import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string; // The rich text editor content stored as HTML or JSON blocks
    authorId: mongoose.Types.ObjectId;
    isPublic: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }]
}, {
    timestamps: true
});

// Indexing for discovery page querying and text search
PostSchema.index({ authorId: 1, isPublic: 1 });
PostSchema.index({ isPublic: 1, createdAt: -1 });

export const Post = mongoose.model<IPost>('Post', PostSchema);
