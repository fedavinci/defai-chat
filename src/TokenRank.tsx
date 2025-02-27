import { useEffect, useState } from "react";
import { getTokenRank } from './services/agent'
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
            top: 0px;
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
                            <Avatar src={item.imageUrl} size={40} />
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