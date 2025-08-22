import * as path from "node:path";
import { config } from "dotenv";

function loadEnvs() {
    const { error } = config({
        path: path.resolve(process.cwd(), ".env.test"),
        debug: false,
    });

    if (error) {
        throw new Error(error.message);
    }
}

loadEnvs();
