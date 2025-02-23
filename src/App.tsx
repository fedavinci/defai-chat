import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { createStyles } from 'antd-style';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Spin } from 'antd';

import Chat from './Chat';

const useStyle = createStyles(({ css }) => ({
  app: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  `,
  loading: css`
    position: absolute;
    inset: 0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  wallet: css`
    position: absolute;
    top: 10px;
    right: 10px;
  `,
}));

const App = () => {
  const { styles } = useStyle();
  const { isConnecting, isConnected } = useAccount(); // 监听钱包状态
  const [forceConnect, setForceConnect] = useState(false);

  useEffect(() => {
    if (forceConnect && !isConnecting && !isConnected) {
      document.getElementById('force-connect')?.click();
      setForceConnect(false);
    }
  }, [forceConnect, isConnecting, isConnected])

  // isConnecting isConnected  forceConnect
  //      F           F            F         mount
  //      T           F            F         update
  //      F           T            F         update
  //      F           F            T         update

  useEffect(() => {
    if (!isConnecting && !isConnected) {
      setForceConnect(true)
    }
  }, [isConnecting, isConnected]);

  if (isConnecting) {
    return <div className={styles.loading}><Spin size="large" /></div>;
  }

  return (
    <div className={styles.app}>
      <div className={styles.wallet}>
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <>
              <button id="force-connect" style={{ display: 'none' }} onClick={openConnectModal} />
              <ConnectButton showBalance />
            </>
          )}
        </ConnectButton.Custom>
      </div>
      {isConnected ? <Chat /> : <p>Please connect your wallet to continue</p>}
    </div>
  );
};

export default App;
