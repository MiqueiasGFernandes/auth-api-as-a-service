import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { AppModule } from "src/application/application.module";

describe("/signup", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	describe("[POST] /signup", () => {
		test("WHEN user is creating with strongless password. SHOULD returns error code 400", () => { });
		test("WHEN username has an invalid pattern by field type EMAIL. SHOULD returns error code 419 ", () => { });
		test("WHEN username has an invalid pattern by field type PHONE NUMBER. SHOULD returns error code 419 ", () => { });
		test("WHEN username has an invalid pattern by field type USERNAME allowed params. SHOULD returns error code 419 ", () => { });
		test("WHEN user is creating without username. SHOULD returns error code 419", () => { });
		test("WHEN user is creating without password. SHOULD returns error code 419", () => { });
		test("WHEN user is successfully created. SHOULD exists in database", () => { });
	});
});
