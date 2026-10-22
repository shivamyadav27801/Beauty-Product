"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle, MessageSquarePlus, Loader2 } from "lucide-react";

interface ReviewItem {
  _id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  isVerifiedPurchase?: boolean;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error("Fetch reviews error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!authorName.trim() || !comment.trim()) {
      setErrorMsg("Please provide your name and your review feedback");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          authorName,
          rating,
          title,
          comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Thank you for sharing your experience! Your review is posted.");
        setAuthorName("");
        setTitle("");
        setComment("");
        setShowForm(false);
        fetchReviews();
      } else {
        setErrorMsg(data.message || "Failed to submit review");
      }
    } catch {
      setErrorMsg("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="mt-16 pt-10 border-t border-neutral-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-800 uppercase tracking-wider">
            CUSTOMER REVIEWS
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-[#f59e0b]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
              ))}
            </div>
            <span className="text-sm font-bold text-neutral-800">{avgRating} out of 5</span>
            <span className="text-xs text-neutral-500">
              (Based on {reviews.length} authentic customer reviews)
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-secondary text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <MessageSquarePlus className="w-4 h-4 text-[#b55b6c]" />
          <span>WRITE A REVIEW</span>
        </button>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-pink-50/40 p-6 rounded-xl border border-pink-100 mb-10 space-y-4 animate-fade-in"
        >
          <h3 className="text-sm font-serif font-bold text-neutral-800 uppercase tracking-wider">
            Review {productName}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Alisha Mehta"
                className="w-full text-xs px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Rating (Stars) *
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? "fill-[#f59e0b] text-[#f59e0b]"
                          : "text-neutral-300 stroke-[1.5]"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-neutral-600 ml-2 font-medium">
                  {rating} / 5 Stars
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Review Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Best face wash for sensitive skin!"
              className="w-full text-xs px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Your Feedback *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How did this formulation work for your skin? Texture, scent, and results..."
              className="w-full text-xs px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
            />
          </div>

          {errorMsg && <p className="text-xs text-red-600 font-medium">{errorMsg}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-xs uppercase tracking-wider py-2.5 px-6 disabled:opacity-60"
            >
              {submitting ? "SUBMITTING..." : "POST REVIEW"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-neutral-500 hover:text-neutral-800 underline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {successMsg && (
        <div className="p-4 mb-6 bg-green-50 text-green-800 rounded-lg text-xs font-medium border border-green-200">
          {successMsg}
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-[#b55b6c]" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 bg-neutral-50 rounded-xl">
          <p className="text-sm text-neutral-600">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="p-5 rounded-xl border border-neutral-100 bg-white shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-800">{rev.userName}</span>
                  {rev.isVerifiedPurchase && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Verified Purchase
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-400">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[#f59e0b]">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                ))}
              </div>

              {rev.title && <h4 className="text-xs font-bold text-neutral-800">{rev.title}</h4>}
              <p className="text-xs text-neutral-600 leading-relaxed font-light">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
