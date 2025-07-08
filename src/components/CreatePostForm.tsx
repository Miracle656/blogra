import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Upload, X } from 'lucide-react';
import { apiUpload } from '../hooks/useApi';
import { useZora } from '../hooks/useZora';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface CreatePostFormData {
  title: string;
  content: string;
  tags: string;
}

export function CreatePostForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CreatePostFormData>();
  const { address, isConnected } = useAccount();
  const { createCoin } = useZora();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const onSubmit = async (data: CreatePostFormData) => {
    // Explicit validation to prevent undefined values
    if (!data.title || data.title.trim() === '') {
      alert('Title is required');
      return;
    }
    
    if (!data.content || data.content.trim() === '') {
      alert('Content is required');
      return;
    }

    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('tags', data.tags);
      formData.append('author', address);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      // Upload post to backend
      const post = await apiUpload('/api/posts', formData);

      // Create coin using Zora SDK
      const metadata = {
        title: data.title,
        description: data.content.substring(0, 200) + '...',
        image: post.image && !API_URL.includes('localhost') ? `${API_URL}${post.image}` : undefined,
        tags: data.tags.split(',').map(tag => tag.trim())
      };

      try {
        const coinResult = await createCoin(metadata);
        console.log('Coin created successfully:', coinResult);
        
        // In a real app, you'd update the post with the coin address via API
        // For now, we'll just log the success
        alert(`Post created and coin minted! Coin address: ${coinResult.address}`);
      } catch (coinError) {
        console.error('Error creating coin:', coinError);
        // Post was created but coin creation failed
        alert('Post created successfully, but coin creation failed. You can try minting a coin later.');
      }
      

      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Blog Post</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your blog post title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              {...register('content', { required: 'Content is required' })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Write your blog post content here..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              {...register('tags')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., blockchain, web3, defi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                {selectedFile ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="mx-auto h-32 w-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Your blog post will be published immediately</li>
              <li>• A Zora Coin will be automatically minted for your post</li>
              <li>• Readers can collect your post by purchasing the coin</li>
              <li>• You earn royalties from all future trades</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isConnected}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-300 transition-all"
          >
            {isSubmitting ? 'Creating...' : 'Publish & Mint Coin'}
          </button>
        </form>
      </div>
    </div>
  );
}