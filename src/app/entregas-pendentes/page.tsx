"use client"

import React, { useRef, useEffect, useState } from 'react'

import { ListaProdutosPendentesEntrega } from './ListaProdutosVendidos'

import { useEntregasFuturas } from '@/hooks/useVendaEntregaFutura'
import { IEntregaFuturaProps, IItemRestanteProps, ITempItemEntregue, ITempRomaneioEntrega } from '../interfaces'

import { LoadingAnimation } from '../components/LoadingAnimation'
import { IEntregaPendente } from '@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente'

import style from "./page.module.css"

function EntregasPendentesPage() {

    const { listaEntregasFuturas, loadingEntregasFuturas, atualizaListaDeEntregasFuturas } = useEntregasFuturas()

    const [tipoAgupamento, setTipoAgrupamento] = useState<"produto" | "venda">("venda")
    const [mostraClientes, setMostraClientes] = useState(false)

    function handleClicaMostraClientes() {
        setMostraClientes(prevState => !prevState)
    }

    useEffect(() => {
        atualizaListaDeEntregasFuturas()
    }, [])

    return (
        <div className={style.page_container}>

            {/* Conteiner do relatório */}
            <div className={style.conteiner_relatorio}>

            <h1>Entregas pendentes</h1>

                {/* Container seletor de relatório */}
                <div className={style.container_radio_tipo_rel}>
                    <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
                        <p>Agrupar por: </p>

                        <label htmlFor="radio1" className={style.radio_button}>
                            <input
                                type="radio"
                                name="tipoRel"
                                id="radio1"
                                checked={tipoAgupamento == "venda"}
                                onClick={() => {
                                    setTipoAgrupamento("venda")
                                }}
                            />
                            <span>Venda</span>
                        </label>

                        <label htmlFor="radio2" className={style.radio_button}>
                            <input
                                type="radio"
                                name="tipoRel"
                                id="radio2"
                                checked={tipoAgupamento == "produto"}
                                onClick={() => {
                                    setTipoAgrupamento("produto")
                                }}
                            />
                            <span>Produto</span>
                        </label>
                    </div>

                    {
                        tipoAgupamento == "produto" && (
                            <div>
                                <label htmlFor="checkMostraClientes" className={style.radio_button}>
                                    <input type="checkbox" name="" id="checkMostraClientes" checked={mostraClientes} onChange={handleClicaMostraClientes} />
                                    <span>Mostrar clientes</span>
                                </label>
                            </div>
                        )
                    }
                </div>

                {
                    (loadingEntregasFuturas)
                        ? <LoadingAnimation />
                        : (tipoAgupamento == "venda")
                            ? (
                                // {/* Conteiner de conteúdo */}
                                <div>
                                    {/* Header */}
                                    <div className={style.header_por_venda}>
                                        <span className={style.col_venda}>Nº venda</span>
                                        <span className={style.col_data}>Data</span>
                                        <span className={style.col_cliente}>Cliente</span>
                                        <span className={style.col_status}>Status</span>
                                    </div>

                                    {/* Body */}
                                    <div className={style.conteudo_por_venda}>
                                        {
                                            listaEntregasFuturas.map(entregaFutura => {
                                                return <LinhaPorVenda entrega={entregaFutura} key={entregaFutura.idVenda} />
                                            })
                                        }
                                    </div>
                                </div>
                            )
                            : <ListaProdutosPendentesEntrega listaEntregasPendentes={listaEntregasFuturas} mostraClientes={mostraClientes} />
                }
            </div>
        </div>
    )
}

function EntregaPendente({ entregaFutura }: IEntregaFuturaProps) {

    const [romaneioEntrega, setRomaneioEntrega] = useState<ITempRomaneioEntrega>({
        dataEntrega: new Date(),
        enderecoEntrega: entregaFutura.endereco,
        idEntregaPendente: entregaFutura.id as any,
        idVenda: entregaFutura.idVenda,
        nomeCliente: entregaFutura.nomeCliente,
        observacoes: "",
        itensEntrega: [],
        numeroEntrega: ""
    })

    useEffect(() => {
        const listaRomaneiosLocal: Array<ITempRomaneioEntrega> = JSON.parse(localStorage.getItem("romaneio") || "[]")
        const meuRomaneio = listaRomaneiosLocal.find(romaneioLocal => romaneioLocal.idVenda == entregaFutura.idVenda)

        if (meuRomaneio) {
            setRomaneioEntrega(meuRomaneio)
        }
    }, [])

    function adicionaAoRomaneioTemporario(aRomaneio: ITempRomaneioEntrega) {
        const listaRomaneiosLocal: Array<ITempRomaneioEntrega> = JSON.parse(localStorage.getItem("romaneio") || "[]")
        const romaneioExistente = listaRomaneiosLocal.find(item => item.idVenda == aRomaneio.idVenda)

        if (romaneioExistente) {

            const listaRomaneioAtualizada = listaRomaneiosLocal.map(item => {
                if (item.idVenda == aRomaneio.idVenda) return aRomaneio
                else return item
            })

            localStorage.setItem("romaneio", JSON.stringify(listaRomaneioAtualizada))

        } else {
            const listaRomaneioAtualizada = [...listaRomaneiosLocal, aRomaneio]

            localStorage.setItem("romaneio", JSON.stringify(listaRomaneioAtualizada))
        }
    }

    return (
        <tr>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Código do produto</th>
                            <th>Quantidade</th>
                            <th>Descrição</th>
                            <th>Romaneio de entrega</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            entregaFutura.itensRestantes.map((dadosItem, itemIndex) => {
                                return <ItemRestante key={itemIndex} dadosItem={dadosItem} romaneio={romaneioEntrega} setRomaneio={setRomaneioEntrega} adicionaAoRomaneioTemporario={adicionaAoRomaneioTemporario} />
                            })
                        }
                    </tbody>
                </table>
            </div>
        </tr>
    )
}

function ItemRestante({ dadosItem, romaneio, setRomaneio, adicionaAoRomaneioTemporario }: IItemRestanteProps) {

    const produtoJaAdicionado = romaneio.itensEntrega.find(item => item.idItemVenda == dadosItem.idItemVenda)

    function adicionaProdutoAoRomaneio() {

        let itemRomaneio = {
            descricao: dadosItem.descricao,
            idVenda: dadosItem.idVenda,
            idItemVenda: dadosItem.idItemVenda,
            idProduto: dadosItem.idProduto,
            observacoes: "",
            qtde: 1,
            qtdeRestante: dadosItem.qtde,
            unidade: dadosItem.unidade,
            valorTotal: dadosItem.valorUnit,
            valorUnit: dadosItem.valorUnit
        }

        setRomaneio(prevRomaneio => {
            const romaneioAtualizado: ITempRomaneioEntrega = {
                ...prevRomaneio,
                itensEntrega: [...prevRomaneio.itensEntrega, itemRomaneio!]
            }

            adicionaAoRomaneioTemporario(romaneioAtualizado)
            return romaneioAtualizado
        })

    }

    return (
        <tr>
            <td>{dadosItem.idProduto}</td>
            <td>{Number(dadosItem.qtde).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })} {dadosItem.unidade}</td>
            <td>{dadosItem.descricao}</td>
            <td>
                <button disabled={produtoJaAdicionado ? true : false} onClick={adicionaProdutoAoRomaneio}>
                    {
                        produtoJaAdicionado
                            ? <span>* Já está na entrega *</span>
                            : <span>Adicionar à entrega</span>
                    }
                </button>
            </td>
        </tr>
    )
}


function LinhaPorVenda({ entrega }: { entrega: IEntregaPendente }) {

    const [exibindoProdutos, setExibindoProdutos] = useState(false)
    const [alturaLinha, setAlturaLinha] = useState<{ height: string } | {}>({})
    const [alturaInicial, setAlturaInicial] = useState<number | undefined>()

    const linhaRef = useRef<HTMLDivElement>(null)
    const detalhesRef = useRef<HTMLDivElement>(null)

    function handleClicaLinha() {
        setExibindoProdutos(prevState => !prevState)
    }

    useEffect(() => {
        if (exibindoProdutos) {
            const detailsHeight = detalhesRef.current?.clientHeight!
            const actualLineHeight = linhaRef.current?.clientHeight!

            setAlturaLinha({ height: Number(detailsHeight + actualLineHeight).toString() + "px" })
        } else {
            setAlturaLinha({ height: "30px" })
        }
    }, [exibindoProdutos])

    return (
        <div className={style.linha_por_venda} style={alturaLinha} ref={linhaRef}>
            <div className={style.container_nomes_colunas} onClick={handleClicaLinha}>
                <span className={style.col_venda}>{entrega.idVenda}</span>
                <span className={style.col_data}>{new Date(entrega.dataEmissao).toLocaleDateString()}</span>
                <span className={style.col_cliente}>{entrega.nomeCliente}</span>
                <span className={style.col_status}>{entrega.status}</span>
            </div>

            <div className={style.detalhes_linha_por_venda} ref={detalhesRef}>
                <EntregaPendente entregaFutura={entrega} key={entrega.idVenda} />
            </div>
        </div>
    )
}

export default EntregasPendentesPage