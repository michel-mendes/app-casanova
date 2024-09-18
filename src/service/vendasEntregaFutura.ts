import { connectDatabaseMongoDB } from "@/database/dbConnect-mongoose"
import { EntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura"
import { RomaneioEntrega } from "@/database/models-mongoose/romaneioEntrega"
import { IEntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente"
import { GenericModelCRUD } from "@/database/classes/GenericModelCRUD"

const vendaEntregaFuturaCRUD = new GenericModelCRUD(EntregaPendente)
const romaneiosEntregaCRUD = new GenericModelCRUD(RomaneioEntrega)

export {
    getAllVendasEntregaFutura,
    createNewVendasEntregaFutura,
    alteraEntregaPendente,
    deletaEntregaPendente
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
    try {
        connectDatabaseMongoDB()
        
        const vendaEntregaFuturaJaCadastrada = await vendaEntregaFuturaCRUD.findOneDocument( {idVenda: vefData.idVenda} )
        if (vendaEntregaFuturaJaCadastrada) throw new Error("Entrega futura já cadastrada!")

        vefData.tipoVenda = (vefData.tipoVenda === "v") ? "À Vista" : "À Prazo"

        const createdVendaEntregaFutura = await vendaEntregaFuturaCRUD.insertDocument(vefData)

        return createdVendaEntregaFutura
    } catch (error: any) {
        throw new Error(`Falha ao cadastrar nova entrega futura: ${error.message}`)
    }
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

async function deletaEntregaPendente(idEntrega: string) {
    try {
        connectDatabaseMongoDB()

        // Localiza a entrega pendente a ser cancelada
        const entregaPendente = await vendaEntregaFuturaCRUD.findDocumentById(idEntrega)
        if (!entregaPendente) throw new Error(`Entrega não localizada!`)

        // Verifica se a entrega pendente possui romaneios de entrega, se possuir então cancela a operação
        const listaRomaneios = await romaneiosEntregaCRUD.findDocuments({idEntregaPendente: entregaPendente.id})
        if (listaRomaneios.length > 0) throw new Error(`Impossível cancelar esta entrega pendente!\nHá ${entregaPendente.romaneiosEntrega.length} entregas registadas para esta venda!`)

        const entregaPendenteCancelada = await vendaEntregaFuturaCRUD.deleteDocument(idEntrega)

        return entregaPendenteCancelada
    } catch (error: any) {
        throw new Error(`Erro ao deletar entrega pendente: ${error.message}`)
    }
}