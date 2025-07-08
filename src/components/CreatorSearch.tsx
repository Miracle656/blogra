import { useState } from 'react'
import { setApiKey } from "@zoralabs/coins-sdk";
import { getProfile } from "@zoralabs/coins-sdk"

setApiKey(import.meta.env.VITE_ZORA_API_KEY);

interface LinkedWallet {
    walletType: string
    walletAddress: string
}

interface Profile {
    handle?: string
    displayName?: string
    bio?: string
    avatar?: {
        medium?: string
    }
    linkedWallets?: {
        edges: {
            node: LinkedWallet
        }[]
    }
}


function CreatorSearch() {

     const [walletAddress, setWalletAddress] = useState("")
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchUserProfile = async () => {
        setProfile(null)
        setError(null)
        setLoading(true)

        try {
            const response = await getProfile({
                identifier: walletAddress,
            })

            const userProfile = response?.data?.profile

            if (userProfile) {
                setProfile(userProfile)
            } else {
                setError("Profile not found or not set up.")
            }
        } catch (err) {
            console.error("Profile fetch error:", err)
            setError("Invalid wallet or network error.")
        } finally {
            setLoading(false)
        }
    }


  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Zora Profile Lookup</h2>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter wallet address (e.g. 0x...)"
          className="w-full p-2 border border-gray-300 rounded-lg text-black"
        />
        <button
          onClick={fetchUserProfile}
          disabled={!walletAddress || loading}
          className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {profile && (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          {profile.avatar?.medium && (
            <img
              src={profile.avatar.medium}
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full mb-4"
            />
          )}

          <h3 className="text-xl font-semibold text-black">
            {profile.displayName || "No Display Name"}
          </h3>
          <p className="text-gray-500">@{profile.handle || "no-handle"}</p>

          {profile.bio && (
            <p className="text-gray-700 mt-2 mb-4 italic">{profile.bio}</p>
          )}

          {profile.linkedWallets?.edges?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-black">Linked Wallets</h4>
              <ul className="list-disc list-inside text-sm text-black">
                {profile.linkedWallets.edges.map((link, index) => (
                  <li key={index}>
                    {link.node.walletType}: {link.node.walletAddress}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreatorSearch