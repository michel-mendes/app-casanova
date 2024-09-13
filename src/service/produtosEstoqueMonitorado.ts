import { connectDatabaseMongoDB } from "@/database/dbConnect-mongoose";

import { ProdutoEstoqueMonitorado } from "@/database/models-mongoose/produtoEstoqueMonitorado";
import { GenericModelCRUD } from "@/database/classes/GenericModelCRUD";
import { IProdutoEstoqueMonitorado } from "@/database/models-mongoose/produtoEstoqueMonitorado/IProdutoEstoqueMonitorado";

const produtoEstoqueMonitoradoCRUD = new GenericModelCRUD(ProdutoEstoqueMonitorado)

export {
    listaProdutosEstoqueMonitorado,
    criaProdutoEstoqueMonitorado,
    alteraProdutoEstoqueMonitorado
}

async function listaProdutosEstoqueMonitorado() {
    try {
        connectDatabaseMongoDB()

        const listaProdutos = await produtoEstoqueMonitoradoCRUD.findDocuments()

        return listaProdutos
    } catch (error) {
        throw new Error(`Erro ao consultar produtos com estoque monitorado >> ${error}`)
    }
}

async function criaProdutoEstoqueMonitorado(dadosProdutoMonitorado: IProdutoEstoqueMonitorado) {
    try {
        connectDatabaseMongoDB()

        const produtoJaCadastrado = await produtoEstoqueMonitoradoCRUD.findOneDocument({ idProduto: dadosProdutoMonitorado.idProduto })

        // Erro produto já cadastrado
        if (produtoJaCadastrado) throw new Error("Produto já cadastrado na lista de monitoramento de estoque!")

        const novoProdutoEstoqueMonitorado = await produtoEstoqueMonitoradoCRUD.insertDocument(dadosProdutoMonitorado)

        return novoProdutoEstoqueMonitorado
    } catch (error: any) {
        throw new Error(`Falha ao cadastrar novo produto com estoque monitorado: ${error.message}`)
    }
}

async function alteraProdutoEstoqueMonitorado(idProdutoEstoqueMonitorado: string, dadosProdutoMonitorado: IProdutoEstoqueMonitorado) {
    try {
        connectDatabaseMongoDB()

        const produtoMonitoradoAlterado = await produtoEstoqueMonitoradoCRUD.editDocument(idProdutoEstoqueMonitorado, dadosProdutoMonitorado)

        return produtoMonitoradoAlterado
    } catch (error: any) {
        throw new Error(`Erro ao alterar produto com estoque monitorado: ${error.message}`)
    }
}