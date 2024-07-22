import { useState } from "react"

import { IProdutoRomaneioProps, ITempRomaneioEntrega } from "@/app/interfaces"

function useScripts({ listaRomaneios, produto, setListaRomaneios, idInputObs }: IProdutoRomaneioProps) {

    const [quantidade, setQuantidade] = useState<undefined | number>()
    
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

                romaneio.itensEntrega = [...produtosAtualizados]
            }

            return romaneio
        })

        setListaRomaneios([...listaRomaneiosAtualizada])
    }

    function handleClicaBotaoSubtrairProduto() {
        const qtde = (quantidade !== undefined) ? quantidade - 1 : 0
        setQuantidade(qtde)

        atualizaQuantProduto(qtde)
    }

    function handleClicaBotaoSomarProduto() {
        const qtde = (quantidade !== undefined) ? quantidade + 1 : 0
        setQuantidade(qtde)

        atualizaQuantProduto(qtde)
    }

    function atualizaObservacoesProduto() {

        const novaObservacao = (document.getElementById(idInputObs)! as HTMLInputElement).value

        const listaRomaneiosAtualizada = listaRomaneios.map(romaneio => {
            if (romaneio.idVenda == produto.idVenda) {
                
                const produtosAtualizados = romaneio.itensEntrega.map(itemEntrega => {
                    if (itemEntrega.idItemVenda == produto.idItemVenda) {
                        itemEntrega.observacoes = novaObservacao
                    }

                    return itemEntrega
                })

                romaneio.itensEntrega = [...produtosAtualizados]
            }

            return romaneio
        })

        setListaRomaneios([...listaRomaneiosAtualizada])
    }
    
    return {
        excluiProduto,
        handleClicaBotaoSomarProduto,
        handleClicaBotaoSubtrairProduto,
        quantidade,
        atualizaObservacoesProduto,
        atualizaQuantProduto
    }
}


// helpers
function removeRomaneioSemProdutos(listaRomaneios: Array<ITempRomaneioEntrega>) {
    const listaAtualizada = listaRomaneios.filter(romaneio => romaneio.itensEntrega.length > 0)

    return listaAtualizada
}

export { useScripts }