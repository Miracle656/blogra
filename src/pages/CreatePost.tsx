import React from 'react';
import { CreatePostForm } from '../components/CreatePostForm';
import { useAccount } from 'wagmi';
import { Wallet } from 'lucide-react';

export function CreatePost() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Wallet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            You need to connect your wallet to create blog posts and mint coins.
          </p>
          <p className="text-sm text-gray-500">
            Click the "Connect Wallet" button in the top navigation to get started.
          </p>
        </div>
      </div>
    );
  }

  return <CreatePostForm />;
}