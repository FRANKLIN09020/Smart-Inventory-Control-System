import { Document } from "mongoose";

export interface IUser extends Document {
    shopId: string;
    username: string;
    email: string;
    password_hash: string;
    full_name?: string;
    phone?: string;
    is_active: boolean;
    last_login?: Date;
    created_at: Date;
}

export interface CreateUserDTO {
    shopId: string;
    username: string;
    email: string;
    password: string;
    full_name?: string;
    phone?: string;
}

export interface UpdateUserDTO {
    full_name?: string;
    phone?: string;
    is_active?: boolean;
}
