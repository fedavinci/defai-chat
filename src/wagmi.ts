import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  sepolia,
  sonic,
} from 'wagmi/chains';


// 为 Sonic 链添加图标配置
const sonicWithIcon = {
  ...sonic,
  iconUrl: 'https://www.soniclabs.com/favicon.ico',
};


export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '909561d7e8646fc7ce17702fd6209efc',
  chains: [
    sonicWithIcon,
    ...(import.meta.env.VITE_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});