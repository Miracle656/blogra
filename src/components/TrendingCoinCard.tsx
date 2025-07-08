import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, User, ShoppingCart, DollarSign, Eye } from 'lucide-react';
// import { useZoraTrade } from '../hooks/useZoraTrade';
import { useAccount } from 'wagmi';
import { useZora } from '../hooks/useZora';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  creator: string;
  totalSupply: string;
  marketCap: string;
  price: string;
  volume24h: string;
  holders: number;
  image?: string;
  description?: string;
}

interface TrendingCoinCardProps {
  coin: CoinData;
  onViewDetails?: (coin: CoinData) => void;
}

export function TrendingCoinCard({ coin, onViewDetails }: TrendingCoinCardProps) {
  const [amount, setAmount] = useState(1);
  const [isTrading, setIsTrading] = useState(false);
  
  const { buyCoin, sellCoin, loading } = useZora();
  const { isConnected } = useAccount();

  // Mock price change for demo
  const priceChange = (Math.random() - 0.5) * 20;
  const isPositive = priceChange >= 0;

  const handleBuy = async () => {
    if (!isConnected) return;
    
    setIsTrading(true);
    try {
      const result = await buyCoin(coin.id, amount * 0.001); // Convert amount to ETH
      if (result.success) {
        alert(`Successfully bought ${amount} tokens! Transaction: ${result}`);
      } else {
        alert(`Buy failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Buy error:', error);
      alert('Buy transaction failed');
    } finally {
      setIsTrading(false);
    }
  };

  const handleSell = async () => {
    if (!isConnected) return;
    
    setIsTrading(true);
    try {
      const result = await sellCoin(coin.id, amount);
      if (result.success) {
        alert(`Successfully sold ${amount} tokens! Transaction: ${result}`);
      } else {
        alert(`Sell failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Sell error:', error);
      alert('Sell transaction failed');
    } finally {
      setIsTrading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
      {coin.image && (
        <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
              {coin.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">{coin.symbol}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{coin.creator.slice(0, 6)}...{coin.creator.slice(-4)}</span>
              </div>
            </div>
          </div>
          
          <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">{parseFloat(coin.price).toFixed(4)}</div>
            <div className="text-xs text-gray-600">Price (ETH)</div>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">{parseFloat(coin.volume24h).toFixed(2)}</div>
            <div className="text-xs text-gray-600">24h Volume</div>
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
              onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleBuy}
              disabled={!isConnected || loading || isTrading}
              className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors text-sm font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isTrading ? 'Buying...' : 'Buy'}</span>
            </button>
            
            <button
              onClick={handleSell}
              disabled={!isConnected || loading || isTrading}
              className="flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 transition-colors text-sm font-medium"
            >
              <DollarSign className="w-4 h-4" />
              <span>{isTrading ? 'Selling...' : 'Sell'}</span>
            </button>
          </div>

          <button
            onClick={() => onViewDetails?.(coin)}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}