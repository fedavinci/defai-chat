import { useEffect, useState } from "react";
import { getNFTRank } from '../services/agent'
import { createStyles } from 'antd-style';
import { List, Avatar, Typography } from 'antd';

const useStyle = createStyles(({ token, css }) => {
    return {
        rank: css`
            position: absolute;
            padding: 20px;
            right: 180px;
            top: 70px;
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
    const [nftRankData, setNFTRankData] = useState<any[]>([]);
    useEffect(() => {
        async function fetchNFTRank() {
            try {
                const result = await getNFTRank()
                console.log(result)
                setNFTRankData(result.data)
            } catch (error) {
                console.error('获取代币排行数据失败:', error);
            }
        }
        fetchNFTRank()
    }, [])

    const { styles } = useStyle();

    return (<div className={styles.rank}>

        <Typography.Title level={3}>👑 Top NFTs</Typography.Title>
        <List
            dataSource={nftRankData}
            renderItem={(item) => (
                <List.Item>
                    {/* <div style={{width:'200px'}}>123</div> */}
                    {/* <div className={styles.tokenInfo}>
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
                    </div> */}
                </List.Item>
            )}
        />
    </div>)
}