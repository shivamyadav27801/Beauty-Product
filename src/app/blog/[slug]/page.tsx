import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { BlogPost } from "@/models/BlogPost";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  await connectDB();

  const post = await BlogPost.findOne({ slug, isPublished: true }).lean();
  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#b55b6c] mb-8 font-medium uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {post.author}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-neutral-500 leading-relaxed font-light italic">
            {post.summary}
          </p>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-10 shadow-sm bg-neutral-100">
          <Image
            src={post.coverImage || "/images/hero/hero-slide-1.jpg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Body */}
        <div className="prose max-w-none text-neutral-700 leading-relaxed text-sm sm:text-base space-y-4 font-light">
          {post.content.split("\n\n").map((para: string, idx: number) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="border-t border-neutral-100 pt-8 mt-12 flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Topics:
            </span>
            {post.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="text-xs bg-pink-50 text-[#b55b6c] px-3 py-1 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
