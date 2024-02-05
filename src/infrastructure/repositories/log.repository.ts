import { LogDataSource } from "../../domain/datasources/log.datasource";
import {
  LogEntity,
  LogSeverityLevel,
} from "../../domain/entities/log.entities";
import { LogRepository } from "../../domain/repository/log.repository";

export class LogRepositoryImplementation implements LogRepository {
  constructor(private readonly logDatasource: LogDataSource) {}

  async getLog(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    return this.logDatasource.getLog(severityLevel);
  }
  async saveLog(log: LogEntity): Promise<void> {
    this.logDatasource.saveLog(log);
  }
}
