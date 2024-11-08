import mongoose, { model, Schema, Model } from "mongoose"

import { IProdutoNuvem } from "./IProdutosNuvem"

const produtoNuvem = new Schema(
    {
        imagensProduto: { type: Map, of: mongoose.Schema.Types.String },
		m2Caixa: { type: Number },
		m2Pallet: { type: Number },
		idProduto: { type: Number },
	    barras: { type: String },
	    descricao: { type: String },
	    unidade: { type: String },
	    grupo: { type: Number },
	    fabricante: { type: Number },
	    referencia: { type: String },
	    vlrCusto: { type: Number },
	    margemVista: { type: Number },
	    vlrVista: { type: Number },
	    margemPrazo: { type: Number },
	    vlrPrazo: { type: Number },
	    ncm: { type: String },
	    cfopEntradaEstado: { type: String },
	    cfopEntradaForaEstado: { type: String },
	    cfopSaidaEstado: { type: String },
	    cfopSaidaForaEstado: { type: String },
	    cst: { type: String },
	    percentualIcms: { type: Number },
	    idBalanca: { type: Number },
	    validadeBalanca: { type: Number },
	    idBaixaAlternativa: { type: Number },
	    qtdeBaixaAlternativa: { type: Number },
	    status: { type: Number },
	    dtAlteracao: { type: Date },
	    idUsuario: { type: Number },
	    vlrAtacado: { type: Number },
	    estoque: { type: Number },
	    percentualIcmsSt: { type: Number },
	    materiaPrima: { type: Number },
	    minimo: { type: Number },
	    maximo: { type: Number },
	    idFornecedor1: { type: Number },
	    idFornecedor2: { type: Number },
	    disponivelEntrega: { type: Number },
	    vlrOferta: { type: Number },
	    dtInicioOferta: { type: Date },
	    dtFimOferta: { type: Date },
	    idPlanoContas: { type: Number },
	    qtdeEmbalagemCompra: { type: Number },
	    barrasAdicional1: { type: String },
	    barrasAdicional2: { type: String },
	    vlrGelado: { type: Number },
	    qtdePromocional: { type: Number },
	    vlrQtdePromocional: { type: Number },
	    vlrCxNatural: { type: Number },
	    vlrCxGelado: { type: Number },
	    qtdeCx: { type: Number },
	    vlrPrazo2: { type: Number },
	    vlrPrazo3: { type: Number },
	    vlrPrazo4: { type: Number },
	    vlrPrazo5: { type: Number },
	    margemVlrPrazo2: { type: Number },
	    margemVlrPrazo3: { type: Number },
	    margemVlrPrazo4: { type: Number },
	    margemVlrPrazo5: { type: Number },
	    idSubGrupo: { type: Number },
	    localizacao: { type: String },
	    idFamiliaProdutos: { type: Number },
	    img: { type: String },
	    pisCstSaida: { type: String },
	    pisCstEntrada: { type: String },
	    pisAliqSaida: { type: Number },
	    cofinsCstSaida: { type: String },
	    cofinsCstEntrada: { type: String },
	    cofinsAliqSaida: { type: Number },
	    siglaIcms: { type: String },
	    obs: { type: String },
	    composicao: { type: String },
	    medida: { type: String },
	    pesoEmbalagem: { type: Number },
	    qtdeEmbalagemEtiqueta: { type: String },
	    ulFornecedor: { type: String },
	    ulCusto: { type: Number },
	    ulCompra: { type: Date },
	    estoque2: { type: Number },
	    idImpressora: { type: Number },
	    exibeApp: { type: Number },
	    adicionais: { type: Number },
	    qtdeAd: { type: Number },
	    aplicacao: { type: String },
	    percComissao: { type: Number },
	    vlrFrete: { type: Number },
	    percReducIcms: { type: Number },
	    baseLegal: { type: String },
	    icmsOrig: { type: String },
	    cest: { type: String },
    },
    {
        toJSON: {
			virtuals: true,
            versionKey: false,
        },
        timestamps: true
    }
)
const ProdutoNuvem = (mongoose.models.ProdutoNuvem as (Model<IProdutoNuvem>)) || model<IProdutoNuvem>("ProdutoNuvem", produtoNuvem)


export { ProdutoNuvem }