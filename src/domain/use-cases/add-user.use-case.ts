import type { Result, UserInputDto, UserOutputDto } from "@application/dto";

export interface IAddUserUseCase {
    execute(input: UserInputDto): Promise<Result<UserOutputDto>>;
}

export const ADD_USER_USE_CASE = "IAddUserUseCase"