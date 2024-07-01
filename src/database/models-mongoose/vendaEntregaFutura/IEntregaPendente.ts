import { ObjectId } from "mongoose"
import mongoose from "mongoose"

import { IRomaneioEntrega } from "../romaneioEntrega/IRomaneioEntrega";

export interface IItemRestante {
    idVenda: number,
    idItemVenda: number,
    idProduto: number,
    qtdeTotalComprado: number,
    qtde: number,
    unidade: string,
    valorUnit: number,
    valorTotal: number,
    descricao: string,
}

export interface IEntregaPendente extends mongoose.Document {
    id?: ObjectId;
    idVenda: number,
    dataEmissao: Date,
    nomeCliente: string,
    endereco: string,
    cidade: string,
    uf: string,
    valorVenda: number,
    status: string,
    quantidadeTotalProdutos: number,
    quantidadeEntregue: number,

    itensRestantes: Array<IItemRestante>,
    romaneiosEntrega: Array<IRomaneioEntrega>
}