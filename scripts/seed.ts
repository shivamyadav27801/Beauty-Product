import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../src/models/User";
import { Category } from "../src/models/Category";
import { Product } from "../src/models/Product";
import { HeroSlide } from "../src/models/HeroSlide";
import { Promotion } from "../src/models/Promotion";
import { SiteSetting } from "../src/models/SiteSetting";
import { Coupon } from "../src/models/Coupon";
import { BlogPost } from "../src/models/BlogPost";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/velvetique_beauty";

async function seed() {
  console.log("Connecting to MongoDB for seeding...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB successfully!");

  // 1. Seed Admin User
  const existingAdmin = await User.findOne({ email: "admin@velvetiquebeauty.com" });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@Velvetique2025!", 10);
    await User.create({
      name: "Velvetique Administrator",
      email: "admin@velvetiquebeauty.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      phone: "+91 98765 43210",
      isVerified: true,
    });
    console.log("✔ Admin user created: admin@velvetiquebeauty.com / Admin@Velvetique2025!");
  } else {
    console.log("✔ Admin user already exists");
  }

  // 2. Seed Categories
  const categoriesData = [
    {
      name: "SKINCARE",
      slug: "skincare",
      description: "Hydrating cleansers, illuminating serums, and rich moisturizers for radiant skin.",
      image: "/images/categories/skincare.jpg",
      order: 1,
      isActive: true,
    },
    {
      name: "MAKEUP",
      slug: "makeup",
      description: "Velvety lipsticks, flattering palettes, and weightless complexion essentials.",
      image: "/images/categories/makeup.jpg",
      order: 2,
      isActive: true,
    },
    {
      name: "HAIRCARE",
      slug: "haircare",
      description: "Botanical shampoos, nourishing conditioners, and restorative hair oils.",
      image: "/images/categories/haircare.jpg",
      order: 3,
      isActive: true,
    },
    {
      name: "BODYCARE",
      slug: "bodycare",
      description: "Sumptuous body lotions, soothing body washes, and gentle exfoliating scrubs.",
      image: "/images/categories/bodycare.jpg",
      order: 4,
      isActive: true,
    },
    {
      name: "SUN CARE",
      slug: "sun-care",
      description: "Broad-spectrum mineral sunscreens and antioxidant sun drop serums.",
      image: "/images/categories/suncare.jpg",
      order: 5,
      isActive: true,
    },
    {
      name: "GIFT SETS",
      slug: "gift-sets",
      description: "Luxurious, curated gift boxes and limited-edition beauty sets.",
      image: "/images/categories/giftsets.jpg",
      order: 6,
      isActive: true,
    },
  ];

  const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
  for (const cat of categoriesData) {
    const saved = await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true, new: true }
    );
    categoryMap[cat.slug] = saved._id as mongoose.Types.ObjectId;
  }
  console.log("✔ Categories seeded");

  // 3. Seed Products (Strict match with Reference Screenshot Best Sellers + Shop catalog)
  const productsData = [
    {
      name: "Oil Control Face Wash with Salicylic Acid",
      slug: "oil-control-face-wash-with-salicylic-acid",
      sku: "VB-SK-001",
      description:
        "A gentle yet potent face wash infused with 2% Salicylic Acid and soothing botanical extracts. Unclogs pores, gently eliminates excess sebum, and prevents breakouts without drying out your moisture barrier. Suitable for daily morning and evening cleansing.",
      shortDescription: "Clarifying daily wash with 2% Salicylic Acid for clear, shine-free skin.",
      price: 499,
      compareAtPrice: 599,
      category: categoryMap["skincare"],
      categoryName: "SKINCARE",
      brand: "Velvetique Beauty",
      images: ["/images/products/oil-control-facewash.jpg"],
      thumbnail: "/images/products/oil-control-facewash.jpg",
      stock: 75,
      lowStockThreshold: 10,
      tags: ["face wash", "cleanser", "salicylic acid", "oil control", "skincare"],
      ingredients: "Aqua, Salicylic Acid (2%), Niacinamide, Camellia Sinensis (Green Tea) Leaf Extract, Aloe Barbadensis Leaf Juice, Glycerin.",
      benefits: ["Deep pore cleansing", "Controls excess sebum", "Calms redness & blemishes", "Maintains natural moisture barrier"],
      howToUse: "Apply a small amount to wet face, massage gently in circular motions for 60 seconds, then rinse thoroughly with lukewarm water.",
      weight: "150ml",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isActive: true,
      rating: 5.0,
      reviewCount: 125,
      seoTitle: "Oil Control Face Wash with Salicylic Acid - Velvetique Beauty",
      seoDescription: "Shop our best-selling Oil Control Face Wash with Salicylic Acid. Clarify and balance your skin for a fresh, radiant look.",
    },
    {
      name: "10% Niacinamide Face Serum",
      slug: "10-niacinamide-face-serum",
      sku: "VB-SK-002",
      description:
        "High-strength Vitamin B3 and Zinc PCA serum engineered to visibly refine skin texture, fade post-acne dark spots, balance oil production, and enhance skin radiance. Absorbs quickly without any stickiness or irritation.",
      shortDescription: "Ultra-concentrated Vitamin B3 serum to fade blemishes and even skin tone.",
      price: 799,
      compareAtPrice: 999,
      category: categoryMap["skincare"],
      categoryName: "SKINCARE",
      brand: "Velvetique Beauty",
      images: ["/images/products/niacinamide-serum.jpg"],
      thumbnail: "/images/products/niacinamide-serum.jpg",
      stock: 60,
      lowStockThreshold: 8,
      tags: ["serum", "niacinamide", "vitamin b3", "dark spots", "skincare"],
      ingredients: "Aqua, Niacinamide (10%), Zinc PCA (1%), Hyaluronic Acid, Centella Asiatica Extract, Phenoxyethanol.",
      benefits: ["Fades pigmentation & dark spots", "Tightens enlarged pores", "Promotes smooth skin texture", "Strengthens skin immunity"],
      howToUse: "Dispense 3-4 drops onto clean fingertips and press gently into face and neck before applying moisturizer.",
      weight: "30ml",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isActive: true,
      rating: 5.0,
      reviewCount: 200,
      seoTitle: "10% Niacinamide Face Serum - Velvetique Beauty",
      seoDescription: "Discover Velvetique's 10% Niacinamide Face Serum with Zinc PCA for glowing, spot-free skin.",
    },
    {
      name: "Hydra Intense Gel Moisturizer",
      slug: "hydra-intense-gel-moisturizer",
      sku: "VB-SK-003",
      description:
        "An ultra-lightweight, oil-free water gel moisturizer packed with multi-molecular Hyaluronic Acid and Marine Algae extract. Quenches dehydrated skin with an instant burst of hydration that lasts for 72 hours while leaving a velvety, plump finish.",
      shortDescription: "Oil-free gel moisturizer providing 72-hour deep plumping hydration.",
      price: 649,
      compareAtPrice: 799,
      category: categoryMap["skincare"],
      categoryName: "SKINCARE",
      brand: "Velvetique Beauty",
      images: ["/images/products/gel-moisturizer.jpg"],
      thumbnail: "/images/products/gel-moisturizer.jpg",
      stock: 85,
      lowStockThreshold: 12,
      tags: ["moisturizer", "gel cream", "hyaluronic acid", "hydration", "skincare"],
      ingredients: "Aqua, Hyaluronic Acid, Betaine, Ceramide NP, Laminaria Ochroleuca (Kelp) Extract, Tocopherol.",
      benefits: ["72-hour moisture lock", "Cooling, non-greasy texture", "Restores lipid barrier", "Improves skin bounce and radiance"],
      howToUse: "Smooth a nickel-sized amount over face and neck as the final step in your morning or evening routine.",
      weight: "50g",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isActive: true,
      rating: 5.0,
      reviewCount: 185,
      seoTitle: "Hydra Intense Gel Moisturizer - Velvetique Beauty",
      seoDescription: "Experience 72-hour hydration with Velvetique Hydra Intense Gel Moisturizer.",
    },
    {
      name: "Velvet Matte Lipstick",
      slug: "velvet-matte-lipstick",
      sku: "VB-MK-001",
      description:
        "A couture matte lipstick that delivers intense pigment in a single stroke with a weightless, non-drying suede finish. Infused with Argan Oil and Vitamin E to keep lips cushiony soft and comfortable all day.",
      shortDescription: "Ultra-pigmented cushiony matte lipstick with nourishing botanical oils.",
      price: 349,
      compareAtPrice: 449,
      category: categoryMap["makeup"],
      categoryName: "MAKEUP",
      brand: "Velvetique Beauty",
      images: ["/images/products/velvet-matte-lipstick.jpg"],
      thumbnail: "/images/products/velvet-matte-lipstick.jpg",
      stock: 120,
      lowStockThreshold: 15,
      tags: ["lipstick", "velvet matte", "makeup", "berry rose"],
      ingredients: "Dimethicone, Isononyl Isononanoate, Microcrystalline Wax, Argania Spinosa Kernel Oil, Tocopherol, Iron Oxides.",
      benefits: ["Long-lasting up to 10 hours", "Non-drying velvet finish", "Enriched with Vitamin E & Argan Oil", "Intense one-swipe payoff"],
      howToUse: "Glide directly onto lips starting from the Cupid's bow and working outward.",
      weight: "4.2g",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isActive: true,
      rating: 5.0,
      reviewCount: 98,
      seoTitle: "Velvet Matte Lipstick - Velvetique Beauty",
      seoDescription: "Elevate your pout with Velvetique's signature Velvet Matte Lipstick.",
    },
    {
      name: "Botanical Harmony Restorative Shampoo",
      slug: "botanical-harmony-restorative-shampoo",
      sku: "VB-HC-001",
      description:
        "Sulfate-free restorative shampoo enriched with Argan Oil, Rosemary extract, and plant keratin. Gently cleanses while fortifying weak strands and boosting natural shine.",
      shortDescription: "Sulfate-free nourishing shampoo with Argan Oil and Rosemary.",
      price: 599,
      compareAtPrice: 699,
      category: categoryMap["haircare"],
      categoryName: "HAIRCARE",
      brand: "Velvetique Beauty",
      images: ["/images/categories/haircare.jpg"],
      thumbnail: "/images/categories/haircare.jpg",
      stock: 40,
      lowStockThreshold: 5,
      tags: ["shampoo", "haircare", "argan oil", "sulfate free"],
      weight: "500ml",
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      isActive: true,
      rating: 4.8,
      reviewCount: 42,
    },
    {
      name: "Luxury Body Lotion - Amber & Jasmine",
      slug: "luxury-body-lotion-amber-jasmine",
      sku: "VB-BC-001",
      description:
        "Silky body lotion enriched with Shea Butter, Vitamin C, and sensual Amber and Jasmine extracts. Melts effortlessly into the skin leaving it luminous, soft, and delicately perfumed.",
      shortDescription: "Ultra-hydrating body lotion infused with warm amber and blooming jasmine.",
      price: 549,
      compareAtPrice: 649,
      category: categoryMap["bodycare"],
      categoryName: "BODYCARE",
      brand: "Velvetique Beauty",
      images: ["/images/promo/promo-banner.jpg"],
      thumbnail: "/images/promo/promo-banner.jpg",
      stock: 65,
      lowStockThreshold: 8,
      tags: ["body lotion", "bodycare", "jasmine", "shea butter"],
      weight: "250ml",
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      isActive: true,
      rating: 4.9,
      reviewCount: 56,
    },
    {
      name: "Solaire Mineral Sunscreen SPF 50",
      slug: "solaire-mineral-sunscreen-spf-50",
      sku: "VB-SC-001",
      description:
        "100% mineral broad-spectrum SPF 50 sunscreen with Zinc Oxide, Hyaluronic Acid, and Vitamin C. Invisible finish with zero white cast and maximum protection.",
      shortDescription: "Broad-spectrum mineral SPF 50 with Hyaluronic Acid and zero white cast.",
      price: 699,
      compareAtPrice: 849,
      category: categoryMap["sun-care"],
      categoryName: "SUN CARE",
      brand: "Velvetique Beauty",
      images: ["/images/categories/suncare.jpg"],
      thumbnail: "/images/categories/suncare.jpg",
      stock: 50,
      lowStockThreshold: 10,
      tags: ["sunscreen", "spf 50", "mineral sunscreen", "sun care"],
      weight: "100ml",
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      isActive: true,
      rating: 4.9,
      reviewCount: 78,
    },
    {
      name: "Elara Botanicals Royale Gift Set",
      slug: "elara-botanicals-royale-gift-set",
      sku: "VB-GS-001",
      description:
        "A premier limited-edition gift box set containing 5 travel-sized essentials: Restorative Serum, Radiance Face Cream, Cellular Hydration Mist, Sleeping Mask, and Revitalizing Oil.",
      shortDescription: "Luxury 5-piece royal skincare gift set presented in a satin blush box.",
      price: 1899,
      compareAtPrice: 2499,
      category: categoryMap["gift-sets"],
      categoryName: "GIFT SETS",
      brand: "Velvetique Beauty",
      images: ["/images/categories/giftsets.jpg"],
      thumbnail: "/images/categories/giftsets.jpg",
      stock: 25,
      lowStockThreshold: 5,
      tags: ["gift set", "luxury box", "skincare set", "gift"],
      weight: "5 Piece Set",
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      isActive: true,
      rating: 5.0,
      reviewCount: 34,
    },
  ];

  for (const prod of productsData) {
    await Product.findOneAndUpdate({ slug: prod.slug }, { $set: prod }, { upsert: true });
  }
  console.log("✔ Products seeded");

  // 4. Seed Hero Slides
  const heroSlides = [
    {
      badge: "NEW IN",
      title: "Radiant Skin.\nReal Confidence.",
      description: "Clean beauty that nourishes,\nenhances and empowers you.",
      buttonText: "SHOP NOW",
      buttonUrl: "/shop",
      image: "/images/hero/hero-slide-1.jpg",
      order: 1,
      isActive: true,
    },
    {
      badge: "SUMMER ESSENTIALS",
      title: "Pure Botanical\nNourishment.",
      description: "Gentle elixirs crafted with pure botanical extracts for an effortless natural glow.",
      buttonText: "EXPLORE NOW",
      buttonUrl: "/shop",
      image: "/images/hero/hero-slide-2.jpg",
      order: 2,
      isActive: true,
    },
  ];

  for (let i = 0; i < heroSlides.length; i++) {
    await HeroSlide.findOneAndUpdate(
      { order: heroSlides[i].order },
      { $set: heroSlides[i] },
      { upsert: true }
    );
  }
  console.log("✔ Hero slides seeded");

  // 5. Seed Promotion
  await Promotion.findOneAndUpdate(
    { badge: "LIMITED TIME OFFER" },
    {
      $set: {
        badge: "LIMITED TIME OFFER",
        title: "Up to 30% Off\non Best Sellers",
        description: "Glow more, spend less.\nTreat your skin today!",
        discountPercentage: 30,
        buttonText: "SHOP THE SALE",
        buttonUrl: "/shop",
        image: "/images/promo/promo-banner.jpg",
        isActive: true,
      },
    },
    { upsert: true }
  );
  console.log("✔ Promotional banner seeded");

  // 6. Seed Site Settings
  await SiteSetting.findOneAndUpdate(
    {},
    {
      $set: {
        brandName: "Velvetique Beauty",
        logoText: "VELVETIQUE BEAUTY",
        tagline: "Thoughtful beauty for every skin, every day.",
        announcementBar: {
          enabled: true,
          text: "Free Shipping on orders over ₹999 | Use code: GLOW15 for 15% OFF",
          code: "GLOW15",
          discountPercent: 15,
          threshold: 999,
        },
        contactInfo: {
          email: "care@velvetiquebeauty.com",
          phone: "+91 98765 43210",
          address: "Velvetique Studio, 4th Avenue, Indiranagar, Bengaluru, India",
          businessHours: "Mon - Sat: 9:00 AM - 7:00 PM IST",
        },
        socialLinks: {
          facebook: "https://facebook.com/velvetiquebeauty",
          instagram: "https://instagram.com/velvetiquebeauty",
          youtube: "https://youtube.com/velvetiquebeauty",
          pinterest: "https://pinterest.com/velvetiquebeauty",
        },
        shipping: {
          freeShippingThreshold: 999,
          standardShippingFee: 99,
        },
      },
    },
    { upsert: true }
  );
  console.log("✔ Site settings seeded");

  // 7. Seed Coupons
  await Coupon.findOneAndUpdate(
    { code: "GLOW15" },
    {
      $set: {
        code: "GLOW15",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minimumOrderAmount: 999,
        isActive: true,
      },
    },
    { upsert: true }
  );

  await Coupon.findOneAndUpdate(
    { code: "WELCOME10" },
    {
      $set: {
        code: "WELCOME10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minimumOrderAmount: 499,
        isActive: true,
      },
    },
    { upsert: true }
  );
  console.log("✔ Coupons seeded");

  // 8. Seed Blog Posts
  const blogPosts = [
    {
      title: "The Ultimate Guide to Salicylic Acid and Clear Skin",
      slug: "the-ultimate-guide-to-salicylic-acid",
      summary: "Understand how beta-hydroxy acids penetrate deep inside oil-clogged pores to gently exfoliate and refine your skin texture.",
      content: "Salicylic acid is a powerhouse oil-soluble ingredient beloved by dermatologists. Unlike water-soluble alpha-hydroxy acids (AHAs), salicylic acid can penetrate lipid-rich pores to break down sebum plugs and dead cellular debris...",
      coverImage: "/images/products/oil-control-facewash.jpg",
      author: "Dr. Alicia Vance",
      authorRole: "Consultant Dermatologist",
      tags: ["Skincare", "Salicylic Acid", "Clear Skin"],
      readTime: "4 min read",
      isPublished: true,
    },
    {
      title: "Why Niacinamide is Every Skincare Lover's Secret Weapon",
      slug: "why-niacinamide-is-skincare-secret-weapon",
      summary: "From fading stubborn sun spots to smoothing fine lines and reducing inflammation, discover the science behind Vitamin B3.",
      content: "Niacinamide, also known as Vitamin B3, is one of the most versatile and well-tolerated active ingredients in modern dermatology. It helps strengthen the natural lipid moisture barrier, enhances elasticity, and reduces pigmentation...",
      coverImage: "/images/products/niacinamide-serum.jpg",
      author: "Maya Kapoor",
      authorRole: "Velvetique Head of Formulation",
      tags: ["Niacinamide", "Serums", "Radiance"],
      readTime: "5 min read",
      isPublished: true,
    },
  ];

  for (const post of blogPosts) {
    await BlogPost.findOneAndUpdate({ slug: post.slug }, { $set: post }, { upsert: true });
  }
  console.log("✔ Blog posts seeded");

  console.log("✨ All seeding completed successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
