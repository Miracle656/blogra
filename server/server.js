import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Mock database for demo purposes
let posts = [];
let trades = [];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Posts endpoints
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
});

app.post('/api/posts', upload.single('image'), (req, res) => {
  const { title, content, tags, author } = req.body;
  const post = {
    id: Date.now().toString(),
    title,
    content,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    author,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString(),
    coinAddress: null, // Will be set when coin is minted
    price: 0,
    volume: 0,
    holders: 0
  };
  posts.push(post);
  res.json(post);
});

// Trading endpoints
app.get('/api/trades', (req, res) => {
  res.json(trades);
});

app.post('/api/trades', (req, res) => {
  const { postId, type, amount, price, user } = req.body;
  const trade = {
    id: Date.now().toString(),
    postId,
    type, // 'buy' or 'sell'
    amount,
    price,
    user,
    timestamp: new Date().toISOString()
  };
  trades.push(trade);
  res.json(trade);
});

// Analytics endpoints
app.get('/api/analytics/trending', (req, res) => {
  const trending = posts
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10)
    .map(post => ({
      id: post.id,
      title: post.title,
      volume: post.volume,
      price: post.price,
      change24h: Math.random() * 20 - 10 // Mock data
    }));
  res.json(trending);
});

app.get('/api/analytics/creators', (req, res) => {
  const creators = posts
    .reduce((acc, post) => {
      if (!acc[post.author]) {
        acc[post.author] = {
          address: post.author,
          totalVolume: 0,
          totalPosts: 0,
          totalCollectors: 0
        };
      }
      acc[post.author].totalVolume += post.volume;
      acc[post.author].totalPosts += 1;
      acc[post.author].totalCollectors += post.holders;
      return acc;
    }, {});
  
  res.json(Object.values(creators).slice(0, 10));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});