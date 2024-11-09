// Produtos Servidor local
import { produtos } from "@/database/models";

// Produtos bando de dados nuvem
import { ProdutoNuvem } from "@/database/models-mongoose/produtosNuvem"

import { connectDatabaseMongoDB } from "@/database/dbConnect-mongoose"
import { GenericModelCRUD } from "@/database/classes/GenericModelCRUD"
import { IProdutoNuvem, AtributosProdutoNuvem } from "@/database/models-mongoose/produtosNuvem/IProdutosNuvem"
import { AtributosProduto } from "@/database/models/produtos/Produto";

const produtoNuvemCRUD = new GenericModelCRUD(ProdutoNuvem)

export {
    listaTodosProdutosNuvem, listaCompletaProdutosSomenteIdeDescricao, novoProdutoNuvem, sincronizaProdutosLocalComNuvem, localizaProdutoPorCodigo
}

async function listaTodosProdutosNuvem() {
    try {
        await connectDatabaseMongoDB()

        const listaProdutos = await produtoNuvemCRUD.findDocuments()

        return listaProdutos
    } catch (error: any) {
        throw new Error(`Falha ao listar romaneios: ${error.message}`)
    }
}

async function listaCompletaProdutosSomenteIdeDescricao() {
    try {
        await connectDatabaseMongoDB()

        const listaProdutos = await produtoNuvemCRUD.findDocuments()

        const listaProdutosSomenteId = listaProdutos.map(item => {
            return {
                idProduto: item.idProduto,
                descricao: item.descricao
            }
        })

        return listaProdutosSomenteId
    } catch (error: any) {
        throw new Error(`Falha ao gerar lista completa de Ids de produtos: ${error.message}`)
    }
}

async function localizaProdutoPorCodigo(codProduto: number) {
    try {
        await connectDatabaseMongoDB()

        const produtoLocalizado = await produtoNuvemCRUD.findOneDocument({idProduto: codProduto})

        if (!produtoLocalizado) { throw new Error(`Produto não encontrado`) }

        return produtoLocalizado!.toJSON() as IProdutoNuvem
    } catch (error: any) {
        throw new Error(`Falha ao loalizar produto por código: ${error.message}`)
    }
}

async function novoProdutoNuvem(dadosProduto: AtributosProdutoNuvem) {
    try {
        await connectDatabaseMongoDB()

        const novoProduto = await produtoNuvemCRUD.insertDocument(dadosProduto as IProdutoNuvem)

        return novoProduto
    } catch (error: any) {
        throw new Error(`Falha ao criar novo produto na nuvem: ${error.message}`)
    }
}

async function sincronizaProdutosLocalComNuvem() {
    try {
        await connectDatabaseMongoDB()

        await verificaCadastrosNovos()
        await verificaCadastrosAlterados()

        return
    } catch (error: any) {
        throw new Error(`Falha ao criar novo produto na nuvem: ${error.message}`)
    }
}

// Helpers
async function extraiIdProdutosNuvemELocal() {
    const listaIDProdutosLocal = await produtos.findAll({attributes: ["id", "descricao"]})
    const listaIDProdutosNuvem = await ProdutoNuvem.find({}, {idProduto: 1, descricao: 1})

    return { listaIDProdutosLocal, listaIDProdutosNuvem }
}

async function verificaCadastrosNovos() {
    const {listaIDProdutosLocal, listaIDProdutosNuvem} = await extraiIdProdutosNuvemELocal()
    let itemAtual = 1

    // Percorre todos os produtos do banco de dados local
    for (const produtoLocal of listaIDProdutosLocal) {

        // Se produto atual não estiver cadastrado na nuvem, cadastrar o mesmo
        if (!listaIDProdutosNuvem.some(item => item.idProduto == produtoLocal.id)) {

            const cadastroCompletoProdutoLocal = await produtos.findByPk(produtoLocal.id)
            if (!cadastroCompletoProdutoLocal) continue
            
            const novoProdutoNuvem = await produtoNuvemCRUD.insertDocument(
                {
                    ...cadastroCompletoProdutoLocal.dataValues,
                    idProduto: cadastroCompletoProdutoLocal.id
                } as any
            )
            
            console.log(`${new Date(Date.now()).toLocaleTimeString()} - Cadastrado novo produto no servidor em nuvem: "${novoProdutoNuvem.descricao}"`)
        }

        itemAtual++
    }
}

async function verificaCadastrosAlterados() {
    const produtosPorPagina = 100
    const { totalPaginas } = await defineQuantidadeTotalPaginas(produtosPorPagina)

    const listaProdutosLocal = await produtos.findAll()

    for (let i = 0; i < totalPaginas; i++) {
        const skip = i * produtosPorPagina

        const listaProdutosNuvem = await ProdutoNuvem.find().skip(skip).limit(produtosPorPagina)

        for (const produtoNuvem of listaProdutosNuvem) {
            const produtoLocal = listaProdutosLocal.find(item => item.id == produtoNuvem.idProduto)
            let atributosAlterados = []

            for (const key in produtoLocal?.dataValues) {
                const nomeAtributo = key as keyof AtributosProduto
                if (nomeAtributo == "id") continue

                const atributoLocal = String(produtoLocal.dataValues[nomeAtributo])
                const atributoNuvem = String(produtoNuvem[nomeAtributo])

                if (atributoLocal != atributoNuvem) {
                    produtoNuvem.set(nomeAtributo, produtoLocal[nomeAtributo])
                    atributosAlterados.push(nomeAtributo)
                }
            }

            if (atributosAlterados.length > 0) {
                await produtoNuvem.save()
                console.log(`${new Date(Date.now()).toLocaleTimeString()} - Atualização de produto no servidor em nuvem: ${produtoNuvem.descricao} recebeu alterações em ${JSON.stringify(atributosAlterados)}`)
            }

        }
    }
}

async function defineQuantidadeTotalPaginas(produtosPorPagina: number) {
    const totalProdutos = await ProdutoNuvem.countDocuments()
    const totalPaginas = Math.ceil(totalProdutos / produtosPorPagina)
    
    return { totalProdutos, totalPaginas }
}