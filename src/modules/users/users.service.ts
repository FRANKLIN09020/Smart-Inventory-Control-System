import bcrypt from "bcrypt";
import prisma from "../../config/database/prisma";
import {
    CreateUserDTO,
    GetUsersQuery,
    UpdateUserDTO,
} from "./users.types";

export class UserService {

    /* =========================
       GET USERS (Pagination + Search)
    ========================= */
    static async getUsers({ page, limit, search }: GetUsersQuery) {
        const skip = (page - 1) * limit;

        const where: any = {
            is_active: true,
            ...(search && {
                OR: [
                    { username: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { full_name: { contains: search, mode: "insensitive" } },
                ],
            }),
        };

        const [users, totalRecords] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: "desc" },
                select: {
                    id: true,
                    shopId: true,
                    username: true,
                    email: true,
                    full_name: true,
                    phone: true,
                    is_active: true,
                    created_at: true,
                },
            }),
            prisma.user.count({ where }),
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

    /* =========================
       GET USER BY ID
    ========================= */
    static async getUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                shopId: true,
                username: true,
                email: true,
                full_name: true,
                phone: true,
                is_active: true,
                created_at: true,
            },
        });
    }

    /* =========================
       CREATE USER
    ========================= */
    static async createUser(data: CreateUserDTO) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        return prisma.user.create({
            data: {
                shopId: data.shopId,
                username: data.username,
                email: data.email,
                password_hash: hashedPassword,
                full_name: data.full_name,
                phone: data.phone,
            },
            select: {
                id: true,
                shopId: true,
                username: true,
                email: true,
                full_name: true,
                phone: true,
                created_at: true,
            },
        });
    }

    /* =========================
       UPDATE USER
    ========================= */
    static async updateUser(id: string, data: UpdateUserDTO) {
        return prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                shopId: true,
                username: true,
                email: true,
                full_name: true,
                phone: true,
                is_active: true,
            },
        });
    }

    /* =========================
       SOFT DELETE (Deactivate)
    ========================= */
    static async deactivateUser(id: string) {
        return prisma.user.update({
            where: { id },
            data: { is_active: false },
        });
    }
}
