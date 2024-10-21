import { NextApiRequest, NextApiResponse } from "next";
import { localizaProdutoPorCodigo, alteraProduto } from "@/service/produtos";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query, body } = req
    const { idProduto } = query

    if (method === "GET") {
        try {
            const produto = await localizaProdutoPorCodigo(Number(idProduto))

            res.status(200).json(produto)
        } catch (error: any) {
            return res.status(404).json({ error: error.message })
        }
    }

    else if (method === "PUT") {
        try {
            const dadosRecebidos = JSON.parse(body)

            const venda = await alteraProduto(Number(idProduto), dadosRecebidos)

            res.status(200).json(venda)
        } catch (error: any) {
            return res.status(501).json({ error: error.message })
        }
    }
}

export default handler