import { NextApiRequest, NextApiResponse } from "next";
import { novaVendaNuvem } from "@/service/nuvem/vendas";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body } = req

    if (method === "POST") {
        try {
            const dadosRecebidos = JSON.parse(body)

            const novaVenda = await novaVendaNuvem(dadosRecebidos)

            res.status(200).send(novaVenda)
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }

}

export default handler