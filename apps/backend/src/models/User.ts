import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    bio?: string;
    avatarUrl?: string;
    favorites: mongoose.Types.ObjectId[]; // Top 4 favorite posts (like Letterboxd 4 favorite films)
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    streak: number;
    lastCheckIn?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    bio: { type: String, maxLength: 500 },
    avatarUrl: { type: String },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Post' }], // Limit checked by app logic
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    streak: { type: Number, default: 0 },
    lastCheckIn: { type: Date },
}, {
    timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema);
