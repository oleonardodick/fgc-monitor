import { type IUserDocument, User } from "../models/user.js";

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export interface UpdateProfileData {
  name: string;
  email: string;
  photoKey?: string;
}

export interface IUserRepository {
  findActiveByEmail(email: string): Promise<IUserDocument | null>;
  findByEmail(email: string): Promise<IUserDocument | null>;
  create(data: CreateUserData): Promise<IUserDocument>;
  findById(id: string): Promise<IUserDocument | null>;
  findByEmailExcluding(email: string, excludeId: string): Promise<IUserDocument | null>;
  updateProfile(id: string, data: UpdateProfileData): Promise<IUserDocument | null>;
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

  async findById(id: string): Promise<IUserDocument | null> {
    return User.findOne({ _id: id, active: true }).exec();
  },

  async findByEmailExcluding(email: string, excludeId: string): Promise<IUserDocument | null> {
    return User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: excludeId },
      active: true,
    }).exec();
  },

  async updateProfile(id: string, data: UpdateProfileData): Promise<IUserDocument | null> {
    const update: Record<string, unknown> = {
      name: data.name,
      email: data.email.toLowerCase(),
    };
    if (data.photoKey !== undefined) {
      update.photoKey = data.photoKey;
    }
    return User.findByIdAndUpdate(id, update, { new: true }).exec();
  },
};
