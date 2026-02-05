import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import Badges from './pages/Badges';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ChallengeDetail from './pages/ChallengeDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* Menu điều hướng */}
        <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
          <div className="text-2xl font-black text-blue-400">PTIT-SUI</div>
          <div className="flex gap-6 font-bold text-xs">
            <Link to="/dashboard" className="hover:text-blue-400">DASHBOARD</Link>
            <Link to="/challenges" className="hover:text-blue-400">CHALLENGES</Link>
            <Link to="/badges" className="hover:text-blue-400">BADGES</Link>
            <Link to="/profile" className="hover:text-blue-400">PROFILE</Link>
            <Link to="/admin" className="text-red-400 border-l pl-6 border-slate-700">ADMIN</Link>
          </div>
          <button className="bg-blue-600 px-6 py-2 rounded-full font-bold text-xs">CONNECT WALLET</button>
        </nav>

        {/* Nội dung trang */}
        <div className="container mx-auto py-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/:lang" element={<ChallengeDetail />} />
            <Route path="/badges" element={<Badges />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;