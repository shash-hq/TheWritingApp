import { Link } from 'react-router-dom';

export const ExploreFeed = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 selection:bg-blue-100 py-20 px-6">
            <div className="max-w-5xl mx-auto">
                <header className="mb-16 flex items-baseline justify-between border-b border-gray-200/60 pb-6">
                    <h1 className="text-4xl font-serif text-gray-900">Discover</h1>
                    <Link to="/" className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">← Back to Home</Link>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((post) => (
                        <article key={post} className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-serif text-xs">A</div>
                                <div className="flex flex-col">
                                    <Link to="/profile/author" className="text-sm font-medium text-gray-800 hover:underline decoration-gray-300 underline-offset-2">Author Name</Link>
                                    <time className="text-[11px] text-gray-400 uppercase tracking-widest">Oct 24, 2026</time>
                                </div>
                            </div>

                            <h2 className="text-xl font-serif text-gray-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                                The Architecture of Silence: Designing for Deep Work
                            </h2>

                            <p className="text-sm text-gray-500 leading-relaxed font-light mb-6 flex-1 line-clamp-3">
                                In an era of constant notifications and fragmented attention, creating digital sanctuaries has become not just an aesthetic choice, but a cognitive necessity. We explore the principles of...
                            </p>

                            <div className="mt-auto border-t border-gray-50 pt-4 flex justify-between items-center text-xs font-medium text-gray-400">
                                <span className="bg-gray-50 px-2 py-1 rounded text-gray-500">Design</span>
                                <span className="flex items-center gap-1 hover:text-gray-900 cursor-pointer transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 15l7-7 7 7"></path></svg>
                                    142
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};
