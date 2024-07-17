import { NextApiRequest, NextApiResponse } from "next";
import { alteraVenda, localizaVendaPorId } from "@/service/vendas";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query, body } = req
    const { id } = query

    if (method === "GET") {
        try {
            const venda = await localizaVendaPorId(Number(id))

            res.status(200).json(venda)
        } catch (error: any) {
            return res.status(404).json({ error: error.message })
        }
    }

    else if (method === "PUT") {
        try {
            const receivedData = JSON.parse(body)

            const venda = await alteraVenda(Number(id), receivedData)

            res.status(200).json(venda)
        } catch (error: any) {
            return res.status(501).json({ error: error.message })
        }
    }
}

export default handler