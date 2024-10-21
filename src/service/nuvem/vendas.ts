import { VendaNuvem } from "@/database/models-mongoose/venda";
import { AtributosVendaNuvem, IVendaNuvem } from "@/database/models-mongoose/venda/IVendaNuvem";
import { GenericModelCRUD } from "@/database/classes/GenericModelCRUD";
import { connectDatabaseMongoDB } from "@/database/dbConnect-mongoose";

const vendas = new GenericModelCRUD(VendaNuvem)

export async function listaVendasNuvem() {
    try {
        await connectDatabaseMongoDB()

        const listaVendas = await vendas.findDocuments()

        return (listaVendas as Array<AtributosVendaNuvem>)
    } catch (error: any) {
        throw new Error(`Falha ao listar vendas no servidor da nuvem: ${error.message}`)
    }
}

export async function buscaVendaNuvem(idVenda: number) {
    try {
        await connectDatabaseMongoDB()

        const venda = await vendas.findOneDocument({idVenda})

        if (venda) {
            return venda.toJSON() as AtributosVendaNuvem
        } else {
            return null
        }
    } catch (error: any) {
        throw new Error(`Falha ao buscar venda no servidor da nuvem: ${error.message}`)
    }
}

export async function novaVendaNuvem(dadosVenda: AtributosVendaNuvem) {
    try {
        await connectDatabaseMongoDB()

        const vendaJaExiste = await vendas.findOneDocument({idVenda: dadosVenda.idVenda})

        if (vendaJaExiste) throw new Error(`Venda nº ${dadosVenda.idVenda} já registrada!`)

        const novaVenda = await vendas.insertDocument(dadosVenda as IVendaNuvem)

        return (novaVenda.toJSON() as AtributosVendaNuvem)
    } catch (error: any) {
        throw new Error(`Falha registrar nova venda no servidor da nuvem: ${error.message}`)
    }
}

export async function editaVendaNuvem(idVendaNuvem: string, {idVenda, ...dadosVenda}: AtributosVendaNuvem) {
    try {
        await connectDatabaseMongoDB()
        
        const vendaAlterada = await vendas.editDocument(idVendaNuvem, dadosVenda as IVendaNuvem)

        return vendaAlterada
    } catch (error: any) {
        throw new Error(`Falha editar venda no servidor da nuvem: ${error.message}`)
    }
}