import type { UserInputDto, UserOutputDto } from "@application/dto";

export interface IAddUserUseCase {
    execute(input: UserInputDto): Promise<UserOutputDto>;
}
