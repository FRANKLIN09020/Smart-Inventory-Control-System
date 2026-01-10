import bcrypt from "bcrypt";
import { UserModel } from "./users.model";
import { CreateUserDTO, UpdateUserDTO } from "./users.types";

export class UserService {
    static async getAllUsers() {
        return UserModel.find({ is_active: true }).select("-password_hash");
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
