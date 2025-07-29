import type { HttpStatus } from "@nestjs/common";

export type Result<T> = {
    success: boolean;
    error?: string;
    data?: T;
    code: HttpStatus;
};
