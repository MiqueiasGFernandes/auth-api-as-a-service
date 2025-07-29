import type { UserInputDto, UserOutputDto } from "@application/dto";

export interface IUserRepository {
    countBy(where: Partial<UserInputDto>): Promise<number>
    create(data: UserInputDto): Promise<UserOutputDto>
}

export const USER_REPOSITORYU = 'IUserRepository'