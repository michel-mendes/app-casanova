import mongoose, { Model, model, Schema } from "mongoose"

import { IEntregaPendente } from "./IEntregaPendente"

const entregaPendenteSchema = new Schema(
    {

        idVenda: { type: Number },
        dataEmissao: { type: Date },
        nomeCliente: { type: String },
        endereco: { type: String },
        cidade: { type: String },
        uf: { type: String },
        valorVenda: { type: Number },
        status: { type: String },

        itensRestantes: Array<
            {
                idItemVenda: { type: Number },
                idProduto: { type: Number },
                qtde: { type: Number },
                unidade: { type: String },
                valorUnit: { type: Number },
                valorTotal: { type: Number },
                descricao: { type: String },
            }
        >
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
        },
        timestamps: true
    }
)
const EntregaPendente = (mongoose.models.EntregaPendente as Model<IEntregaPendente>) || model<IEntregaPendente>("EntregaPendente", entregaPendenteSchema)

export { EntregaPendente }