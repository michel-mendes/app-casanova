import mongoose from "mongoose"
import { AtributosProduto } from "@/database/models/produtos/Produto";

export interface IFilaAtualizacaoProdutos extends mongoose.Document{
    idProduto: number;
    atributosAlterados: AtributosProduto;
}