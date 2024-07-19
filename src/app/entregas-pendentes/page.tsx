"use client"

import React, { useRef, useEffect, useState } from 'react'

import { ListaProdutosPendentesEntrega } from './ListaProdutosVendidos'

import { useEntregasFuturas } from '@/hooks/useVendaEntregaFutura'
import { IEntregaFuturaProps, IItemRestanteProps, ITempItemEntregue, ITempRomaneioEntrega } from '../interfaces'

import { LoadingAnimation } from '../components/LoadingAnimation'
import { IEntregaPendente } from '@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente'

import style from "./page.module.css"

function EntregasPendentesPage() {

    const { listaEntregasFuturas, loadingEntregasFuturas, atualizaListaDeEntregasFuturas, alteraEntregaPendente } = useEntregasFuturas()

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
                    <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                        <p>Agrupar por: </p>

                        <label htmlFor="radio1" className={style.radio_button}>
                            <input
                                type="radio"
                                name="tipoRel"
                                id="radio1"
                                checked={tipoAgupamento == "venda"}
                                onChange={() => {
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
                                onChange={() => {
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
                                                return <LinhaPorVenda entrega={entregaFutura} alteraEntregaPendente={alteraEntregaPendente} key={entregaFutura.idVenda} />
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

function EntregaPendente({ entregaFutura, alteraEntregaPendente }: IEntregaFuturaProps) {

    const [romaneioEntrega, setRomaneioEntrega] = useState<ITempRomaneioEntrega>({
        dataEntrega: new Date(),
        enderecoEntrega: entregaFutura.endereco,
        idEntregaPendente: entregaFutura.id as any,
        tipoVenda: entregaFutura.tipoVenda,
        idVenda: entregaFutura.idVenda,
        nomeCliente: entregaFutura.nomeCliente,
        observacoes: "",
        itensEntrega: [],
        numeroEntrega: ""
    })

    useEffect(() => {
        const listaRomaneiosLocal: Array<ITempRomaneioEntrega> = (localStorage) ? (JSON.parse(localStorage.getItem("romaneio") || "[]")) : []
        const meuRomaneio = listaRomaneiosLocal.find(romaneioLocal => romaneioLocal.idVenda == entregaFutura.idVenda)

        if (meuRomaneio) {
            setRomaneioEntrega(meuRomaneio)
        }
    }, [])

    async function handleClickAlteraNome() {
        const novoNome = prompt(`Digite um novo nome para "${entregaFutura.nomeCliente}"`, "")

        if (!novoNome) {
            alert("Insira um nome válido")
            return
        }

        await alteraEntregaPendente(String(entregaFutura.id), { nomeCliente: novoNome } as any)
        alert("Nome alterado com sucesso!")
    }

    async function handleClickAlteraEnderecoEntrega() {
        const novoEnd = prompt(`Digite um novo endereço para a entrega de "${entregaFutura.nomeCliente}"`, "")

        if (!novoEnd) {
            alert("Insira um endereço válido")
            return
        }

        await alteraEntregaPendente(String(entregaFutura.id), { endereco: novoEnd } as any)
        alert("Endereço alterado com sucesso!")
    }

    function adicionaAoRomaneioTemporario(aRomaneio: ITempRomaneioEntrega) {
        const listaRomaneiosLocal: Array<ITempRomaneioEntrega> = (localStorage) ? (JSON.parse(localStorage.getItem("romaneio") || "[]")) : []
        const romaneioExistente = listaRomaneiosLocal.find(item => item.idVenda == aRomaneio.idVenda)

        if (romaneioExistente) {

            const listaRomaneioAtualizada = listaRomaneiosLocal.map(item => {
                if (item.idVenda == aRomaneio.idVenda) return aRomaneio
                else return item
            })

            localStorage && localStorage.setItem("romaneio", JSON.stringify(listaRomaneioAtualizada))

        } else {
            const listaRomaneioAtualizada = [...listaRomaneiosLocal, aRomaneio]

            localStorage && localStorage.setItem("romaneio", JSON.stringify(listaRomaneioAtualizada))
        }
    }

    return (
        // <tr>
        <div className={style.conteiner_tabela}>
            <div className={style.detalhes_entrega}>
                <p><b>Nome do cliente:</b> <span>{entregaFutura.nomeCliente}</span> <button onClick={handleClickAlteraNome}>Alterar nome do cliente</button></p>
                <p><b>Endereço de entrega:</b> <span>{entregaFutura.endereco}</span> <button onClick={handleClickAlteraEnderecoEntrega}>Alterar endereço de entrega</button></p>
            </div>
            <table className={style.tabela_produtos_pendentes}>
                <thead>
                    <tr>
                        <th className={style.col_id_produto}>Código do produto</th>
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
        // </tr>
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
        <tr className={style.linha_produto_pendente} entregue-total={Number(dadosItem.qtde) < 0.5 ? "true" : "false"}>
            <td className={style.col_id_produto}>{dadosItem.idProduto}</td>
            <td>{Number(dadosItem.qtde).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })} {dadosItem.unidade}</td>
            <td>{dadosItem.descricao}</td>
            <td className={style.col_button_container}>
                {
                    (Number(dadosItem.qtde > 0.5))
                    ? (
                        <button disabled={produtoJaAdicionado ? true : false} onClick={adicionaProdutoAoRomaneio} className={style.button_adicionar_entrega}>
                            {
                                produtoJaAdicionado
                                    ? <span>* Já está na entrega *</span>
                                    : <span>Adicionar à entrega</span>
                            }
                        </button>
                    )
                    : null
                }
            </td>
        </tr>
    )
}


function LinhaPorVenda({ entrega, alteraEntregaPendente }: { entrega: IEntregaPendente, alteraEntregaPendente: (idEntrega: string, dados: IEntregaPendente) => Promise<void> }) {

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

    if (entrega.quantidadeEntregue == entrega.quantidadeTotalProdutos) return null

    return (
        <div className={style.linha_por_venda} style={alturaLinha} ref={linhaRef}>
            <div className={style.container_nomes_colunas} onClick={handleClicaLinha}>
                <span className={style.col_venda}>{entrega.idVenda}</span>
                <span className={style.col_data}>{new Date(entrega.dataEmissao).toLocaleDateString()}</span>
                <span className={style.col_cliente}>{entrega.nomeCliente}</span>
                <span className={style.col_status}>{entrega.status}</span>
            </div>

            <div className={style.detalhes_linha_por_venda} ref={detalhesRef}>
                <EntregaPendente entregaFutura={entrega} alteraEntregaPendente={alteraEntregaPendente} key={entrega.idVenda} />
            </div>
        </div>
    )
}

export default EntregasPendentesPage