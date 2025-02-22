import axios, { ResDataType } from './ajax'

// Web3 钱包接口
interface GenerateTextParams {
  userInput: string
  systemPrompt?: string
  modelName?: string
}

// 基础生成文本接口
export async function generateText({
  userInput,
  systemPrompt = '',
  modelName = 'deepseek-chat'
}: GenerateTextParams): Promise<ResDataType> {
  const url = '/agent/action'
  const data = await axios.post(url, {
    connection: 'deepseek',
    action: 'generate-text',
    params: [userInput, systemPrompt, modelName]
  })
  return data
}

// 查询钱包余额
export async function getWalletBalance(
  walletAddress: string,
  tokenSymbol: string = 'S'
): Promise<ResDataType> {
  return generateText({
    userInput: `Check ${walletAddress}'s ${tokenSymbol} token balance`
  })
}

// 转账代币
// export async function transferToken(
//   fromAddress: string,
//   toAddress: string,
//   amount: number,
//   tokenSymbol: string = 'S'
// ): Promise<ResDataType> {
//   return generateText({
//     userInput: `从钱包 ${fromAddress} 转 ${amount} ${tokenSymbol} 到 ${toAddress}`
//   })
// }

// 查询代币合约地址
export async function getTokenAddress(
  tokenSymbol: string = 'USDT'
): Promise<ResDataType> {
  return generateText({
    userInput: `Check ${tokenSymbol} Token contract address`
  })
}