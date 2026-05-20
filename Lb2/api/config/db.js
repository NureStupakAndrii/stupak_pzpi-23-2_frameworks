const POSTGRES_HOST = process.env.POSTGRES_HOST ?? "localhost";
const POSTGRES_PORT = Number(process.env.POSTGRES_PORT ?? "5432");
const POSTGRES_DB = process.env.POSTGRES_DB ?? "lb2";
const POSTGRES_USER = process.env.POSTGRES_USER ?? "postgres";
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? "postgres";

const DATABASE_CONFIG = {
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
};

module.exports = {
  DATABASE_CONFIG,
};
