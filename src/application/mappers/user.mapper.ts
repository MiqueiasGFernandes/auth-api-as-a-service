import type { UserInputDto } from "@application/dto";
import { UserEntity } from "@domain/entities";
import type { TypeOrmUserModel } from "@infra/models";

export class UserMapper {
    static toDomain(userDto: UserInputDto): UserEntity {
        const entity = new UserEntity(
            userDto.username,
            userDto.password,
        )

        return entity;
    }

    static toModel(userDto: UserInputDto): TypeOrmUserModel {
        return {
            password: userDto.password,
            username: userDto.username,
        }
    }
}