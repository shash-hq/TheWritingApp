import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import { useAuthStore } from '../../hooks/useAuth';

export const RichTextEditor = () => {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isLoading = useAuthStore((s) => s.isLoading);
    const [searchParams] = useSearchParams();
    const postId = searchParams.get('postId');

    const [title, setTitle] = useState('');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [currentPostId, setCurrentPostId] = useState<string | null>(postId);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const contentRef = useRef('');

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ document: false, paragraph: false, text: false }),
            Document,
            Paragraph,
            Text,
            Placeholder.configure({
                placeholder: 'Begin your essay here...',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-300 before:absolute before:pointer-events-none',
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-lg sm:prose-xl mx-auto focus:outline-none min-h-[70vh] bg-transparent text-gray-800 font-serif leading-loose tracking-wide mt-8 relative',
            },
        },
        onUpdate: ({ editor }) => {
            contentRef.current = editor.getHTML();
            scheduleSave();
        },
    });

    // Word count
    const wordCount = useMemo(() => {
        const text = editor?.getText() || '';
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const readTime = Math.max(1, Math.ceil(words / 200));
        return { words, readTime };
    }, [editor?.getText()]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isLoading, isAuthenticated, navigate]);

    // Load existing post if editing
    useEffect(() => {
        if (!postId || !editor) return;
        (async () => {
            try {
                const { data } = await apiClient.get(`/posts/${postId}`);
                setTitle(data.post.title || '');
                editor.commands.setContent(data.post.content || '');
                contentRef.current = data.post.content || '';
                setCurrentPostId(postId);
            } catch {
                // Post not found — start fresh
            }
        })();
    }, [postId, editor]);

    // Save logic
    const save = useCallback(async () => {
        const content = contentRef.current;
        if (!title.trim() && !content.trim()) return;

        setSaveStatus('saving');
        try {
            if (currentPostId) {
                await apiClient.patch(`/posts/${currentPostId}`, { title, content });
            } else {
                const { data } = await apiClient.post('/posts', { title: title || 'Untitled', content });
                setCurrentPostId(data.post._id);
            }
            setSaveStatus('saved');
        } catch {
            setSaveStatus('error');
        }
    }, [title, currentPostId]);

    // Auto-save every 30s
    const scheduleSave = useCallback(() => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => save(), 30_000);
    }, [save]);

    // ⌘S / Ctrl+S manual save
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                save();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [save]);

    // Publish
    const handlePublish = async () => {
        const content = contentRef.current;
        if (!title.trim() || !content.trim()) return;

        setSaveStatus('saving');
        try {
            if (currentPostId) {
                await apiClient.patch(`/posts/${currentPostId}`, { title, content, isPublic: true });
                navigate(`/posts/${currentPostId}`);
            } else {
                const { data } = await apiClient.post('/posts', { title, content, isPublic: true });
                navigate(`/posts/${data.post._id}`);
            }
        } catch {
            setSaveStatus('error');
        }
    };

    if (!editor) return null;

    const statusText: Record<typeof saveStatus, string> = {
        idle: 'New draft',
        saving: 'Saving…',
        saved: 'Draft saved ✓',
        error: 'Save failed',
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] selection:bg-blue-100 flex flex-col relative">
            <header className="flex items-center justify-between py-5 px-10 border-b border-gray-100 shrink-0">
                <Link to="/" className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">← Back</Link>
                <div className="flex gap-4 items-center">
                    <span className="text-xs text-gray-400 tabular-nums">
                        {wordCount.words} words · {wordCount.readTime} min read
                    </span>
                    <span className={`text-xs font-medium uppercase tracking-widest ${saveStatus === 'error' ? 'text-red-400' : 'text-gray-400'}`}>
                        {statusText[saveStatus]}
                    </span>
                    <button
                        onClick={save}
                        className="text-xs text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300"
                    >
                        Save
                    </button>
                    <button
                        onClick={handlePublish}
                        className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors shadow-sm"
                    >
                        Publish
                    </button>
                </div>
            </header>

            <div className="w-full flex-1 flex flex-col items-center pt-24 px-4 pb-32">
                <input
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); scheduleSave(); }}
                    className="w-full max-w-[65ch] text-4xl sm:text-5xl font-serif font-bold text-gray-900 bg-transparent outline-none placeholder:text-gray-300 mb-8 tracking-tight"
                    placeholder="Title goes here"
                />

                <div className="w-full max-w-[65ch]">
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Floating toolbar */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] opacity-50 hover:opacity-100 transition-opacity">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold font-serif text-sm transition-colors ${editor.isActive('bold') ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >B</button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`w-9 h-9 rounded-full flex items-center justify-center italic font-serif text-sm transition-colors ${editor.isActive('italic') ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >i</button>
            </div>
        </div>
    );
};
