import mongoose from "mongoose";

export type AtributosItemVenda = {
    idItemVenda?: number;
    idVenda?: number;
    idProduto?: number;
    unidade?: string;
    qtde?: number;
    vlrUnitario?: number;
    vlrTotal?: number;
    vlrCustoDia?: number;
    idCaixa?: number;
    idOperador?: number;
    descricao?: string;
    item?: number;
    dataDevolucao?: Date;
    baixaEstoque?: number;
    particionado?: number;
    idProdutoParticionado1?: number;
    idProdutoParticionado2?: number;
    vlrcustoProdPart1?: number;
    vlrcustoProdPart2?: number;
    vlrVendaProdPart1?: number;
    vlrVendaProdPart2?: number;
    oferta?: number;
    descricaoGrade?: string;
    idAuxGrade?: number;
    numeroSerie?: string;
    margemLucro?: number;
}

export interface IItemVendaNuvem extends mongoose.Document<AtributosItemVenda> {}