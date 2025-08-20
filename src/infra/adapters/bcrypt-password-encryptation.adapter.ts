import type { IPasswordEncryptorPort } from "@application/ports";
import * as bcrypt from "bcrypt";

export class BCryptPasswordEncryptationAdapter
    implements IPasswordEncryptorPort {

    async encrypt(value: string): Promise<string> {
        const saltRounds = 15;
        const hash = await bcrypt.hash(value, saltRounds)
        return hash
    }

    async compare(value1: string, value2: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(value1, value2);
        return isMatch;
    }
}
