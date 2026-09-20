import mongoose, { type Document, Schema } from "mongoose";

export interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  active: boolean;
  createdAt: Date;
  photoKey?: string;
}

export interface IUserDocument extends IUser, Document {
  id: string;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    photoKey: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = (ret._id as mongoose.Types.ObjectId).toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.photoKey;
        return ret;
      },
    },
  },
);

userSchema.virtual("id").get(function () {
  return this._id.toString();
});

export const User = mongoose.model<IUserDocument>("User", userSchema);
