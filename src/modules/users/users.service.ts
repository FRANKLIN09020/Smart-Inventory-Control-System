import bcrypt from "bcrypt";
import { UserModel } from "./users.model";
import {CreateUserDTO, GetUsersQuery, UpdateUserDTO} from "./users.types";

export class UserService {
    static async getUsers(query: GetUsersQuery) {
        const { page, limit, search } = query;

        const skip = (page - 1) * limit;

        // Base filter
        const filter: any = {
            is_active: true,
        };

        // Search condition
        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { full_name: { $regex: search, $options: "i" } },
            ];
        }

        // Query data + count in parallel
        const [users, totalRecords] = await Promise.all([
            UserModel.find(filter)
                .select("-password_hash")
                .skip(skip)
                .limit(limit)
                .sort({ created_at: -1 }),

            UserModel.countDocuments(filter),
        ]);

        return {
            data: users,
            pagination: {
                page,
                limit,
                totalRecords,
                totalPages: Math.ceil(totalRecords / limit),
            },
        };
    }

    static async getUserById(id: string | string[]) {

        return UserModel.findById(id).select("-password_hash");
    }

    static async createUser(data: CreateUserDTO) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return UserModel.create({
            shopId: data.shopId,
            username: data.username,
            email: data.email,
            password_hash: hashedPassword,
            full_name: data.full_name,
            phone: data.phone,
        });
    }

    static async updateUser(id: string | string[], data: UpdateUserDTO) {
        return UserModel.findByIdAndUpdate(id, data, { new: true }).select(
            "-password_hash"
        );
    }

    static async deactivateUser(id: string | string[]) {
        return UserModel.findByIdAndUpdate(
            id,
            { is_active: false },
            { new: true }
        );
    }
}
