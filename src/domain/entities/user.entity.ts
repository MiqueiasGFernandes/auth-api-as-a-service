export type FieldType = "username" | "email" | "phone"

export class UserEntity {
    constructor(
        private username: string,
        private readonly password: string
    ) { }

    private isValidPlainUsername(): boolean {
        const hasNotUpperCase = /A-Z/.test(this.username);
        const hasNotEmptySpaces = /\s/.test(this.username)

        return hasNotUpperCase && hasNotEmptySpaces
    }

    private isValidEmail(): boolean {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const hasValidEmail = emailRegex.test(this.username);
        const emailProvider = this.username.split("@")[1];
        const dennyListEmails = ['@email.org']

        const isAllowedProvider = !dennyListEmails.find(item => item === emailProvider)

        return hasValidEmail && isAllowedProvider
    }

    private parsePhoneNumber(): string {
        return (this.username[0] === '+') ? this.username : `+${this.username}`
    }

    private isValidPhoneNumber(): boolean {
        this.username = this.parsePhoneNumber()

        const phoneRegex = /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,3}\)?[\s-]?)?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,4}$/;
        const isValidPhoneNumber = phoneRegex.test(this.username);
        return isValidPhoneNumber
    }

    isValidUsernameByFieldType(fieldType: FieldType): boolean {
        const validatorsByContext: Record<FieldType, () => boolean> = {
            email: this.isValidEmail.bind(this),
            phone: this.isValidPhoneNumber.bind(this),
            username: this.isValidPlainUsername.bind(this)
        }

        return validatorsByContext[fieldType]()
    }

    isStrongPassword(): boolean {
        const hasUppercase = /[A-Z]/.test(this.password);
        const hasNumbers = /[0-9]/.test(this.password);
        const hasLowercase = /[a-z]/.test(this.password);
        const hasSymbols = /[^A-Za-z0-9\s]/.test(this.password);

        return hasLowercase && hasUppercase && hasNumbers && hasSymbols;
    }
}