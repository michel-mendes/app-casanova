import mongoose from "mongoose";
import { IItemVendaNuvem } from "../itemVenda/IItemVendaNuvem";

export type AtributosVendaNuvem = {
	idVenda?: number;
	dataEmissao?: Date;
	vlrBruto?: number;
	vlrDesconto?: number;
	vlrLiquido?: number;
	vlrRecebido?: number;
	vlrTroco?: number;
	idClientes?: number;
	idCfe?: number;
	idCupomFiscal?: number;
	tipoVenda?: string;
	idCaixa?: number;
	idOperador?: number;
	cancelado?: number;
	obs?: string;
	idFormaPagamentos?: number;
	vlrAcrescimo?: number;
	idNFe?: number;
	justificativa?: string;
	dtCancelamento?: Date;
	idUsuarioCancelamento?: number;
	idAbertura?: number;
	cpf?: string;
	nome?: string;
	endereco?: string;
	numero?: string;
	bairro?: string;
	complemento?: string;
	cidade?: string;
	uf?: string;
	cep?: string;
	telefone?: string;
	faturada?: number;
	entregaFutura?: number;
	marcaModelo?: string;
	placa?: string;
	km?: string;
	vlrFrete?: number;
	idMontador?: number;
	marcaModelo2?: string;
	marcaModelo3?: string;
	placa2?: string;
	placa3?: string;
	km2?: string;
	km3?: string;
	dtAlteracao?: Date;
	idUsuarioAlteracao?: number;
	condicoesPagto?: string;
	retirado?: string;
	situacao?: string;
	entregaApp?: number;
	levarApp?: number;
	acompanhamentoApp?: number;
	margemLucro?: number;

	itensVenda?: Array<IItemVendaNuvem>
}

export interface IVendaNuvem extends mongoose.Document<AtributosVendaNuvem> {

}