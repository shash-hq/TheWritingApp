import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/axios';

interface PostItem {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    authorId: { _id: string; username: string } | string;
}

/* Skeleton shimmer card */
const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse flex flex-col h-full">
        <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-gray-100" />
            <div className="flex flex-col gap-1.5">
                <div className="w-20 h-3 bg-gray-100 rounded" />
                <div className="w-14 h-2 bg-gray-50 rounded" />
            </div>
        </div>
        <div className="w-3/4 h-5 bg-gray-100 rounded mb-2" />
        <div className="w-full h-4 bg-gray-50 rounded mb-1.5" />
        <div className="w-5/6 h-4 bg-gray-50 rounded mb-6" />
        <div className="mt-auto border-t border-gray-50 pt-4 flex justify-between">
            <div className="w-12 h-4 bg-gray-50 rounded" />
            <div className="w-8 h-4 bg-gray-50 rounded" />
        </div>
    </div>
);

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, '').slice(0, 200);
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getAuthorName(authorId: PostItem['authorId']): string {
    return typeof authorId === 'object' ? authorId.username : 'Anonymous';
}

function getAuthorInitial(authorId: PostItem['authorId']): string {
    const name = getAuthorName(authorId);
    return name.charAt(0).toUpperCase();
}

export const ExploreFeed = () => {
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const { data } = await apiClient.get('/posts?limit=12');
                setPosts(data.posts || []);
            } catch {
                setError('Failed to load posts.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 selection:bg-blue-100 py-20 px-6">
            <div className="max-w-5xl mx-auto">
                <header className="mb-16 flex items-baseline justify-between border-b border-gray-200/60 pb-6">
                    <h1 className="text-4xl font-serif text-gray-900">Discover</h1>
                    <Link to="/" className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">← Back to Home</Link>
                </header>

                {/* Loading state */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="text-center py-20 text-gray-400">{error}</div>
                )}

                {/* Empty state */}
                {!loading && !error && posts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg font-light mb-4">Nothing here yet.</p>
                        <Link to="/editor" className="text-sm font-medium text-gray-900 hover:underline underline-offset-2 decoration-gray-300">
                            Be the first to publish →
                        </Link>
                    </div>
                )}

                {/* Posts grid */}
                {!loading && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link to={`/posts/${post._id}`} key={post._id} className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-serif text-xs">
                                        {getAuthorInitial(post.authorId)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-800">{getAuthorName(post.authorId)}</span>
                                        <time className="text-[11px] text-gray-400 uppercase tracking-widest">{formatDate(post.createdAt)}</time>
                                    </div>
                                </div>

                                <h2 className="text-xl font-serif text-gray-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                                    {post.title}
                                </h2>

                                <p className="text-sm text-gray-500 leading-relaxed font-light mb-6 flex-1 line-clamp-3">
                                    {stripHtml(post.content)}
                                </p>

                                <div className="mt-auto border-t border-gray-50 pt-4 flex justify-between items-center text-xs font-medium text-gray-400">
                                    {post.tags?.length > 0 ? (
                                        <span className="bg-gray-50 px-2 py-1 rounded text-gray-500">{post.tags[0]}</span>
                                    ) : <span />}
                                    <span className="text-gray-300">Read →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
