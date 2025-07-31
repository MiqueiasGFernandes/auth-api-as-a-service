import { faker } from "@faker-js/faker/.";
import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import * as supertest from "supertest";
import type { QueryBuilder } from "typeorm";
import { AppModule } from "../src/application/application.module";
import { TestDatabaseConnection } from "./fixtures/test-database-connection";

describe("/signup", () => {
	let app: INestApplication;
	let databaseTestConnection: TestDatabaseConnection;
	let queryBuilder: QueryBuilder<unknown>;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		databaseTestConnection = new TestDatabaseConnection();
		await databaseTestConnection.connect();
		queryBuilder = databaseTestConnection.makeQueryBuilder();
	});

	describe("[POST] /signup", () => {
		test("WHEN user is creating with strongless password. SHOULD returns error code 400", async () => {
			const body = {
				username: faker.internet.username(),
				password: faker.internet.password(),
			};

			const response = await supertest(app).post("/signup").send(body);

			const hasCreatedUser =
				(await queryBuilder
					.select("*")
					.where({
						username: body.username,
					})
					.getCount()) > 0;

			expect(response.statusCode).toBe(400);
			expect(response.body).toHaveProperty("success", false);
			expect(response.body).toHaveProperty("success", false);
			expect(response.body).toHaveProperty("code", 400);
			expect(response.body).toHaveProperty("code", 400);
			expect(hasCreatedUser).toBeFalsy();
			expect(response.body).not.toHaveProperty(
				"error",
				"Your password must contain upper and lower case characters, numbers and symbols",
			);
		});
		test("WHEN username has an invalid pattern by field type EMAIL. SHOULD returns error code 419 ", () => { });
		test("WHEN username has an invalid pattern by field type PHONE NUMBER. SHOULD returns error code 419 ", () => { });
		test("WHEN username has an invalid pattern by field type USERNAME allowed params. SHOULD returns error code 419 ", () => { });
		test("WHEN user is creating without username. SHOULD returns error code 419", () => { });
		test("WHEN user is creating without password. SHOULD returns error code 419", () => { });
		test("WHEN user with matching PHONE NUMBER already exists. SHOULD returns error code 409", () => { });
		test("WHEN user with matching USERNAME already exists. SHOULD returns error code 409", () => { });
		test("WHEN user with matching EMAIL already exists. SHOULD returns error code 409", () => { });
		test("WHEN user two users are created simulteanely. SHOULD be idempotent", () => { });
		test("WHEN user is successfully created. SHOULD exists in database", () => { });
	});
});
