import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript";
import { Retirada } from "./Retirada";
import { db } from "@/database/dbConnect";

const initRetirada = (sequelizeInstance: Sequelize) => {
    Retirada.init(
        {
            id: { type: DataType.INTEGER, autoIncrement: true, primaryKey: true},
            idCaixa: { type: DataType.INTEGER, allowNull: true, },
            dataRetirada: { type: DataType.DATE, allowNull: true, },
            valor: { type: DataType.DECIMAL(19, 4), allowNull: true, },
            idFuncionario: { type: DataType.INTEGER, allowNull: true, },
            obs: { type: DataType.STRING(1500), allowNull: true, },
            idAbertura: { type: DataType.INTEGER, allowNull: true, },
        },
        {
            freezeTableName: true,
            sequelize: sequelizeInstance, // Sua instância de conexão
            modelName: "Retirada",
            tableName: "retiradas",
        }
    );

    return { Retirada }
}

export default initRetirada(db).Retirada