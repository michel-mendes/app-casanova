import mongoose, { model, Schema, Model } from "mongoose"

import { IVendaNuvem } from "./IVendaNuvem"

const vendaNuvemSchema = new Schema(
    {
        idVenda: { type: Schema.Types.Number },
	    dataEmissao: { type: Schema.Types.Date},
	    vlrBruto: { type: Schema.Types.Number },
	    vlrDesconto: { type: Schema.Types.Number },
	    vlrLiquido: { type: Schema.Types.Number },
	    vlrRecebido: { type: Schema.Types.Number },
	    vlrTroco: { type: Schema.Types.Number },
	    idClientes: { type: Schema.Types.Number },
	    idCfe: { type: Schema.Types.Number },
	    idCupomFiscal: { type: Schema.Types.Number },
	    tipoVenda: { type: Schema.Types.String },
	    idCaixa: { type: Schema.Types.Number },
	    idOperador: { type: Schema.Types.Number },
	    cancelado: { type: Schema.Types.Number },
	    obs: { type: Schema.Types.String },
	    idFormaPagamentos: { type: Schema.Types.Number },
	    vlrAcrescimo: { type: Schema.Types.Number },
	    idNFe: { type: Schema.Types.Number },
	    justificativa: { type: Schema.Types.String },
	    dtCancelamento: { type: Schema.Types.Date},
	    idUsuarioCancelamento: { type: Schema.Types.Number },
	    idAbertura: { type: Schema.Types.Number },
	    cpf: { type: Schema.Types.String },
	    nome: { type: Schema.Types.String },
	    endereco: { type: Schema.Types.String },
	    numero: { type: Schema.Types.String },
	    bairro: { type: Schema.Types.String },
	    complemento: { type: Schema.Types.String },
	    cidade: { type: Schema.Types.String },
	    uf: { type: Schema.Types.String },
	    cep: { type: Schema.Types.String },
	    telefone: { type: Schema.Types.String },
	    faturada: { type: Schema.Types.Number },
	    entregaFutura: { type: Schema.Types.Number },
	    marcaModelo: { type: Schema.Types.String },
	    placa: { type: Schema.Types.String },
	    km: { type: Schema.Types.String },
	    vlrFrete: { type: Schema.Types.Number },
	    idMontador: { type: Schema.Types.Number },
	    marcaModelo2: { type: Schema.Types.String },
	    marcaModelo3: { type: Schema.Types.String },
	    placa2: { type: Schema.Types.String },
	    placa3: { type: Schema.Types.String },
	    km2: { type: Schema.Types.String },
	    km3: { type: Schema.Types.String },
	    dtAlteracao: { type: Schema.Types.Date},
	    idUsuarioAlteracao: { type: Schema.Types.Number },
	    condicoesPagto: { type: Schema.Types.String },
	    retirado: { type: Schema.Types.String },
	    situacao: { type: Schema.Types.String },
	    entregaApp: { type: Schema.Types.Number },
	    levarApp: { type: Schema.Types.Number },
	    acompanhamentoApp: { type: Schema.Types.Number },
	    margemLucro: { type: Schema.Types.Number },

        itensVenda: { type: Schema.Types.Array, of: Schema.Types.Mixed }
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
        },
        timestamps: true
    }
)
const VendaNuvem = (mongoose.models.Venda as (Model<IVendaNuvem>)) || model<IVendaNuvem>("Venda", vendaNuvemSchema)

export { VendaNuvem }