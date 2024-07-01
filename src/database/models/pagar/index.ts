import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript";
import { Pagar } from "./Pagar";
import { Fornecedor } from "../fornecedores/Fornecedor";
import { db } from "@/database/dbConnect";

function initPagar(sequelizeInstance: Sequelize) {
	Pagar.init({
		id: { type: DataType.INTEGER, allowNull: false, primaryKey: true },
	    idOrigem: { type: DataType.INTEGER },
	    idFornecedor: { type: DataType.INTEGER },
	    dtEmissao: { type: DataType.DATE },
	    dtVencimento: { type: DataType.STRING },
	    parcela: { type: DataType.STRING },
	    vlrParcela: { type: DataType.NUMBER },
	    historico: { type: DataType.STRING },
	    documento: { type: DataType.STRING },
	    idFormaPagamento: { type: DataType.INTEGER },
	    quitado: { type: DataType.INTEGER },
	    dtQuitacao: { type: DataType.DATE },
	    idUsuario: { type: DataType.INTEGER },
	    dtAlteracao: { type: DataType.DATE },
	    idAbertura: { type: DataType.INTEGER },
	    idPlanoContas: { type: DataType.INTEGER },
	    vlrDesconto: { type: DataType.NUMBER },
	    vlrJuros: { type: DataType.NUMBER },
	}, {
		freezeTableName: true,
		sequelize: sequelizeInstance,
		modelName: "Pagar",
		tableName: "pagar"
	})

	// Pagar.belongsTo(Fornecedor, {foreignKey: "idFornecedor"})
	Pagar.hasOne(Fornecedor, {
		sourceKey: "idFornecedor",
		foreignKey: "id",
		as: "dadosFornecedor"
	})

	return { Pagar }
}

export default initPagar(db).Pagar