import { ADD_USER_USE_CASE, CREDENTIALS_AUTHENTICATOR_USE_CASE } from "@domain/use-cases";
import type { Provider } from "@nestjs/common";
import { RemoteAddUserUseCase, RemoteCredentialsAuthenticatorUseCase } from "./use-cases";

export const ApplicationProviders: Provider[] = [
    {
        provide: ADD_USER_USE_CASE,
        useClass: RemoteAddUserUseCase,
    },
    {
        provide: CREDENTIALS_AUTHENTICATOR_USE_CASE,
        useClass: RemoteCredentialsAuthenticatorUseCase
    }
];
