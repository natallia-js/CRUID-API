import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import Lock from "@classes/lock";
import { UserError, USER_ERROR_CODES } from "./errors/userErrors";

export interface UserData {
  username?: string | undefined;
  age?: number | undefined;
  hobbies?: string[] | undefined;
}

export interface IdentifiedUser extends UserData {
  id: string;
}

export class Users {
  private static _users: IdentifiedUser[] = [];
  private static _shared: boolean = false;
  private static _lock: Lock = new Lock();

  // ------- PRIVATE

  private static checkUserData(user: UserData) {
    if (!user)
      throw new UserError(
        USER_ERROR_CODES.wrongUserData,
        "User object is undefined",
      );
    if (!user.username?.length)
      throw new UserError(
        USER_ERROR_CODES.wrongUserData,
        "Username is not defined",
      );
    if (!user.hobbies?.length)
      throw new UserError(
        USER_ERROR_CODES.wrongUserData,
        "User hobbies are not defined",
      );
    if (!user.age || user.age < 0)
      throw new UserError(
        USER_ERROR_CODES.wrongUserData,
        "User age is not defined or wrong (< 0)",
      );
  }

  private static getUserIndex(userId: string) {
    Users.checkUserId(userId);
    const userIndex = Users._users.findIndex((user) => user.id === userId);
    if (userIndex < 0)
      throw new UserError(
        USER_ERROR_CODES.userNotFound,
        `User with id = ${userId} not found`,
      );
    return userIndex;
  }

  // ------- PUBLIC

  public static setShared() {
    Users._shared = true;
  }

  public static checkUserId(userId: string) {
    if (!uuidValidate(userId))
      throw new UserError(
        USER_ERROR_CODES.wrongUserData,
        "User ID is not valid",
      );
  }

  public static async addUser(user: UserData): Promise<IdentifiedUser> {
    if (Users._shared) await Users._lock.acquire();
    try {
      Users.checkUserData(user);
      const userId: string = uuidv4();
      const newUser = {
        id: userId,
        ...user,
      };
      Users._users.push(newUser);
      return newUser;
    } finally {
      if (Users._shared) Users._lock.release();
    }
  }

  public static async modUser(
    userId: string,
    user: UserData,
  ): Promise<IdentifiedUser> {
    if (Users._shared) await Users._lock.acquire();
    try {
      const userIndex = Users.getUserIndex(userId);
      const newUserInfo = {
        ...Users._users[userIndex],
        ...user,
      };
      Users.checkUserData(newUserInfo);
      Users._users[userIndex] = newUserInfo;
      return newUserInfo;
    } finally {
      if (Users._shared) Users._lock.release();
    }
  }

  public static async delUser(userId: string) {
    if (Users._shared) await Users._lock.acquire();
    try {
      const userIndex = Users.getUserIndex(userId);
      Users._users.splice(userIndex, 1);
    } finally {
      if (Users._shared) Users._lock.release();
    }
  }

  public static async delAllUsers() {
    if (Users._shared) await Users._lock.acquire();
    try {
      Users._users = [];
    } finally {
      if (Users._shared) Users._lock.release();
    }
  }

  public static async getUsersNumber(): Promise<number> {
    if (Users._shared) await Users._lock.acquire();
    try {
      return Users._users.length;
    } finally {
      if (Users._shared) Users._lock.release();
    }
  }

  public static async getAllUsers(): Promise<IdentifiedUser[]> {
    if (Users._shared) await Users._lock.acquire();
    try {
      return Users._users;
    } finally {
      if (Users._shared) Users._lock.release();
    }
  }

  public static async getUserById(userId: string): Promise<IdentifiedUser> {
    if (Users._shared) await Users._lock.acquire();
    try {
      const userIndex = Users.getUserIndex(userId);
      return Users._users[userIndex];
    } finally {
      if (Users._shared) Users._lock.release();
    }
  }
}
