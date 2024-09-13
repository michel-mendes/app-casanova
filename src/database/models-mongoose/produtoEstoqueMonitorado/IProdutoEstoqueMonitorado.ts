import mongoose from "mongoose"

export interface IProdutoEstoqueMonitorado extends mongoose.Document{
    idProduto: number,
    barras: string,
    descricao: string,
    estoque: number
}