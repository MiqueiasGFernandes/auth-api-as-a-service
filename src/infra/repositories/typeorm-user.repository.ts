import { UserMapper } from "@application/mappers";
import type { IUserRepository } from "@application/repositories";
import type { UserEntity } from "@domain/entities";
import { TypeOrmUserModel } from "@infra/models";
import { Inject, Injectable } from "@nestjs/common";
import { getDataSourceToken } from "@nestjs/typeorm";
import type { DataSource } from "typeorm";

@Injectable()
export class TypeOrmuUserRepository implements IUserRepository {
    constructor(
        @Inject(getDataSourceToken()) private readonly dataSource: DataSource,
    ) { }

    async findOneBy(where: Partial<UserEntity>): Promise<UserEntity | null> {
        const user = await this.dataSource
            .createQueryBuilder(TypeOrmUserModel, "users")
            .where(where)
            .getOne();

        if (!user) {
            return null;
        }

        return UserMapper.fromModelToDomain(user);
    }

    async countBy(where: Partial<UserEntity>): Promise<number> {
        const count = await this.dataSource
            .createQueryBuilder(TypeOrmUserModel, "users")
            .where(where)
            .getCount();

        return count;
    }

    async create(userEntity: UserEntity): Promise<UserEntity> {
        const data = UserMapper.fromDomainToModel(userEntity)

        const result = await this.dataSource
            .createQueryBuilder(TypeOrmUserModel, "users")
            .insert()
            .into(TypeOrmUserModel)
            .values(data)
            .returning(`
                "id",
                "username",
                "password",
                "created_at" as "createdAt",
                "updated_at" as "updatedAt"
            `)
            .execute();

        const user: TypeOrmUserModel = result.raw[0];

        return UserMapper.fromModelToDomain(user)
    }
}
