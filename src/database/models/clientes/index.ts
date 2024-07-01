import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript";
import { Cliente } from "./Cliente";
import { db } from "@/database/dbConnect";

const initCliente = (sequelizeInstance: Sequelize) => {
    Cliente.init({
        id: { type: DataType.NUMBER, allowNull: false, primaryKey: true },
        status: { type: DataType.NUMBER },
        nome: { type: DataType.STRING },
        endereco: { type: DataType.STRING },
        numero: { type: DataType.STRING },
        bairro: { type: DataType.STRING },
        complemento: { type: DataType.STRING },
        cidade: { type: DataType.STRING },
        uf: { type: DataType.STRING },
        cep: { type: DataType.STRING },
        rg: { type: DataType.STRING },
        cpf: { type: DataType.STRING },
        fone1: { type: DataType.STRING },
        fone2: { type: DataType.STRING },
        fone3: { type: DataType.STRING },
        email: { type: DataType.STRING },
        dtCadastro: { type: DataType.DATE },
        dtAlteracao: { type: DataType.DATE },
        idUsuario: { type: DataType.NUMBER },
        limite: { type: DataType.NUMBER },
        obs: { type: DataType.STRING },
        dtNascimento: { type: DataType.DATE },
        localTrabalho: { type: DataType.STRING },
        foneTrabalho: { type: DataType.STRING },
        contatoTrabalho: { type: DataType.STRING },
        salario: { type: DataType.NUMBER },
        estadoCivil: { type: DataType.STRING },
        pessoa: { type: DataType.STRING },
        fantasia: { type: DataType.STRING },
        tipoCliente: { type: DataType.STRING },
        produtorRural: { type: DataType.NUMBER },
        dtVencimento: { type: DataType.NUMBER },
        diasVenctoVendas: { type: DataType.NUMBER },
        mesa: { type: DataType.NUMBER },
        statusMesa: { type: DataType.STRING },
        mensalidade: { type: DataType.NUMBER },
        vlrMensalidade: { type: DataType.NUMBER },
        idRespAberturaMesa: { type: DataType.NUMBER },
        tipoRespAberturaMesa: { type: DataType.STRING },
        foneMesa: { type: DataType.STRING },
    }, {
        freezeTableName: true,
        sequelize: sequelizeInstance,
        modelName: "Cliente",
        tableName: "clientes"
    })

    return { Cliente }
}

export default initCliente(db).Cliente