import { AuxBaixa } from "./AuxBaixa"
import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript"
import { db } from "@/database/dbConnect"

function initAuxBaixas(sequelizeInstance: Sequelize) {
    AuxBaixa.init({
        id: { type: DataType.NUMBER, allowNull: false, primaryKey: true },
	    idBaixa: { type: DataType.NUMBER },
	    idOrigem: { type: DataType.NUMBER },
	    vlrBruto: { type: DataType.NUMBER },
	    vlrDesconto: { type: DataType.NUMBER },
	    vlrAcrescimo: { type: DataType.NUMBER },
	    vlrJuros: { type: DataType.NUMBER },
	    vlrLiquido: { type: DataType.NUMBER },
	    vlrAbater: { type: DataType.NUMBER },
	    vlrRestante: { type: DataType.NUMBER },
	    complemento: { type: DataType.STRING },
    }, {
        freezeTableName: true,
        sequelize: sequelizeInstance,
        modelName: "AuxBaixa",
        tableName: "auxBaixas"
    })

    return { AuxBaixa }
}

export default initAuxBaixas(db).AuxBaixa