import { NextApiRequest, NextApiResponse } from "next";
import { listarVendas } from "@/service/vendas";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {method, query} = req

        switch (method) {
            case "GET": {
                const {start, end} = query

                if (!start || !end) throw("Faltando parâmetros 'start' ou 'end'")

                const listaVendas = await listarVendas(String(start), String(end))

                res.status(200).send(listaVendas)
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