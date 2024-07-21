import prisma from "@prisma/client";
import chalk from "chalk";

const model = new prisma.PrismaClient({
  log: [{ emit: "event", level: "query" }],
});

if (process.env.NODE_ENV === "development") {
  model.$on("query", (event) => {
    console.info(`${chalk.blue("prisma:query")} ${event.query}`);
    console.info(`${chalk.blue("prisma:params")}: ${event.params}`);
    console.info(`${chalk.blue("prisma:duration")}: ${event.duration}ms`);
    console.info(`${chalk.red("-----")}`);
  });
}

export { model, prisma };
