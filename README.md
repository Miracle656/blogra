# 📝 Zoracle (testnet)

**Zoracle** is a decentralized publishing platform that lets writers turn blog posts into **tradable tokens** using the Zora Coins SDK, deployed on the Base network. It combines writing, minting, and market mechanics into a seamless Web3-native experience.

---

## 🚀 Live Demo

[🔗 Demo URL](https://your-demo-url.com)

---

## 🧠 Overview

Zoracle allows users to:
- Publish blog posts and mint them as Zora Coins.
- Trade blog posts like assets (buy/sell).
- Discover trending posts, top creators and zora data aggregator.
- Unlock full content by holding the blog token.

Built with a fully onchain-native stack to support creator ownership, discovery, and monetization.

---

## 🛠️ Tech Stack

| Layer         | Tech                                                                 |
|---------------|----------------------------------------------------------------------|
| **Frontend**  | React + Vite + TypeScript + Tailwind CSS + Lucid                            |
| **Backend**   | Node.js (optional for metadata hosting)                             |
| **Wallet**    | wagmi + viem for wallet interactions                                |
| **Blockchain**| **Base** (L2) for low-cost transactions                             |
| **Core SDK**  | **Zora Coins SDK** (Sponsor Tech)                                   |

---

## 🎯 Features

### ✅ Post Creation & Minting  
- Users write blog content.
- Upon submission, metadata is generated and uploaded.
- A Zora Coin is minted using `createCoin()`.

### ✅ Tokenized Trading
- Each post has a dedicated coin market.
- Users can **buy/sell** the post using Zora’s `tradeCoin()` method.

### ✅ Gated Content
- Full blog content is unlocked only if the reader holds a token of the post.

### ✅ Creator Dashboard
- Users can view all their minted posts, trade volumes, and coin holders.

### ✅ Discovery Page
- List of trending blog coins, based on volume and activity.

---

## 🧩 Where Sponsor Tech (Zora) Is Used

✅ **Zora SDK for Minting:**
```ts
import { createCoin } from "@zoralabs/coins-sdk";
```
---

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/blogra.git
cd blogra
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file:

```env
VITE_WALLET_CONNECT_PROJECT_ID=your-id
VITE_ZORA_CREATOR_ADDRESS=your-address
VITE_CHAIN_ID=8453 # Base Mainnet or 84532 for Base Sepolia
```

### 4. Start the App

```bash
npm run dev
```
