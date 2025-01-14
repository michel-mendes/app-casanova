"use client"

import React, { useRef, useEffect, useState } from 'react'

import { ListaProdutosPendentesEntrega } from './ListaProdutosVendidos'

import { useModal } from '@/hooks/useModal'

import { useEntregasFuturas } from '@/hooks/useVendaEntregaFutura'
import { useVendas } from '@/hooks/useVendas'

import { IEntregaFuturaProps, IItemRestanteProps, ITempItemEntregue, ITempRomaneioEntrega } from '../../interfaces'

import { LoadingAnimation } from '../../components/LoadingAnimation'
import { IEntregaPendente } from '@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente'

import dropdownIcon from "../../images/dropdown-svgrepo-com.svg"
import { CiEdit } from "react-icons/ci";

import { Input } from '../../components/Input'
import { ComboBox } from '@/app/components/ComboBox'
import { CustomButton } from '@/app/components/CustomButton'
import { sortArrayOfObjects } from '../../helpers'

import { FormVenda } from '@/app/components/FormVenda'
import { IVenda } from '../../interfaces'

import style from "./page.module.css"
import { TabControl } from '@/app/components/TabControl'

interface FormItensRestantesProps {
    entregaPendente: IEntregaPendente;
    romaneioEntrega: ITempRomaneioEntrega;
    setRomaneioEntrega: React.Dispatch<React.SetStateAction<ITempRomaneioEntrega>>
    alteraEntregaPendente: (idEntrega: string, dados: IEntregaPendente) => Promise<IEntregaPendente>
}

function EntregasPendentesPage() {

    const modal = useModal()

    const { listaEntregasFuturas, setListaEntregasFuturas, loadingEntregasFuturas, atualizaListaDeEntregasFuturas, alteraEntregaPendente, deletaEntregaPendente } = useEntregasFuturas()

    const [dadosEntregaModal, setDadosEntregaModal] = useState<IEntregaPendente>()

    const [listaFiltrada, setListaFiltrada] = useState<Array<IEntregaPendente>>([])
    const [filtroCliente, setFiltroCliente] = useState("")
    const [filtroProduto, setFiltroProduto] = useState("")

    const [tipoAgupamento, setTipoAgrupamento] = useState<"produto" | "venda">("venda")
    const [filtroStatusEntrega, setFiltroStatusEntrega] = useState<"todas-entregas" | "somente-finalizadas" | "somente-nao-finalizadas">("somente-nao-finalizadas")
    const [mostraClientes, setMostraClientes] = useState(false)

    function handleClicaMostraClientes() {
        setMostraClientes(prevState => !prevState)
    }

    useEffect(() => {
        const listaFiltradaClientes = listaEntregasFuturas.filter(entrega => {

            if (!isNaN(Number(filtroCliente)) && entrega.idVenda == Number(filtroCliente)) {
                return entrega
            } else if (entrega.nomeCliente.toUpperCase().includes(filtroCliente.toUpperCase())) {
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

        setListaFiltrada([...listaOrganizada])
    }, [filtroCliente, filtroProduto, listaEntregasFuturas])

    useEffect(() => {
        atualizaListaDeEntregasFuturas(filtroStatusEntrega)
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

                        <Input inputType='text' fieldName='filtroCli' placeholder={{ insideInput: true, text: "Filtre nº venda ou cliente" }} onChange={(value) => { setFiltroCliente(String(value)) }} />
                        <Input inputType='text' fieldName='filtroProd' placeholder={{ insideInput: true, text: "Filtre por produto" }} onChange={(value) => { setFiltroProduto(String(value)) }} />
                        <br />
                    </div>

                    {
                        tipoAgupamento == "venda" && (
                            <div className={style.filtro_status_container}>
                                <div>
                                    <span>Status da entrega</span>
                                    <ComboBox
                                        items={
                                            [
                                                { id: "todas-entregas", description: "Todas entregas" },
                                                { id: "somente-finalizadas", description: "Finalizadas" },
                                                { id: "somente-nao-finalizadas", description: "Pendente / Em entrega" }
                                            ]
                                        }
                                        defaultText='Pendente / Em entrega'
                                        onSelectItem={(item) => { setFiltroStatusEntrega(item.id as any) }}
                                    />
                                </div>

                                <CustomButton caption='Atualizar' handleClick={() => { atualizaListaDeEntregasFuturas(filtroStatusEntrega) }} />
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
                                                    exibeFinalizadas={true}
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

            <modal.ModalComponent
                modalTitle={`Visualização de entrega pendente (Venda nº ${dadosEntregaModal?.idVenda})`}
                modalButtons={{ cancelButton: { customCaption: "Fechar (ESC)", onClick: () => { modal.closeModal() } } }}
                customSizes={{ height: "100vh", width: "100vw" }}
            >
                <EntregaPendente entregaFutura={dadosEntregaModal!} alteraEntregaPendente={alteraEntregaPendente} deletaEntregaPendente={deletaEntregaPendente} />
            </modal.ModalComponent>
        </div>
    )
}

function EntregaPendente({ entregaFutura, alteraEntregaPendente, deletaEntregaPendente }: IEntregaFuturaProps) {

    const { localizaVenda } = useVendas()

    const [vendaCompleta, setVendaCompleta] = useState<IVenda | null>(null)

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
        async function getVendaCompleta() {
            const vendaLocalizada = await localizaVenda(entregaFutura.idVenda)

            setVendaCompleta(vendaLocalizada)
        }

        const listaRomaneiosLocal: Array<ITempRomaneioEntrega> = (localStorage) ? (JSON.parse(localStorage.getItem("romaneio") || "[]")) : []
        const meuRomaneio = listaRomaneiosLocal.find(romaneioLocal => romaneioLocal.idVenda == entregaFutura.idVenda)

        if (meuRomaneio) {
            setRomaneioEntrega(meuRomaneio)
        }

        getVendaCompleta()
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

    return (
        // <tr>
        <>
            <TabControl tabs={[
                {
                    tabTitle: "Itens restantes",
                    tabContent: <FormItensRestantes
                        entregaPendente={entregaFutura}
                        romaneioEntrega={romaneioEntrega}
                        setRomaneioEntrega={setRomaneioEntrega}
                        alteraEntregaPendente={alteraEntregaPendente}
                    />
                },
                {
                    tabTitle: `Histórico de entregas (${entregaFutura.romaneiosEntrega.length} ${entregaFutura.romaneiosEntrega.length < 2 ? "entrega" : "entregas"})`,
                    tabContent: <FormHistoricoEntregas entregaPendente={entregaFutura} />
                },
                {
                    tabTitle: "Visualizar venda",
                    tabContent: (
                        <div className={style.container_venda_completa}>
                            <FormVenda venda={vendaCompleta} />
                        </div>
                    )
                },
                {
                    tabTitle: "Mais opções",
                    tabContent: (
                        <div className={style.container_abas_entrega_futura}>
                            <CustomButton caption='Cancelar entrega' handleClick={handleCliqueBotaoCancelarEntregaPendente}/>
                            <CustomButton caption='Marcar entrega como concluída' handleClick={handleCliqueBotaoMarcaEntregaConcluida}/>
                        </div>
                    )
                }
            ]} />

        </>
        // </tr>
    )
}

function FormItensRestantes({ entregaPendente, romaneioEntrega, setRomaneioEntrega, alteraEntregaPendente }: FormItensRestantesProps) {

    async function handleClickAlteraNome() {
        const novoNome = prompt(`Digite um novo nome para "${entregaPendente.nomeCliente}"`, "")

        if (!novoNome) {
            alert("Insira um nome válido")
            return
        }

        await alteraEntregaPendente(String(entregaPendente.id), { nomeCliente: novoNome } as any)
        alert("Nome alterado com sucesso!")
    }

    async function handleClickAlteraEnderecoEntrega() {
        const novoEnd = prompt(`Digite um novo endereço para a entrega de "${entregaPendente.nomeCliente}"`, "")

        if (!novoEnd) {
            alert("Insira um endereço válido")
            return
        }

        await alteraEntregaPendente(String(entregaPendente.id), { endereco: novoEnd } as any)
        alert("Endereço alterado com sucesso!")
    }

    return (
        <div className={style.conteiner_tabela}>

            <div className={style.detalhes_entrega}>
                <p>
                    <span>Nome do cliente:</span> <br />
                    <input type='text' readOnly value={entregaPendente.nomeCliente} /> <button title='Altera o nome do cliente' onClick={handleClickAlteraNome}><CiEdit size={"16px"} /></button>
                </p>
                <p>
                    <span>Endereço de entrega:</span> <br />
                    <input type='text' readOnly value={entregaPendente.endereco} /> <button title='Altera o endereço do cliente' onClick={handleClickAlteraEnderecoEntrega}><CiEdit size={"16px"} /></button>
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
                        entregaPendente.itensRestantes.map((dadosEntrega, itemIndex) => {
                            return <ItemRestante key={itemIndex} dadosItem={dadosEntrega} romaneio={romaneioEntrega} setRomaneio={setRomaneioEntrega} />
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

function ItemRestante({ dadosItem, romaneio, setRomaneio }: IItemRestanteProps) {

    const produtoJaAdicionado = romaneio.itensEntrega.find(item => item.idItemVenda == dadosItem.idItemVenda)

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

interface FormHistoricoRomaneioProps {
    entregaPendente: IEntregaPendente
}

function FormHistoricoEntregas({ entregaPendente }: FormHistoricoRomaneioProps) {

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

                            <table className={style.tabela_historico_entregas}>
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


function LinhaPorVenda({ entrega, alteraEntregaPendente, deletaEntregaPendente, setDadosEntregaPendente, openModalFunction }: { entrega: IEntregaPendente, alteraEntregaPendente: (idEntrega: string, dados: IEntregaPendente) => Promise<IEntregaPendente>, exibeFinalizadas: boolean, deletaEntregaPendente: (idEntrega: string) => Promise<IEntregaPendente>, setDadosEntregaPendente: React.Dispatch<React.SetStateAction<IEntregaPendente | undefined>>, openModalFunction: () => void }) {

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