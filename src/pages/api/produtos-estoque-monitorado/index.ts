import { NextApiRequest, NextApiResponse } from "next";
import { criaProdutoEstoqueMonitorado, listaProdutosEstoqueMonitorado } from "@/service/produtosEstoqueMonitorado";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body } = req

    if (method === "GET") {
        try {
            const listaProdutos = await listaProdutosEstoqueMonitorado()

            res.status(200).json(listaProdutos)
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

    else if (method === "POST") {
        try {
            const dadosRecebidos = JSON.parse(body)

            const novoRomaneio = await criaProdutoEstoqueMonitorado(dadosRecebidos)

            res.status(200).json(novoRomaneio)
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }

}

export default handler