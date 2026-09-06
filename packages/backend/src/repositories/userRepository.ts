import { type IUserDocument, User } from "../models/user.js";

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export interface IUserRepository {
  findActiveByEmail(email: string): Promise<IUserDocument | null>;
  findByEmail(email: string): Promise<IUserDocument | null>;
  create(data: CreateUserData): Promise<IUserDocument>;
}

export const userRepository: IUserRepository = {
  async findActiveByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email: email.toLowerCase(), active: true }).exec();
  },

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email: email.toLowerCase() }).exec();
  },

  async create(data: CreateUserData): Promise<IUserDocument> {
    return User.create(data);
  },
};
