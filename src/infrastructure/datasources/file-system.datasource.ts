import fs, { writeFileSync } from "fs";
import { LogDataSource } from "../../domain/datasources/log.datasource";
import {
  LogEntity,
  LogSeverityLevel,
} from "../../domain/entities/log.entities";

export class FileSystemDatasource implements LogDataSource {
  private readonly logPath = "logs/";
  private readonly allLogsPath = "logs/logs-all.log";
  private readonly mediumLogsPath = "logs/logs-medium.log";
  private readonly highLogsPath = "logs/logs-high.log";

  constructor() {
    this.createLogFiles();
  }

  private createLogFiles = () => {
    if (!fs.existsSync(this.logPath)) {
      fs.mkdirSync(this.logPath);
    }
    [this.allLogsPath, this.mediumLogsPath, this.highLogsPath].forEach(
      (path) => {
        if (fs.existsSync(path)) return;
        writeFileSync(path, "");
      }
    );
  };

  async saveLog(log: LogEntity): Promise<void> {
    const logAsJson = `${JSON.stringify(log)}\n`;
    fs.appendFileSync(this.allLogsPath, logAsJson);

    if (log.level === LogSeverityLevel.low) return;

    if (log.level === LogSeverityLevel.medium) {
      fs.appendFileSync(this.mediumLogsPath, logAsJson);
    } else {
      fs.appendFileSync(this.highLogsPath, logAsJson);
    }
  }

  private getLogsFromFile = (path: string): LogEntity[] => {
    const content = fs.readFileSync(path, "utf8");
    const logs = content.split("\n").map((log) => LogEntity.fromJson(log));
    return logs;
  };
  async getLog(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    switch (severityLevel) {
      case LogSeverityLevel.low: {
        return this.getLogsFromFile(this.logPath);
      }
      case LogSeverityLevel.medium: {
        return this.getLogsFromFile(this.mediumLogsPath);
      }
      case LogSeverityLevel.high: {
        return this.getLogsFromFile(this.highLogsPath);
      }
      default: {
        throw new Error(`${severityLevel}No tidentified`);
      }
    }
  }
}
