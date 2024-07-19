"use client"

import React, { useEffect, useState } from 'react'

import { useVendas } from '@/hooks/useVendas'
import { useEntregasFuturas } from '@/hooks/useVendaEntregaFutura'
import { useRomaneioEntrega } from '@/hooks/useRomaneioEntrega'

import Link from 'next/link'
import addIcon from "../../images/add-circle-svgrepo-com.svg"
import novaLogo from "../../images/Logo.png"
import truck from "../../images/truck-semi-trailer-svgrepo-com.svg"
import sandClockIcon from "../../images/sand-clock-svgrepo-com.svg"
import deliveryTruckTime from "../../images/delivery-truck-time-svgrepo-com.svg"
import hamburgerIcon from "../../images/hamburger-menu.svg"
import closeHamburgerIcon from "../../images/close-hamburger-menu.svg"

import style from "./index.module.css"
import { Input } from '../Input'
import { IVenda } from '@/app/interfaces'
import { IEntregaPendente } from '@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente'
import { LoadingAnimation } from '../LoadingAnimation'

function TopNavigation() {

    const { localizaVenda, alteraVenda, aguardandoApiVendas } = useVendas()
    const { criaNovaEntregaFutura, aguardandoApiEntregaFutura } = useEntregasFuturas()
    const { criaNovoRomaneio, imprimeRomaneioNoServidor, aguardandoApiRomaneio } = useRomaneioEntrega()

    const [romaneioCount, setRomaneioCount] = useState(0)

    const [isClosed, setIsClosed] = useState(true)

    function handleClickHamburgerMenuButton() {
        setIsClosed(prevState => !prevState)
    }

    function handleClickMenuOverlay(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const menuOverlay = event.currentTarget
        // const menuContainer = document.getElementById("menuContainer")
        const closeMenuButton = document.getElementById("closeMenuButton")

        if (event.target === menuOverlay || event.target === closeMenuButton) {
            handleClickHamburgerMenuButton()
        }
    }
    
    async function handleClickAdicionarEntrega(idInput: string) {

        const inputNumVenda = (document.getElementById( idInput ) as HTMLInputElement)
        const nVenda = inputNumVenda.value
        const venda = await localizaVenda(Number(nVenda))

        if (venda) {
            if (!confirm(`Deseja adicionar ${venda?.nome} à lista de entregas pendentes?`)) return

            inputNumVenda.value = ""
            handleClickNovaEntregaFutura(venda, criaNovaEntregaFutura, alteraVenda)

            alert("Venda adicionada à lista de entregas pendentes!")
        }

        inputNumVenda.value = ""
    }

    async function handleGeraRomaneioEntrega(idInput: string) {
        const inputNumVenda = (document.getElementById( idInput ) as HTMLInputElement)
        const nVenda = inputNumVenda.value
        const venda = await localizaVenda(Number(nVenda))

        if (venda) {
            if (!confirm(`Deseja gerar o romaneio completo para ${venda?.nome}?`)) return

            const novoRomaneio = await criaNovoRomaneio({
                // idEntregaPendente: "",
                tipoVenda: (venda.tipoVenda === "v") ? "À Vista" : "À Prazo",
                numeroEntrega: "",
                dataEntrega: new Date(Date.now()),
                idVenda: venda.id!,
                nomeCliente: venda.nome!,
                enderecoEntrega: `${venda.endereco}, ${venda.numero}`,
                observacoes: "",
                itensEntrega: [...venda.itensVenda!]
            } as any)

            if (novoRomaneio) {
                const confirmado = confirm(`Deseja imprimir o romaneio de entrega para ${novoRomaneio.nomeCliente}?`)

                // if (confirmado) navigate(`/imprime-romaneio/${novoRomaneio.id}`)
                if (confirmado) await imprimeRomaneioNoServidor(novoRomaneio.id)

                inputNumVenda.value = ""
            } else {
                alert("Erro ao cadastrar romaneio")
                inputNumVenda.value = ""
            }
        }

        inputNumVenda.value = ""
    }

    useEffect(() => {
        const romaneioVerifierTimer = setInterval(() => {
            const cacheRomaneio: Array<any> = (localStorage) ? ( JSON.parse(localStorage.getItem("romaneio") || "[]") ) : []

            setRomaneioCount(cacheRomaneio.length)
        }, 500)

        return () => {
            clearInterval(romaneioVerifierTimer)
        }
    }, [])

    return (
        <>
            <div className={style.navbar}>

                <img className={style.logo} src={novaLogo.src} alt="Logo" />

                <div className={style.adicionar_entrega_container}>
                    <Input placeholder={{ insideInput: true, text: "Adicionar entrega futura" }} inputType='text' fieldName='inputNumeroVenda' />
                    {
                        (aguardandoApiVendas || aguardandoApiEntregaFutura)
                            ? <LoadingAnimation />
                            : <img className={style.icone_dicionar} src={addIcon.src} alt="Adicionar entrega futura" onClick={() => {handleClickAdicionarEntrega("inputNumeroVenda")}} />
                    }
                </div>

                <div className={style.adicionar_entrega_container}>
                    <Input placeholder={{ insideInput: true, text: "Gerar romaneio de entrega única" }} inputType='text' fieldName='inputNumeroVenda2' />
                    {
                        (aguardandoApiVendas || aguardandoApiEntregaFutura)
                            ? <LoadingAnimation />
                            : <img className={style.icone_dicionar} src={addIcon.src} alt="Imprimir romaneio" onClick={() => {handleGeraRomaneioEntrega("inputNumeroVenda2")}}/>
                    }
                </div>

                <Link href={"/entregas-pendentes"}>Entregas pendentes</Link>
                <Link href={"/consulta-romaneios"}>Romaneios</Link>
                {/* <Link href={"/vendas"}>Vendas</Link> */}

                <Link href={"/romaneio"}>
                    <div className={style.icone_caminhao_container}>
                        <img className={style.icone_caminhao} src={truck.src} alt="Entregas" />
                        {
                            romaneioCount > 0 && <IconeQuantidadeEntregas quantidadeEntregas={romaneioCount} />
                        }
                    </div>
                </Link>

            </div>

            <div className={style.mobile_navbar}>

                <div className={style.hamburger_container} onClick={handleClickHamburgerMenuButton}>
                    <img src={hamburgerIcon.src} alt="" className={style.icone_hamburger} />
                </div>

                <img src={novaLogo.src} alt="" className={style.logo} />

                <Link href={"/romaneio"}>
                    <div className={style.icone_caminhao_container}>
                        <img className={style.icone_caminhao} src={truck.src} alt="Entregas" />
                        {
                            romaneioCount > 0 && <IconeQuantidadeEntregas quantidadeEntregas={romaneioCount} />
                        }
                    </div>
                </Link>

                <div className={style.menu_overlay} is-closed={String(isClosed)} id='menuOverlay' onClick={handleClickMenuOverlay}>
                    <div className={style.menu_container} id='menuContainer'>
                        
                        <div className={style.mobile_menu_input_container}>
                            <p>Adicionar venda à entrega pendente</p>
                            <div className={style.adicionar_entrega_container}>
                                <Input placeholder={{ insideInput: true, text: "Nº venda" }} inputType='text' fieldName='inputNumeroVenda_mobile' />
                                {
                                    (aguardandoApiVendas || aguardandoApiEntregaFutura)
                                        ? <LoadingAnimation />
                                        : <img className={style.icone_dicionar} src={addIcon.src} alt="Adicionar entrega futura" onClick={() => {handleClickAdicionarEntrega("inputNumeroVenda_mobile")}} />
                                }
                            </div>
                        </div>

                        <div className={style.mobile_menu_input_container}>
                            <p>Gerar romaneio de entrega</p>
                            <div className={style.adicionar_entrega_container}>
                                <Input placeholder={{ insideInput: true, text: "Nº venda" }} inputType='text' fieldName='inputNumeroVenda2_mobile' />
                                {
                                    (aguardandoApiVendas || aguardandoApiRomaneio)
                                        ? <LoadingAnimation />
                                        : <img className={style.icone_dicionar} src={addIcon.src} alt="Imprimir romaneio" onClick={() => {handleGeraRomaneioEntrega("inputNumeroVenda2_mobile")}} />
                                }
                            </div>
                        </div>

                        <hr />

                        <Link href={"/entregas-pendentes"} className={style.mobile_menu_link_container} onClick={handleClickHamburgerMenuButton}>
                            <img src={sandClockIcon.src} alt="" className={style.mobile_menu_link_icon} />
                            <span>Entregas pendentes</span>
                        </Link>

                        <Link href={"/consulta-romaneios"} className={style.mobile_menu_link_container} onClick={handleClickHamburgerMenuButton}>
                            <img src={deliveryTruckTime.src} alt="" className={style.mobile_menu_link_icon} />
                            <span>Imprimir romaneios</span>
                        </Link>

                        <div className={style.close_menu_button} onClick={handleClickHamburgerMenuButton} id='closeMenuButton'>
                            <img src={closeHamburgerIcon.src} alt="" className={style.close_hamburger_icon} />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

interface IIconeQuantidadeEntregasProps {
    quantidadeEntregas: number
}

function IconeQuantidadeEntregas({ quantidadeEntregas }: IIconeQuantidadeEntregasProps) {
    return (
        <div className={style.icone_quantidade_entregas}>
            <span>{quantidadeEntregas}</span>
        </div>
    )
}

async function handleClickNovaEntregaFutura(
    venda: IVenda,
    criaNovaEntregaFutura: (vefData: IEntregaPendente) => Promise<IEntregaPendente | undefined>,
    alteraVenda: (id: number, dadosVenda: IVenda) => Promise<void | IVenda>
) {
    let quantidadeTotalProdutos = 0

    for (const produto of venda?.itensVenda!) {
        quantidadeTotalProdutos += produto.qtde
    }

    const novaEntragaFutura = {
        idVenda: venda?.id!,
        finalizada: false,
        tipoVenda: venda?.tipoVenda,
        dataEmissao: venda?.dataEmissao!,
        nomeCliente: venda?.nome!,
        endereco: `${venda?.endereco}${venda?.numero ? `, ${venda?.numero}` : ""}${venda?.bairro ? ` (${venda?.bairro})` : ""}`,
        cidade: venda?.cidade!,
        uf: venda?.uf!,
        valorVenda: venda?.vlrLiquido!,
        status: "Pendente",
        quantidadeTotalProdutos,
        quantidadeEntregue: 0,

        itensRestantes: venda?.itensVenda?.map(itemVenda => {
            return {
                idVenda: itemVenda.idVenda,
                idItemVenda: itemVenda.id,
                idProduto: itemVenda.idProduto,
                qtdeTotalComprado: itemVenda.qtde,
                qtde: itemVenda.qtde,
                unidade: itemVenda.unidade,
                valorUnit: itemVenda.vlrUnitario,
                valorTotal: itemVenda.vlrTotal,
                descricao: itemVenda.descricao,
            }
        }) || [],
        itensEntregues: [],
    } as any

    await criaNovaEntregaFutura(novaEntragaFutura)
    await alteraVenda(venda.id!, { entregaFutura: 1 })
    venda!.entregaFutura = 1;
}

export { TopNavigation }