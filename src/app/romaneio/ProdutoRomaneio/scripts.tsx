import { useState } from "react"

import { IProdutoRomaneioProps, ITempRomaneioEntrega } from "@/app/interfaces"

function useScripts({ listaRomaneios, produto, setListaRomaneios }: IProdutoRomaneioProps) {

    const [quantidade, setQuantidade] = useState<undefined | number>()
    const [observacao, setObservacao] = useState("")
    
    function excluiProduto() {
    
        let listaRomaneiosAtualizada = listaRomaneios.map(romaneio => {
            if (romaneio.idVenda == produto.idVenda) {
                const produtosAtualizados = romaneio.itensEntrega.filter(itemEntrega => itemEntrega.idItemVenda !== produto.idItemVenda)
                return { ...romaneio, itensEntrega: [...produtosAtualizados] }
            }
    
            return romaneio
        })
    
        listaRomaneiosAtualizada = removeRomaneioSemProdutos(listaRomaneiosAtualizada)
    
        setListaRomaneios([...listaRomaneiosAtualizada])
    }

    function atualizaQuantProduto(valor: number | undefined) {

        setQuantidade(valor)

        const listaRomaneiosAtualizada = listaRomaneios.map(romaneio => {
            if (romaneio.idVenda == produto.idVenda) {
                const produtosAtualizados = romaneio.itensEntrega.map(itemEntrega => {
                    if (itemEntrega.idItemVenda == produto.idItemVenda) {
                        itemEntrega.qtde = valor
                    }

                    return itemEntrega
                })
            }

            return romaneio
        })

        setListaRomaneios(listaRomaneiosAtualizada)
    }

    function handleClicaBotaoSubtrairProduto() {
        const qtde = (quantidade) ? quantidade - 1 : 0
        atualizaQuantProduto(qtde)
    }

    function handleClicaBotaoSomarProduto() {
        const qtde = (quantidade) ? quantidade + 1 : 1
        atualizaQuantProduto(qtde)
    }

    function atualizaObservacoesProduto() {

        const listaRomaneiosAtualizada = listaRomaneios.map(romaneio => {
            if (romaneio.idVenda == produto.idVenda) {
                const produtosAtualizados = romaneio.itensEntrega.map(itemEntrega => {
                    if (itemEntrega.idItemVenda == produto.idItemVenda) {
                        itemEntrega.observacoes = observacao
                    }

                    return itemEntrega
                })

                romaneio.itensEntrega = [...produtosAtualizados]
            }

            return romaneio
        })

        setListaRomaneios(listaRomaneiosAtualizada)
    }
    
    return {
        excluiProduto,
        atualizaQuantProduto,
        atualizaObservacoesProduto,
        handleClicaBotaoSomarProduto,
        handleClicaBotaoSubtrairProduto,
        quantidade, setQuantidade,
        observacao, setObservacao
    }
}


// helpers
function removeRomaneioSemProdutos(listaRomaneios: Array<ITempRomaneioEntrega>) {
    const listaAtualizada = listaRomaneios.filter(romaneio => romaneio.itensEntrega.length > 0)

    return listaAtualizada
}

export { useScripts }