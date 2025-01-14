import { NextApiRequest, NextApiResponse } from "next";
import { imprimeRomaneioNoServidor } from "@/service/nuvem/romaneioEntrega";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = req

    if (method === "GET") {
        try {
            const idRomaneio = query.id
            const resultadoImpressao = await imprimeRomaneioNoServidor(String(idRomaneio))

            return res.status(200).send(resultadoImpressao)
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

}

export default handler