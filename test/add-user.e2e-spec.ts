import { SETTINGS_FETCH_GATEWAY } from "@application/gateways";
import { BootstrapModule } from "@bootstrap/bootstrap.module";
import { faker } from "@faker-js/faker";
import { TypeOrmUserModel } from "@infra/models";
import { type INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { HttpExceptionFilter } from "@presentation/filters/exception.filter";
import { ResultInterceptor } from "@presentation/interceptors/response.interceptor";
import * as supertest from "supertest";
import { DataSource, type QueryBuilder } from "typeorm";
import { SettingsFetchGatewayStub } from "./stub/settings-fetch-gateway.stub";

describe("/signup", () => {
	let app: INestApplication;
	let dataSource: DataSource;
	let queryBuilder: QueryBuilder<unknown>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [BootstrapModule],
		}).compile();

		app = moduleFixture.createNestApplication();

		app.useGlobalFilters(new HttpExceptionFilter());
		app.useGlobalInterceptors(new ResultInterceptor());
		app.useGlobalPipes(new ValidationPipe({
		}));

		await app.init();
	});

	afterEach(async () => {
		await app.close();
		jest.clearAllMocks();
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
	});
	afterAll(async () => {
		queryBuilder = dataSource.createQueryBuilder<TypeOrmUserModel>(
			TypeOrmUserModel,
			"user",
		);

		await queryBuilder.delete().where("1=1").execute();

		await dataSource.destroy();
	});

	describe("[POST] /signup", () => {
		describe("WITH password validation", () => {
			test("WHEN user is creating with strongless password. SHOULD returns error code 400", async () => {
				const body = {
					username: faker.internet.email(),
					password: faker.word.noun(),
				};

				const response = await supertest(app.getHttpServer())
					.post("/signup")
					.send(body);

				queryBuilder = dataSource.createQueryBuilder<TypeOrmUserModel>(
					TypeOrmUserModel,
					"user",
				);
				const hasCreatedUser =
					(await queryBuilder
						.select("*")
						.where({
							username: body.username,
						})
						.getCount()) > 0;

				expect(response.body).toHaveProperty(
					"error",
					"Your password must contain upper and lower case characters, numbers and symbols",
				);
				expect(response.statusCode).toBe(400);
				expect(response.body).toHaveProperty("success", false);
				expect(response.body).toHaveProperty("code", 400);
				expect(hasCreatedUser).toBeFalsy();
			});
		});
		describe("WITH field type validation", () => {
			test.each([
				{
					field: "email",
					fakerGenerator: faker.internet.username(),
				},
				{
					field: "username",
					fakerGenerator: faker.person.fullName(),
				},
				{
					field: "phone",
					fakerGenerator: String(faker.number.int({
						max: 99,
					})),
				},
			])(
				"WHEN $field has an invalid pattern by field type EMAIL. SHOULD returns error code 422 ",
				async ({ field, fakerGenerator }) => {
					const moduleFixture: TestingModule = await Test.createTestingModule({
						imports: [BootstrapModule],
					})
						.overrideProvider(SETTINGS_FETCH_GATEWAY)
						.useValue(
							new SettingsFetchGatewayStub({
								AUTHENTICATION: {
									USERNAME_FIELD_TYPE: field,
								},
							}),
						)
						.compile();

					app = moduleFixture.createNestApplication();

					app.useGlobalFilters(new HttpExceptionFilter());
					app.useGlobalInterceptors(new ResultInterceptor());
					app.useGlobalPipes(new ValidationPipe({

					}));

					await app.init();

					const body = {
						username: fakerGenerator,
						password: faker.internet.password({
							length: 12,
							prefix: "@1",
							pattern: /[A-Za-z0-9]/,
						}),
					};

					const response = await supertest(app.getHttpServer())
						.post("/signup")
						.send(body);

					queryBuilder = dataSource.createQueryBuilder<TypeOrmUserModel>(
						TypeOrmUserModel,
						"user",
					);
					const hasCreatedUser =
						(await queryBuilder
							.select("*")
							.where({
								username: body.username,
							})
							.getCount()) > 0;

					expect(response.body).toHaveProperty(
						"error",
						`Your ${field} is invalid`,
					);
					expect(response.statusCode).toBe(422);
					expect(response.body).toHaveProperty("success", false);
					expect(response.body).toHaveProperty("code", 422);
					expect(hasCreatedUser).toBeFalsy();
				},
			);
		});
		describe("WITH resource conflict", () => {
			test.each([
				{
					field: "email",
					value: "fulano@gmail.com",
				},
				{
					field: "username",
					value: "foobaar",
				},
				{
					field: "phone",
					value: "+5511999999999",
				},
			])(
				"WHEN user with matching PHONE NUMBER already exists. SHOULD returns error code 409",
				async ({ field, value }) => {
					queryBuilder = dataSource.createQueryBuilder<TypeOrmUserModel>(
						TypeOrmUserModel,
						"user",
					);

					await queryBuilder
						.insert()
						.into(TypeOrmUserModel)
						.values({
							username: value,
							password: faker.internet.password(),
						})
						.execute();

					const moduleFixture: TestingModule = await Test.createTestingModule({
						imports: [BootstrapModule],
					})
						.overrideProvider(SETTINGS_FETCH_GATEWAY)
						.useValue(
							new SettingsFetchGatewayStub({
								AUTHENTICATION: {
									USERNAME_FIELD_TYPE: field,
								},
							}),
						)
						.compile();

					app = moduleFixture.createNestApplication();

					app.useGlobalFilters(new HttpExceptionFilter());
					app.useGlobalInterceptors(new ResultInterceptor());
					app.useGlobalPipes(new ValidationPipe({

					}));

					await app.init();

					const body = {
						username: value,
						password: faker.internet.password({
							length: 12,
							prefix: "@1",
							pattern: /[A-Za-z0-9]/,
						}),
					};

					const response = await supertest(app.getHttpServer())
						.post("/signup")
						.send(body);

					expect(response.body).toHaveProperty(
						"error",
						`User ${value} already exists`,
					);
					expect(response.statusCode).toBe(409);
					expect(response.body).toHaveProperty("success", false);
					expect(response.body).toHaveProperty("code", 409);
				},
			);
		});
		describe("WITH input validation", () => {
			test.each([
				{
					field: "username",
				},
				{
					field: "password",
				},
			])(
				"WHEN user is creating without $field string. SHOULD returns error code 422",
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
						.post("/signup")
						.send(body);

					expect(response.body).toHaveProperty(
						"error",
						[`${field} should not be empty`, `${field} must be a string`]
					);
					expect(response.statusCode).toBe(422);
					expect(response.body).toHaveProperty("success", false);
					expect(response.body).toHaveProperty("code", 422);
				},
			);
		});
		describe("WITH success", () => {
			test("WHEN user two users are created simulteanely. SHOULD be idempotent", async () => { });
			test("WHEN user is successfully created. SHOULD exists in database", async () => { });
		});
	});
});
