import React from 'react';
import { User, TrendingUp, Users, Coins } from 'lucide-react';

interface CreatorData {
  address: string;
  name?: string;
  totalCoins: number;
  totalVolume: string;
  followers: number;
  avatar?: string;
}

interface CreatorCardProps {
  creator: CreatorData;
  rank: number;
  onViewProfile?: (creator: CreatorData) => void;
}

export function CreatorCard({ creator, rank, onViewProfile }: CreatorCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            {creator.avatar ? (
              <img
                src={creator.avatar}
                alt={creator.name || 'Creator'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
            {rank}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {creator.name || 'Anonymous Creator'}
          </h3>
          <p className="text-sm text-gray-600">
            {creator.address.slice(0, 6)}...{creator.address.slice(-4)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Coins className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">{creator.totalCoins}</div>
          <div className="text-xs text-gray-600">Tokens</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">
            {parseFloat(creator.totalVolume).toFixed(1)}
          </div>
          <div className="text-xs text-gray-600">ETH Volume</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">{creator.followers}</div>
          <div className="text-xs text-gray-600">Followers</div>
        </div>
      </div>

      <button
        onClick={() => onViewProfile?.(creator)}
        className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium"
      >
        View Profile
      </button>
    </div>
  );
}