import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript";
import { Pagar } from "./Pagar";
// import { Fornecedor } from "../fornecedores/Fornecedor";
import fornecedores from "../fornecedores";
import planoContas from "../planoContas";
import { db } from "@/database/dbConnect";
import { PlanoContas } from "../planoContas/PlanoContas";

function initPagar(sequelizeInstance: Sequelize) {
	Pagar.init(
		{
			id: { type: DataType.INTEGER, autoIncrement: true, primaryKey: true, },
			idOrigem: { type: DataType.INTEGER, allowNull: true, },
			idFornecedor: { type: DataType.INTEGER, allowNull: true, },
			dtEmissao: { type: DataType.DATE, allowNull: true, },
			dtVencimento: { type: DataType.DATE, allowNull: true, },
			parcela: { type: DataType.STRING(50), allowNull: true, },
			vlrParcela: { type: DataType.DECIMAL(19, 4), allowNull: true, },
			historico: { type: DataType.STRING(1500), allowNull: true, },
			documento: { type: DataType.STRING(250), allowNull: true, },
			idFormaPagamento: { type: DataType.INTEGER, allowNull: true, },
			quitado: { type: DataType.INTEGER, allowNull: true, },
			dtQuitacao: { type: DataType.DATE, allowNull: true, },
			idUsuario: { type: DataType.INTEGER, allowNull: true, },
			dtAlteracao: { type: DataType.DATE, allowNull: true, },
			idAbertura: { type: DataType.INTEGER, allowNull: true, },
			idPlanoContas: { type: DataType.INTEGER, allowNull: true, },
			vlrDesconto: { type: DataType.DECIMAL(19, 4), allowNull: true, },
			vlrJuros: { type: DataType.DECIMAL(19, 4), allowNull: true, },
		},
		{
			freezeTableName: true,
			sequelize: sequelizeInstance,
			modelName: "Pagar",
			tableName: "pagar",
			timestamps: false,
		}
	);

	// Pagar.belongsTo(Fornecedor, {foreignKey: "idFornecedor"})
	Pagar.hasOne(fornecedores, { sourceKey: "idFornecedor", foreignKey: "id", as: "fornecedor" })
	Pagar.hasOne(planoContas, { sourceKey: "idPlanoContas", foreignKey: "id", as: "planoContas" })

	return { Pagar }
}

export default initPagar(db).Pagar