import type { UserInputDto, UserOutputDto } from "@application/dto";
import type { IUserRepository } from "@application/repositories";
import { TypeOrmUserModel } from "@infra/models";
import { Inject, Injectable } from "@nestjs/common";
import { getDataSourceToken } from "@nestjs/typeorm";
import type { DataSource } from "typeorm";

@Injectable()
export class TypeOrmuUserRepository implements IUserRepository {
    constructor(
        @Inject(getDataSourceToken()) private readonly dataSource: DataSource,
    ) { }

    async findOneBy(where: Partial<UserInputDto>): Promise<UserOutputDto | null> {
        const user = await this.dataSource
            .createQueryBuilder(TypeOrmUserModel, "users")
            .where(where)
            .getOne();

        if (!user) {
            return null
        }

        return {
            id: user.id,
            username: user.username,
            password: user.password,
            updated_at: user.updatedAt,
            created_at: user.createdAt,
        }
    }

    async countBy(where: Partial<UserInputDto>): Promise<number> {
        const count = await this.dataSource
            .createQueryBuilder(TypeOrmUserModel, "users")
            .where(where)
            .getCount();

        return count;
    }

    async create(data: UserInputDto): Promise<UserOutputDto> {
        const result = await this.dataSource
            .createQueryBuilder(TypeOrmUserModel, "users")
            .insert()
            .into(TypeOrmUserModel)
            .values(data)
            .returning("*")
            .execute();

        const user = result.raw[0]

        return {
            id: user.id,
            username: user.username,
            created_at: user.created_at,
            updated_at: user.updated_at,
        }
    }
}
