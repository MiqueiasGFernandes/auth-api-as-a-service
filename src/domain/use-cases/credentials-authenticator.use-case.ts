import type { Result, SessionTokenOutputDto } from "@application/dto";

export interface ICredentialsAuthenticatorUseCase {
    execute(username: string, password: string): Promise<Result<SessionTokenOutputDto>>
}

export const CREDENTIALS_AUTHENTICATOR_USE_CASE =
    "CREDENTIALS_AUTHENTICATOR_USE_CASE";
