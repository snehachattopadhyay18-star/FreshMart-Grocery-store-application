import React, { useState } from 'react';
import { X, Star, Heart, Plus, Minus, ShoppingBag, ShieldCheck, MapPin, Sparkles, MessageSquare } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';
import { SAMPLE_REVIEWS } from '../data/initialData';

export const ProductDetailModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    cart,
    addToCart,
    updateQuantity,
    toggleWishlist,
    isInWishlist
  } = useGrocery();

  // Local review state
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!quickViewProduct) return null;

  const cartItem = cart.find(item => item.product.id === quickViewProduct.id);
  const quantity = cartItem?.quantity || 0;
  const isWished = isInWishlist(quickViewProduct.id);

  // Filter reviews for this product
  const productReviews = reviews.filter(r => r.productId === quickViewProduct.id);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newAuthor.trim()) return;

    const reviewObj = {
      id: `rev-${Date.now()}`,
      productId: quickViewProduct.id,
      authorName: newAuthor.trim(),
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      comment: newComment.trim(),
      location: 'Kolkata Customer'
    };

    setReviews([reviewObj, ...reviews]);
    setNewComment('');
    setNewAuthor('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-stone-500 hover:text-stone-900 rounded-full shadow-xs transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative bg-stone-100 aspect-4/3 md:aspect-auto flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-stone-200">
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="max-h-72 w-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {quickViewProduct.discountPercent && (
              <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs font-mono">
                {quickViewProduct.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Right: Details & Purchase Module */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span className="font-semibold text-emerald-800 uppercase tracking-wider text-[11px]">
                  {quickViewProduct.category}
                </span>
                <div className="flex items-center gap-1 text-stone-700 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-mono tabular-nums">{quickViewProduct.rating}</span>
                  <span className="text-stone-400">({quickViewProduct.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                {quickViewProduct.name}
              </h2>

              <p className="text-xs text-stone-500 mt-1">
                Package Size: <strong className="text-stone-800">{quickViewProduct.unit}</strong>
                {quickViewProduct.origin && (
                  <span> · Sourced from {quickViewProduct.origin}</span>
                )}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline gap-2.5 my-3">
                <span className="text-2xl font-extrabold text-stone-900 font-mono tabular-nums">
                  ₹{quickViewProduct.price}
                </span>
                {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-sm text-stone-400 line-through font-mono tabular-nums">
                    ₹{quickViewProduct.originalPrice}
                  </span>
                )}
                {quickViewProduct.originalPrice && (
                  <span className="text-xs font-semibold text-emerald-700">
                    Save ₹{quickViewProduct.originalPrice - quickViewProduct.price}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Trust highlights */}
              <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Quality Checked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Kolkata Express 90-Min</span>
                </div>
              </div>
            </div>

            {/* Cart & Wishlist Actions */}
            <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
              {quantity > 0 ? (
                <div className="flex items-center bg-emerald-50 border border-emerald-600 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(quickViewProduct.id, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-emerald-800 hover:bg-emerald-100 rounded transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-emerald-950 font-mono text-sm tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(quickViewProduct.id, quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-emerald-800 hover:bg-emerald-100 rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(quickViewProduct.id, 1)}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              )}

              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isWished
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWished ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="p-6 bg-stone-50 border-t border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>Customer Reviews & Feedback</span>
            </h3>
            <span className="text-xs text-stone-500">Verified Kolkata Buyers</span>
          </div>

          {/* Existing Reviews */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {productReviews.length > 0 ? (
              productReviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-white rounded-xl border border-stone-200/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-stone-900">{rev.authorName} ({rev.location})</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-600">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 italic">No reviews yet for this product. Be the first to share your experience!</p>
            )}
          </div>

          {/* Write a review form */}
          <form onSubmit={handleAddReview} className="mt-4 pt-4 border-t border-stone-200/60 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-700">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-0.5 text-stone-300 hover:text-amber-400"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                required
                placeholder="Your Name (e.g. Sneha C.)"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="text"
                required
                placeholder="Write your feedback..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="sm:col-span-2 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              {reviewSubmitted && (
                <span className="text-emerald-700 font-semibold text-[11px]">
                  Thank you! Your review was recorded.
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors"
                >
                  Post Review
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
