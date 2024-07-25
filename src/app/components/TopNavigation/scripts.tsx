import React, { useState, useEffect } from 'react'

import { adicionaVendaParaEntregaFutura } from '@/app/helpers'

import { useVendas } from '@/hooks/useVendas'
import { useEntregasFuturas } from '@/hooks/useVendaEntregaFutura'
import { useRomaneioEntrega } from '@/hooks/useRomaneioEntrega'


function useScripts() {

    // Estados de controle do menu
    const [romaneioCount, setRomaneioCount] = useState(0)
    const [isMenuClosed, setIsMenuClosed] = useState(true)

    // Funções de controle do banco de dados
    const { localizaVenda, alteraVenda, aguardandoApiVendas } = useVendas()
    const { criaNovaEntregaFutura, aguardandoApiEntregaFutura } = useEntregasFuturas()
    const { criaNovoRomaneio, imprimeRomaneioNoServidor, aguardandoApiRomaneio } = useRomaneioEntrega()

    function handleCliqueBotaoHamburgerMenu() {
        setIsMenuClosed(prevState => !prevState)
    }

    function handleCliqueOverlayMenu(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const menuOverlay = event.currentTarget
        // const menuContainer = document.getElementById("menuContainer")
        const closeMenuButton = document.getElementById("closeMenuButton")

        if (event.target === menuOverlay || event.target === closeMenuButton) {
            handleCliqueBotaoHamburgerMenu()
        }
    }

    async function handleCliqueBotaoAdicionarEntrega(idInput: string) {

        const inputNumVenda = (document.getElementById(idInput) as HTMLInputElement)
        const nVenda = inputNumVenda.value
        const venda = await localizaVenda(Number(nVenda))

        if (venda) {
            if (!confirm(`Deseja adicionar ${venda?.nome} à lista de entregas pendentes?`)) return

            inputNumVenda.value = ""

            try {
                const entregaFutura = await adicionaVendaParaEntregaFutura({ venda, apiAlteraVenda: alteraVenda, apiNovaEntregaFutura: criaNovaEntregaFutura })

                alert("Venda adicionada à lista de entrega futura!")
            } catch (error: any) {
                alert(error.message)
            }

        }

        inputNumVenda.value = ""
        inputNumVenda.focus()
    }

    async function handleCliqueBotaoGeraRomaneioEntrega(idInput: string) {
        const inputNumVenda = (document.getElementById(idInput) as HTMLInputElement)
        const nVenda = inputNumVenda.value

        try {
            const venda = await localizaVenda(Number(nVenda))

            if (venda) {
                if (!confirm(`Deseja gerar o romaneio completo para ${venda?.nome}?`)) return

                // Cadastra entrega futura para abrir relacionamento entre entrega e romaneio
                const entregaFutura = await adicionaVendaParaEntregaFutura({ venda, apiAlteraVenda: alteraVenda, apiNovaEntregaFutura: criaNovaEntregaFutura })

                const novoRomaneio = await criaNovoRomaneio({
                    idEntregaPendente: entregaFutura.id!,
                    tipoVenda: (venda.tipoVenda === "v") ? "À Vista" : "À Prazo",
                    numeroEntrega: "",
                    dataEntrega: new Date(Date.now()),
                    idVenda: venda.id!,
                    nomeCliente: venda.nome!,
                    enderecoEntrega: `${venda.endereco}, ${venda.numero}`,
                    observacoes: "",
                    itensEntrega: venda.itensVenda!.map(item => {
                        return {
                            descricao: item.descricao,
                            idItemVenda: item.id,
                            idProduto: item.idProduto,
                            idVenda: item.idVenda,
                            observacoes: "",
                            qtde: item.qtde,
                            unidade: item.unidade,
                            valorTotal: item.vlrTotal,
                            valorUnit: item.vlrUnitario
                        }
                    })
                } as any)

                if (novoRomaneio) {
                    const confirmado = confirm(`Deseja imprimir o romaneio de entrega para ${novoRomaneio.nomeCliente}?`)

                    if (confirmado) {
                        const respostaImpressaoServidor = await imprimeRomaneioNoServidor(novoRomaneio.id)
                        
                        alert( respostaImpressaoServidor )
                    }
                } else {
                    alert("Erro ao cadastrar romaneio")
                    inputNumVenda.value = ""
                }
            }
        } catch (error: any) {

            alert(error.message)

        } finally {
            inputNumVenda.value = ""
            inputNumVenda.focus()
        }

    }


    // Controlador de indicador de romaneios abertos no armazenamento local
    useEffect(() => {
        const romaneioVerifierTimer = setInterval(() => {
            const cacheRomaneio: Array<any> = (localStorage) ? (JSON.parse(localStorage.getItem("romaneio") || "[]")) : []

            setRomaneioCount(cacheRomaneio.length)
        }, 500)

        return () => {
            clearInterval(romaneioVerifierTimer)
        }
    }, [])

    return {
        handleCliqueBotaoAdicionarEntrega,
        handleCliqueBotaoGeraRomaneioEntrega,
        handleCliqueOverlayMenu,
        handleCliqueBotaoHamburgerMenu,
        romaneioCount,
        isMenuClosed,
        aguardandoApiVendas,
        aguardandoApiRomaneio,
        aguardandoApiEntregaFutura,
    }
}

export default useScripts