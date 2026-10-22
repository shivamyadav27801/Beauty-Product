import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSetting extends Document {
  brandName: string;
  logoText: string;
  tagline: string;
  announcementBar: {
    enabled: boolean;
    text: string;
    code: string;
    discountPercent: number;
    threshold: number;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    businessHours: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    pinterest: string;
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingFee: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    brandName: { type: String, default: "Velvetique Beauty" },
    logoText: { type: String, default: "VELVETIQUE BEAUTY" },
    tagline: { type: String, default: "Thoughtful beauty for every skin, every day." },
    announcementBar: {
      enabled: { type: Boolean, default: true },
      text: {
        type: String,
        default: "Free Shipping on orders over ₹999 | Use code: GLOW15 for 15% OFF",
      },
      code: { type: String, default: "GLOW15" },
      discountPercent: { type: Number, default: 15 },
      threshold: { type: Number, default: 999 },
    },
    contactInfo: {
      email: { type: String, default: "care@velvetiquebeauty.com" },
      phone: { type: String, default: "+91 98765 43210" },
      address: { type: String, default: "Velvetique Studio, 4th Avenue, Indiranagar, Bengaluru, India" },
      businessHours: { type: String, default: "Mon - Sat: 9:00 AM - 7:00 PM IST" },
    },
    socialLinks: {
      facebook: { type: String, default: "https://facebook.com/velvetiquebeauty" },
      instagram: { type: String, default: "https://instagram.com/velvetiquebeauty" },
      youtube: { type: String, default: "https://youtube.com/velvetiquebeauty" },
      pinterest: { type: String, default: "https://pinterest.com/velvetiquebeauty" },
    },
    shipping: {
      freeShippingThreshold: { type: Number, default: 999 },
      standardShippingFee: { type: Number, default: 99 },
    },
  },
  { timestamps: true }
);

export const SiteSetting: Model<ISiteSetting> =
  mongoose.models.SiteSetting ||
  mongoose.model<ISiteSetting>("SiteSetting", SiteSettingSchema);
