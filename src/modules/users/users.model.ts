import { Schema, model } from "mongoose";
import { IUser } from "./users.types";

const userSchema = new Schema<IUser>({
    shopId: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    full_name: { type: String },
    phone: { type: String },
    is_active: { type: Boolean, default: true },
    last_login: { type: Date },
    created_at: { type: Date, default: Date.now },
});

export const UserModel = model<IUser>("User", userSchema);
