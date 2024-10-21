'use client'

import React, { useEffect, useState } from 'react'
import { useProdutos } from '@/hooks/useProdutos'
import { useProdutosNuvem } from '@/hooks/useProdutosNuvem'
import { useFilaEdicaoProdutos } from '@/hooks/useFilaEdicaoProduto'

import style from "./page.module.css"
import { AtributosProduto } from '@/database/models/produtos/Produto';

interface IContagemProduto {
    idProduto: number;
    descricaoProduto: string;
    quantidade: number;
}

function ContagemProdutosPage() {

    const { listaProdutosDescricaoId, atualizaListaDescricaoId } = useProdutosNuvem()
    const { criaNovaFilaAtualizacaoProduto } = useFilaEdicaoProdutos()

    const [listaContagem, setListaContagem] = useState<Array<IContagemProduto>>([])

    function adicionaProdutoParaListaContagem(descricaoProduto: string) {
        const produtoEncontrado = listaProdutosDescricaoId.find(item => item.descricao == descricaoProduto)

        if (!produtoEncontrado) {
            return alert("Produto indisponível ou não localizado!")
        }

        setListaContagem(listaAtual => {
            return [
                ...listaAtual,
                {
                    idProduto: produtoEncontrado.idProduto,
                    descricaoProduto: produtoEncontrado.descricao,
                    quantidade: 0
                }
            ]
        })
    }

    function removeProdutoDaLista(idProduto: number) {
        const novaLista = listaContagem.filter(item => item.idProduto != idProduto)

        setListaContagem(novaLista)
    }

    async function enviaContagemParaServidor() {
        const confirmado = confirm("Deseja realmente enviar essa relação de contagem para o servidor?\nA operação não poderá ser desfeita!")

        if (!confirmado) return

        const tempListaContagem = [...listaContagem]

        for (const contagemProduto of tempListaContagem) {
            try {
                const novoProduto = await criaNovaFilaAtualizacaoProduto({
                    idProduto: contagemProduto.idProduto,
                    atributosAlterados: {
                        estoque: contagemProduto.quantidade
                    }
                } as any)

                setListaContagem(atual => {
                    const listaSemProdutoContado = atual.filter(itemContado => itemContado.idProduto !== novoProduto.idProduto)

                    return listaSemProdutoContado
                })
            } catch (error: any) {
                alert(`Erro: ${error.message}`)
            }
        }

        alert("Processo concluído")
    }

    function calculaContagem(idProduto: number, tipoDeCalculo: "SOMAR" | "SUBTRAIR") {
        const quantidadeInformada = Number(prompt(`Digite a quantidade contada:`, "")?.replaceAll(",", "."))

        if (isNaN(quantidadeInformada)) {
            alert("Insira uma contagem válida!")
            return
        }

        setListaContagem(listaAtual => {
            const listaAtualizada = listaAtual.map(item => {
                if (item.idProduto == idProduto) {
                    const novaQuantidade = (tipoDeCalculo == "SOMAR") ? (item.quantidade + quantidadeInformada) : (item.quantidade - quantidadeInformada)

                    return {
                        ...item,
                        quantidade: novaQuantidade
                    }
                }

                return item
            })

            return listaAtualizada
        })
    }

    useEffect(() => { atualizaListaDescricaoId() }, [])

    return (
        <div className={style.page_container}>
            <h1>Contagem de Produtos</h1>

            <div className={style.cotainer_pesquisa}>
                <label htmlFor="">
                    <span>Busca de produtos</span>
                    <input type="text" list='listaProdutos' id='inputListaProdutos' />
                    <datalist id='listaProdutos'>
                        {
                            listaProdutosDescricaoId.map(produto => {
                                return (
                                    <option key={produto.idProduto}>{produto.descricao}</option>
                                )
                            })
                        }
                    </datalist>
                </label>
                <button onClick={() => {
                    const inputDescricaoProduto = (document.getElementById("inputListaProdutos") as HTMLInputElement)
                    const produtoJaExisteNaLista = listaContagem.find(item => item.descricaoProduto == inputDescricaoProduto.value)

                    if (produtoJaExisteNaLista) return inputDescricaoProduto.value = ""

                    adicionaProdutoParaListaContagem(inputDescricaoProduto.value)
                    inputDescricaoProduto.value = ""
                }}>Adicionar</button>
            </div>
            <br />

            <table className={style.tabela_contagem}>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Quantidade contada</th>
                        <th>Operações</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        listaContagem.map(item => {
                            return (
                                <tr key={item.idProduto}>
                                    <td>{item.descricaoProduto}</td>
                                    <td className={style.coluna_quantidade}>{item.quantidade}</td>
                                    <td className={style.coluna_botoes}>
                                        <div className={style.container_botoes_contagem}>
                                            <button onClick={() => { calculaContagem(item.idProduto, "SOMAR") }}>Somar contagem</button>
                                            <button onClick={() => { calculaContagem(item.idProduto, "SUBTRAIR") }}>Subtrair contagem</button>
                                            <button onClick={() => { removeProdutoDaLista(item.idProduto) }}>Remover da lista</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            <br />
            <hr />
            <br />

            <button onClick={enviaContagemParaServidor}>Enviar contagem para o SERVIDOR</button>

        </div>
    )
}

export default ContagemProdutosPage