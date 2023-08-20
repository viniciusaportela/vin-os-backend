import sqlite3, { verbose } from "sqlite3";
import { readdir, readFile } from "fs/promises";

const sqlite = verbose();

export class Database {
  private __db: sqlite3.Database;

  constructor() {
    this.__db = new sqlite.Database("./data/db.sqlite", () => {
      this.autoMigrate();
    });
  }

  async autoMigrate() {
    if (!(await this.tableExists("migrations"))) {
      await this.createMigrationsTable();
    }

    const migrations = await readdir("./migrations");

    for (const migrationFileName of migrations) {
      const hasMigrated = await this.hasMigrated(migrationFileName);

      if (!hasMigrated) {
        const migrationSql = await readFile(
          `./migrations/${migrationFileName}`,
          "utf-8"
        );
        await this.write(migrationSql);
        await this.write(
          `INSERT INTO migrations (name) VALUES ('${migrationFileName}');`
        );
      }
    }

    console.log("Finished migration process");
  }

  async hasMigrated(fileName: string) {
    const result = await this.read(
      `SELECT * FROM migrations WHERE name='${fileName}';`
    );

    return result.length > 0;
  }

  async tableExists(tableName: string) {
    return (
      (
        await this.read(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`
        )
      ).length > 0
    );
  }

  createMigrationsTable() {
    return this.write(
      "CREATE TABLE IF NOT EXISTS migrations (name TEXT, migrated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)"
    );
  }

  async read(sql: string, parameters: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      const statement = this.__db.prepare(sql);
      statement.all(parameters, (err, result) => {
        if (err) reject(err);

        resolve(result);
      });
    });
  }

  async write(sql: string, parameters: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      const statement = this.__db.prepare(sql);
      statement.run(parameters, (err) => {
        if (err) reject(err);

        resolve(undefined);
      });

      statement.finalize();
    });
  }

  async exec(sql: string, parameters: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.__db.get(sql, parameters, (err, result) => {
        console.log(result, err);
        if (err) reject(err);

        resolve(result);
      });
    });
  }
}
