import { ObjectId } from "mongoose"
import mongoose from "mongoose"

export interface IItemEntregue {
    idVenda: number,
    idItemVenda: number,
    idProduto: number,
    qtde: number,
    unidade: string,
    valorUnit: number,
    valorTotal: number,
    descricao: string,
    observacoes: string
}

export interface IRomaneioEntrega extends mongoose.Document {
    idEntregaPendente: ObjectId | string | null,
    tipoVenda: string,
    numeroEntrega: string,
    dataEntrega: Date,
    idVenda: number,
    nomeCliente: string,
    enderecoEntrega: string,
    observacoes: string,
    
    itensEntrega: Array<IItemEntregue>
}