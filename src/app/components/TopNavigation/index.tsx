"use client"

import React, { useEffect, useState } from 'react'

import { navigate } from '@/app/actions'

import { useVendas } from '@/hooks/useVendas'
import { useEntregasFuturas } from '@/hooks/useVendaEntregaFutura'
import { useRomaneioEntrega } from '@/hooks/useRomaneioEntrega'

import Link from 'next/link'
import addIcon from "../../images/add-circle-svgrepo-com.svg"
import novaLogo from "../../images/Logo.png"
import truck from "../../images/truck-semi-trailer-svgrepo-com.svg"

import style from "./index.module.css"
import { Input } from '../Input'
import { IVenda } from '@/app/interfaces'
import { IEntregaPendente } from '@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente'

function TopNavigation() {

    const { getVendaById, alteraVenda } = useVendas()
    const { criaNovaEntregaFutura } = useEntregasFuturas()
    const { criaNovoRomaneio } = useRomaneioEntrega()

    const [romaneioCount, setRomaneioCount] = useState(0)

    async function handleClickAdicionarEntrega() {
        const inputNumVenda = (document.getElementById("inputNumeroVenda") as HTMLInputElement)
        const nVenda = inputNumVenda.value
        const venda = await getVendaById(Number(nVenda))

        if (venda) {
            inputNumVenda.value = ""
            handleClickNovaEntregaFutura(venda, criaNovaEntregaFutura, alteraVenda)
        } else {
            alert("Venda não localizada")
            inputNumVenda.value = ""
        }
    }

    async function handleGeraRomaneioEntrega() {
        const inputNumVenda = (document.getElementById("inputNumeroVenda2") as HTMLInputElement)
        const nVenda = inputNumVenda.value
        // alert(`Vamos criar romaneio?\nNúmero da venda: ${nVenda}`)
        const venda = await getVendaById(Number(nVenda))
        // alert("show")
        
        if (venda) {
            const novoRomaneio = await criaNovoRomaneio({
                // idEntregaPendente: "",
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

                if (confirmado) navigate(`/imprime-romaneio/${novoRomaneio.id}`)

                inputNumVenda.value = ""
            } else {
                alert("Erro ao cadastrar romaneio")
                inputNumVenda.value = ""
            }
        } else {
            alert("Venda não localizada")
            inputNumVenda.value = ""
        }
    }

    useEffect(() => {
        const romaneioVerifierTimer = setInterval(() => {
            const cacheRomaneio: Array<any> = JSON.parse(localStorage.getItem("romaneio") || "[]")

            setRomaneioCount(cacheRomaneio.length)
        }, 500)

        return () => {
            clearInterval(romaneioVerifierTimer)
        }
    }, [])

    return (
        <div className={style.navbar}>

            <img className={style.logo} src={novaLogo.src} alt="Logo" />

            <div className={style.adicionar_entrega_container}>
                <Input placeholder={{ insideInput: true, text: "Adicionar entrega futura" }} inputType='text' fieldName='inputNumeroVenda' />
                <img className={style.icone_dicionar} src={addIcon.src} alt="Adicionar entrega futura" onClick={handleClickAdicionarEntrega} />
            </div>

            <div className={style.adicionar_entrega_container}>
                <Input placeholder={{ insideInput: true, text: "Gerar romaneio de entrega única" }} inputType='text' fieldName='inputNumeroVenda2' />
                <img className={style.icone_dicionar} src={addIcon.src} alt="Imprimir romaneio" onClick={handleGeraRomaneioEntrega} />
            </div>

            <Link href={"/entregas-pendentes"}>Entregas pendentes</Link>
            <Link href={"/consulta-entregas"}>Consulta entregas</Link>
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

function handleClickNovaEntregaFutura(
    venda: IVenda,
    criaNovaEntregaFutura: (vefData: IEntregaPendente) => Promise<void>,
    alteraVenda: (id: number, dadosVenda: IVenda) => Promise<void>
) {
    let quantidadeTotalProdutos = 0

    for (const produto of venda?.itensVenda!) {
        quantidadeTotalProdutos += produto.qtde
    }

    const novaEntragaFutura = {
        idVenda: venda?.id!,
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

    criaNovaEntregaFutura(novaEntragaFutura)
    alteraVenda(venda.id!, { entregaFutura: 1 })
    venda!.entregaFutura = 1;
}

export { TopNavigation }