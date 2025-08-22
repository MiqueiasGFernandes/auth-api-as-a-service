import type { UserInputDto, UserOutputDto } from "@application/dto";

export interface IUserRepository {
    countBy(where: Partial<UserInputDto>): Promise<number>
    findOneBy(where: Partial<UserInputDto>): Promise<UserOutputDto | null>
    create(data: UserInputDto): Promise<UserOutputDto>
}

export const USER_REPOSITORY = 'IUserRepository'