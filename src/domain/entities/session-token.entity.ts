export class SessionTokenEntity {
    public accessToken: string

    constructor(
        attributes: Partial<SessionTokenEntity>
    ) {
        Object.assign(this, attributes)
    }
}