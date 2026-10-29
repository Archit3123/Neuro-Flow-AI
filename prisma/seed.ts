import { PrismaClient } from "./generated/client";
import { createMssqlAdapter } from "../lib/mssql";

const prisma = new PrismaClient({ adapter: createMssqlAdapter() });

async function main() {
  console.log("Seeding sample tasks...");

  await prisma.task.deleteMany({});

  const sampleTasks = [
    {
      title: "Review project specifications",
      description: "Carefully analyze requirement documents and design plans.",
      status: "todo",
      priority: "high",
      duration: 45,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      tags: JSON.stringify(["planning", "review"]),
      source: "manual",
    },
    {
      title: "Setup Azure SQL Database",
      description: "Provision the database instance and configure security rules.",
      status: "in_progress",
      priority: "high",
      duration: 60,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      tags: JSON.stringify(["database", "azure"]),
      source: "manual",
    },
    {
      title: "Design flowcharts for scheduling",
      description: "Create visual diagrams to map scheduler heuristics.",
      status: "done",
      priority: "medium",
      duration: 30,
      tags: JSON.stringify(["design"]),
      source: "ai",
    },
    {
      title: "Integrate Groq API endpoints",
      description: "Test completion speeds with llama-3.1-8b-instant.",
      status: "todo",
      priority: "medium",
      duration: 30,
      tags: JSON.stringify(["ai", "groq"]),
      source: "ai",
    },
  ];

  for (const task of sampleTasks) {
    await prisma.task.create({ data: task });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
