import initOrm, { basicOption } from "@/repo/repo-context";
import fs from 'fs/promises';

export const migrate = async () => {
  const { DB_TYPE } = process.env;
  const orm = await initOrm();
  const migrator = orm.getMigrator();

  if (DB_TYPE === 'sqlite') {
    await fs.rm(basicOption.migrations.pathTs, { recursive: true });
    await fs.rm(basicOption.migrations.path, { recursive: true });
    await fs.mkdir(basicOption.migrations.pathTs);
    await fs.mkdir(basicOption.migrations.path);
    await migrator.createInitialMigration();
  }
  await migrator.up();

  return orm;
};
