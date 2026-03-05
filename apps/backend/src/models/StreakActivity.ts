import mongoose, { Document, Schema } from 'mongoose';

export interface IStreakActivity extends Document {
    userId: mongoose.Types.ObjectId;
    checkInDate: Date; // The specific day the user checked in (e.g. 2026-03-05 at midnight UTC)
}

const StreakActivitySchema = new Schema<IStreakActivity>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    checkInDate: { type: Date, required: true },
});

// Quickly find daily check-ins for a user to construct the GitHub/Leetcode graph
StreakActivitySchema.index({ userId: 1, checkInDate: 1 }, { unique: true });

export const StreakActivity = mongoose.model<IStreakActivity>('StreakActivity', StreakActivitySchema);
