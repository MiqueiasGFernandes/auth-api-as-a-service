export interface IPasswordEncryptorPort {
    encrypt(value: string): Promise<string>
    compare(value1: string, value2: string): Promise<boolean>
}

export const PASSWORD_ENCRYPTATOR_PORT = 'PASSWORD_ENCRYPTATOR_PORT'