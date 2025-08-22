import type { SessionTokenOutputDto, UserOutputDto } from "@application/dto";
import {
    type IVaultFetcherGateway,
    VAULT_FETCHER_GATEWAY,
} from "@application/gateways";
import type { ISessionTokenPort } from "@application/ports";
import { Inject, Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <adapter>
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtTokenServiceAdapter implements ISessionTokenPort {
    constructor(
        private readonly jwt: JwtService,
        @Inject(VAULT_FETCHER_GATEWAY)
        private readonly vaultFetcherGateway: IVaultFetcherGateway,
    ) { }
    async sign(
        user: UserOutputDto,
        expirationTime: string,
    ): Promise<SessionTokenOutputDto> {
        const secret = await this.vaultFetcherGateway.getSecret<string>('APP_SECRET');

        const accessToken = await this.jwt.signAsync(
            {
                sub: user.id,
            },
            {
                expiresIn: expirationTime,
                secret,
            },
        );

        return {
            access_token: accessToken,
        };
    }
}
