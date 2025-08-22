import {
    type IPasswordEncryptorPort,
    PASSWORD_ENCRYPTATOR_PORT,
} from "@application/ports";
import { BootstrapModule } from "@bootstrap/bootstrap.module";
import { faker } from "@faker-js/faker";
import { TypeOrmUserModel } from "@infra/models";
import { type INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { HttpExceptionFilter } from "@presentation/filters/exception.filter";
import { ResultInterceptor } from "@presentation/interceptors/response.interceptor";
import * as supertest from "supertest";
import { DataSource, type QueryBuilder } from "typeorm";

describe("/signin", () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let queryBuilder: QueryBuilder<unknown>;
    let passwordEncryptationPort: IPasswordEncryptorPort;
    let moduleFixture: TestingModule;

    beforeEach(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [BootstrapModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalFilters(new HttpExceptionFilter());
        app.useGlobalInterceptors(new ResultInterceptor());
        app.useGlobalPipes(new ValidationPipe());

        await app.init();

        passwordEncryptationPort = await moduleFixture.resolve(
            PASSWORD_ENCRYPTATOR_PORT,
        );
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllMocks();

        await queryBuilder.delete().where("1=1").execute();
    });

    beforeAll(async () => {
        dataSource = new DataSource({
            type: "postgres",
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [TypeOrmUserModel],
            synchronize: true,
        });

        await dataSource.initialize();

        queryBuilder = dataSource.createQueryBuilder<TypeOrmUserModel>(
            TypeOrmUserModel,
            "user",
        );
    });
    afterAll(async () => {
        await dataSource.destroy();
    });

    describe("[POST] /signin", () => {
        test.each([
            {
                field: "username",
            },
            {
                field: "password",
            },
        ])(
            "WHEN user is signin without $field string. SHOULD returns error code 422",
            async ({ field }) => {
                const body = {
                    username: faker.internet.email(),
                    password: faker.internet.password({
                        length: 12,
                        prefix: "@1",
                        pattern: /[A-Za-z0-9]/,
                    }),
                };

                body[field] = undefined;

                const response = await supertest(app.getHttpServer())
                    .post("/signin")
                    .send(body);

                expect(response.body).toHaveProperty("error", [
                    `${field} should not be empty`,
                    `${field} must be a string`,
                    `${field} must be shorter than or equal to 100 characters`,
                ]);
                expect(response.statusCode).toBe(422);
                expect(response.body).toHaveProperty("success", false);
                expect(response.body).toHaveProperty("code", 422);
            },
        );

        test.each([
            {
                field: "username",
                value: faker.string.alpha({ length: 101 }),
            },
            {
                field: "password",
                value: faker.internet.password({
                    length: 101,
                    prefix: "@1",
                    pattern: /[A-Za-z0-9]/,
                }),
            },
        ])(
            "WHEN user is creating with $field using invalid type. SHOULD returns error code 422",
            async ({ field }) => {
                const body = {
                    username: faker.internet.email(),
                    password: faker.internet.password({
                        length: 12,
                        prefix: "@1",
                        pattern: /[A-Za-z0-9]/,
                    }),
                };

                body[field] = 12;

                const response = await supertest(app.getHttpServer())
                    .post("/signin")
                    .send(body);

                expect(response.body).toHaveProperty("error", [
                    `${field} must be a string`,
                    `${field} must be shorter than or equal to 100 characters`,
                ]);
                expect(response.statusCode).toBe(422);
                expect(response.body).toHaveProperty("success", false);
                expect(response.body).toHaveProperty("code", 422);
            },
        );
        test("WHEN user with matching username does not exists. SHOULD returns error code 401", async () => {
            const body = {
                username: faker.internet.email(),
                password: faker.internet.password({
                    length: 12,
                    prefix: "@1",
                    pattern: /[A-Za-z0-9]/,
                }),
            };

            const response = await supertest(app.getHttpServer())
                .post("/signin")
                .send(body);

            expect(response.body).toHaveProperty(
                "error",
                "Invalid username or password",
            );
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("code", 401);
        });
        test("WHEN password is incorrect. SHOULD returns error code 401", async () => {
            const validUserBody = {
                username: faker.internet.email(),
                password: await passwordEncryptationPort.encrypt(faker.internet.password({
                    length: 12,
                    prefix: "@1M",
                    pattern: /[A-Za-z0-9]/,
                })),
            };

            await queryBuilder
                .insert()
                .into(TypeOrmUserModel)
                .values({
                    username: validUserBody.username,
                    password: faker.internet.password(),
                })
                .execute();

            const body = {
                username: validUserBody.username,
                password: faker.internet.password({
                    length: 12,
                    prefix: "@1",
                    pattern: /[A-Za-z0-9]/,
                }),
            };

            const response = await supertest(app.getHttpServer())
                .post("/signin")
                .send(body);

            expect(response.body).toHaveProperty(
                "error",
                "Invalid username or password",
            );
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("code", 401);
        });
        test("WHEN user is successfully logged in. SHOULD returns 201", async () => {
            const validUserBody = {
                username: faker.internet.email(),
                password: faker.internet.password({
                    length: 12,
                    prefix: "@1M",
                    pattern: /[A-Za-z0-9]/,
                }),
            };

            await queryBuilder
                .insert()
                .into(TypeOrmUserModel)
                .values({
                    username: validUserBody.username,
                    password: await passwordEncryptationPort.encrypt(validUserBody.password)
                })
                .execute();

            const response = await supertest(app.getHttpServer())
                .post("/signin")
                .send(validUserBody);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body).toHaveProperty("code", 201);
            expect(response.body.data).toHaveProperty("access_token");
            expect(response.body.data.access_token.split(".")).toHaveLength(3)
        });
        test("WHEN user requests login twice. SHOULD be idempotent", async () => {
            const validUserBody = {
                username: faker.internet.email(),
                password: faker.internet.password({
                    length: 12,
                    prefix: "@1M",
                    pattern: /[A-Za-z0-9]/,
                }),
            };

            await queryBuilder
                .insert()
                .into(TypeOrmUserModel)
                .values({
                    username: validUserBody.username,
                    password: await passwordEncryptationPort.encrypt(validUserBody.password)
                })
                .execute();

            const idempotentKeyValue = faker.string.uuid();

            const response = await supertest(app.getHttpServer())
                .post("/signin")
                .set("X-Idempotent-Key", idempotentKeyValue)
                .send(validUserBody);

            await supertest(app.getHttpServer())
                .post("/signin")
                .set("X-Idempotent-Key", idempotentKeyValue)
                .send(validUserBody);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body).toHaveProperty("code", 201);
            expect(response.body.data).toHaveProperty("access_token");
            expect(response.body.data.access_token.split(".")).toHaveLength(3)
        });
    });
});
