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
import { generateText, getWalletBalance, transferToken, getTokenAddress } from './services/agent'
import { message } from 'antd';
import { red, blue, green } from '@ant-design/colors';
import { useAccount, useWriteContract, useSendTransaction, usePrepareTransactionRequest, useReadContract } from 'wagmi';

import { parseUnits, erc20Abi } from 'viem'

import {
  PullRequestOutlined,
  PropertySafetyOutlined,
  FireOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { Avatar, type GetProp, Space } from 'antd';


const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
        width: 100%;
        min-width: 1000px;
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
       min-width:500px
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

const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, 'Hot Topics'),
    // description: 'What are you interested in?',
    children: [
      {
        key: '1-1',
        description: `What's new in X?`,
      },
      {
        key: '1-2',
        description: `What's AGI?`,
      },
      {
        key: '1-3',
        description: `Where is the doc?`,
      },
    ],
  },
  {
    key: '2',
    label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, 'Hot prompts'),
    // description: 'How to design a good product?',
    children: [
      {
        key: '2-1',
        icon: <PropertySafetyOutlined style={{ color: blue.primary }} />,
        description: `查询余额`,
      },
      {
        key: '2-2',
        icon: <PullRequestOutlined style={{ color: green.primary }} />,
        description: `查询USDT代币地址`,
      },
    ],
  },
];

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    typing: { step: 3 },
    avatar: { icon: <Avatar src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp" />, style: { background: '#fde3cf' } },
  },
  local: {
    placement: 'end',
    variant: 'shadow',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

type SuggestionItems = Exclude<GetProp<typeof Suggestion, 'items'>, () => void>;

const suggestions: SuggestionItems = [
  { label: '查询余额', value: '查询余额' },
  { label: '查询USDT代币地址', value: '查询USDT代币地址' },
];

const Independent: React.FC = () => {

  const { styles } = useStyle();
  const { address } = useAccount();

  const { sendTransaction } = useSendTransaction();
  const { writeContract } = useWriteContract()

  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      let result = null;
      try {
        if (message === '查询余额' && address) {
          result = await getWalletBalance(address)
        } else if (message === '查询USDT代币地址') {
          result = await getTokenAddress()
        } else {
          result = await generateText({
            userInput: message || ''
          });
        }

        onSuccess(result?.message || result || '抱歉，我没有找到合适的回答');

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
          if (address?.toLowerCase() !== transaction_data.from.toLowerCase()) {
            onSuccess('请使用正确的钱包地址进行转账');
            return;
          }
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
        console.error('生成回答失败:', error);
        onSuccess('抱歉，服务出现了一些问题，请稍后再试');
      }
    },
  });

  const { onRequest, messages } = useXChat({
    agent,
    requestPlaceholder: 'Waiting...',
  });
  const onSubmit = (nextContent: string) => {
    const trimmedContent = nextContent.trim();
    if (!trimmedContent) {
      message.warning('请输入内容');
      return;
    }

    onRequest(trimmedContent);
  };

  const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    onRequest(info.data.description as string);
  };

  const placeholderNode = (
    <Space direction="vertical" size={25} className={styles.placeholder}>
      <Welcome
        className={styles.welcome}
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm DeFAI robot~"
        description="AGI product interface solution, create a better intelligent vision~"
      />
      <Prompts
        title="Do you want?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: '100%',
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
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
                  } else if (!nextVal) {
                    onTrigger(false);
                  }
                  setValue(nextVal);
                }}
                loading={agent.isRequesting()}
                className={styles.sender}
                onKeyDown={onKeyDown}
                placeholder="输入 / 获取建议"
              />
            );
          }}
        </Suggestion>
      </div>
    </div>
  );
};

export default Independent;