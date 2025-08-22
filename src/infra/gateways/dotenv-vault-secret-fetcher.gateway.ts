import type { IVaultFetcherGateway } from "@application/gateways";
import { Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <adapter>
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DotenvVaultSecretFetchergateway implements IVaultFetcherGateway {
    constructor(private readonly configService: ConfigService) { }

    getSecret<T>(id: string): Promise<T> {
        return this.configService.getOrThrow(id)
    }
}
