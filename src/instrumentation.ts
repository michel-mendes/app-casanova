export async function register() {
    setInterval(sincronizaProdutos, 20000)
}

async function sincronizaProdutos() {
    try {
        await fetch("http://localhost:1005/api/produtos-estoque-monitorado/sincroniza")
    } catch (error: any) {
        console.log(`Erro ao sincronizar produtos: ${error.message}`)
    }
}