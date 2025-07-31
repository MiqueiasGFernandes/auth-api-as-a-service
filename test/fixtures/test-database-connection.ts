import * as path from "node:path";
import { config } from "dotenv";
import { DataSource, type QueryBuilder } from "typeorm";

export class TestDatabaseConnection {
    private dataSource: DataSource;

    async connect(): Promise<DataSource> {
        const { error } = config({
            path: path.resolve(process.cwd(), ".env.test"),
            debug: true,
        });

        if (error) {
            throw new Error(error.message)
        }

        this.dataSource = new DataSource({
            type: "postgres",
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [],
        });

        await this.dataSource.initialize();

        return this.dataSource;
    }

    async disconenct(): Promise<void> {
        this.dataSource.destroy();
    }

    makeQueryBuilder(): QueryBuilder<unknown> {
        return this.dataSource.createQueryBuilder();
    }
}
