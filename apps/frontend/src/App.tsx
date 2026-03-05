import { Routes, Route, Link } from 'react-router-dom';
import { UserProfile } from './features/profiles/UserProfile';
import { RichTextEditor } from './features/editor/RichTextEditor';
import { ExploreFeed } from './features/explore/ExploreFeed';

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-gray-900 selection:bg-blue-100">
      {/* Premium Minimalist Navbar */}
      <header className="w-full flex justify-between items-center py-6 px-10 border-b border-gray-200/50 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="font-serif font-bold text-xl tracking-tight text-gray-800">The Writing App.</div>
        <nav className="flex gap-8 text-sm font-medium text-gray-500">
          <Link to="/explore" className="hover:text-gray-900 transition-colors">Explore</Link>
          <Link to="/profile/me" className="hover:text-gray-900 transition-colors">Profile</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-6 leading-tight">
          Write deeply. <br /><span className="text-gray-400 italic font-light">Think clearly.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl font-light leading-relaxed">
          A minimalist sanctuary for professional writers and thinkers, designed to foster focus and reward consistency.
        </p>

        <Link to="/editor" className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white transition-all duration-300 bg-gray-900 rounded-full hover:bg-gray-800 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5">
          Start Writing
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </Link>
      </main>
    </div>
  );
}

function App() {
  const defaultProfile = { username: "Biplav", bio: "Tech enthusiast, AI Developer.", streak: 14, postsCount: 3, followersCount: 42 };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<ExploreFeed />} />
      <Route path="/editor" element={<RichTextEditor />} />
      <Route path="/profile/:username" element={<UserProfile profileData={defaultProfile} />} />
      <Route path="/login" element={<div className="p-8 text-center text-gray-600">Login Page (WIP)</div>} />
      <Route path="/register" element={<div className="p-8 text-center text-gray-600">Register Page (WIP)</div>} />
    </Routes>
  );
}

export default App;
