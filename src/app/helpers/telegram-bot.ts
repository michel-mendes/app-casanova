import telegramBotApi from "node-telegram-bot-api"

const botToken = process.env.TELEGRAM_BOT_TOKEN || ""
const chatId = process.env.TELEGRAM_CHAT_ID || ""

const telegramBot = new telegramBotApi(botToken)

export const telegram = {
    sendMessage
}

async function sendMessage(text: string) {
    try {
        await telegramBot.sendMessage(chatId, text)
        // await telegramBot.sendMessage(chatId, text, {parse_mode: "HTML"})
    } catch (error: any) {
        console.log(`Erro ao enviar mensagem via Telegram: '${error}'`)
    }
}