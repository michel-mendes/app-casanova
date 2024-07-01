import { Venda } from "./Venda";
import itensVenda from "../itensVenda";
import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript";
import { db } from "@/database/dbConnect";

export function initVendas(sequelizeInstance: Sequelize) {
    Venda.init({
        id: { type: DataType.NUMBER, allowNull: false, primaryKey: true },
        dataEmissao: { type: DataType.DATE },
        vlrBruto: { type: DataType.NUMBER },
        vlrDesconto: { type: DataType.NUMBER },
        vlrLiquido: { type: DataType.NUMBER },
        vlrRecebido: { type: DataType.NUMBER },
        vlrTroco: { type: DataType.NUMBER },
        idClientes: { type: DataType.NUMBER },
        idCfe: { type: DataType.NUMBER },
        idCupomFiscal: { type: DataType.NUMBER },
        tipoVenda: { type: DataType.STRING },
        idCaixa: { type: DataType.NUMBER },
        idOperador: { type: DataType.NUMBER },
        cancelado: { type: DataType.NUMBER },
        obs: { type: DataType.STRING },
        idFormaPagamentos: { type: DataType.NUMBER },
        vlrAcrescimo: { type: DataType.NUMBER },
        idNFe: { type: DataType.NUMBER },
        justificativa: { type: DataType.STRING },
        dtCancelamento: { type: DataType.DATE },
        idUsuarioCancelamento: { type: DataType.NUMBER },
        idAbertura: { type: DataType.NUMBER },
        cpf: { type: DataType.STRING },
        nome: { type: DataType.STRING },
        endereco: { type: DataType.STRING },
        numero: { type: DataType.STRING },
        bairro: { type: DataType.STRING },
        complemento: { type: DataType.STRING },
        cidade: { type: DataType.STRING },
        uf: { type: DataType.STRING },
        cep: { type: DataType.STRING },
        telefone: { type: DataType.STRING },
        faturada: { type: DataType.NUMBER },
        entregaFutura: { type: DataType.NUMBER },
        marcaModelo: { type: DataType.STRING },
        placa: { type: DataType.STRING },
        km: { type: DataType.STRING },
        vlrFrete: { type: DataType.NUMBER },
        idMontador: { type: DataType.NUMBER },
        marcaModelo2: { type: DataType.STRING },
        marcaModelo3: { type: DataType.STRING },
        placa2: { type: DataType.STRING },
        placa3: { type: DataType.STRING },
        km2: { type: DataType.STRING },
        km3: { type: DataType.STRING },
        dtAlteracao: { type: DataType.DATE },
        idUsuarioAlteracao: { type: DataType.NUMBER },
        condicoesPagto: { type: DataType.STRING },
        retirado: { type: DataType.STRING },
        situacao: { type: DataType.STRING },
        entregaApp: { type: DataType.NUMBER },
        levarApp: { type: DataType.NUMBER },
        acompanhamentoApp: { type: DataType.NUMBER },

        margemLucro: {
            type: DataType.VIRTUAL,
            get() {
                if (this.itensVenda) {
                    let totalCusto = 0

                    for (const item of this.itensVenda) {
                        totalCusto += item.vlrCustoDia * item.qtde
                    }

                    return ((this.vlrLiquido - totalCusto) / totalCusto) * 100
                } else {
                    return 0
                }
            }
        }
    }, {
        freezeTableName: true,
        sequelize: sequelizeInstance,
        modelName: "Venda",
        tableName: "vendas"
    })

    Venda.hasMany(itensVenda, {foreignKey: "idVenda", as: "itensVenda"})

    return { Venda }
}

export default initVendas(db).Venda