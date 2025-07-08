import { useState, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { tradeCoin, TradeParameters } from '@zoralabs/coins-sdk';
import { parseEther, formatEther, Address } from 'viem';
import { base } from 'viem/chains';

interface TradeResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export function useZoraTrade() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { address, chain } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();


  const buyCoin = useCallback(async (coinAddress: string, ethAmount: number): Promise<TradeResult> => {
    if (!address || !walletClient || !publicClient) {
      return { success: false, error: 'Wallet not connected' };
    }

    setLoading(true);
    setError(null);

    try {
      const tradeParameters: TradeParameters = {
        sell: { type: "eth" },
        buy: {
          type: "erc20",
          address: coinAddress as Address,
        },
        amountIn: parseEther(ethAmount.toString()),
        slippage: 0.05,
        sender: address,
      };

      const receipt = await tradeCoin({
        tradeParameters,
        walletClient,
        account,
        publicClient,
      });

      return {
        success: true,
        transactionHash: receipt.transactionHash,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Buy transaction failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [address, walletClient, publicClient]);

  const sellCoin = useCallback(async (coinAddress: string, tokenAmount: number): Promise<TradeResult> => {
    if (!address || !walletClient || !publicClient) {
      return { success: false, error: 'Wallet not connected' };
    }

    setLoading(true);
    setError(null);

    try {
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
      });

      return {
        success: true,
        transactionHash: receipt.transactionHash,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sell transaction failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [address, walletClient, publicClient]);

  return {
    buyCoin,
    sellCoin,
    loading,
    error,
  };
}