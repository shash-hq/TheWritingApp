import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { UserProfile } from './features/profiles/UserProfile';
import { RichTextEditor } from './features/editor/RichTextEditor';
import { ExploreFeed } from './features/explore/ExploreFeed';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { PostReadView } from './features/posts/PostReadView';
import { useAuthStore } from './hooks/useAuth';

/* ─── Curated Quotes ─── */
const QUOTES = [
  { text: 'The scariest moment is always just before you start.', author: 'Stephen King' },
  { text: 'Write what should not be forgotten.', author: 'Isabel Allende' },
  { text: 'Start writing, no matter what. The water does not flow until the faucet is turned on.', author: 'Louis L\'Amour' },
  { text: 'A writer is someone for whom writing is more difficult than it is for other people.', author: 'Thomas Mann' },
  { text: 'You can always edit a bad page. You can\'t edit a blank page.', author: 'Jodi Picoult' },
  { text: 'Almost all good writing begins with terrible first efforts.', author: 'Anne Lamott' },
  { text: 'The first draft is just you telling yourself the story.', author: 'Terry Pratchett' },
  { text: 'If you want to be a writer, you must do two things above all others: read a lot and write a lot.', author: 'Stephen King' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.', author: 'Buddha' },
  { text: 'In the midst of chaos, there is also opportunity.', author: 'Sun Tzu' },
  { text: 'The impediment to action advances action. What stands in the way becomes the way.', author: 'Marcus Aurelius' },
  { text: 'Waste no more time arguing about what a good man should be. Be one.', author: 'Marcus Aurelius' },
  { text: 'The ability to simplify means to eliminate the unnecessary so that the necessary may speak.', author: 'Hans Hofmann' },
  { text: 'Silence is a source of great strength.', author: 'Lao Tzu' },
  { text: 'Nature does not hurry, yet everything is accomplished.', author: 'Lao Tzu' },
  { text: 'A mind that is stretched by a new experience can never go back to its old dimensions.', author: 'Oliver Wendell Holmes Jr.' },
  { text: 'Deep work is the ability to focus without distraction on a cognitively demanding task.', author: 'Cal Newport' },
  { text: 'Attention is the rarest and purest form of generosity.', author: 'Simone Weil' },
  { text: 'The art of writing is the art of discovering what you believe.', author: 'Gustave Flaubert' },
];

function getDailyQuote() {
  const dayIndex = Math.floor(Date.now() / 86400000) % QUOTES.length;
  return QUOTES[dayIndex];
}

/* ─── Homepage ─── */
function Home() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const quote = getDailyQuote();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-gray-900 selection:bg-blue-100">
      {/* Navbar */}
      <header className="w-full flex justify-between items-center py-6 px-10 border-b border-gray-200/50 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="font-serif font-bold text-xl tracking-tight text-gray-800">The Writing App.</Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-500">
          <Link to="/explore" className="hover:text-gray-900 transition-colors">Explore</Link>
          {!isLoading && (
            isAuthenticated ? (
              <>
                <Link to="/profile/me" className="hover:text-gray-900 transition-colors">Profile</Link>
                <Link to="/editor" className="px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-all shadow-sm">
                  Write
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-900 transition-colors">Sign In</Link>
                <Link to="/register" className="px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-all shadow-sm">
                  Get Started
                </Link>
              </>
            )
          )}
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

        {/* Feature pillars */}
        <div className="flex flex-wrap justify-center gap-8 mb-14 text-xs text-gray-400 tracking-wide uppercase font-medium">
          <span>✦ Write without distraction</span>
          <span>◎ Build your streak</span>
          <span>↗ Share with readers</span>
        </div>

        <Link to={isAuthenticated ? "/editor" : "/register"} className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white transition-all duration-300 bg-gray-900 rounded-full hover:bg-gray-800 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5">
          {isAuthenticated ? 'Start Writing' : 'Get Started'}
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </Link>

        {/* Daily Quote */}
        <div className="mt-20 mb-12 max-w-lg animate-[fadeIn_1s_ease-in-out]">
          <p className="font-serif italic text-gray-400 text-base leading-relaxed">"{quote.text}"</p>
          <p className="text-xs text-gray-300 uppercase tracking-widest mt-3 font-medium">— {quote.author}</p>
        </div>
      </main>
    </div>
  );
}

/* ─── App ─── */
function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const user = useAuthStore((s) => s.user);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<ExploreFeed />} />
      <Route path="/editor" element={<RichTextEditor />} />
      <Route path="/profile/:username" element={<UserProfile profileData={user} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/posts/:id" element={<PostReadView />} />
    </Routes>
  );
}

export default App;
