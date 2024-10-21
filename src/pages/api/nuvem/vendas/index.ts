import { NextApiRequest, NextApiResponse } from "next";
import { listaVendasNuvem, novaVendaNuvem } from "@/service/nuvem/vendas";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body } = req

    if (method === "GET") {
        try {
            const listaVendas = await listaVendasNuvem()

            res.status(200).json(listaVendas)
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

    else if (method === "POST") {
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