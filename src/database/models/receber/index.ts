import { Receber } from "./Receber";
import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript";
import { db } from "@/database/dbConnect";

function initReceber(sequelizeInstance: Sequelize) {
    Receber.init({
        id: { type: DataType.NUMBER, allowNull: false, primaryKey: true },
        idVenda: { type: DataType.NUMBER },
        idCliente: { type: DataType.NUMBER },
        parcela: { type: DataType.STRING },
        vlrParcela: { type: DataType.NUMBER },
        dataEmissao: { type: DataType.DATE },
        quitado: { type: DataType.NUMBER },
        dataQuitacao: { type: DataType.DATE },
        idOperador: { type: DataType.NUMBER },
        dataVencimento: { type: DataType.DATE },
        selecionado: { type: DataType.NUMBER },
        idDevolucao: { type: DataType.NUMBER },
        entrada: { type: DataType.NUMBER },
        cancelada: { type: DataType.NUMBER },
        dtCancelamento: { type: DataType.DATE },
        idProcesso: { type: DataType.NUMBER },
        obs: { type: DataType.STRING },
        origem: { type: DataType.STRING },
        faturaLocacao: { type: DataType.NUMBER },
    }, {
        freezeTableName: true,
        sequelize: sequelizeInstance,
        modelName: "Receber",
        tableName: "receber"
    })

    return { Receber }
}

export default initReceber(db).Receber