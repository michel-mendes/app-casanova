import type { Dialect, Options } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

const username = process.env.DB_USER
const password = process.env.DB_PASS
const database = process.env.DB_NAME
const host = process.env.DB_HOST
const port = Number(process.env.DB_PORT)
const dialect: Dialect = "mssql"

export default {
  development: <Options> {
    username,
    password,
    database,
    host,
    port,
    dialect,
    dialectOptions: {
      instanceName: "MSSQLSERVER",
      options: {
        encrypt: false,
        enableArithAbort: false
      }
    },
    define: { // Do not pluralize table names
      freezeTableName: true,
      timestamps: false
    }
  },
  test: <Options> {
    username,
    password,
    database,
    host,
    port,
    dialect,
    dialectOptions: {
      instanceName: "MSSQLSERVER",
      options: {
        encrypt: false,
        enableArithAbort: false
      }
    },
    define: { // Do not pluralize table names
      freezeTableName: true,
      timestamps: false
    }
  },
  production: <Options> {
    username,
    password,
    database,
    host,
    port,
    dialect,
    logging: false,
    dialectOptions: {
      ssl: true,
      instanceName: "MSSQLSERVER",
      options: {
        encrypt: false,
        enableArithAbort: false
      }
    },
    define: { // Do not pluralize table names
      freezeTableName: true,
      timestamps: false
    }
  }
}
