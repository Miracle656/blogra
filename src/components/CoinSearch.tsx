import { useState } from 'react'
import { setApiKey } from "@zoralabs/coins-sdk";
import { getCoin } from "@zoralabs/coins-sdk"
import { base } from "viem/chains"

setApiKey(import.meta.env.VITE_ZORA_API_KEY);

interface Coin {
    name: string
    symbol: string
    description?: string
    totalSupply: string
    marketCap: string
    volume24h: string
    creatorAddress: string
    createdAt: string
    uniqueHolders: number
    mediaContent?: {
        previewImage?: string
    }
}

function CoinSearch() {

    const [address, setAddress] = useState("")
    const [coin, setCoin] = useState < Coin | null > (null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState < string | null > (null)

    const fetchCoin = async () => {
        setCoin(null)
        setError(null)
        setLoading(true)

        try {
            const response = await getCoin({
                address,
                chain: base.id,
            })

            if (response.data?.zora20Token) {
                setCoin(response.data.zora20Token)
            } else {
                setError("No coin found for this address.")
            }
        } catch (err) {
            console.error("Error fetching coin:", err)
            setError("Invalid address or network error.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-black">Zora Coin Lookup</h2>

            <div className="flex items-center gap-2 mb-6">
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Paste Zora contract address (e.g. 0x...)"
                    className="w-full p-2 border border-gray-300 rounded-lg text-black"
                />
                <button
                    onClick={fetchCoin}
                    disabled={!address || loading}
                    className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {coin && (
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="text-xl font-semibold mb-2 text-black">
                        {coin.name} ({coin.symbol})
                    </h3>

                    {coin.mediaContent?.previewImage && (
                        <img
                            src={coin.mediaContent.previewImage}
                            alt="Preview"
                            className="w-full h-auto mb-4 rounded"
                        />
                    )}

                    <p className="text-gray-700 mb-2">
                        <strong>Description:</strong> {coin.description || "N/A"}
                    </p>

                    <ul className="text-sm space-y-2 text-black">
                        <li>
                            <strong>Total Supply:</strong>{" "}
                            {Number(coin.totalSupply).toLocaleString()}
                        </li>
                        <li>
                            <strong>Market Cap:</strong>{" "}
                            {Number(coin.marketCap).toLocaleString()} USD
                        </li>
                        <li>
                            <strong>24h Volume:</strong>{" "}
                            {Number(coin.volume24h).toLocaleString()} USD
                        </li>
                        <li>
                            <strong>Unique Holders:</strong>{" "}
                            {coin.uniqueHolders.toLocaleString()}
                        </li>
                        <li>
                            <strong>Creator Address:</strong> {coin.creatorAddress}
                        </li>
                        <li>
                            <strong>Created At:</strong>{" "}
                            {new Date(coin.createdAt).toLocaleString()}
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default CoinSearch