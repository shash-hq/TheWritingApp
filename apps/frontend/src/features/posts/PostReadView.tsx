import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiClient } from '../../lib/axios';

interface Post {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    isPublic: boolean;
    createdAt: string;
    authorId: { _id: string; username: string } | string;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getAuthorName(authorId: Post['authorId']): string {
    return typeof authorId === 'object' ? authorId.username : 'Anonymous';
}

function getAuthorInitial(authorId: Post['authorId']): string {
    return getAuthorName(authorId).charAt(0).toUpperCase();
}

function estimateReadTime(html: string): number {
    const words = html.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

export const PostReadView = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const { data } = await apiClient.get(`/posts/${id}`);
                setPost(data.post);
            } catch {
                setError('Post not found.');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center text-center px-4">
                <p className="text-gray-400 text-lg mb-4">{error || 'Post not found.'}</p>
                <Link to="/explore" className="text-sm font-medium text-gray-900 hover:underline underline-offset-2 decoration-gray-300">
                    ← Back to Explore
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] selection:bg-blue-100">
            {/* Top bar */}
            <header className="w-full flex justify-between items-center py-6 px-10 border-b border-gray-100 bg-white/70 backdrop-blur-md sticky top-0 z-50">
                <Link to="/explore" className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">← Explore</Link>
                <Link to="/" className="font-serif font-bold text-lg text-gray-800">The Writing App.</Link>
                <div className="w-20" /> {/* spacer */}
            </header>

            {/* Article */}
            <article className="max-w-[65ch] mx-auto px-4 pt-20 pb-32">
                {/* Meta */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-serif text-sm">
                        {getAuthorInitial(post.authorId)}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">{getAuthorName(post.authorId)}</p>
                        <p className="text-xs text-gray-400">{formatDate(post.createdAt)} · {estimateReadTime(post.content)} min read</p>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 leading-tight mb-10 tracking-tight">
                    {post.title}
                </h1>

                {/* Tags */}
                {post.tags?.length > 0 && (
                    <div className="flex gap-2 mb-10">
                        {post.tags.map((tag) => (
                            <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div
                    className="prose prose-lg sm:prose-xl prose-gray font-serif leading-loose"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
        </div>
    );
};
