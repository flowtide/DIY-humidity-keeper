export interface IUser {
    id: string
    userId: string
    password: string
    name: string
    email: string
    created: Date
    isAdmin: boolean
}

class User implements IUser {

    public id: string
    public userId: string
    public name: string
    public email: string
    public created: Date
    public password: string
    public isAdmin: boolean

    constructor(user: null | IUser) {
        if (user === null) {
            this.id = ''
            this.userId = ''
            this.name = ''
            this.email = ''
            this.created = new Date()
            this.password = ''
            this.isAdmin = false
        } else {
            this.id = user.id
            this.userId = user.userId
            this.name = user.name
            this.email = user.email
            this.created = user.created
            this.password = user.password
            this.isAdmin = user.isAdmin
        }
    }
}

export default User;
