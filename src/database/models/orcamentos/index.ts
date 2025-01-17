import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript";

import { Orcamento } from "./Orcamento";
import itensOrcamento from "../itensOrcamento";
import clientes from "../clientes";
import funcionarios from "../funcionarios";

import { db } from "@/database/dbConnect";


function initOrcamentos(sequelizeInstance: Sequelize) {
    Orcamento.init(
        {
            id: {
                type: DataType.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            dataEmissao: {
                type: DataType.DATE,
                allowNull: true,
            },
            vlrBruto: {
                type: DataType.DECIMAL(19, 4), // Mapeando `money` como `DECIMAL`
                allowNull: true,
            },
            vlrDesconto: {
                type: DataType.DECIMAL(19, 4),
                allowNull: true,
            },
            vlrAcrescimo: {
                type: DataType.DECIMAL(19, 4),
                allowNull: true,
            },
            vlrLiquido: {
                type: DataType.DECIMAL(19, 4),
                allowNull: true,
            },
            idClientes: {
                type: DataType.INTEGER,
                allowNull: true,
            },
            idNFe: {
                type: DataType.INTEGER,
                allowNull: true,
            },
            idVenda: {
                type: DataType.INTEGER,
                allowNull: true,
            },
            tipoOrcamento: {
                type: DataType.STRING(1),
                allowNull: true,
            },
            idOperador: {
                type: DataType.INTEGER,
                allowNull: true,
            },
            cancelado: {
                type: DataType.INTEGER,
                allowNull: true,
            },
            obs: {
                type: DataType.STRING(1500),
                allowNull: true,
            },
            clienteNome: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            clienteEndereco: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            clienteNumero: {
                type: DataType.STRING(50),
                allowNull: true,
            },
            clienteBairro: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            clienteComplemento: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            clienteCidade: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            clienteUF: {
                type: DataType.STRING(5),
                allowNull: true,
            },
            clienteCep: {
                type: DataType.STRING(20),
                allowNull: true,
            },
            clienteFone: {
                type: DataType.STRING(50),
                allowNull: true,
            },
            clienteEmail: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            dtAlteracao: {
                type: DataType.DATE,
                allowNull: true,
            },
            idUsuarioAlteracao: {
                type: DataType.INTEGER,
                allowNull: true,
            },
            DtValidade: {
                type: DataType.DATE,
                allowNull: true,
            },
            idUsuarioCancelamento: {
                type: DataType.INTEGER,
                allowNull: true,
            },
            justificativa: {
                type: DataType.STRING(1500),
                allowNull: true,
            },
            dtCancelamento: {
                type: DataType.DATE,
                allowNull: true,
            },
            vlrFrete: {
                type: DataType.DECIMAL(19, 4),
                allowNull: true,
            },
            ac: {
                type: DataType.STRING(250),
                allowNull: true,
            },

            margemLucro: {
                type: DataType.VIRTUAL,
                get() {
                    let totalCusto = calculaTotalCustoOrcamento(this)
                    
                    if (totalCusto > 0) {
                        return ((this.vlrLiquido! - totalCusto) / totalCusto) * 100
                    } else {
                        return 0
                    }
                }
            },

            custoOrcamento: {
                type: DataType.VIRTUAL,
                get() { return calculaTotalCustoOrcamento(this) }
            }
        },
        {
            freezeTableName: true,
            sequelize: sequelizeInstance, // Sua instância de conexão Sequelize
            modelName: "Orcamentos",
            tableName: 'orcamentos',
        }
    );

    Orcamento.hasMany(itensOrcamento, { foreignKey: "idOrcamento", as: "itensOrcamento" })
    Orcamento.belongsTo(clientes, { foreignKey: "idClientes", as: "cliente" })
    Orcamento.belongsTo(funcionarios, { foreignKey: "idOperador", as: "operador" })

    return { Orcamento }
}

export default initOrcamentos(db).Orcamento


// Helpers
function calculaTotalCustoOrcamento(orcamento: Orcamento) {
    if (!orcamento.itensOrcamento) return 0

    let totalCusto = 0

    for (const item of orcamento.itensOrcamento) {
        if (!item.produto) {
            totalCusto += 0
        } else {
            totalCusto += Number(item.produto?.vlrCusto!) * item.qtde!
        }
    }

    return totalCusto
}