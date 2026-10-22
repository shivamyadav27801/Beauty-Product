import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHeroSlide extends Document {
  badge?: string; // e.g. "NEW IN"
  title: string; // e.g. "Radiant Skin.\nReal Confidence."
  description: string; // e.g. "Clean beauty that nourishes, enhances and empowers you."
  buttonText: string; // e.g. "SHOP NOW"
  buttonUrl: string; // e.g. "/shop"
  image: string; // e.g. "/images/hero/hero-slide-1.jpg"
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    badge: { type: String, default: "NEW IN" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    buttonText: { type: String, default: "SHOP NOW" },
    buttonUrl: { type: String, default: "/shop" },
    image: { type: String, required: true },
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const HeroSlide: Model<IHeroSlide> =
  mongoose.models.HeroSlide || mongoose.model<IHeroSlide>("HeroSlide", HeroSlideSchema);
