import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useSimulateContract } from 'wagmi';
import { createCoinCall, DeployCurrency, InitialPurchaseCurrency, ValidMetadataURI, tradeCoin, TradeParameters } from '@zoralabs/coins-sdk';
import { parseEther, formatEther, Address, Hex, createWalletClient, createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

interface CoinMetadata {
  title: string;
  description: string;
  image?: string;
  tags?: string[];
}

interface CreateCoinResult {
  hash: string;
  address: string;
  deployment: any;
}

interface TradeResult {
  hash: string;
  success: boolean;
  error?: string;
}

const account = privateKeyToAccount(import.meta.env.VITE_PRIVATE_KEY as `0x${string}`)

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http("https://rpc.ankr.com/base_sepolia/b60b4597fb0cfa1390b70d42d6ae32a80cf6d7754b8212dc38524753ed108842"),
});
 
const walletClient = createWalletClient({
  account: account,
  chain: baseSepolia,
  transport: http("https://rpc.ankr.com/base_sepolia/b60b4597fb0cfa1390b70d42d6ae32a80cf6d7754b8212dc38524753ed108842"),
});

export function useZora() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { writeContract } = useWriteContract();

  const createCoin = useCallback(async (metadata: CoinMetadata): Promise<CreateCoinResult> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const coinParams = {
        name: metadata.title,
        symbol: (metadata.title || 'COIN').toUpperCase().replace(/\s+/g, '').slice(0, 6),
        uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy" as ValidMetadataURI,
        payoutRecipient: address as Address,
        // chainId: baseSepolia.id,
        // currency: DeployCurrency.ETH,
        // initialPurchase: {
        //   currency: InitialPurchaseCurrency.ETH,
        //   amount: parseEther("0.001"), // 0.001 ETH initial purchase
        // },
      };

      // Create configuration for wagmi
      const contractCallParams = await createCoinCall(coinParams);
      
      // Execute the contract call
      const result = await new Promise<CreateCoinResult>((resolve, reject) => {
        writeContract(
          {
            ...contractCallParams,
          },
          {
            onSuccess: (hash) => {
              resolve({
                hash,
                address: contractCallParams.address || '',
                deployment: contractCallParams
              });
            },
            onError: (error) => {
              reject(error);
            }
          }
        );
      });
      
      console.log(result)
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create coin';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [address, writeContract]);

  const buyCoin = useCallback(async (coinAddress: string, ethAmount: number): Promise<TradeResult> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // For now, return a mock success since we need to implement trading with the new SDK
      // This would need to be updated with the actual trading implementation

      const tradeParameters: TradeParameters = {
        sell: { type: "eth" },
        buy: {
          type: "erc20",
          address: coinAddress as Address,
        },
        amountIn: parseEther(ethAmount.toString()),
        slippage: 0.05, // 5% slippage tolerance
        sender: address,
      };

      const receipt = await tradeCoin({
        tradeParameters,
        walletClient,
        account,
        publicClient,
      })

      return {
        hash: receipt.transactionHash,
        success: true
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Buy transaction failed';
      setError(errorMessage);
      return {
        hash: '',
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [address, walletClient, publicClient]);

  const sellCoin = useCallback(async (coinAddress: string, tokenAmount: number): Promise<TradeResult> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // For now, return a mock success since we need to implement trading with the new SDK
      // This would need to be updated with the actual trading implementation

      const tradeParameters: TradeParameters = {
        sell: {
          type: "erc20",
          address: coinAddress as Address,
        },
        buy: { type: "eth" },
        amountIn: parseEther(tokenAmount.toString()),
        slippage: 0.05,
        sender: address,
      };

      const receipt = await tradeCoin({
        tradeParameters,
        walletClient,
        account,
        publicClient,
      })

      return {
        hash: receipt.transactionHash,
        success: true
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sell transaction failed';
      setError(errorMessage);
      return {
        hash: '',
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [address, walletClient, publicClient]);

  const getPrice = useCallback(async (coinAddress: string) => {
    try {
      // This would typically involve querying the Zora protocol for current prices
      // For now, return mock data - implement actual price fetching based on Zora's API
      return {
        buyPrice: 0.001,
        sellPrice: 0.0009,
        volume24h: Math.random() * 10
      };
    } catch (err) {
      console.error('Error fetching price:', err);
      return {
        buyPrice: 0,
        sellPrice: 0,
        volume24h: 0
      };
    }
  }, []);

  return {
    createCoin,
    buyCoin,
    sellCoin,
    getPrice,
    loading,
    error
  };
}