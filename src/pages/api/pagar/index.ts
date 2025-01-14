import { NextApiRequest, NextApiResponse } from "next";
import { listaContasPagar } from "@/service/pagar";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = req

    if (method === "GET") {
        try {
            const {start, end, search} = query

            if (!start || !end) throw("Faltando parâmetros 'start' ou 'end'")

            const listaPagar = await listaContasPagar(String(start), String(end), (search) ? String(search) : "")

            res.status(200).json(listaPagar)
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

}

export default handler