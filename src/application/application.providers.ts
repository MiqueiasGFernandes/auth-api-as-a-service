import { ADD_USER_USE_CASE } from "@domain/use-cases";
import type { Provider } from "@nestjs/common";
import { RemoteAddUserUseCase } from "./use-cases/remote-add-user.use-case";

export const ApplicationProviders: Provider[] = [
    {
        provide: ADD_USER_USE_CASE,
        useClass: RemoteAddUserUseCase,
    },
];
