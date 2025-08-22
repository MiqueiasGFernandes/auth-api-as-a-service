import type { SessionTokenOutputDto } from "@application/dto";
import type { SessionTokenEntity } from "@domain/entities";

export class SessionTokenMapper {
    static fromDomainToOutputDto(entity: SessionTokenEntity): SessionTokenOutputDto {
        return {
            access_token: entity.accessToken
        };
    }
}
