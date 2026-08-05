import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __simcogy_sql: ReturnType<typeof postgres> | undefined;
}

function createSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return postgres(connectionString, {
    ssl: "require",
    max: 10,
  });
}

const sql = globalThis.__simcogy_sql ?? createSql();

if (process.env.NODE_ENV !== "production") {
  globalThis.__simcogy_sql = sql;
}

export default sql;
