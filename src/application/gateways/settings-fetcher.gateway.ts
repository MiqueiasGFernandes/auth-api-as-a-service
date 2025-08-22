export interface ISettingsFetcherGateway {
    get<T>(path: string): Promise<T>
}

export const SETTINGS_FETCH_GATEWAY = 'ISettingsFetcherGateway'