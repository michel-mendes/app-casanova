import { connectDatabaseMongoDB } from "@/database/dbConnect-mongoose"
import { EntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura"
import { IEntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente"
import { GenericModelCRUD } from "@/database/classes/GenericModelCRUD"

const vendaEntregaFuturaCRUD = new GenericModelCRUD(EntregaPendente)

export {
    getAllVendasEntregaFutura,
    createNewVendasEntregaFutura,
    alteraEntregaPendente
}

async function getAllVendasEntregaFutura() {
    try {
        connectDatabaseMongoDB()

        const listaVendasEF = await vendaEntregaFuturaCRUD.findDocuments()

        return listaVendasEF
    } catch (error) {
        return `Erro ao consultar vendas para entrega futura >> ${error}`
    }
}

async function createNewVendasEntregaFutura(vefData: IEntregaPendente) {
    // try {
        connectDatabaseMongoDB()
        
        const vendaEntregaFuturaJaCadastrada = await vendaEntregaFuturaCRUD.findOneDocument( {idVenda: vefData.idVenda} )
        if (vendaEntregaFuturaJaCadastrada) throw "Entrega futura já cadastrada!"

        vefData.tipoVenda = (vefData.tipoVenda === "v") ? "À Vista" : "À Prazo"

        const createdVendaEntregaFutura = await vendaEntregaFuturaCRUD.insertDocument(vefData)

        return createdVendaEntregaFutura
    // } catch (error) {
    //     return `Erro ao cadastrar nova entrega futura >> ${error}`
    // }
}

async function alteraEntregaPendente(idEntrega: string, dados: IEntregaPendente) {
    try {
        connectDatabaseMongoDB()

        const entregaPendenteAlterada = await vendaEntregaFuturaCRUD.editDocument(idEntrega, dados)

        return entregaPendenteAlterada
    } catch (error: any) {
        throw new Error(`Erro ao alterar entrega pendente: ${error.message}`)
    }
}