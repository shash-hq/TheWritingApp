import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const RichTextEditor = ({
    initialContent = '',
    onChange
}: {
    initialContent?: string,
    onChange?: (html: string) => void
}) => {
    const [isSaving] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                document: false,
                paragraph: false,
                text: false,
            }),
            Document,
            Paragraph,
            Text,
            Placeholder.configure({
                placeholder: 'Begin your essay here...',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-300 before:absolute before:pointer-events-none',
            })
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-lg sm:prose-xl mx-auto focus:outline-none min-h-[70vh] bg-transparent text-gray-800 font-serif leading-loose tracking-wide mt-8 relative',
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        }
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] selection:bg-blue-100 flex flex-col relative">
            <header className="flex items-center justify-between py-6 px-10 border-b border-gray-100 shrink-0">
                <Link to="/" className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">← Back</Link>
                <div className="flex gap-4 items-center">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{isSaving ? 'Saving...' : 'Draft saved'}</span>
                    <button className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors shadow-sm">
                        Publish
                    </button>
                </div>
            </header>

            {/* Floating Selection Toolbar imitation - simplified for now */}
            <div className="w-full flex-1 flex flex-col items-center pt-24 px-4 pb-32">
                <input
                    className="w-full max-w-[65ch] text-4xl sm:text-5xl font-serif font-bold text-gray-900 bg-transparent outline-none placeholder:text-gray-300 mb-8 tracking-tight"
                    placeholder="Title goes here"
                />

                <div className="w-full max-w-[65ch]">
                    {/* The Editor */}
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Minimalist Floating Controls */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] opacity-50 hover:opacity-100 transition-opacity">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold font-serif text-sm transition-colors ${editor.isActive('bold') ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    B
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`w-9 h-9 rounded-full flex items-center justify-center italic font-serif text-sm transition-colors ${editor.isActive('italic') ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    i
                </button>
            </div>
        </div>
    );
};
