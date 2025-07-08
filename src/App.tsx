import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CreatePost } from './pages/CreatePost';
import { Trading } from './pages/Trading';
import ZoraTrends from './pages/ZoraTrends';
import { Profile } from './pages/Profile';
import { PostDetail } from './pages/PostDetail';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/trading" element={<Trading />} />
              <Route path="/trending" element={<ZoraTrends />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/post/:id" element={<PostDetail />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;