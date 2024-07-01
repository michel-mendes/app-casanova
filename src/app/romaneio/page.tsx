"use client"

import React, { useEffect, useState } from 'react'
import { ITempItemEntregue, ITempRomaneioEntrega } from '../interfaces'
import { useRomaneioEntrega } from '@/hooks/useRomaneioEntrega'

import iconAdd from "../images/add-circle-svgrepo-com.svg"
import iconRemove from "../images/minus-circle-svgrepo-com.svg"

import style from "./page.module.css"
import { IRomaneioEntrega } from '@/database/models-mongoose/romaneioEntrega/IRomaneioEntrega'

function RomaneioPage() {

    const { criaNovoRomaneio } = useRomaneioEntrega()

    const [romaneios, setRomaneios] = useState<Array<ITempRomaneioEntrega>>(JSON.parse(localStorage.getItem("romaneio") || "[]"))

    async function handleSalvaRomaneio(dadosRomaneio: ITempRomaneioEntrega) {
        const novoRomaneio = await criaNovoRomaneio(dadosRomaneio as unknown as IRomaneioEntrega)

        if (novoRomaneio) {
            setRomaneios(listaAtual => {
                const listaAtualizada = listaAtual.filter(romaneio => romaneio.idEntregaPendente !== String(novoRomaneio.idEntregaPendente))
                return listaAtualizada
            })
        } else {
            alert(`Não deu certo o cadastro do romaneio =(\n\n"${novoRomaneio}"`)
        }
    }

    useEffect(() => {
        localStorage.setItem("romaneio", JSON.stringify(romaneios))
    }, [romaneios])

    return (
        <div className={style.page_container}>
            <h1>Romaneios de Entrega</h1>

            <div>
                <button onClick={() => {
                    localStorage.removeItem("romaneio")
                }}>Limpar lista de romaneios</button>
            </div>

            <div className={style.romaneios_container}>
                {
                    romaneios.map(romaneio => {
                        return (
                            <div className={style.romaneio}>

                                {/* Header */}
                                <div className={style.romaneio_header}>
                                    <span>Entrega para: <span className={style.texto_nome_cliente}>{romaneio.nomeCliente}</span></span>
                                    <span className={style.texto_data_entrega}>{new Date(romaneio.dataEntrega).toLocaleDateString()}</span>
                                </div>

                                {/* Body / Items */}
                                <div>
                                    {
                                        romaneio.itensEntrega.map((itemEntrega, index) => {
                                            return <ProdutoRomaneio romaneio={romaneio} listaRomaneios={romaneios} setListaRomaneios={setRomaneios} produto={itemEntrega} myIndex={index} key={itemEntrega.idItemVenda} />
                                        })
                                    }
                                </div>

                                {/* Footer */}
                                <div className={style.romaneio_footer}>
                                    <button className={style.button_salvar_entrega} onClick={() => {handleSalvaRomaneio(romaneio)}}>Finalizar romaneio e salvar entrega</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

interface IProdutoRomaneioProps {
    listaRomaneios: Array<ITempRomaneioEntrega>
    setListaRomaneios: React.Dispatch<React.SetStateAction<ITempRomaneioEntrega[]>>
    romaneio: ITempRomaneioEntrega;
    produto: ITempItemEntregue;
    myIndex: number;
}

function ProdutoRomaneio({ listaRomaneios, setListaRomaneios, romaneio, produto, myIndex }: IProdutoRomaneioProps) {

    const idInputQtde = `inputQuantidadeItemEntregar_${produto.idItemVenda}`
    const idInputObs = `inputObservacoesItemEntregar_${produto.idItemVenda}`
    const temBordaEmbaixo = (myIndex + 1) < romaneio.itensEntrega.length

    function excluiProduto() {
        // const confirmado = confirm(`Deseja excluir o produto "${produto.descricao}" do romaneio de entrega?`)

        // if (!confirmado) return

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

    function updateQuantProduto() {
        let novaQuantidade = Number((document.getElementById(idInputQtde)! as HTMLInputElement).value)

        if (novaQuantidade > produto.qtdeRestante) {
            novaQuantidade = produto.qtdeRestante
        } else if (novaQuantidade < 0) {
            novaQuantidade = 0
        }

        const listaRomaneiosAtualizada = listaRomaneios.map(romaneio => {
            if (romaneio.idVenda == produto.idVenda) {
                const produtosAtualizados = romaneio.itensEntrega.map(itemEntrega => {
                    if (itemEntrega.idItemVenda == produto.idItemVenda) {
                        itemEntrega.qtde = novaQuantidade
                    }

                    return itemEntrega
                })
            }

            return romaneio
        })

        setListaRomaneios(listaRomaneiosAtualizada)
    }

    function handleSubtractButton() {
        const input = document.getElementById(idInputQtde)! as HTMLInputElement
        let value = Number(input.value)

        value--

        input.value = String(value)
        updateQuantProduto()
    }

    function handleAddButton() {
        const input = document.getElementById(idInputQtde)! as HTMLInputElement
        let value = Number(input.value)

        value++

        input.value = String(value)
        updateQuantProduto()
    }

    function updateObservacoesProduto() {
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

        setListaRomaneios(listaRomaneiosAtualizada)
    }

    return (
        <div className={style.romaneio_item} style={(temBordaEmbaixo) ? { borderBottom: "1px dashed silver" } : {}}>
            <div className={`${style.item_data} ${style.descricao_produto_container}`}>
                <span>{produto.descricao}</span>
                <span style={{ color: "#3483fa", fontWeight: "bold", cursor: "pointer" }} onClick={excluiProduto}>Excluir</span>
            </div>

            <div className={`${style.item_data} ${style.quant_modifier_container}`}>
                <div className={style.quant_input_container}>
                    <button className={style.button_quantidade} onClick={handleSubtractButton}>
                        <img src={iconRemove.src} alt="" />
                    </button>

                    <input className={style.input_quantidade} type="number" value={produto.qtde} id={idInputQtde} onChange={updateQuantProduto} /> {produto.unidade}

                    <button className={style.button_quantidade} onClick={handleAddButton}>
                        <img src={iconAdd.src} alt="" />
                    </button>
                </div>
                <span style={{ fontWeight: "bold" }}>{Number(produto.qtdeRestante).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2})} {produto.unidade} restante</span>
            </div>

            <div className={`${style.item_data} ${style.obs_container}`}>
                <input className={style.input_observacoes} type="text" name="" value={produto.observacoes} id={idInputObs} onChange={updateObservacoesProduto} autoComplete='off' />
                <span style={{ fontWeight: "bold" }}>Observações</span>
            </div>
        </div>
    )
}

// helpers
function removeRomaneioSemProdutos(listaRomaneios: Array<ITempRomaneioEntrega>) {
    const listaAtualizada = listaRomaneios.filter(romaneio => romaneio.itensEntrega.length > 0)

    return listaAtualizada
}

export default RomaneioPage