import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export interface UserData {
    username?: string | undefined,
    age?: number | undefined,
    hobbies?: string[] | undefined,
}

interface IdentifiedUser extends UserData {
    id: string,
}

export class Users {
    private users: IdentifiedUser[];

    constructor() {
        this.users = [];
    }

    // ------- PRIVATE

    private checkUserId(userId: string) {
        if (!uuidValidate(userId))
            throw new Error('userId is not valid');
    }

    private checkUserData(user: UserData) {
        if (!user)
            throw new Error('Cannot add undefined user');
        if (!user.username?.length)
            throw new Error('Cannot add user: userUsername is not defined');
        if (!user.hobbies?.length)
            throw new Error('Cannot add user: user hobbies are not defined');
        if (!user.age || user.age < 0)
            throw new Error('Cannot add user: user age is not defined or wrong (< 0)');
    }

    private getUserIndex(userId: string) {
        this.checkUserId(userId);
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex < 0)
            throw new Error(`User with id = ${userId} not found`);
        return userIndex;
    }

    // ------- PUBLIC

    public addUser(user: UserData): string {
        this.checkUserData(user);
        const userId: string = uuidv4();
        this.users.push({
            id: userId,
            ...user,
        });
        return userId;
    }

    public modUser(userId: string, user: UserData) {
        const userIndex = this.getUserIndex(userId);
        const newUserInfo = {
            ...this.users[userIndex],
            ...user,
        };
        this.checkUserData(newUserInfo);
        this.users[userIndex] = newUserInfo;
    }

    public delUser(userId: string) {
        const userIndex = this.getUserIndex(userId);
        this.users.splice(userIndex, 1);
    }

    public getUsersNumber() {
        return this.users.length;
    }

    public getAllUsers() {
        return this.users;
    }

    public getUserById(userId: string): IdentifiedUser | undefined {
        return this.users.find(user => user.id === userId);
    }
}
