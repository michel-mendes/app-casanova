import { ChequeCliente } from "./ChequeCliente"
import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript"
import { db } from "@/database/dbConnect"

function initModel(sequelizeInstance: Sequelize) {
    ChequeCliente.init({
        id: { type: DataType.INTEGER, primaryKey: true, allowNull: false },
        idOrigem: { type: DataType.INTEGER },
        idCliente: { type: DataType.INTEGER },
        parcela: { type: DataType.STRING },
        valor: { type: DataType.NUMBER },
        banco: { type: DataType.STRING },
        agencia: { type: DataType.STRING },
        contaCorrente: { type: DataType.STRING },
        Titular: { type: DataType.STRING },
        devolvido: { type: DataType.INTEGER },
        numero: { type: DataType.STRING },
        dtEmissao: { type: DataType.DATE },
        dtVencimento: { type: DataType.DATE },
        idUsuario: { type: DataType.INTEGER },
        dtAlteracao: { type: DataType.DATE },
        status: { type: DataType.STRING },
        dtStatus: { type: DataType.DATE },
        obsStatus: { type: DataType.STRING }
    }, {
        freezeTableName: true,
        sequelize: sequelizeInstance,
        modelName: "ChequeCliente",
        tableName: "chequeClientes"
    })

    return { ChequeCliente }
}

export default initModel(db).ChequeCliente