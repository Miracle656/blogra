import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    walletConnect({
      projectId,
      metadata: {
        name: 'Zora Coins Blog',
        description: 'Turn your blog posts into tradeable tokens',
        url: 'https://your-app.com',
        icons: ['https://your-app.com/icon.png']
      }
    })
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http()
  }
});