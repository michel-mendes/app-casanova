import { NextApiRequest, NextApiResponse } from "next";
import { listaContasPagarGeralSemanal } from "@/service/contasPagar";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {method} = req

        switch (method) {
            case "GET": {
                const todasContas = await listaContasPagarGeralSemanal()
                res.status(200).send(todasContas)
                break;
            }
        }
    } catch(error: any) {
        res.status(400).json({
            error_code: "api_contasPagarTotal",
            message: error.message
        })
    }
}

export default handler