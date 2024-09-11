import { IVenda } from "../interfaces";
import { IEntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente";

// Private interfaces
interface ISortableObject {
    [key: string]: any;
}

interface ICadastroNovaEntregaFuturaArgs {
    venda: IVenda;
    apiNovaEntregaFutura: (dadosEntrega: IEntregaPendente) => Promise<IEntregaPendente>;
    apiAlteraVenda: (id: number, dadosVenda: IVenda) => Promise<IVenda>
}

// Converte string para Hexadecimal
export function strToHex(dadoString: string) {
    const stringConvertidoEmHex = Buffer.from(dadoString, 'utf-8').toString('hex');

    return stringConvertidoEmHex
}

// Convert Hexadecimal para string
export function hexToStr(dadoHex: string) {
    const hexConvertidoEmString = Buffer.from(dadoHex, 'hex').toString('utf-8');

    return hexConvertidoEmString
}

// Sort any array of objects by their object properties
// Ex: const sortedArray = sortArrayOfObjects<myArrayType>(myArrayToBeSorted, "propertyToBeSorted", true || false);
export function sortArrayOfObjects<T extends ISortableObject>(
    listToSort: T[],
    propertyToSort: keyof T,
    isAscending: boolean
): T[] {

    const sortedList = listToSort.sort((a, b) => {
        const sortOrder = (isAscending) ? 1 : -1
        const aValue = a[propertyToSort]
        const bValue = b[propertyToSort]

        if (aValue < bValue) {
            return (-1 * sortOrder)
        }
        else if (aValue > bValue) {
            return (1 * sortOrder)
        }
        else {
            return 0
        }
    })

    return sortedList

}

export async function adicionaVendaParaEntregaFutura({ venda, apiNovaEntregaFutura, apiAlteraVenda }: ICadastroNovaEntregaFuturaArgs) {
    let quantidadeTotalProdutos = 0

    for (const produto of venda?.itensVenda!) {
        quantidadeTotalProdutos += produto.qtde
    }

    const novaEntragaFutura = {
        idVenda: venda?.id!,
        finalizada: false,
        tipoVenda: venda?.tipoVenda,
        dataEmissao: venda?.dataEmissao!,
        nomeCliente: venda?.nome!,
        endereco: `${venda?.endereco}${venda?.numero ? `, ${venda?.numero}` : ""}${venda?.bairro ? ` (${venda?.bairro})` : ""}`,
        cidade: venda?.cidade!,
        uf: venda?.uf!,
        valorVenda: venda?.vlrLiquido!,
        status: "Pendente",
        quantidadeTotalProdutos,
        quantidadeEntregue: 0,

        itensRestantes: venda?.itensVenda?.map(itemVenda => {
            return {
                idVenda: itemVenda.idVenda,
                idItemVenda: itemVenda.id,
                idProduto: itemVenda.idProduto,
                qtdeTotalComprado: itemVenda.qtde,
                qtde: itemVenda.qtde,
                unidade: itemVenda.unidade,
                valorUnit: itemVenda.vlrUnitario,
                valorTotal: itemVenda.vlrTotal,
                descricao: itemVenda.descricao,
            }
        }) || [],
        itensEntregues: [],
    } as any

    try {
        const entregaFuturaCadastrada = await apiNovaEntregaFutura(novaEntragaFutura)
        await apiAlteraVenda(venda.id!, { entregaFutura: 1 })
        venda!.entregaFutura = 1;

        return entregaFuturaCadastrada
    } catch (error: any) {
        throw new Error(error.message)
    }
}