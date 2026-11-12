import React from 'react';
import { CATEGORIES } from '../data/initialData';
import { ProductCategory } from '../types/grocery';
import { useGrocery } from '../context/GroceryContext';

export const CategoryBar: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useGrocery();

  return (
    <section id="categories" className="py-8 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-display">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Select a category to filter FreshMart fresh inventory
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('All');
              const el = document.getElementById('products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              selectedCategory === 'All'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            View All ({CATEGORIES.reduce((a, b) => a + b.itemCount, 0)} Items)
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(isSelected ? 'All' : cat.id);
                  const el = document.getElementById('products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                {/* Category Thumbnail */}
                <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden bg-stone-200 mb-2.5">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors" />
                </div>

                <div>
                  <h3 className={`text-xs sm:text-sm font-bold line-clamp-1 ${
                    isSelected ? 'text-emerald-950 font-semibold' : 'text-stone-900'
                  }`}>
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {cat.itemCount} Items Available
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
