import React from "react";
import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db/connect";
import { BlogPost } from "@/models/BlogPost";
import { Calendar, User, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function BlogPage() {
  await connectDB();

  const posts = await BlogPost.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .lean();

  return (
    <div className="bg-[#fcf8f9] min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] font-semibold text-[#b55b6c]">
            VELVETIQUE BEAUTY JOURNAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-800 uppercase tracking-wide">
            EDITORIAL &amp; SKINCARE SCIENCE
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light">
            Insights, ingredient breakdowns, and expert rituals from our beauty lab.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <article
              key={post._id.toString()}
              className="bg-white rounded-2xl overflow-hidden border border-pink-100/60 shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden">
                  <Image
                    src={post.coverImage || "/images/hero/hero-slide-1.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.tags && post.tags[0] && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#b55b6c] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {post.tags[0]}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {post.author}
                    </span>
                  </div>

                  <h2 className="text-lg font-serif font-bold text-neutral-900 group-hover:text-[#b55b6c] transition-colors leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-xs text-neutral-500 leading-relaxed font-light line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b55b6c] uppercase tracking-wider hover:underline"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
