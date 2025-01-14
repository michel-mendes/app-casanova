import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript";
import { Funcionario } from "./Funcionario";
import { db } from "@/database/dbConnect";

const initFuncionario = (sequelizeInstance: Sequelize) => {
    Funcionario.init({
        id: { type: DataType.NUMBER, primaryKey: true },
	    nome: { type: DataType.STRING },
	    senha: { type: DataType.STRING },
	    ativo: { type: DataType.NUMBER },
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
	    salario: { type: DataType.NUMBER },
	    observacao: { type: DataType.STRING },
	    dtCadastro: { type: DataType.DATE },
	    dtAlteracao: { type: DataType.DATE },
	    idUsuario: { type: DataType.NUMBER },
	    nomeOperador: { type: DataType.STRING },
	    cpf: { type: DataType.STRING },
	    rg: { type: DataType.STRING },
	    percentual: { type: DataType.NUMBER },
	    tipo: { type: DataType.STRING },
	    hrInicio: { type: DataType.STRING },
	    hrFim: { type: DataType.STRING },
	    hrInicioSab: { type: DataType.STRING },
	    hrFimSab: { type: DataType.STRING },
	    almoco: { type: DataType.STRING }
    }, {
        freezeTableName: true,
        sequelize: sequelizeInstance,
        modelName: "Funcionario",
        tableName: "funcionarios"
    })

    return { Funcionario }
}

export default initFuncionario(db).Funcionario