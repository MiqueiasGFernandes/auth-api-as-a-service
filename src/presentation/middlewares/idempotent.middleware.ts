import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, type NestMiddleware } from "@nestjs/common";
import type { Cache } from "cache-manager";
import type { NextFunction, Request, Response } from "express";

export class IdempotentMiddleware implements NestMiddleware {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) { }

    async use(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const idempotentMethods = ['POST', 'PUT', 'PATCH']

        const isCurrentIdempotentMethod = idempotentMethods.includes(request.method.toUpperCase())

        const idempotentKey = request.header("X-Idempotent-key");

        if (isCurrentIdempotentMethod) {
            const previousDuplicatedRequest = await this.cacheManager.get(idempotentKey);

            if (previousDuplicatedRequest) {
                return response.send(previousDuplicatedRequest)
            }

            await this.cacheManager.set(idempotentKey, request.body)
        }

        return next();
    }
}
