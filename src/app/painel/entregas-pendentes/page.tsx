"use client"

import React, { useRef, useEffect, useState } from 'react'

import { ListaProdutosPendentesEntrega } from './ListaProdutosVendidos'

import { useModal } from '@/hooks/useModal'

import { useEntregasFuturas } from '@/hooks/useVendaEntregaFutura'
import { IEntregaFuturaProps, IItemRestanteProps, ITempItemEntregue, ITempRomaneioEntrega } from '../../interfaces'

import { LoadingAnimation } from '../../components/LoadingAnimation'
import { IEntregaPendente } from '@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente'

import dropdownIcon from "../../images/dropdown-svgrepo-com.svg"
import { CiEdit } from "react-icons/ci";

import style from "./page.module.css"
import { Input } from '../../components/Input'
import { sortArrayOfObjects } from '../../helpers'

function EntregasPendentesPage() {

    const modal = useModal()

    const { listaEntregasFuturas, setListaEntregasFuturas, loadingEntregasFuturas, atualizaListaDeEntregasFuturas, alteraEntregaPendente, deletaEntregaPendente } = useEntregasFuturas()

    const [dadosEntregaModal, setDadosEntregaModal] = useState<IEntregaPendente>()
    
    const [listaFiltrada, setListaFiltrada] = useState<Array<IEntregaPendente>>([])
    const [filtroCliente, setFiltroCliente] = useState("")
    const [filtroProduto, setFiltroProduto] = useState("")
    
    const [tipoAgupamento, setTipoAgrupamento] = useState<"produto" | "venda">("venda")
    const [mostraFializadas, setMostraFinalizadas] = useState(false)
    const [mostraClientes, setMostraClientes] = useState(false)

    function handleClicaMostraClientes() {
        setMostraClientes(prevState => !prevState)
    }

    useEffect(() => {
        const listaFiltradaClientes = listaEntregasFuturas.filter(entrega => {

            if ( !isNaN(Number(filtroCliente)) && entrega.idVenda == Number(filtroCliente) ) {
                return entrega
            } else if ( entrega.nomeCliente.toUpperCase().includes(filtroCliente.toUpperCase()) ) {
                return entrega
            }

        })

        const listaFiltradaProdutos = listaFiltradaClientes.filter(entrega => {

            let itemEncontrado = false

            for (const produto of entrega.itensRestantes) {
                if (produto.descricao.toUpperCase().includes(filtroProduto.toUpperCase())) {
                    itemEncontrado = true
                    break
                }
            }

            if (itemEncontrado) {
                return entrega
            }

        })

        const listaOrganizada = sortArrayOfObjects<IEntregaPendente>(listaFiltradaProdutos, "status", true)

        setListaFiltrada( [...listaOrganizada] )
    }, [filtroCliente, filtroProduto, listaEntregasFuturas])
    
    useEffect(() => {
        atualizaListaDeEntregasFuturas("somente-finalizadas")
    }, [])

    return (
        <div className={style.page_container}>

            {/* Conteiner do relatório */}
            <div className={style.conteiner_relatorio}>

                <h1>Entregas pendentes</h1>

                {/* Container seletor de relatório */}
                <div className={style.container_radio_tipo_rel}>
                    
                    <div className={style.container_filtros}>
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

                        <Input inputType='text' fieldName='filtroCli' placeholder={{insideInput: true, text: "Filtre nº venda ou cliente"}} onChange={(value) => { setFiltroCliente(String(value)) }} />
                        <Input inputType='text' fieldName='filtroProd' placeholder={{insideInput: true, text: "Filtre por produto"}} onChange={(value) => { setFiltroProduto(String(value)) }} />
                        <br />
                    </div>

                    {
                        tipoAgupamento == "venda" && (
                            <div>
                                <label htmlFor="check1" className={style.radio_button} style={{ cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        name="exibeFinalizadas"
                                        id="check1"
                                        checked={mostraFializadas}
                                        onChange={() => {
                                            setMostraFinalizadas(prevState => !prevState)
                                        }}
                                    />
                                    <span>Mostra finalizadas</span>
                                </label>
                            </div>
                        )
                    }

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
                        ? (
                            <div className={style.loading_container}>
                                <LoadingAnimation />
                            </div>
                        )
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
                                            listaFiltrada.map(entregaFutura => {
                                                return <LinhaPorVenda
                                                            entrega={entregaFutura}
                                                            alteraEntregaPendente={alteraEntregaPendente}
                                                            exibeFinalizadas={mostraFializadas}
                                                            deletaEntregaPendente={deletaEntregaPendente}
                                                            setDadosEntregaPendente={setDadosEntregaModal}
                                                            openModalFunction={modal.openModal}
                                                            key={entregaFutura.idVenda}
                                                        />
                                            })
                                        }
                                    </div>
                                </div>
                            )
                            : <ListaProdutosPendentesEntrega listaEntregasPendentes={listaFiltrada} mostraClientes={mostraClientes} />
                }
            </div>

            <modal.ModalComponent modalTitle={`Visualização de entrega pendente (Venda nº ${dadosEntregaModal?.idVenda})`} modalButtons={{cancelButton: {customCaption: "Fechar (ESC)", onClick: () => {modal.closeModal()}}}}>
                <EntregaPendente entregaFutura={dadosEntregaModal!} alteraEntregaPendente={alteraEntregaPendente} deletaEntregaPendente={deletaEntregaPendente} />
            </modal.ModalComponent>
        </div>
    )
}

function EntregaPendente({ entregaFutura, alteraEntregaPendente, deletaEntregaPendente }: IEntregaFuturaProps) {

    const [abaAtiva, setAbaAtiva] = useState<"DetalhesEntrega" | "ListaRomaneios">("DetalhesEntrega")
    
    const [popupMenuAberto, setPopupMenuAberto] = useState(false)

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

    function handleCliqueBotaoMenuPopup() {
        setPopupMenuAberto(prevState => !prevState)
    }

    async function handleCliqueBotaoCancelarEntregaPendente() {
        try {
            if (!confirm("Deseja realmente cancelar esta entrega pendente?")) return

            const entregaCancelada = await deletaEntregaPendente(String(entregaFutura.id))

            alert(`A entrega para ${entregaCancelada.nomeCliente} foi cancelada com sucesso!`)
        } catch (error: any) {
            alert(`Erro ao cancelar entrega pendente: ${error.message}`)
        }
    }
    
    async function handleCliqueBotaoMarcaEntregaConcluida() {
        try {
            if (!confirm(`Deseja realmente finalizar a entrega do cliente "${entregaFutura.nomeCliente}"?`)) return

            const entregaAlterada = await alteraEntregaPendente(String(entregaFutura.id), {
                finalizada: true
            } as any)

            alert(`A entrega do cliente "${entregaAlterada.nomeCliente}" foi marcada como finalizada!`)
        } catch (error: any) {
            alert(error.message)
        }
    }

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
        <>
            <div className={style.container_abas_entrega_futura}>
                <span onClick={() => {setAbaAtiva("DetalhesEntrega")}}>Itens restantes</span>
                <span onClick={() => {setAbaAtiva("ListaRomaneios")}}>Lista de entregas ({entregaFutura.romaneiosEntrega.length})</span>

                <div className={style.conteiner_dropdown}>

                    <button className={style.botao_dropdown} onClick={handleCliqueBotaoMenuPopup}>
                        <p>Mais opções</p>
                        <img src={dropdownIcon.src} alt="" />
                    </button>

                    {
                        popupMenuAberto && (
                            <div id="myDropdown" className={style.conteudo_dropdown}>
                                <p onClick={handleCliqueBotaoCancelarEntregaPendente}>Cancelar entrega</p>
                                <p onClick={handleCliqueBotaoMarcaEntregaConcluida}>Marcar entrega concluída</p>
                            </div>
                        )
                    }
                </div>
            </div>

            {
                (abaAtiva == "ListaRomaneios")
                    ? (
                        <ListaRomaneios entregaPendente={entregaFutura} />
                    )
                    : (

                        <div className={style.conteiner_tabela}>

                            <div className={style.detalhes_entrega}>
                                <p>
                                    <span>Nome do cliente:</span> <br />
                                    <input type='text' readOnly value={entregaFutura.nomeCliente} /> <button title='Altera o nome do cliente' onClick={handleClickAlteraNome}><CiEdit size={"16px"} /></button>
                                </p>
                                <p>
                                    <span>Endereço de entrega:</span> <br />
                                    <input type='text' readOnly value={entregaFutura.endereco} /> <button title='Altera o endereço do cliente' onClick={handleClickAlteraEnderecoEntrega}><CiEdit size={"16px"} /></button>
                                </p>
                            </div>
                            <table className={style.tabela_produtos_pendentes}>
                                <thead>
                                    <tr>
                                        <th className={style.col_id_produto}>Cód. produto</th>
                                        <th>Restante a entregar</th>
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

                    )
            }
        </>
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

interface listaRomaneioProps {
    entregaPendente: IEntregaPendente
}

function ListaRomaneios({entregaPendente}: listaRomaneioProps) {

    const romaneios = entregaPendente.romaneiosEntrega

    return (
        <div className={style.corpo_aba_romaneios}>
            {
                romaneios.map((romaneio, index) => {

                    const itensEntrega = romaneio.itensEntrega

                    return (
                        <div key={romaneio.id} className={style.romaneio_container}>
                            <div className={style.romaneio_header}>
                                <p>
                                    <span>{index + 1}ª entrega em {new Date(romaneio.dataEntrega).toLocaleString()}</span>
                                </p>
                            </div>

                            <table>
                                <thead>
                                    <tr className={style.itens_romaneio_nomes_colunas}>
                                        <th>Quantidade</th>
                                        <th>Produto</th>
                                        <th>Observações do produto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        itensEntrega.map(produto => {
                                            return (
                                                <tr className={style.itens_romaneio_dados} key={produto.idItemVenda}>
                                                    <td className={style.coluna_qtde}>{produto.qtde} {produto.unidade}</td>
                                                    <td>{produto.descricao}</td>
                                                    <td className={style.coluna_obs}>{produto.observacoes}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    )
                })
            }
        </div>
    )
}


function LinhaPorVenda({ entrega, alteraEntregaPendente, exibeFinalizadas, deletaEntregaPendente, setDadosEntregaPendente, openModalFunction }: { entrega: IEntregaPendente, alteraEntregaPendente: (idEntrega: string, dados: IEntregaPendente) => Promise<IEntregaPendente>, exibeFinalizadas: boolean, deletaEntregaPendente: (idEntrega: string) => Promise<IEntregaPendente>, setDadosEntregaPendente: React.Dispatch<React.SetStateAction<IEntregaPendente | undefined>>, openModalFunction: () => void }) {

    const [exibindoProdutos, setExibindoProdutos] = useState(false)
    const [alturaLinha, setAlturaLinha] = useState<{ height: string } | {}>({})

    const linhaRef = useRef<HTMLDivElement>(null)
    const detalhesRef = useRef<HTMLDivElement>(null)

    const entregaFinalizada = (Number(entrega.quantidadeEntregue).toFixed(2) == Number(entrega.quantidadeTotalProdutos).toFixed(2)) || entrega.finalizada

    function handleClicaLinha() {
        // setExibindoProdutos(prevState => !prevState)
        setDadosEntregaPendente(entrega)
        openModalFunction()
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

    if (exibeFinalizadas == false && entregaFinalizada) return null

    return (
        <div
            className={style.linha_por_venda}
            style={alturaLinha}
            entrega-finalizada={(entregaFinalizada) ? "true" : "false"}
            ref={linhaRef}
        >
            <div className={style.container_nomes_colunas} onClick={handleClicaLinha}>
                <span className={style.col_venda}>{entrega.idVenda}</span>
                <span className={style.col_data}>{new Date(entrega.dataEmissao).toLocaleDateString()}</span>
                <span className={style.col_cliente}>{entrega.nomeCliente}</span>
                <span className={style.col_status}>{entrega.status}</span>
            </div>

            <div className={style.detalhes_linha_por_venda} ref={detalhesRef}>
                <EntregaPendente entregaFutura={entrega} alteraEntregaPendente={alteraEntregaPendente} deletaEntregaPendente={deletaEntregaPendente} key={entrega.idVenda} />
            </div>
        </div>
    )
}

export default EntregasPendentesPage