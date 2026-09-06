import { type IUserDocument, User } from "../models/user.js";

export interface IUserRepository {
  findActiveByEmail(email: string): Promise<IUserDocument | null>;
}

export const userRepository: IUserRepository = {
  async findActiveByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email: email.toLowerCase(), active: true }).exec();
  },
};
