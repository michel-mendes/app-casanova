import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript";
import { Cliente } from "./Cliente";
import { db } from "@/database/dbConnect";

const initCliente = (sequelizeInstance: Sequelize) => {
    Cliente.init(
        {
            id: {
                type: DataType.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            status: {
                type: DataType.INTEGER,
                allowNull: true,
            },
            nome: {
                type: DataType.STRING(250),
                allowNull: false,
            },
            endereco: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            numero: {
                type: DataType.STRING(50),
                allowNull: true,
            },
            bairro: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            complemento: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            cidade: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            uf: {
                type: DataType.STRING(5),
                allowNull: true,
            },
            cep: {
                type: DataType.STRING(50),
                allowNull: true,
            },
            rg: {
                type: DataType.STRING(25),
                allowNull: true,
            },
            cpf: {
                type: DataType.STRING(25),
                allowNull: true,
            },
            fone1: {
                type: DataType.STRING(50),
                allowNull: true,
            },
            fone2: {
                type: DataType.STRING(50),
                allowNull: true,
            },
            fone3: {
                type: DataType.STRING(50),
                allowNull: true,
            },
            email: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            dtCadastro: {
                type: DataType.DATE,
                allowNull: true,
            },
            dtAlteracao: {
                type: DataType.DATE,
                allowNull: true,
            },
            idUsuario: {
                type: DataType.DECIMAL(18, 0),
                allowNull: true,
            },
            limite: {
                type: DataType.DECIMAL(19, 4),
                allowNull: true,
            },
            obs: {
                type: DataType.STRING(1500),
                allowNull: true,
            },
            dtNascimento: {
                type: DataType.DATE,
                allowNull: true,
            },
            localTrabalho: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            foneTrabalho: {
                type: DataType.STRING(50),
                allowNull: true,
            },
            contatoTrabalho: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            salario: {
                type: DataType.DECIMAL(19, 4),
                allowNull: true,
            },
            estadoCivil: {
                type: DataType.STRING(50),
                allowNull: true,
            },
            pessoa: {
                type: DataType.STRING(50),
                allowNull: true,
            },
            fantasia: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            tipoCliente: {
                type: DataType.STRING(50),
                allowNull: true,
            },
            produtorRural: {
                type: DataType.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            dtVencimento: {
                type: DataType.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            diasVenctoVendas: {
                type: DataType.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            mesa: {
                type: DataType.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            statusMesa: {
                type: DataType.STRING(50),
                allowNull: true,
            },
            mensalidade: {
                type: DataType.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            vlrMensalidade: {
                type: DataType.DECIMAL(19, 4),
                allowNull: true,
            },
            idRespAberturaMesa: {
                type: DataType.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            tipoRespAberturaMesa: {
                type: DataType.STRING(1),
                allowNull: true,
            },
            foneMesa: {
                type: DataType.STRING(50),
                allowNull: true,
            },
        },
        {
            freezeTableName: true,
            sequelize: sequelizeInstance,
            modelName: "Cliente",
            tableName: 'clientes',
        }
    );

    return { Cliente }
}

export default initCliente(db).Cliente