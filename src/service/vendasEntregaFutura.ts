import { connectDatabaseMongoDB } from "@/database/dbConnect-mongoose"
import { EntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura"
import { IEntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente"
import { GenericModelCRUD } from "@/database/classes/GenericModelCRUD"
import { vendas } from "@/database/models"
import { ItemVenda } from "@/database/models/itensVenda/ItemVenda"
import { Op } from "sequelize"
import moment from "moment"

const vendaEntregaFuturaCRUD = new GenericModelCRUD(EntregaPendente)

export {
    getAllVendasEntregaFutura,
    createNewVendasEntregaFutura
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

        const createdVendaEntregaFutura = await vendaEntregaFuturaCRUD.insertDocument(vefData)

        return createdVendaEntregaFutura
    // } catch (error) {
    //     return `Erro ao cadastrar nova entrega futura >> ${error}`
    // }
}