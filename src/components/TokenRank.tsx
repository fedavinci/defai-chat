import { useEffect, useState } from "react";
import { getTokenRank } from '../services/agent'
import { createStyles } from 'antd-style';
import { List, Avatar, Typography } from 'antd';

const CACHE_KEY = 'token_rank_data';
const CACHE_EXPIRY = 12 * 60 * 60 * 1000;

interface CacheData {
    data: any;
    timestamp: number;
}

const useStyle = createStyles(({ token, css }) => {
    return {
        rank: css`
            position: absolute;
            left: 20px;
            top: 70px;
            padding: 20px;
            background: ${token.colorBgContainer};
            border-radius: ${token.borderRadius}px;
            margin: 0 auto;
        `,
        tokenInfo: css`
            display: flex;
            align-items: center;
            gap: 12px;
        `,
        tokenMeta: css`
            .symbol {
                color: ${token.colorTextSecondary};
                font-size: 12px;
            }
        `,
        tokenData: css`
            text-align: right;
            .price {
                font-family: monospace;
                font-weight: 500;
            }
            .volume {
                color: ${token.colorTextSecondary};
                font-size: 12px;
            }
        `
    }
})

export default function TokenRank() {
    const [tokenRankData, setTokenRankData] = useState<any[]>([]);

    useEffect(() => {
        async function fetchTokenRank() {
            try {
                // const cachedData = localStorage.getItem(CACHE_KEY);
                // if (cachedData) {
                //     const { data, timestamp }: CacheData = JSON.parse(cachedData);
                //     if (Date.now() - timestamp < CACHE_EXPIRY) {
                //         setTokenRankData(data);
                //         return;
                //     }
                // }

                const result = await getTokenRank();
                // const cacheData: CacheData = {
                //     data: result.data,
                //     timestamp: Date.now()
                // };
                // localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

                // console.log(result.data)
                // [{
                //     "address": "0xE5DA20F15420aD15DE0fa650600aFc998bbE3955",
                //     "name": "Beets Staked Sonic",
                //     "symbol": "stS",
                //     "total_volume_24h": 25874821.169999998,
                //     "max_liquidity_usd": 12421881.49,
                //     "priceUsd": "0.7343",
                //     "priceNative": "1.006715",
                //     "chainId": "sonic",
                //     "url": "https://dexscreener.com/sonic/0xde861c8fc9ab78fe00490c5a38813d26e2d09c95",
                //     "websites": [
                //         {
                //             "label": "Website",
                //             "url": "https://beets.fi/"
                //         },
                //         {
                //             "label": "Docs",
                //             "url": "https://docs.beets.fi/"
                //         },
                //         {
                //             "label": "Discord",
                //             "url": "https://beets.fi/discord"
                //         }
                //     ],
                //     "socials": [
                //         {
                //             "type": "twitter",
                //             "url": "https://x.com/beets_fi"
                //         }
                //     ],
                //     "imageUrl": "https://dd.dexscreener.com/ds-data/tokens/sonic/0xe5da20f15420ad15de0fa650600afc998bbe3955.png?key=001ef0"
                // }]
                setTokenRankData(result.data);
            } catch (error) {
                console.error('获取代币排行数据失败:', error);
            }
        }

        fetchTokenRank();
    }, []);

    const { styles } = useStyle();

    return (
        <div className={styles.rank}>
            <Typography.Title level={3}>🔥 Trending</Typography.Title>
            <List
                dataSource={tokenRankData}
                renderItem={(item) => (
                    <List.Item>
                        <div className={styles.tokenInfo}>
                            <Avatar
                                src={item.imageUrl}
                                size={40}
                                style={{ cursor: 'pointer' }}
                                onClick={() => window.open(item.url, '_blank')}
                            />
                            <div className={styles.tokenMeta}>
                                <div>{item.name}</div>
                                <div className="symbol">{item.symbol}</div>
                            </div>
                        </div>
                        <div className={styles.tokenData}>
                            <div className="price">${Number(item.priceUsd).toFixed(4)}</div>
                            <div className="volume">
                                24h Volume ${item.total_volume_24h.toLocaleString()}
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
}