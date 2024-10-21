import { connectDatabaseMongoDB } from "@/database/dbConnect-mongoose"
import { GenericModelCRUD } from "@/database/classes/GenericModelCRUD"
import { FilaAtualizacaoProdutos } from "@/database/models-mongoose/filaAtualizacaoProdutos"
import { IFilaAtualizacaoProdutos } from "@/database/models-mongoose/filaAtualizacaoProdutos/IFilaAtualizacaoProdutos"

const filaAtualizacaoProdutosCRUD = new GenericModelCRUD(FilaAtualizacaoProdutos)

export {
    listaFilaAtualizacaoProdutos, novaFilaAtualizacaoProduto, deletaFilaAtualizacaoProduto
}

async function listaFilaAtualizacaoProdutos() {
    try {
        await connectDatabaseMongoDB()

        const lista = await filaAtualizacaoProdutosCRUD.findDocuments()

        return lista
    } catch (error: any) {
        throw new Error(`Falha ao buscar produtos fila de edição: ${error.message}`)
    }
}

async function novaFilaAtualizacaoProduto(dadosProdutoEdicao: IFilaAtualizacaoProdutos) {
    try {
        await connectDatabaseMongoDB()

        const produtoParaFilaCadastrado = await filaAtualizacaoProdutosCRUD.insertDocument(dadosProdutoEdicao)

        return produtoParaFilaCadastrado
    } catch (error: any) {
        throw new Error(`Falha ao criar produto fila de edição: ${error.message}`)
    }
}

async function deletaFilaAtualizacaoProduto(idFila: string) {
    try {
        await connectDatabaseMongoDB()

        const produtoParaFilaDeletado = await filaAtualizacaoProdutosCRUD.deleteDocument(idFila)

        return produtoParaFilaDeletado
    } catch (error: any) {
        throw new Error(`Falha ao deletar produto fila de edição: ${error.message}`)
    }
}