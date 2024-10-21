import { NextApiRequest, NextApiResponse } from "next";
import { listaTodosProdutosNuvem, novoProdutoNuvem } from "@/service/nuvem/produtosNuvem";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body, query } = req

    if (method === "GET") {
        try {
            const listaProdutos = await listaTodosProdutosNuvem()

            res.status(200).json(listaProdutos)
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

    else if (method === "POST") {
        try {
            const dadosRecebidos = JSON.parse(body)

            const novoProduto = await novoProdutoNuvem(dadosRecebidos)

            res.status(200).send(novoProduto)
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }

}

export default handler