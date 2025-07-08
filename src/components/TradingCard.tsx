import React, { useState } from 'react';
import { BlogPost } from '../types';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign } from 'lucide-react';
import { useZoraTrade } from '../hooks/useZoraTrade';
import { useAccount } from 'wagmi';
import { useZora } from '../hooks/useZora';

interface TradingCardProps {
  post: BlogPost;
}

export function TradingCard({ post }: TradingCardProps) {
  const [amount, setAmount] = useState(1);
  const [isTrading, setIsTrading] = useState(false);
  // const { buyCoin, sellCoin, loading } = useZoraTrade();
  const { isConnected } = useAccount();
  const { buyCoin, sellCoin, loading } = useZora();

  const handleBuy = async () => {
    if (!isConnected || !post.coinAddress) return;
    
    setIsTrading(true);
    try {
      const result = await buyCoin(post.coinAddress, amount * 0.001); // Convert amount to ETH
      if (result.success) {
        alert(`Successfully bought ${amount} tokens! Transaction: ${result}`);
      } else {
        alert(`Buy failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Buy failed:', error);
      alert('Buy transaction failed');
    } finally {
      setIsTrading(false);
    }
  };

  const handleSell = async () => {
    if (!isConnected || !post.coinAddress) return;
    
    setIsTrading(true);
    try {
      const result = await sellCoin(post.coinAddress, amount);
      if (result.success) {
        alert(`Successfully sold ${amount} tokens! Transaction: ${result}`);
      } else {
        alert(`Sell failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Sell failed:', error);
      alert('Sell transaction failed');
    } finally {
      setIsTrading(false);
    }
  };

  const change24h = Math.random() * 20 - 10; // Mock data
  const isPositive = change24h >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{post.title}</h3>
        <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-medium">{isPositive ? '+' : ''}{change24h.toFixed(2)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{post.price.toFixed(4)}</div>
          <div className="text-sm text-gray-600">ETH</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{post.volume.toFixed(2)}</div>
          <div className="text-sm text-gray-600">24h Volume</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleBuy}
            disabled={!isConnected || loading || isTrading}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isTrading ? 'Buying...' : 'Buy'}</span>
          </button>
          
          <button
            onClick={handleSell}
            disabled={!isConnected || loading || isTrading}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 transition-colors"
          >
            <DollarSign className="w-4 h-4" />
            <span>{isTrading ? 'Selling...' : 'Sell'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}