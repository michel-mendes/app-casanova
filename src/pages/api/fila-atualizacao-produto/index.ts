import { NextApiRequest, NextApiResponse } from "next";
import { listaFilaAtualizacaoProdutos, novaFilaAtualizacaoProduto } from "@/service/nuvem/filaAtualizacaoProdutos";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body } = req

    if (method === "GET") {
        try {
            const listaProdutos = await listaFilaAtualizacaoProdutos()

            res.status(200).send(listaProdutos)
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }
    
    else if (method === "POST") {
        try {
            const dadosRecebidos = JSON.parse(body)

            const novaFila = await novaFilaAtualizacaoProduto(dadosRecebidos)

            res.status(200).send(novaFila)
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }

}

export default handler