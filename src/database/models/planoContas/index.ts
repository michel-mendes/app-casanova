import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript";
import { PlanoContas } from "./PlanoContas";
import { db } from "@/database/dbConnect";

function initPlanoContas(sequelizeInstance: Sequelize) {
	PlanoContas.init(
        {
          id: { type: DataType.INTEGER, allowNull: false, primaryKey: true, },
          descricao: { type: DataType.STRING(250), allowNull: true, },
          operacional: { type: DataType.INTEGER, allowNull: true, defaultValue: 0, },
          investimento: { type: DataType.INTEGER, allowNull: true, defaultValue: 0, },
          tipo: { type: DataType.STRING(50), allowNull: true, },
          dtAlteracao: { type: DataType.DATE, allowNull: true, },
          idUsuario: { type: DataType.INTEGER, allowNull: true, },
          ativo: { type: DataType.INTEGER, allowNull: true, defaultValue: 1, },
        },
        {
          sequelize: sequelizeInstance,
          modelName: "PlanoContas",
          tableName: 'planoContas',
          timestamps: false,
        }
      );

	return { PlanoContas }
}

export default initPlanoContas(db).PlanoContas