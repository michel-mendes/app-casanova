import { connectDatabaseMongoDB } from "@/database/dbConnect-mongoose";

import { telegram } from "@/app/helpers/telegram-bot";

import { ProdutoEstoqueMonitorado } from "@/database/models-mongoose/produtoEstoqueMonitorado";
import { produtos } from "@/database/models";
import { GenericModelCRUD } from "@/database/classes/GenericModelCRUD";
import { IProdutoEstoqueMonitorado } from "@/database/models-mongoose/produtoEstoqueMonitorado/IProdutoEstoqueMonitorado";
import { AtributosProduto } from "@/database/models/produtos/Produto";

const produtoEstoqueMonitoradoCRUD = new GenericModelCRUD(ProdutoEstoqueMonitorado)

export {
    listaProdutosEstoqueMonitorado,
    criaProdutoEstoqueMonitorado,
    alteraProdutoEstoqueMonitorado,
    sincronizaProdutosEstoqueMonitorado
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

async function sincronizaProdutosEstoqueMonitorado() {
    try {
        connectDatabaseMongoDB()

        let notificacaoTelegram = "Notificação de Estoque Casa Nova Acabamentos\n\n"

        const produtosMonitorados = await produtoEstoqueMonitoradoCRUD.findDocuments()
        const todosProdutos = await produtos.findAll()

        for (let i = 0; i < todosProdutos.length; i++) {

            const produto = todosProdutos[i]
            const produtoMonitorado = produtosMonitorados.find(item => item.idProduto == produto.id)

            // Produto não cadastrado no monitoramento
            if (!produtoMonitorado) {
                try {
                    const novoProdutoMonitorado = await criaProdutoEstoqueMonitorado({
                        idProduto: produto.id,
                        barras: produto.barras,
                        descricao: produto.descricao,
                        estoque: produto.estoque
                    } as any)
                
                    console.log(`[${i + 1} / ${todosProdutos.length}] - Produto "${novoProdutoMonitorado.descricao}" cadastrado na lista de monitoramento de estoque`)
                } catch (error: any) {
                    console.log(`[${i + 1} / ${todosProdutos.length}] - Erro ao cadatrar o produto "${produto.descricao}": '${error}'`)
                }
            }

            // Produto cadastrado no monitoramento
            else {
 
                notificacaoTelegram += checaEstoqueENotifica(produtoMonitorado, produto)

                if (produtoMonitorado.idProduto !== produto.id ||
                    produtoMonitorado.barras !== produto.barras ||
                    produtoMonitorado.descricao !== produto.descricao ||
                    produtoMonitorado.estoque !== produto.estoque
                 ) {
                    const produtoAlterado = await alteraProdutoEstoqueMonitorado(produtoMonitorado?.id, {
                        idProduto: produto.id,
                        barras: produto.barras,
                        descricao: produto.descricao,
                        estoque: produto.estoque
                    } as any)
            
                    console.log(`[${i + 1} / ${todosProdutos.length}] - Produto "${produtoAlterado.descricao}" foi atualizado`)
                }
            }

        }

        console.log(`[${new Date(Date.now()).toLocaleString()}] - Sincronização de produtos completa!`)

        telegram.sendMessage(notificacaoTelegram)
    } catch (error: any) {
        throw new Error(`Erro ao sincronizar produtos com estoque monitorado: ${error.message}`)
    }
}


// Helpers
function checaEstoqueENotifica(produtoMonitorado: IProdutoEstoqueMonitorado, produto: AtributosProduto) {

    if (produtoMonitorado.estoque !== produto.estoque) {

        if (produto.estoque <= 0) {
            return `Produto sem estoque: [${produto.barras}] ${produto.descricao}\n`
        }
        else if (produto.estoque <= 10) {
            return `Produto com pouco estoque (<10 ${produto.unidade}): [${produto.barras}] ${produto.descricao}\n`
        }
        else if (produto.estoque <= 60) {
            return `Produto com pouco estoque (<60 ${produto.unidade}): [${produto.barras}] ${produto.descricao}\n`
        }
        else if (produto.estoque <= 100) {
            return `Produto com pouco estoque (<100 ${produto.unidade}): [${produto.barras}] ${produto.descricao}\n`
        }
        else return "\n"

    }

}