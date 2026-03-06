import { User } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/auth.js';

export class UserService {
    static async registerUser(data: { username: string; email: string; password: string }) {
        const existing = await User.findOne({ $or: [{ email: data.email }, { username: data.username }] });
        if (existing) {
            throw new Error('User already exists');
        }

        const passwordHash = await hashPassword(data.password);
        const user = new User({
            username: data.username,
            email: data.email,
            passwordHash,
        });

        await user.save();

        return {
            user: { id: user._id.toString(), username: user.username, email: user.email },
        };
    }

    static async loginUser(data: { email: string; password: string }) {
        const user = await User.findOne({ email: data.email });
        if (!user) throw new Error('Invalid credentials');

        const isValid = await comparePassword(data.password, user.passwordHash);
        if (!isValid) throw new Error('Invalid credentials');

        return {
            user: { id: user._id.toString(), username: user.username, email: user.email },
        };
    }
}
