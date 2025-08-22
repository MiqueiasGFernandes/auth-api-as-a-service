export interface IVaultFetcherGateway {
    getSecret<T>(id: string): Promise<T>
}

export const VAULT_FETCHER_GATEWAY = "VAULT_FETCHER_GATEWAY"