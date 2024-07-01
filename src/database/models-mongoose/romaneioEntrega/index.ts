import mongoose, { model, Schema, Model } from "mongoose"

import { IRomaneioEntrega } from "./IRomaneioEntrega"

const romaneioEntregaSchema = new Schema(
    {
        idEntregaPendente: { type: Schema.Types.ObjectId || null,  },
        numeroEntrega: { type: String },
        dataEntrega: { type: Date },
        idVenda: { type: Number },
        nomeCliente: { type: String },
        enderecoEntrega: { type: String },
        observacoes: { type: String },

        itensEntrega: Array<
            {
                idItemVenda: { type:  Number },
                idProduto: { type:  Number },
                qtde: { type:  Number },
                unidade: { type: String },
                valorUnit: { type:  Number },
                valorTotal: { type:  Number },
                descricao: { type: String },
                observacoes: { type: String }
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
const RomaneioEntrega = (mongoose.models.RomaneioEntrega as (Model<IRomaneioEntrega>)) || model<IRomaneioEntrega>("RomaneioEntrega", romaneioEntregaSchema)

export { RomaneioEntrega }