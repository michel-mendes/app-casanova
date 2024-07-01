import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript";
import { Fornecedor } from "./Fornecedor";
import { db } from "@/database/dbConnect";

function initFornecedor(sequelizeInstance: Sequelize) {
    Fornecedor.init({
        id: { type: DataType.NUMBER, allowNull: false, primaryKey: true },
        razao: { type: DataType.STRING, allowNull: false },
        fantasia: { type: DataType.STRING },
        endereco: { type: DataType.STRING },
        numero: { type: DataType.STRING },
        bairro: { type: DataType.STRING },
        complemento: { type: DataType.STRING },
        cidade: { type: DataType.STRING },
        uf: { type: DataType.STRING },
        cep: { type: DataType.STRING },
        fone1: { type: DataType.STRING },
        fone2: { type: DataType.STRING },
        fone3: { type: DataType.STRING },
        email: { type: DataType.STRING },
        contato: { type: DataType.STRING },
        cnpj: { type: DataType.STRING },
        inscr: { type: DataType.STRING },
        obs: { type: DataType.STRING },
        status: { type: DataType.BIGINT },
        dtAlteracao: { type: DataType.DATE },
        idUsuario: { type: DataType.BIGINT },
        dtCadastro: { type: DataType.DATE },
        cpf: { type: DataType.STRING(14) },
    }, {
        sequelize: sequelizeInstance,
        freezeTableName: true,
        modelName: "Fornecedor",
        tableName: "fornecedores"
    })

    return { Fornecedor }
}

export default initFornecedor(db).Fornecedor