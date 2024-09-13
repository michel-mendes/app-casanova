import mongoose, { model, Schema, Model } from "mongoose"

import { IProdutoEstoqueMonitorado } from "./IProdutoEstoqueMonitorado"

const produtoEstoqueMonitorado = new Schema(
    {
        idProduto: { type: Number },
        barras: { type: String },
        descricao: { type: String },
        estoque: { type: Number }
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
        },
        timestamps: true
    }
)
const ProdutoEstoqueMonitorado = (mongoose.models.ProdutoEstoqueMonitorado as (Model<IProdutoEstoqueMonitorado>)) || model<IProdutoEstoqueMonitorado>("ProdutoEstoqueMonitorado", produtoEstoqueMonitorado)

export { ProdutoEstoqueMonitorado }