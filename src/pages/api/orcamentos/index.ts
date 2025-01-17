import { NextApiRequest, NextApiResponse } from "next";
import { listarOrcamentos } from "@/service/orcamentos";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {method, query} = req

        switch (method) {
            case "GET": {
                const {start, end, search} = query

                if (!start || !end) throw("Faltando parâmetros 'start' ou 'end'")

                const listaOrcamentos = await listarOrcamentos(String(start), String(end), (search) ? String(search) : "")

                res.status(200).send(listaOrcamentos)
                break;
            }
        }
    } catch(error: any) {
        res.status(400).json({
            error_code: "api_vendas",
            message: error.message || error
        })
    }
}

export default handler