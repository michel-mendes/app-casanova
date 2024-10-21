'use client'

import React from 'react'

import { useProdutos } from '@/hooks/useProdutos'
import { useVendas } from '@/hooks/useVendas'

function TestesPage() {

    const {aplicaAlteracoesFila} = useProdutos()
    const {exportaTodasParaNuvem, exportaVendasRecentes} = useVendas()

    return (
        <div>
            <h1>Página de testes de desenvolvimento</h1>

            <div>
                <p>Aplica alterações de produtos na fila para o banco de dados local</p>
                <button onClick={aplicaAlteracoesFila}>Executar</button>
            </div>

            <div>
                <p>Testa exportação de todas as vendas</p>
                <button onClick={async () => {
                    try {
                        const resultado = await exportaTodasParaNuvem()
                        alert(resultado)
                    } catch (error: any) {
                        alert(error.message)
                    }
                }}>Exportar</button>
            </div>

            <div>
                <p>Testa exportação de vendas recentes</p>
                <button onClick={async () => {
                    try {
                        const resultado = await exportaVendasRecentes()
                        alert(resultado)
                    } catch (error: any) {
                        alert(error.message)
                    }
                }}>Exportar</button>
            </div>
        </div>
    )
}

export default TestesPage