import React from 'react';
import { BlogCard } from '../components/BlogCard';
import { TradingCard } from '../components/TradingCard';
import { useApi } from '../hooks/useApi';
import { BlogPost, TrendingCoin, Creator } from '../types';
import { TrendingUp, Users, Activity } from 'lucide-react';

export function Dashboard() {
  const { data: posts } = useApi<BlogPost[]>('/api/posts');
  const { data: trending } = useApi<TrendingCoin[]>('/api/analytics/trending');
  const { data: creators } = useApi<Creator[]>('/api/analytics/creators');

  const recentPosts = posts?.slice(0, 6) || [];
  const trendingPosts = posts?.filter(p => trending?.some(t => t.id === p.id)).slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">
          Turn Your Words Into Wealth
        </h1>
        <p className="text-xl opacity-90 mb-6">
          Create blog posts, mint coins, and let your community trade your content
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{posts?.length || 0}</div>
            <div className="text-sm opacity-90">Total Posts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{creators?.length || 0}</div>
            <div className="text-sm opacity-90">Active Creators</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {trending?.reduce((sum, coin) => sum + coin.volume, 0).toFixed(1) || '0.0'}
            </div>
            <div className="text-sm opacity-90">ETH Volume</div>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Trending Coins</h2>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {trendingPosts.map((post) => (
              <TradingCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Top Creators</h2>
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {creators?.slice(0, 5).map((creator, index) => (
                <div key={creator.address} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {creator.address.slice(0, 6)}...{creator.address.slice(-4)}
                      </div>
                      <div className="text-sm text-gray-600">{creator.totalPosts} posts</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{creator.totalVolume.toFixed(2)} ETH</div>
                    <div className="text-sm text-gray-600">{creator.totalCollectors} collectors</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
          <Activity className="w-6 h-6 text-purple-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}