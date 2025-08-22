import type { SessionTokenOutputDto, UserOutputDto } from "@application/dto";

export type ISessionTokenPort = {
    sign(user: UserOutputDto, expirationTime: string): Promise<SessionTokenOutputDto>
};

export const SESSION_TOKEN_PORT = Symbol.for("SESSION_TOKEN_PORT");
