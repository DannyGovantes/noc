import { CheckService } from "../domain/use-cases/checks/checks-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImplementation } from "../infrastructure/repositories/log.repository";
import { CronService } from "./cron/cron-service";

const fileSystemRepository = new LogRepositoryImplementation(
  new FileSystemDatasource()
);

export class Server {
  public static start() {
    console.log("Server started");
    CronService.createJob("*/5 * * * * *", () => {
      new CheckService(
        fileSystemRepository,
        () => console.log("success"),
        (error) => console.log(error)
      ).execute("https://google.com");
    });
  }
}
