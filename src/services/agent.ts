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
export async function transferToken(
  toAddress: string,
  amount: number,
  tokenSymbol: string = 'S'
): Promise<ResDataType> {
  return generateText({
    userInput: `Transfer ${amount} ${tokenSymbol} to ${toAddress}`
  })
}

// 查询代币合约地址
export async function getTokenAddress(
  tokenSymbol: string = 'USDT'
): Promise<ResDataType> {
  return generateText({
    userInput: `Check ${tokenSymbol} Token contract address`
  })
}

export async function getTokenRank(): Promise<ResDataType> {
  const url = '/agent/action'
  const data = await axios.post(url, {
    connection: 'deepseek',
    action: 'get-hot-tokens-json',
  })
  return data
}

export async function getNFTRank(): Promise<ResDataType> {
  const url = '/agent/action'
  const data = await axios.post(url, {
    connection: 'deepseek',
    action: 'get-hot-nfts-json',
  })
  return data
}