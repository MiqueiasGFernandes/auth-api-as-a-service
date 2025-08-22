import type { UserInputDto, UserOutputDto } from "@application/dto";
import { UserEntity } from "@domain/entities";
import type { TypeOrmUserModel } from "@infra/models";

export class UserMapper {
    static fromInputDtoToDomain(userDto: UserInputDto): UserEntity {
        const entity = new UserEntity({
            username: userDto.username,
            plainPassword: userDto.password,
        })

        return entity;
    }

    static fromDomainToModel(entity: UserEntity): TypeOrmUserModel {
        return {
            username: entity.username,
            password: entity.encryptedPassword,
        }
    }

    static fromModelToDomain(model: TypeOrmUserModel): UserEntity {
        return new UserEntity({
            id: model.id,
            username: model.username,
            encryptedPassword: model.password,
            updatedAt: model.updatedAt,
            createdAt: model.createdAt
        })
    }

    static fromDomainToOutputDto(model: UserEntity): UserOutputDto {
        return {
            id: model.id,
            username: model.username,
            created_at: model.createdAt,
            updated_at: model.updatedAt
        }
    }
}