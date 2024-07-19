"use client"

import React, { useEffect, useState } from 'react'
import { ITempItemEntregue, ITempRomaneioEntrega } from '../interfaces'
import { useRomaneioEntrega } from '@/hooks/useRomaneioEntrega'

import iconAdd from "../images/add-circle-svgrepo-com.svg"
import iconRemove from "../images/minus-circle-svgrepo-com.svg"

import style from "./page.module.css"
import { IRomaneioEntrega } from '@/database/models-mongoose/romaneioEntrega/IRomaneioEntrega'

function RomaneioPage() {

    const { criaNovoRomaneio, imprimeRomaneioNoServidor } = useRomaneioEntrega()

    const [romaneios, setRomaneios] = useState<Array<ITempRomaneioEntrega>>((localStorage) ? (JSON.parse(localStorage.getItem("romaneio") || "[]")) : [])

    function validaQuantidadesDosProdutos(dados: ITempRomaneioEntrega): boolean {
        for (const produto of dados.itensEntrega) {
            if (!produto.qtde || produto.qtde <= 0) {
                alert(`Por favor, insira uma quantidade válida para "${produto.descricao}"!`)
                return false
            }
            
            if (produto.qtde > produto.qtdeRestante) {
                alert(`Verifique o item "${produto.descricao}".\n\nA quantidade digitada é maior que o restante para entregar!`)
                return false
            }
        }

        return true
    }
    
    async function handleSalvaRomaneio(dadosRomaneio: ITempRomaneioEntrega) {

        if ( !validaQuantidadesDosProdutos(dadosRomaneio) ) return

        const confirmado = confirm(`Confirma o fechamento do romaneio para ${dadosRomaneio.nomeCliente}?`)

        if (!confirmado) return
        
        const novoRomaneio = await criaNovoRomaneio(dadosRomaneio as unknown as IRomaneioEntrega)

        if (novoRomaneio) {
            setRomaneios(listaAtual => {
                const listaAtualizada = listaAtual.filter(romaneio => romaneio.idEntregaPendente !== String(novoRomaneio.idEntregaPendente))
                return listaAtualizada
            })

            if (confirm("Deseja imprimir o romaneio de entrega?")) {
                imprimeRomaneioNoServidor(novoRomaneio.id)
            }
        } else {
            alert(`Não deu certo o cadastro do romaneio =(\n\n"${novoRomaneio}"`)
        }
    }

    useEffect(() => {
        localStorage && localStorage.setItem("romaneio", JSON.stringify(romaneios))
    }, [romaneios])


    return (
        <div className={style.page_container}>
            <h1>Romaneios de Entrega</h1>


            <div className={style.romaneios_container}>
                {
                    romaneios.map(romaneio => {
                        return (
                            <div className={style.romaneio} key={romaneio.idVenda}>

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

    const [quantidade, setQuantidade] = useState<undefined | number>()
    
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

    function updateQuantProduto(valor: number | undefined) {
        
        setQuantidade(valor)
        // let novaQuantidade = (document.getElementById(idInputQtde)! as HTMLInputElement).value

        // if (novaQuantidade > produto.qtdeRestante) {
        //     novaQuantidade = produto.qtdeRestante
        // } else if (novaQuantidade < 0) {
        //     novaQuantidade = 0
        // }

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

    function handleSubtractButton() {
        const qtde = (quantidade) ? quantidade - 1 : 0
        setQuantidade(qtde)

        updateQuantProduto(qtde)
    }

    function handleAddButton() {
       const qtde = (quantidade) ? quantidade + 1 : 1
       setQuantidade(qtde)

       updateQuantProduto(qtde)
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
                <span style={{ color: "#3483fa", fontWeight: "bold", cursor: "pointer", padding: "5px", width: "fit-content" }} onClick={excluiProduto}>Excluir</span>
            </div>

            <div className={`${style.item_data} ${style.quant_modifier_container}`}>
                <div className={style.quant_input_container}>
                    <button className={style.button_quantidade} onClick={handleSubtractButton}>
                        <img src={iconRemove.src} alt="" />
                    </button>

                    <input className={style.input_quantidade} type="number" value={produto.qtde} id={idInputQtde} onChange={e => updateQuantProduto((e.target.value) ? Number(e.target.value) : undefined)} /> {produto.unidade}

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