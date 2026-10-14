import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

declare global {
  // eslint-disable-next-line no-var
  var __simcogy_sql: Sql | undefined;
}

function createSql(): Sql {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  // SSL follows the connection string, e.g. add ?sslmode=require for hosted databases.
  return postgres(connectionString, { max: 10 });
}

function getSql(): Sql {
  if (!globalThis.__simcogy_sql) {
    globalThis.__simcogy_sql = createSql();
  }
  return globalThis.__simcogy_sql;
}

// Connect lazily so the app can be built (e.g. inside Docker) without a database.
const sql = new Proxy(function () {} as unknown as Sql, {
  apply(_target, _this, args) {
    return Reflect.apply(getSql() as unknown as (...a: unknown[]) => unknown, undefined, args);
  },
  get(_target, prop) {
    const real = getSql();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export default sql;
