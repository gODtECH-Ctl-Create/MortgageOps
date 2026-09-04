import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const mortgageOpsQueue = new Queue("mortgageops", { connection });

new Worker(
  "mortgageops",
  async (job) => {
    switch (job.name) {
      case "application.submitted":
        console.log(JSON.stringify({ job: job.name, applicationId: job.data.applicationId }));
        break;
      case "document.process":
        console.log(JSON.stringify({ job: job.name, documentId: job.data.documentId }));
        break;
      case "reconciliation.import":
        console.log(JSON.stringify({ job: job.name, batchId: job.data.batchId }));
        break;
      default:
        throw new Error(`Unsupported MortgageOps job: ${job.name}`);
    }
  },
  { connection },
);

async function bootstrap() {
  await mortgageOpsQueue.add(
    "application.submitted",
    { applicationId: "demo-application" },
    { jobId: `demo-${Date.now()}` },
  );

  console.log("MortgageOps worker started.");
}

void bootstrap();
