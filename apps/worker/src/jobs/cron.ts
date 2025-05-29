import { Prisma } from '@brickninja-org/database';
import chalk from 'chalk';
import { CronExpressionParser } from 'cron-parser';
import { JobName } from '.';
import { db } from '../db';
import { toId } from './helper/to-id';

const schedule = {
  daily: 'H H * * *',
  hourly: 'H * * * *',
  every5Minutes: 'H/5 * * * *',
  every10Minutes: 'H/10 * * * *',
} as const;

export async function registerCronJobs() {
  console.log('Registering cron jobs...');

  await registerJob('test', '0 0 * * *');

  await registerJob('items.check', schedule.every5Minutes);
  await registerJob('items.update', 'H/3 * * * *');
  await registerJob('items.migrate', 'H/6 * * * *');
  await registerJob('items.container-content', schedule.daily);
  await registerJob('items.views', schedule.hourly);

  await registerJob('products', schedule.every5Minutes);
  await registerJob('product.categories', schedule.every10Minutes);
  await registerJob('product.views', schedule.hourly);

  await registerJob('colors', schedule.every5Minutes);

  // await registerJob('categories.check', '*/5 * * * *');

  await registerJob('bricklinkapi-requests.cleanup', 'H 3 * * *');

  await registerJob('icon.colors', '37 * * * * ');

  await registerJob('jobs.cleanup', schedule.hourly);
}

async function registerJob(name: JobName, cron: string, data: Prisma.InputJsonValue = {}) {
  cron = fixCronJitter(cron, name);

  // check if a matching job exists
  const jobs = await db.job.findMany({ where: { type: name, cron: { not: '' }}});

  if(jobs.length > 1) {
    console.warn(`Found multiple cron jobs for ${chalk.blue(name)}. Deleting superfluous jobs.`);

    await db.job.deleteMany({ where: { id: { in: jobs.slice(1).map(toId) }}});
  }

  if(jobs.length === 0) {
    // add new cron job
    console.log(`Registering new cron job ${chalk.blue(name)}.`);

    const scheduledAt = CronExpressionParser.parse(cron, { tz: 'utc', hashSeed: name }).next().toDate();
    await db.job.create({ data: { type: name, data, cron, scheduledAt }});
    return;
  }

  if(jobs.length >= 1) {
    // check if data matches
    if(jobs[0].cron !== cron || JSON.stringify(jobs[0].data) !== JSON.stringify(data)) {
      console.log(`Updating cron job ${chalk.blue(name)}.`);

      const scheduledAt = CronExpressionParser.parse(cron, { tz: 'utc', hashSeed: name }).next().toDate();
      await db.job.update({ where: { id: jobs[0].id }, data: { data, cron, scheduledAt }});
    }

    return;
  }
}

// Fix handling hash steps in cron expression (see https://github.com/harrisiirak/cron-parser/issues/381)
function fixCronJitter(cron: string, seed: string) {
  // this only handles `H/x` at the start (minutes) of the cron expression
  const match = cron.match(/^H\/(\d+) /);

  // return the unchanged expression if no match was found
  if(!match) {
    return cron;
  }

  // generate a random value based on the name. This is not a great "hash" function, but we just need values between 0-5 or 0-10 and this is good enough
  const random = seed.split('').reduce((s, c) => s + c.charCodeAt(0), 0);

  // generate the offset (for H/5 the offset should be between 0 and 4)
  const offset = random % Number(match[1]);

  return offset + cron.substring(1);
}
