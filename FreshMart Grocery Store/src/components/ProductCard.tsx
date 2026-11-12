import React from 'react';
import { Heart, Plus, Minus, Star, Eye } from 'lucide-react';
import { Product } from '../types/grocery';
import { useGrocery } from '../context/GroceryContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    cart,
    addToCart,
    updateQuantity,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct
  } = useGrocery();

  const cartItem = cart.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const isWished = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-xl border border-stone-200/90 overflow-hidden hover:border-emerald-400/80 hover:shadow-md transition-all flex flex-col justify-between">
      {/* Top Media Area */}
      <div className="relative aspect-4/3 w-full bg-stone-50 overflow-hidden">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Elegant styled SVG fallback if image host is unreachable
            const target = e.currentTarget;
            target.onerror = null;
            target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225" viewBox="0 0 300 225" fill="%23f8fafc"><rect width="300" height="225" fill="%23f1f5f9"/><path d="M150 70c-16 0-30 14-30 30 0 20 30 40 30 40s30-20 30-40c0-16-14-30-30-30z" fill="%23059669"/><text x="50%" y="72%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23334155">FreshMart Produce</text></svg>';
          }}
        />

        {/* Quick View Button overlay on hover */}
        <button
          onClick={() => setQuickViewProduct(product)}
          className="absolute inset-x-3 bottom-3 py-1.5 px-3 bg-white/90 backdrop-blur-xs text-stone-800 text-xs font-semibold rounded-md shadow-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 hover:bg-white"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
            isWished
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 text-stone-500 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Discount / Tag in top-left without pill styling */}
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs font-mono">
            {product.discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Content & Metadata Area */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Rating separator text */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="font-medium text-emerald-800 uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-stone-700 font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-mono tabular-nums">{product.rating}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="text-sm sm:text-base font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Unit / Weight specification */}
          <p className="text-xs text-stone-500 mt-0.5">
            Pack of {product.unit}
            {product.origin && (
              <span className="hidden sm:inline text-stone-400"> · {product.origin.split(',')[0]}</span>
            )}
          </p>
        </div>

        {/* Price & Add to Cart row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-stone-900 font-mono tabular-nums">
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Interactive Stepper or Add button */}
          {!product.inStock ? (
            <span className="text-xs font-semibold text-stone-400 px-2 py-1 bg-stone-100 rounded">
              Out of Stock
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center bg-emerald-50 border border-emerald-600 rounded-lg p-0.5">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                aria-label="Decrease quantity"
                className="w-7 h-7 flex items-center justify-center text-emerald-800 hover:bg-emerald-100 rounded transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-bold text-emerald-950 font-mono tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                aria-label="Increase quantity"
                className="w-7 h-7 flex items-center justify-center text-emerald-800 hover:bg-emerald-100 rounded transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product.id, 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
