import React from 'react';
import { TradingCard } from '../components/TradingCard';
import { useApi } from '../hooks/useApi';
import { BlogPost } from '../types';
import { TrendingUp } from 'lucide-react';

export function Trading() {
  const { data: posts, loading } = useApi<BlogPost[]>('/api/posts');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Token Trading</h1>
          <p className="text-gray-600 mt-2">
            Buy and sell blog post tokens from creators around the world
          </p>
        </div>
        <TrendingUp className="w-8 h-8 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts?.map((post) => (
          <TradingCard key={post.id} post={post} />
        ))}
      </div>

      {posts?.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tokens available</h3>
          <p className="text-gray-600">
            Be the first to create a blog post and mint a token!
          </p>
        </div>
      )}
    </div>
  );
}