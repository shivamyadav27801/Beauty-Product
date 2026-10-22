import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPromotion extends Document {
  badge: string; // e.g. "LIMITED TIME OFFER"
  title: string; // e.g. "Up to 30% Off\non Best Sellers"
  description: string; // e.g. "Glow more, spend less.\nTreat your skin today!"
  discountPercentage?: number;
  buttonText: string; // e.g. "SHOP THE SALE"
  buttonUrl: string; // e.g. "/shop"
  image: string; // e.g. "/images/promo/promo-banner.jpg"
  startDate?: Date;
  expiryDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromotionSchema = new Schema<IPromotion>(
  {
    badge: { type: String, default: "LIMITED TIME OFFER" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountPercentage: { type: Number, default: 30 },
    buttonText: { type: String, default: "SHOP THE SALE" },
    buttonUrl: { type: String, default: "/shop" },
    image: { type: String, required: true },
    startDate: { type: Date },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Promotion: Model<IPromotion> =
  mongoose.models.Promotion || mongoose.model<IPromotion>("Promotion", PromotionSchema);
