import type { ISettingsFetcherGateway } from "@application/gateways";
import { settings } from "@config/settings";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LocalSettingsFetcherGateway implements ISettingsFetcherGateway {
    get<T>(path: string): Promise<T> {
        const [context, setting] = path.split(".")

        const output: T = settings[context][setting] as T

        return Promise.resolve(output)
    }
}
