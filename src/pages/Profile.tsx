import React from 'react';
import { useAccount } from 'wagmi';
import { useApi } from '../hooks/useApi';
import { BlogPost } from '../types';
import { BlogCard } from '../components/BlogCard';
import { User, BookOpen, TrendingUp, Users } from 'lucide-react';

export function Profile() {
  const { address, isConnected } = useAccount();
  const { data: posts } = useApi<BlogPost[]>('/api/posts');

  const userPosts = posts?.filter(post => post.author === address) || [];
  const totalVolume = userPosts.reduce((sum, post) => sum + post.volume, 0);
  const totalHolders = userPosts.reduce((sum, post) => sum + post.holders, 0);

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Connect your wallet to view your creator profile and manage your blog tokens.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Creator Profile</h1>
            <p className="text-xl opacity-90">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{userPosts.length}</div>
            <div className="text-sm opacity-90">Posts Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{totalVolume.toFixed(2)}</div>
            <div className="text-sm opacity-90">ETH Volume</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{totalHolders}</div>
            <div className="text-sm opacity-90">Total Collectors</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">{userPosts.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Posts</h3>
          <p className="text-gray-600">Blog posts you've created</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">{totalVolume.toFixed(2)}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Volume</h3>
          <p className="text-gray-600">ETH traded on your tokens</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{totalHolders}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Collectors</h3>
          <p className="text-gray-600">People who own your tokens</p>
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Posts</h2>
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first blog post to start earning from your content.
            </p>
            <a
              href="/create"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Create First Post
            </a>
          </div>
        )}
      </div>
    </div>
  );
}