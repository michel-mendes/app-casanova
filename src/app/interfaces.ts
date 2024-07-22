import { IEntregaPendente, IItemRestante } from "@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente"

export interface ITempItemEntregue {
    idVenda: number,
    idItemVenda: number,
    idProduto: number,
    qtde?: number,
    qtdeRestante: number,
    unidade: string,
    valorUnit: number,
    valorTotal: number,
    descricao: string,
    observacoes: string
}

export interface ITempRomaneioEntrega {
    idEntregaPendente: string,
	tipoVenda: string,
    numeroEntrega: string,
    dataEntrega: Date,
    idVenda: number,
    nomeCliente: string,
    enderecoEntrega: string,
    observacoes: string,
    
    itensEntrega: Array<ITempItemEntregue>
}

export interface IEntregaFuturaProps {
    entregaFutura: IEntregaPendente,
	alteraEntregaPendente: (idEntrega: string, dados: IEntregaPendente) => Promise<void>
}

export interface IItemRestanteProps {
    dadosItem: IItemRestante,
    romaneio: ITempRomaneioEntrega,
    setRomaneio: React.Dispatch<React.SetStateAction<ITempRomaneioEntrega>>,
    adicionaAoRomaneioTemporario(aRomaneio: ITempRomaneioEntrega): void;
}

export interface IProdutoPendente {
    idProduto?: number,
	descricaoProduto?: string,
    totalVendido?: number,
    unidade?: string,
    listaClientes?: Array<{
        idVenda: number,
        dataVenda: Date,
        quantidade: number,
        nomeCliente: string,
    }>
}

export interface IVenda {
    id?: number;
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

	itensVenda?: Array<any>
}

export interface IProdutoRomaneioProps {
    listaRomaneios: Array<ITempRomaneioEntrega>
    setListaRomaneios: React.Dispatch<React.SetStateAction<ITempRomaneioEntrega[]>>
    romaneio: ITempRomaneioEntrega;
    produto: ITempItemEntregue;
    myIndex: number;
	idInputObs: string;
}