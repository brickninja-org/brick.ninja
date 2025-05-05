import { Prisma } from '@brickninja-org/database';
import chalk from 'chalk';
import { CronExpressionParser } from 'cron-parser';
import { JobName } from '.';
import { db } from '../db';
import { toId } from './helper/to-id';

export async function registerCronJobs() {
  console.log('Registering cron jobs...');

  await registerJob('test', '0 0 * * *');

  // await registerJob('items.check', '*/5 * * * *');
  // await registerJob('items.update', '*/3 * * * *');
  // await registerJob('items.migrate', '*/6 * * * *');
  // await registerJob('items.container-content', '47 11 * * *');
  // await registerJob('items.views', '56 * * * *');

  await registerJob('products', '*/5 * * * *');
  await registerJob('product.categories', '*/10 * * * *');
  // await registerJob('product.views', '49 * * * *');

  await registerJob('colors', '*/5 * * * *');

  // await registerJob('categories.check', '*/5 * * * *');

  await registerJob('bricklinkapi-requests.cleanup', '33 3 * * *');

  // await registerJob('icon.colors', '37 * * * * ');

  await registerJob('jobs.cleanup', '8 * * * *');
}

async function registerJob(name: JobName, cron: string, data: Prisma.InputJsonValue = {}) {
  // check if a matching job exists
  const jobs = await db.job.findMany({ where: { type: name, cron: { not: '' }}});

  if(jobs.length > 1) {
    console.warn(`Found multiple cron jobs for ${chalk.blue(name)}. Deleting superfluous jobs.`);

    await db.job.deleteMany({ where: { id: { in: jobs.slice(1).map(toId) }}});
  }

  if(jobs.length === 0) {
    // add new cron job
    console.log(`Registering new cron job ${chalk.blue(name)}.`);

    const scheduledAt = CronExpressionParser.parse(cron, { tz: 'utc' }).next().toDate();
    await db.job.create({ data: { type: name, data, cron, scheduledAt }});
    return;
  }

  if(jobs.length >= 1) {
    // check if data matches
    if(jobs[0].cron !== cron || JSON.stringify(jobs[0].data) !== JSON.stringify(data)) {
      console.log(`Updating cron job ${chalk.blue(name)}.`);

      const scheduledAt = CronExpressionParser.parse(cron, { tz: 'utc' }).next().toDate();
      await db.job.update({ where: { id: jobs[0].id }, data: { data, cron, scheduledAt }});
    }

    return;
  }
}
