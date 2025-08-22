import type { UserEntity } from "@domain/entities";

export interface IUserRepository {
    countBy(where: Partial<UserEntity>): Promise<number>;
    findOneBy(where: Partial<UserEntity>): Promise<UserEntity | null>;
    create(data: UserEntity): Promise<UserEntity>;
}

export const USER_REPOSITORY = "IUserRepository";
