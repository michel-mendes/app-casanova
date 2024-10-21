import mongoose, { model, Schema, Model } from "mongoose"

import { IFilaAtualizacaoProdutos } from "./IFilaAtualizacaoProdutos"

const filaAtualizacaoProdutos = new Schema(
    {
        idProduto: { type: Number },
        atributosAlterados: { type: Map, of: Schema.Types.Mixed },
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
        },
        timestamps: true
    }
)
const FilaAtualizacaoProdutos = (mongoose.models.FilaAtualizacaoProdutos as (Model<IFilaAtualizacaoProdutos>)) || model<IFilaAtualizacaoProdutos>("FilaAtualizacaoProdutos", filaAtualizacaoProdutos)

export { FilaAtualizacaoProdutos }