import { config } from "dotenv";
config({path: [".env.local", ".env"]});

import {healthServer} from "./health-server";
import {registerCronJobs} from "./jobs/cron";
import { startNewJob } from "./run-job";
import { worker } from "./worker";

if (process.argv.length > 2) {
  // run a single job
  healthServer.start()
    .then(() => startNewJob(process.argv[2]))
    .then(() => healthServer.close());
} else {
  // run the worker
  healthServer.start()
    .then(() => registerCronJobs())
    .then(() => worker.start());
}

// shutdown handling

let shuttingDown = false;

function shutdownHandler() {
  if (shuttingDown) {
    console.log("Forcing shutdown");
    process.exit(1);
  }

  shuttingDown = true;

  // initiate shutdown
  console.log("Gracefully shutting down...");
  worker.shutdown();
  healthServer.close()
}

process.on("SIGTERM", shutdownHandler);
process.on("SIGINT", shutdownHandler);

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection:", reason, promise);
  process.exit(1);
});