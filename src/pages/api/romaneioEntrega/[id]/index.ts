import { NextApiRequest, NextApiResponse } from "next";
import { localizaRomaneioPorId, deletaRomaneioEntrega } from "@/service/nuvem/romaneioEntrega";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query, body } = req
    const { id } = query

    if (method === "GET") {
        try {
            const romaneio = await localizaRomaneioPorId(String(id))

            res.status(200).json(romaneio)
        } catch (error: any) {
            return res.status(404).json({ error: error.message })
        }
    }

    else if (method === "DELETE") {
        try {
            const romaneioDeletado = await deletaRomaneioEntrega(String(id))

            res.status(200).send(romaneioDeletado)
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }

}

export default handler