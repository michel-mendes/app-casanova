import { NextApiRequest, NextApiResponse } from "next";
import { imprimeRomaneioNoServidor } from "@/service/romaneioEntrega";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = req

    if (method === "GET") {
        try {
            const dadosRomaneio = encodeURIComponent( String(query.dadosRomaneio) )
            const resultadoImpressao = await imprimeRomaneioNoServidor( dadosRomaneio )

            return res.status(200).send(resultadoImpressao)
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

}

export default handler