import type { ISettingsFetcherGateway } from "@application/gateways";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SettingsFetchGatewayStub implements ISettingsFetcherGateway {
    constructor(
        private settings: Record<string, Record<string, string | boolean | number>>
    ) {

    }

    get<T>(path: string): Promise<T> {
        const [context, setting] = path.split(".")

        const output: T = this.settings[context][setting] as T

        return Promise.resolve(output)
    }
}
