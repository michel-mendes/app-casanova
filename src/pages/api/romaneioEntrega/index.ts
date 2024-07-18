import { NextApiRequest, NextApiResponse } from "next";
import { listaTodosRomaneios, novoRomaneioEntrega } from "@/service/romaneioEntrega";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body } = req

    if (method === "GET") {
        try {
            const listaRomaneios = await listaTodosRomaneios()

            res.status(200).json(listaRomaneios)
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

    else if (method === "POST") {
        try {
            const dadosRecebidos = JSON.parse(body)

            const novoRomaneio = await novoRomaneioEntrega(dadosRecebidos)

            res.status(200).send(novoRomaneio)
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }

}

export default handler