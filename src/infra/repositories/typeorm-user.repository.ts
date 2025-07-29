import type { UserInputDto, UserOutputDto } from "@application/dto";
import type { IUserRepository } from "@application/repositories";
import { Inject, Injectable } from "@nestjs/common";
import { getDataSourceToken } from "@nestjs/typeorm";
import type { DataSource, SelectQueryBuilder } from "typeorm";

@Injectable()
export class TypeOrmuUserRepository implements IUserRepository {
    private readonly queryBuilder: SelectQueryBuilder<unknown>

    constructor(
        @Inject(getDataSourceToken()) private readonly dataSource: DataSource
    ) {
        this.queryBuilder = this.dataSource.createQueryBuilder()
    }

    async countBy(where: Partial<UserInputDto>): Promise<number> {
        const count = await this.queryBuilder
            .select('id')
            .from('users', 'user')
            .where(where)
            .getCount()

        return count;
    }

    async create(data: UserInputDto): Promise<UserOutputDto> {
        const newUser = await this.queryBuilder
            .insert()
            .into('users', Object.keys(data))
            .values(data)
            .returning("*")
            .execute()

        return newUser.raw[0];
    }
}
