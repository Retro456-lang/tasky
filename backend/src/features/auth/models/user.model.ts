import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'Superadmin' | 'Manager' | 'Employee';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['Superadmin', 'Manager', 'Employee'],
      required: true,
      default: 'Employee',
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
