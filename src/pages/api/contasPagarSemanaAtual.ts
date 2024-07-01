import { NextApiRequest, NextApiResponse } from "next";
import { listaContasPagarSemanaAtual } from "@/service/contasPagar";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {method} = req

        switch (method) {
            case "GET": {
                const totalSemanaAtual = await listaContasPagarSemanaAtual()
                res.status(200).json(totalSemanaAtual)
                break;
            }
        }
    } catch(error: any) {
        res.status(400).json({
            error_code: "api_contasPagar",
            message: error.message
        })
    }
}

export default handler