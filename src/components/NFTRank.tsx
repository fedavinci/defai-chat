import { useEffect, useState } from "react";
import { getNFTRank } from '../services/agent'
import { createStyles } from 'antd-style';
import { List, Avatar, Typography } from 'antd';

const useStyle = createStyles(({ token, css }) => {
    return {
        rank: css`
            position: absolute;
            padding: 20px;
            right: 20px;
            top: 40px;
            border-radius: ${token.borderRadius}px;
            margin: 0 auto;
            .ant-list{
                max-height: 660px;
                overflow: scroll;
                .ant-list-item {
                    padding:10px;
                    &:hover {
                        background: ${token.colorBgTextHover};
                    }
                }
            }
        `,
        tokenInfo: css`
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
        `,
        tokenMeta: css`
            max-width: 145px;
            .name {
                font-weight: 500;
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .symbol {
                color: ${token.colorTextSecondary};
                font-size: 12px;
            }
        `,
        tokenData: css`
            text-align: right;
            min-width: 140px;
            .price {
                // font-family: monospace;
                font-weight: 500;
                // color: ${token.colorSuccess};
            }
            .volume {
                color: ${token.colorTextSecondary};
                font-size: 12px;
            }
            .floor {
                font-size: 12px;
                color: ${token.colorPrimary};
            }
        `
    }
});

export default function TokenRank() {
    const [nftRankData, setNFTRankData] = useState<any[]>([]);
    useEffect(() => {
        async function fetchNFTRank() {
            try {
                const result = await getNFTRank()
                // console.log(result.data)
                // [{
                //     "name": "Derps",
                //     "address": "0x8500d84b203775fc8b418148223872b35c43b050",
                //     "url": "https://paintswap.io/sonic/collections/Derps",
                //     "thumbnail": "https://media-paint.paintswap.finance/0x8500d84b203775fc8b418148223872b35c43b050-146-1734986837_thumb.png",
                //     "floor_price": 1290,
                //     "created_at": "2024-12-23T20:58:26.856Z",
                //     "active_sales": "124",
                //     "symbol": "DERPS",
                //     "website": "https://derpe.xyz",
                //     "twitter": "@derpedewdz",
                //     "isWhitelisted": true,
                //     "numOwners": "1069",
                //     "totalNFTs": "2000",
                //     "total_volume_traded": 925044.7506,
                //     "volume_last_24_hours": 98789.40000000001
                // }]
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
                    <div className={styles.tokenInfo}>
                        <Avatar
                            src={item.thumbnail}
                            size={40}
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(item.url, '_blank')}
                        />
                        <div className={styles.tokenMeta}>
                            <div className="name">{item.name}</div>
                            <div className="symbol">{item.symbol}</div>
                        </div>
                    </div>
                    <div className={styles.tokenData}>
                        <div className="price">{item.floor_price} S</div>
                        <div className="volume">
                            24h Volume ${item.volume_last_24_hours.toLocaleString()}
                        </div>
                        {/* <div>
                        Floor: {item.floor_price} S
                        </div> */}
                    </div>
                </List.Item>
            )}
        />
    </div>)
}