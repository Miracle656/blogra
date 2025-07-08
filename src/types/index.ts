export interface BlogPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: string;
  image?: string;
  createdAt: string;
  coinAddress?: string;
  price: number;
  volume: number;
  holders: number;
}

export interface Trade {
  id: string;
  postId: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  user: string;
  timestamp: string;
}

export interface Creator {
  address: string;
  totalVolume: number;
  totalPosts: number;
  totalCollectors: number;
}

export interface TrendingCoin {
  id: string;
  title: string;
  volume: number;
  price: number;
  change24h: number;
}