import { Sequelize } from "sequelize";
import config from "./config/config";

(Sequelize as any).DATE.prototype._stringify = function _stringify(date: any, options: any) {
    date = this._applyTimezone(date, options)

    // Corrige bug do Sequelize ao enviar data para o banco de dados
    // Antes da correção: "2024-03-21 00:00:00:000 +00:00" ---> Erro de conversão de data no banco
    // Após a correção:   "2024-03-21 00:00:00:000" ---> Sem erro de conversão
    return date.format("YYYY-MM-DD HH:mm:ss:SSS")
}

let sequelize;

switch (process.env.NODE_ENV) {
    case "production": sequelize = new Sequelize(config.production); break;
    case "test": sequelize = new Sequelize(config.test); break;
    default: sequelize = new Sequelize(config.development)
}

const db = sequelize

export { db }