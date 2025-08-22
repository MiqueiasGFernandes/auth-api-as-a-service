import type { SessionTokenEntity, UserEntity } from "@domain/entities";

export type ISessionTokenPort = {
    sign(
        user: UserEntity,
        expirationTime: string,
    ): Promise<SessionTokenEntity>;
};

export const SESSION_TOKEN_PORT = Symbol.for("SESSION_TOKEN_PORT");
