import { NextApiRequest, NextApiResponse } from "next";
import { listaProdutosSemVenda } from "@/service/produtos";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {method} = req

        switch (method) {
            case "GET": {
                const produtosSemVenda = await listaProdutosSemVenda()
                res.status(200).json(produtosSemVenda)
                break;
            }
        }
    } catch(error: any) {
        res.status(400).json({
            error_code: "api_produtos",
            message: error.message
        })
    }
}

export default handler