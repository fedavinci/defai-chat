import {
  Bubble,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
  Suggestion
} from '@ant-design/x';
import { createStyles } from 'antd-style';
import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { generateText, getWalletBalance, getTokenAddress } from '../services/agent'
import { message } from 'antd';
import { red, blue, green } from '@ant-design/colors';
import { useAccount, useWriteContract, useSendTransaction, usePrepareTransactionRequest, useReadContract } from 'wagmi';

import { parseUnits, erc20Abi } from 'viem'
import markdownit from 'markdown-it';

import {
  PullRequestOutlined,
  PropertySafetyOutlined,
  FireOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { Avatar, type GetProp, Space } from 'antd';
import { Typography } from 'antd';
import type { BubbleProps } from '@ant-design/x';
import { Image } from 'antd';

const md = markdownit({ html: true, breaks: true });

const renderMarkdown: BubbleProps['messageRender'] = (content) => (
  <Typography >
    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
    <div className="renderMarkdown" dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  </Typography>
)

// const renderTitle = (icon: React.ReactElement, title: string) => (
//   <Space align="start">
//     {icon}
//     <span>{title}</span>
//   </Space>
// );

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
        width: 100%;
        height: 722px;
        border-radius: ${token.borderRadius}px;
        display: flex;
        background: ${token.colorBgContainer};
        font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
        .ant-prompts {
          color: ${token.colorText};
        }
      `,
    welcome: css`
       min-width: 600px;
      `,
    menu: css`
        background: ${token.colorBgLayout}80;
        width: 280px;
        height: 100%;
        display: flex;
        flex-direction: column;
      `,
    conversations: css`
        padding: 0 12px;
        flex: 1;
        overflow-y: auto;
      `,
    chat: css`
        height: 100%;
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        padding: ${token.paddingLG}px;
        gap: 16px;
      `,
    messages: css`
        flex: 1;
      `,
    placeholder: css`
        padding-top: 32px;
      `,
    sender: css`
        box-shadow: ${token.boxShadow};
      `,
    logo: css`
        display: flex;
        height: 72px;
        align-items: center;
        justify-content: start;
        padding: 0 24px;
        box-sizing: border-box;
  
        img {
          width: 24px;
          height: 24px;
          display: inline-block;
        }
  
        span {
          display: inline-block;
          margin: 0 8px;
          font-weight: bold;
          color: ${token.colorText};
          font-size: 16px;
        }
      `,
    addBtn: css`
        background: #1677ff0f;
        border: 1px solid #1677ff34;
        width: calc(100% - 24px);
        margin: 0 12px 24px 12px;
      `,
  };
});

// const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
//   // {
//   //   key: '1',
//   //   label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, 'Hot Topics'),
//   //   // description: 'What are you interested in?',
//   //   children: [
//   //     {
//   //       key: '1-1',
//   //       description: `What's new in X?`,
//   //     },
//   //     {
//   //       key: '1-2',
//   //       description: `What's AGI?`,
//   //     },
//   //     // {
//   //     //   key: '1-3',
//   //     //   description: `Where is the doc?`,
//   //     // },
//   //   ],
//   // },
//   {
//     key: '2',
//     label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, 'Hot prompts'),
//     // description: 'How to design a good product?',
//     children: [
//       {
//         key: '2-1',
//         icon: <PropertySafetyOutlined style={{ color: blue.primary }} />,
//         description: `Check Balance`,
//       },
//       {
//         key: '2-2',
//         icon: <PullRequestOutlined style={{ color: green.primary }} />,
//         description: `Check USDT Token Address`,
//       },
//     ],
//   },
// ];

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    // typing: { step: 10 },
    avatar: { icon: <Avatar src="/logo.png" />, style: { background: '#fde3cf' } },
  },
  local: {
    placement: 'end',
    variant: 'shadow',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

type SuggestionItems = Exclude<GetProp<typeof Suggestion, 'items'>, () => void>;

const suggestions: SuggestionItems = [
  { label: 'Check Balance', value: 'Check Balance' },
  { label: 'Check USDT Token Address', value: 'Check USDT Token Address' },
  { label: 'Transfer S Tokens', value: 'Transfer S Tokens' },
  { label: 'Get Hot Tokens', value: 'Get Hot Tokens' },
  { label: 'Check Token Security', value: 'Check Token Security' },
  { label: 'Get Hot NFTs', value: 'Get Hot NFTs' },
  { label: 'Get NFT Info', value: 'Get NFT Info' },
];

const Independent: React.FC = () => {

  const { styles } = useStyle();
  const { address } = useAccount();

  const { sendTransaction } = useSendTransaction();
  const { writeContract } = useWriteContract()

  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onError }) => {
      let result = null;
      try {
        if (message && message.toUpperCase() === 'CHECK BALANCE' && address) {
          result = await getWalletBalance(address)
        }
        else if (message && message.toUpperCase() === 'CHECK USDT TOKEN ADDRESS') {
          result = await getTokenAddress()
        }
        else if (message && message.toUpperCase() === 'GET HOT TOKENS') {
          result = await generateText({ userInput: 'Get Hot Tokens on Sonic Chain' })
        }
        else if (message && message.toUpperCase() === 'GET HOT NFTS') {
          result = await generateText({ userInput: 'Get Hot NFTs on Sonic Chain' })
        }
        else {
          result = await generateText({
            userInput: message || ''
          });
        }
        onSuccess(result?.message || result?.error || result?.security_summary || result || "Sorry, I couldn't find a suitable answer.");

        // result = {
        //   "action": "transfer",
        //   "transaction_data": {
        //     "from": "0x456...",
        //     "to": "0x789...",
        //     "amount": 100,
        //     "token_name": "USDC",
        //     "token_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        //     "requires_signature": true
        //   },
        //   "message": "Please confirm transfer of 100 USDC from 0x456... to 0x789..."
        // }

        if (result?.action === 'transfer') {
          const { transaction_data } = result;
          if (transaction_data.token_name === 'S') {
            // 原生代币转账
            sendTransaction({
              to: transaction_data.to,
              value: parseUnits(transaction_data.amount.toString(), 18),
            });
          } else {
            // ERC20 代币转账
            writeContract({
              address: transaction_data.token_address as `0x${string}`,
              abi: erc20Abi,
              functionName: 'transfer',
              args: [
                transaction_data.to as `0x${string}`,
                parseUnits(transaction_data.amount.toString(), transaction_data.decimals || 18)
              ],
            })
          }
        }
      } catch (error) {
        console.error('Failed to generate a response:', error);
        onError(new Error());
      }
    },
  });

  const { onRequest, messages } = useXChat({
    agent,
    requestPlaceholder: 'Waiting...',
    requestFallback: 'Sorry, I can not answer your question now',
  });
  const onSubmit = (nextContent: string) => {
    const trimmedContent = nextContent.trim();
    if (!trimmedContent) {
      message.warning('Please enter content');
      return;
    }

    onRequest(trimmedContent);
  };

  // const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
  //   onRequest(info.data.description as string);
  // };

  const placeholderNode = (
    <Space direction="vertical" size={25} className={styles.placeholder}>
      <Welcome
        className={styles.welcome}
        variant="borderless"
        icon={<Image src='/logo.png' width={60} height={60} />}
        title="Hello, I'm SonicTokenSafe."
        description="SonicTokenSafe is a comprehensive token management and security tool built on the Sonic blockchain. It provides users with a range of functionalities to interact with their tokens securely and efficiently, leveraging the high performance of the Sonic blockchain and the AI capabilities of the ZerePy framework."
      />
      {/* <Prompts
        title="Do you want?"
        items={placeholderPromptsItems}
        styles={{
          // list: {
          //   width: '100%',
          // },
          // item: {
          //   flex: 1,
          // },
        }}
        onItemClick={onPromptsItemClick}
      /> */}
    </Space>
  );

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
    messageRender: renderMarkdown,
  }));
  const [value, setValue] = useState('');

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      <div className={styles.chat}>
        <Bubble.List
          items={items.length > 0 ? items : [{ content: placeholderNode, variant: 'borderless' }]}
          roles={roles}
          className={styles.messages}
        />
        <Suggestion
          items={suggestions}
          onSelect={(itemVal) => {
            if (itemVal === 'Transfer S Tokens') {
              setValue('Transfer 1 S Token to This Address: ')
              return;
            } else if (itemVal === 'Check Token Security') {
              setValue('Check Token Security for This Address: ')
              return;
            } else if (itemVal === 'Get NFT Info') {
              setValue('Get NFT Info for This Address: ')
              return;
            }
            onSubmit(itemVal)
            setValue('')
          }}
        >
          {({ onTrigger, onKeyDown }) => {
            return (
              <Sender
                value={value}
                onSubmit={(nextVal) => {
                  if (nextVal !== '/') {
                    onSubmit(nextVal)
                  }
                  setValue('')
                }}
                onChange={(nextVal) => {
                  if (nextVal === '/') {
                    onTrigger();
                  } else if (!suggestions.map(x => x.label).includes(nextVal)) {
                    onTrigger(false);
                  }
                  setValue(nextVal);
                }}
                loading={agent.isRequesting()}
                className={styles.sender}
                onKeyDown={onKeyDown}
                placeholder="Enter / to get suggestions"
              />
            );
          }}
        </Suggestion>
      </div>
    </div>
  );
};

export default Independent;