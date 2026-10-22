import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount?: number;
  startDate?: Date;
  expiryDate?: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    discountType: { type: String, enum: ["PERCENTAGE", "FIXED"], default: "PERCENTAGE" },
    discountValue: { type: Number, required: true, min: 1 },
    minimumOrderAmount: { type: Number, default: 0 },
    maximumDiscountAmount: { type: Number },
    startDate: { type: Date },
    expiryDate: { type: Date },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
