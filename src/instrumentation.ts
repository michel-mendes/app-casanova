import { listaTodosProdutos } from "./service/produtos"
import { alteraProdutoEstoqueMonitorado, criaProdutoEstoqueMonitorado, listaProdutosEstoqueMonitorado } from "./service/produtosEstoqueMonitorado"

export async function register() {
    setInterval(checkupProdutosEstoqueMonitorado, 10000)
}

async function checkupProdutosEstoqueMonitorado() {
    const produtosMonitorados = await listaProdutosEstoqueMonitorado()
    const todosProdutos = await listaTodosProdutos()

    for (let i = 0; i < todosProdutos.length; i++) {

        const produtoCadastrado = produtosMonitorados.some(item => item.idProduto === todosProdutos[i].id)
        const produtoMonitorado = produtosMonitorados.find(item => item.idProduto == todosProdutos[i].id)

        if (!produtoCadastrado) {
            try {
                const novoProdutoMonitorado = await criaProdutoEstoqueMonitorado({
                    idProduto: todosProdutos[i].id,
                    barras: todosProdutos[i].barras,
                    descricao: todosProdutos[i].descricao,
                    estoque: todosProdutos[i].estoque
                } as any)
    
                console.log(`[${i + 1} / ${todosProdutos.length}] - Produto "${novoProdutoMonitorado.descricao}" cadastrado na lista de monitoramento de estoque`)
            } catch (error: any) {
                console.log(`[${i + 1} / ${todosProdutos.length}] - Erro ao cadatrar o produto "${todosProdutos[i].descricao}": '${error}'`)
            }
        }

        if (produtoCadastrado) {
            
            if (produtoMonitorado?.idProduto !== todosProdutos[i].id ||
                produtoMonitorado?.barras !== todosProdutos[i].barras ||
                produtoMonitorado?.descricao !== todosProdutos[i].descricao ||
                produtoMonitorado?.estoque !== todosProdutos[i].estoque
             ) {
                const produtoAlterado = await alteraProdutoEstoqueMonitorado(produtoMonitorado?.id, {
                    idProduto: todosProdutos[i].id,
                    barras: todosProdutos[i].barras,
                    descricao: todosProdutos[i].descricao,
                    estoque: todosProdutos[i].estoque
                } as any)

                console.log(`[${i + 1} / ${todosProdutos.length}] - Produto "${produtoAlterado.descricao}" foi atualizado`)
            }
        }

    }

    console.log("\nChecagem de produtos com estoque monitorado completa!")
    console.log(`Total de ${todosProdutos.length} produtos\n`)
}