import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useZora } from '../hooks/useZora';
import { useAccount } from 'wagmi';
import { BlogPost } from '../types';
import { Clock, User, TrendingUp, Users, ShoppingCart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [amount, setAmount] = useState(1);
  const { data: post, loading } = useApi<BlogPost>(`/api/posts/${id}`, [id]);
  const { buyCoin, loading: buyLoading } = useZora();
  const { isConnected } = useAccount();

  const handleBuy = async () => {
    if (!isConnected || !post?.coinAddress) return;
    
    try {
      await buyCoin(post.coinAddress, amount);
      // Refresh data or show success message
    } catch (error) {
      console.error('Buy failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
        <p className="text-gray-600">The post you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {post.image && (
          <div className="aspect-video bg-gray-100">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{post.author.slice(0, 6)}...{post.author.slice(-4)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{post.price.toFixed(4)} ETH</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="prose max-w-none mb-8">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Token Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">{post.price.toFixed(4)}</div>
                    <div className="text-sm text-gray-600">Current Price (ETH)</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">{post.volume.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">24h Volume</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">{post.holders}</div>
                    <div className="text-sm text-gray-600">Holders</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.floor(Math.random() * 100)}
                    </div>
                    <div className="text-sm text-gray-600">Trades</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Collect This Post</h3>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to buy
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Total cost:</span>
                      <span>{(post.price * amount).toFixed(4)} ETH</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBuy}
                    disabled={!isConnected || buyLoading}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-300 transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{buyLoading ? 'Processing...' : 'Collect Post'}</span>
                  </button>

                  {!isConnected && (
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      Connect your wallet to collect this post
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}