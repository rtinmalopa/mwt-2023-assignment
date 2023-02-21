export class User {
    constructor(
        public name: string,
        public email: string,
        public id?: number,
        public lastLogin?: Date,
        public password: string = ''
    ){}

    toString():string {
        return `name: ${this.name}, email:${this.email}, id: ${this.id}, last login: ${this.lastLogin}`;
    }
}