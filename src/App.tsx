import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { createStyles } from 'antd-style';

import Chat from './Chat';

const useStyle = createStyles(({ css }) => {
  return {
    app: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      `,
    wallet: css`
      position: absolute;
      top: 10px;
      right: 10px;
    `
  }
});

const App = () => {
  const { styles } = useStyle();

  return (
    <div className={styles.app}>
      <div className={styles.wallet}>
        <ConnectButton />
      </div>
      <Chat />
    </div>
  )
};

export default App;