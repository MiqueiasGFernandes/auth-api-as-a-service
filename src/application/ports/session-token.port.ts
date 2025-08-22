import type { SessionTokenOutputDto } from "@application/dto";
import type { UserEntity } from "@domain/entities";

export type ISessionTokenPort = {
    sign(
        user: UserEntity,
        expirationTime: string,
    ): Promise<SessionTokenOutputDto>;
};

export const SESSION_TOKEN_PORT = Symbol.for("SESSION_TOKEN_PORT");
