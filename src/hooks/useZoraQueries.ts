import { useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { getCoins, getCreators } from '@zoralabs/coins-sdk';
import { base, baseSepolia } from 'viem/chains';

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

interface CreatorData {
  address: string;
  name?: string;
  totalCoins: number;
  totalVolume: string;
  followers: number;
  avatar?: string;
}

export function useZoraQueries() {
  const [trendingCoins, setTrendingCoins] = useState<CoinData[]>([]);
  const [topCreators, setTopCreators] = useState<CreatorData[]>([]);
  const [searchResults, setSearchResults] = useState<(CoinData | CreatorData)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { chain } = useAccount();
  const publicClient = usePublicClient();

  const fetchTrendingCoins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Query trending coins using Zora SDK
      const response = await getCoins({
        orderBy: 'volume',
        orderDirection: 'desc',
        first: 20,
      }, {
        chainId: chain?.id || base.id,
        publicClient: publicClient as any,
      });

      const formattedCoins: CoinData[] = response.coins.map((coin: any) => ({
        id: coin.id,
        name: coin.name || 'Unnamed Coin',
        symbol: coin.symbol || 'COIN',
        creator: coin.creator,
        totalSupply: coin.totalSupply,
        marketCap: coin.marketCap || '0',
        price: coin.price || '0',
        volume24h: coin.volume24h || '0',
        holders: coin.holders || 0,
        image: coin.metadata?.image,
        description: coin.metadata?.description,
      }));

      setTrendingCoins(formattedCoins);
    } catch (err) {
      console.error('Error fetching trending coins:', err);
      setError('Failed to fetch trending coins');
      
      // Fallback to mock data for development
      setTrendingCoins([
        {
          id: '1',
          name: 'The Future of Web3',
          symbol: 'WEB3',
          creator: '0x1234...5678',
          totalSupply: '1000000',
          marketCap: '50.5',
          price: '0.0505',
          volume24h: '12.3',
          holders: 156,
          image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'A comprehensive guide to the future of decentralized web'
        },
        {
          id: '2',
          name: 'DeFi Revolution',
          symbol: 'DEFI',
          creator: '0x2345...6789',
          totalSupply: '500000',
          marketCap: '75.2',
          price: '0.1504',
          volume24h: '18.7',
          holders: 234,
          image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Understanding the decentralized finance ecosystem'
        },
        {
          id: '3',
          name: 'NFT Art Guide',
          symbol: 'NFTART',
          creator: '0x3456...7890',
          totalSupply: '750000',
          marketCap: '32.8',
          price: '0.0437',
          volume24h: '8.9',
          holders: 89,
          image: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Creating and collecting digital art on the blockchain'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [chain?.id, publicClient]);

  const fetchTopCreators = useCallback(async () => {
    try {
      // Query top creators using Zora SDK
      const response = await getCreators({
        orderBy: 'volume',
        orderDirection: 'desc',
        first: 10,
      }, {
        chainId: chain?.id || base.id,
        publicClient: publicClient as any,
      });

      const formattedCreators: CreatorData[] = response.creators.map((creator: any) => ({
        address: creator.address,
        name: creator.profile?.name,
        totalCoins: creator.totalCoins || 0,
        totalVolume: creator.totalVolume || '0',
        followers: creator.followers || 0,
        avatar: creator.profile?.avatar,
      }));

      setTopCreators(formattedCreators);
    } catch (err) {
      console.error('Error fetching top creators:', err);
      
      // Fallback to mock data
      setTopCreators([
        {
          address: '0x1234...5678',
          name: 'CryptoWriter',
          totalCoins: 5,
          totalVolume: '125.7',
          followers: 1250,
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        {
          address: '0x2345...6789',
          name: 'BlockchainBlogger',
          totalCoins: 8,
          totalVolume: '98.3',
          followers: 890,
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        {
          address: '0x3456...7890',
          name: 'DeFiExpert',
          totalCoins: 3,
          totalVolume: '67.9',
          followers: 567,
          avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'
        }
      ]);
    }
  }, [chain?.id, publicClient]);

  const searchTokensAndCreators = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      
      // Search coins
      const coinsResponse = await getCoins({
        where: {
          name_contains_nocase: query,
        },
        first: 10,
      }, {
        chainId: chain?.id || base.id,
        publicClient: publicClient as any,
      });

      // Search creators
      const creatorsResponse = await getCreators({
        where: {
          address_contains_nocase: query,
        },
        first: 5,
      }, {
        chainId: chain?.id || base.id,
        publicClient: publicClient as any,
      });

      const coins: CoinData[] = coinsResponse.coins.map((coin: any) => ({
        id: coin.id,
        name: coin.name || 'Unnamed Coin',
        symbol: coin.symbol || 'COIN',
        creator: coin.creator,
        totalSupply: coin.totalSupply,
        marketCap: coin.marketCap || '0',
        price: coin.price || '0',
        volume24h: coin.volume24h || '0',
        holders: coin.holders || 0,
        image: coin.metadata?.image,
        description: coin.metadata?.description,
      }));

      const creators: CreatorData[] = creatorsResponse.creators.map((creator: any) => ({
        address: creator.address,
        name: creator.profile?.name,
        totalCoins: creator.totalCoins || 0,
        totalVolume: creator.totalVolume || '0',
        followers: creator.followers || 0,
        avatar: creator.profile?.avatar,
      }));

      setSearchResults([...coins, ...creators]);
    } catch (err) {
      console.error('Error searching:', err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [chain?.id, publicClient]);

  useEffect(() => {
    fetchTrendingCoins();
    fetchTopCreators();
  }, [fetchTrendingCoins, fetchTopCreators]);

  return {
    trendingCoins,
    topCreators,
    searchResults,
    loading,
    error,
    searchTokensAndCreators,
    refetch: () => {
      fetchTrendingCoins();
      fetchTopCreators();
    }
  };
}