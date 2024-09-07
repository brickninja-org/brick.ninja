import { Revision } from '@brickninja-org/database';
import { JobName } from '..';
import { db, type PrismaTransaction } from '../../db';
import { createRevision as createRevisionInDb } from './revision-create';
import { toId } from './to-id';
import { batch } from './batch';
import { createEntityMap } from './map';

type FindManyArgs = {
  select: { id: true };
  where: {
    removedFromApi?: false;
    id?: { notIn: number[] };
    lastCheckedAt?: { lt: Date };
    version?: { lt: number };
  }
};

export async function createSubJobs(
  jobName: JobName,
  getIdsFromApi: () => Promise<number[]>,
  findMany: (args: FindManyArgs) => Promise<{ id: number }[]>,
  currentVersion: number,
) {
  const queuedJobs = await db.job.count({ where: { type: jobName, state: { in: ['Queued', 'Running'] }, cron: null }});

  if (queuedJobs > 0) {
    return 'Waiting for pending follow up jobs';
  }

  // get known ids
  const knownIds = (await findMany({
    where: { removedFromApi: false },
    select: { id: true },
  })).map(toId);

  // get ids currently in the API
  const apiIds = await getIdsFromApi();

  // get new or rediscovered ids
  const newOrRediscoveredIds = apiIds.filter((id) => !knownIds.includes(id));

  // also load all ids where the lastCheckedAt is before the ...
  // TODO: this is not correct, we should only load the ids where the lastCheckedAt is before the last time we checked the API

  // and then also include ids that need to be migrated
  const idsToBeMigrated = (await findMany({
    where: { version: { lt: currentVersion }, id: { notIn: [...newOrRediscoveredIds] }},
    select: { id: true },
  })).map(toId);

  // some stats
  let jobCount = 0;
  let idCount = 0;

  // create new/rediscover/update jobs
  for (const ids of batch([...newOrRediscoveredIds, ...idsToBeMigrated], 200)) {
    await db.job.create({ data: { type: jobName, data: { ids }}});
    jobCount++;
    idCount += ids.length;
  }

  // build list of ids that are no longer available in the API
  const removedIds = knownIds.filter((id) => !apiIds.includes(id));

  // output
  return `Queued ${jobCount} jobs for ${idCount} entries (${newOrRediscoveredIds.length} new, ${idsToBeMigrated.length} migrated, ${removedIds.length} removed)`;
}

export interface ProcessEntitiesData<Id extends string | number> {
  ids: Id[];
  removed?: boolean;
}

type DbEntityBase<Id extends string | number> = {
  id: Id;
  current: Revision;
  removedFromApi: boolean;
  version: number;
};

type GetEntitiesArgs<Id> = {
  where: { id: { in: Id[] }};
  include: { current: true };
};

export type InputData<Id, HistoryId> = {
  id: Id;
  currentId: string;

  history: {
    connectOrCreate: [
      { where: HistoryId, create: { revisionId: string }}
    ]
  };

  lastChecked: Date;
  removedFromApi: boolean;
  version: number;
};

type CreateInput<Id, HistoryId, ExtraData> = {
  data: InputData<Id, HistoryId> & ExtraData;
};

export type UpdateInput<Id, HistoryId, ExtraData> = {
  where: { id: Id };
  data: Partial<InputData<Id, HistoryId> & ExtraData> | { lastCheckedAt: Date };
};

export enum Changes {
  New,
  Remove,
  Update,
  Migrate,
  None,
}

export async function processEntities<Id extends string | number, DbEntity extends DbEntityBase<Id>, ApiEntity extends { id: Id }, HistoryId, ExtraData>(
  data: ProcessEntitiesData<Id>,
  entityName: string,
  createHistoryId: (id: Id, revisionId: string) => HistoryId,
  migrate: (entity: ApiEntity, version: number, changes: Changes) => ExtraData | Promise<ExtraData>,
  getEntitiesFromDb: (args: GetEntitiesArgs<Id>) => Promise<DbEntity[]>,
  getEntitiesFromApi: (ids: Id[]) => Promise<Map<Id, ApiEntity>>,
  create: (tx: PrismaTransaction, data: CreateInput<Id, HistoryId, ExtraData>) => Promise<unknown>,
  update: (tx: PrismaTransaction, data: UpdateInput<Id, HistoryId, ExtraData>) => Promise<unknown>,
  currentVersion: number,
) {
  // load the current ids from the db
  const dbEntities = await createEntityMap(getEntitiesFromDb({
    where: { id: { in: data.ids }},
    include: { current: true },
  }));

  // fetch latest from API
  // if we are currently handling removed ids we can skip the API call
  const apiEntities = data.removed ? undefined : await getEntitiesFromApi(data.ids);

  let processEntityCount = 0;

  // iterate over all ids
  for (const id of data.ids) {
    await db.$transaction(async (tx) => {
      // get the db and api entry
      const dbEntity = dbEntities.get(id);
      const apiData = apiEntities?.get(id);

      // parse known data
      const dbData: undefined | ApiEntity = dbEntity ? JSON.parse(dbEntity.current.data) : undefined;

      // create revision
      const revision = await createRevision(tx, dbData, apiData, dbEntity?.removedFromApi, { entity: entityName, 'language': 'en', previousRevisionId: dbEntity?.current.id ?? null }) ?? dbEntity!.current;

      // check if nothing changed
      const revisionsChanged = !dbEntity || revision !== dbEntity.current;

      // check if the db has an old migration version
      const migrationVersionChanged = dbEntity?.version !== currentVersion;

      // if nothing changed and we also don't have to migrate anything, we can early return
      if (!revisionsChanged && !migrationVersionChanged) {
        await update(tx, { where: { id }, data: { lastCheckedAt: new Date() }});
        return;
      }

      // always run all migrations if a revision changed, otherwise run only required migrations
      const migrationVersion = revisionsChanged ? -1 : dbEntity.version;

      const changes =
        !dbData ? Changes.New :
        !apiData ? Changes.Remove :
        revisionsChanged ? Changes.Update :
        migrationVersionChanged ? Changes.Migrate :
        Changes.None;

      const data: InputData<Id, HistoryId> & ExtraData = {
        id,

        ...await migrate(apiData ?? dbData!, migrationVersion, changes),

        currentId: revision.id,

        history: {
          connectOrCreate: [
            { where: createHistoryId(id, revision.id), create: { revisionId: revision.id }}
          ]
        },

        lastChecked: new Date(),
        removedFromApi: !apiData,
        version: currentVersion,
      };

      // update in db
      if (changes == Changes.New) {
        await create(tx, { data });
      } else {
        await update(tx, { where: { id }, data });
      }

      processEntityCount++;
    });
  }

  return `Updated ${processEntityCount}/${data.ids.length}`;
}

function createRevision<T>(tx: PrismaTransaction, known: T | undefined, update: T | undefined, wasRemoved: boolean | undefined, base: Pick<Revision, 'entity' | 'language' | 'previousRevisionId'>) {
  // convert data to json
  const knownData = known !== undefined && JSON.stringify(known);
  const updateData = update !== undefined && JSON.stringify(update);

  // new
  if (!knownData && updateData) {
    return createRevisionInDb({ ...base, data: updateData, type: 'Added', description: 'Added to API' }, tx);
  }

  // removed
  if (knownData && !updateData && !wasRemoved) {
    return createRevisionInDb({ ...base, data: knownData, type: 'Removed', description: 'Removed from API' }, tx);
  }

  // rediscovered
  if (knownData && updateData && wasRemoved) {
    return createRevisionInDb({ ...base, data: updateData, type: 'Updated', description: 'Resdiscovered in API' }, tx);
  }

  // updated
  if (knownData && updateData && knownData !== updateData) {
    return createRevisionInDb({ ...base, data: updateData, type: 'Updated', description: 'Updated in API' }, tx);
  }

  return undefined;
}
