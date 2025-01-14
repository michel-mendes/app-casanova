import { ItemVenda } from "@/database/models/itensVenda/ItemVenda";
import { IEntregaPendente, IItemRestante } from "@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente"
import { Funcionario } from "@/database/models/funcionarios/Funcionario";
import { VendaAttributes } from "@/database/models/vendas/Venda";

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
	alteraEntregaPendente: (idEntrega: string, dados: IEntregaPendente) => Promise<IEntregaPendente>
	deletaEntregaPendente: (idEntrega: string) => Promise<IEntregaPendente>
}

export interface IItemRestanteProps {
    dadosItem: IItemRestante,
    romaneio: ITempRomaneioEntrega,
    setRomaneio: React.Dispatch<React.SetStateAction<ITempRomaneioEntrega>>
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

export interface IVenda extends VendaAttributes {}

export interface IProdutoRomaneioProps {
    listaRomaneios: Array<ITempRomaneioEntrega>
    setListaRomaneios: React.Dispatch<React.SetStateAction<ITempRomaneioEntrega[]>>
    romaneio: ITempRomaneioEntrega;
    produto: ITempItemEntregue;
    myIndex: number;
	idInputObs: string;
}