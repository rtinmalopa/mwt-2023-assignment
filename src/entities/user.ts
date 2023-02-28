import { Group } from "./group";

export class User {

    static clone(user: User): User {
        return new User(user.name, 
                        user.email, 
                        user.id, 
                        user.lastLogin, 
                        user.password,
                        user.active,
                        user.groups?.map(group => Group.clone(group)));
    }

    constructor(
        public name: string,
        public email: string,
        public id?: number,
        public lastLogin?: Date,
        public password: string | undefined = '',
        public active: boolean | undefined = true,
        public groups: Group[] | undefined = []
    ){}

    toString():string {
        return `name: ${this.name}, email:${this.email}, id: ${this.id}, last login: ${this.lastLogin}`;
    }
}