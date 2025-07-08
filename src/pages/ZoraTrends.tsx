import { useState, useEffect } from 'react';
import CreatorSearch from '../components/CreatorSearch';
import CoinSearch from '../components/CoinSearch';
// import '../ScrollText.css'
import {
  setApiKey,
  getCoinsTopGainers,
  getCoinsTopVolume24h,
  getCoinsMostValuable,
  getCoinsNew,
  getCoinsLastTraded,
  getCoinsLastTradedUnique
} from '@zoralabs/coins-sdk';

setApiKey(import.meta.env.VITE_ZORA_API_KEY);

interface Coin {
  id?: string;
  name?: string;
  symbol?: string;
  volume24h?: string;
  marketCap?: string;
  uniqueHolders?: number;
  description?: string;
  address?: string;
  totalSupply?: string;
  totalVolume?: string;
  createdAt?: string;
  creatorAddress?: string;
  marketCapDelta24h?: string;
  chainId?: number;
}

const categories: { label: string; fetcher: () => Promise<any> }[] = [
  { label: 'Top Volume', fetcher: () => getCoinsTopVolume24h({ count: 10 }) },
  { label: 'Top Gainers', fetcher: () => getCoinsTopGainers({ count: 10 }) },
  { label: 'Most Valuable', fetcher: () => getCoinsMostValuable({ count: 10 }) },
  { label: 'New Coins', fetcher: () => getCoinsNew({ count: 10 }) },
  { label: 'Last Traded', fetcher: () => getCoinsLastTraded({ count: 10 }) },
  { label: 'Unique Trades', fetcher: () => getCoinsLastTradedUnique({ count: 10 }) }
];

function ZoraTrends() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Top Volume');
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const category = categories.find((c) => c.label === selectedCategory);
        if (!category) return;

        const response = await category.fetcher();
        const tokens = response?.data?.exploreList?.edges?.map((edge: any) => edge.node);
        setCoins(tokens || []);
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [selectedCategory]);

  return (
    <div className="p-4 text-white">
      {/* <div className="w-full overflow-hidden whitespace-nowrap bg-gray-100 py-2">
        <p className="inline-block animate-scroll-lr text-sm font-semibold text-blue-600">
          {coins.map((coin, index) => (
            <span key={index}>{coin.name} |</span>
          ))}
        </p>
      </div> */}
      <div className='flex'>
        <CreatorSearch />
        <CoinSearch />
      </div>
      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setSelectedCategory(cat.label)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedCategory === cat.label
                ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-purple-600 to-blue-600'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-black">{selectedCategory}</h2>

      {loading ? (
        <p className='text-black'>Fetching data ...</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-black">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">Symbol</th>
                <th className="p-2">Volume (24h)</th>
                <th className="p-2">Market Cap</th>
                <th className="p-2">Holders</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, index) => (
                <tr
                  key={index}
                  className="border-gray-700 hover:bg-gray-200 cursor-pointer text-black"
                  onClick={() => setSelectedCoin(coin)}
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{coin.name}</td>
                  <td className="p-2">{coin.symbol}</td>
                  <td className="p-2">{Number(coin.volume24h || 0).toLocaleString()}</td>
                  <td className="p-2">{Number(coin.marketCap || 0).toLocaleString()}</td>
                  <td className="p-2">{Number(coin.uniqueHolders || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedCoin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-xl shadow-lg relative">
            <button
              onClick={() => setSelectedCoin(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedCoin.name} ({selectedCoin.symbol})</h2>
            <ul className="space-y-2 text-sm">
              <li><strong>Description:</strong> {selectedCoin.description || 'N/A'}</li>
              <li><strong>Address:</strong> {selectedCoin.address}</li>
              <li><strong>Creator Address:</strong> {selectedCoin.creatorAddress}</li>
              <li><strong>Created At:</strong> {selectedCoin.createdAt ? new Date(selectedCoin.createdAt).toLocaleString() : 'N/A'}</li>
              <li><strong>Total Supply:</strong> {Number(selectedCoin.totalSupply || 0).toLocaleString()}</li>
              <li><strong>Total Volume:</strong> {Number(selectedCoin.totalVolume || 0).toLocaleString()}</li>
              <li><strong>Volume 24h:</strong> {Number(selectedCoin.volume24h || 0).toLocaleString()}</li>
              <li><strong>Market Cap:</strong> {Number(selectedCoin.marketCap || 0).toLocaleString()}</li>
              <li><strong>Market Cap Δ 24h:</strong> {Number(selectedCoin.marketCapDelta24h || 0).toLocaleString()}</li>
              <li><strong>Unique Holders:</strong> {Number(selectedCoin.uniqueHolders || 0).toLocaleString()}</li>
              <li><strong>Chain ID:</strong> {selectedCoin.chainId ?? 'N/A'}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZoraTrends;
