const useInstrumentations = (process.env.USE_INSTRUMENTATIONS_MODULE_ON_APP_BOOT == "true") ? true : false

export async function register() {
    console.log(`Usar módulo 'instrumentations' na inicialização: ${useInstrumentations ? "SIM" : "NÃO"}`)
    
    if (useInstrumentations) {
        setTimeout(sincronizaProdutosEstoqueMonitorado, 60000)
    }

    setInterval(enviaSinalKeepAliveParaSiteLoja, 180000)
}

async function enviaSinalKeepAliveParaSiteLoja() {
    try {
        await fetch("https://site-acabamentoscasanova.onrender.com/")
    } catch (error: any) {
        console.log(`Erro ao enviar sinal keep alive para site loja: ${error.message}`)        
    }
}

// Espelha alterações de estoque nos produtos do BD local para a nuvem
async function sincronizaProdutosEstoqueMonitorado() {
    try {
        await fetch("http://localhost:1005/api/produtos-estoque-monitorado/sincroniza")
    } catch (error: any) {
        console.log(`Erro ao sincronizar produtos: ${error.message}`)
    } finally {
        // setTimeout(sincronizaProdutosEstoqueMonitorado, 60000)
        await enviaCadastroProdutosParaServidorNuvem()
    }
}

// Espelha alterações nos produtos (novo cadastro, alteração de cadastro) do BD local para a nuvem
async function enviaCadastroProdutosParaServidorNuvem() {
    try {
        await fetch("http://localhost:1005/api/nuvem/produtos/sincroniza")
    } catch (error: any) {
        console.log(`Erro ao sincronizar produtos da nuvem com servidor local: ${error.message}`)
    } finally {
        await aplicaAlteracoesDeProdutosFeitosNoServidorNuvem()
    }
}

async function aplicaAlteracoesDeProdutosFeitosNoServidorNuvem() {
    try {
        await fetch("http://localhost:1005/api/produtos/aplica-alteracoes-fila")
    } catch (error: any) {
        console.log(`Erro ao aplicar alterações da fila: ${error.message}`)
    } finally {
        await enviaVendasRecentesParaServidorNuvem()
    }
}

async function enviaVendasRecentesParaServidorNuvem() {
    try {
        await fetch("http://localhost:1005/api/vendas/exporta-vendas-recentes")
    } catch (error: any) {
        console.log(`Erro ao aplicar alterações da fila: ${error.message}`)
    } finally {
        setTimeout(sincronizaProdutosEstoqueMonitorado, 60000)
    }
}