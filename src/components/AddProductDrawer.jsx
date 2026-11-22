import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { PRESET_CATALOG_PRODUCTS } from '../data/products';

export default function AddProductDrawer({
  isOpen,
  onClose,
  activeProductIds = [],
  onAddProduct
}) {
  const [addedIds, setAddedIds] = useState([]);

  if (!isOpen) return null;

  const handleAdd = (product) => {
    onAddProduct(product);
    setAddedIds(prev => [...prev, product.id]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-bodywise-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md h-full bg-bodywise-50 shadow-2xl flex flex-col border-l border-bodywise-200 animate-slide-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-bodywise-200 bg-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-bodywise-600">Your routine</span>
            <h3 className="text-base font-bold text-bodywise-950">Add an item</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full hover:bg-bodywise-100 text-bodywise-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {PRESET_CATALOG_PRODUCTS.map((product) => {
            const isAlreadyOnShelf = activeProductIds.includes(product.id) || addedIds.includes(product.id);

            return (
              <div key={product.id} className="p-4 rounded-2xl bg-white border border-bodywise-200 shadow-warm-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-bodywise-600 mb-2">
                  {product.category} {product.concern ? ` ${product.concern}` : ''}
                </p>
                <h4 className="text-sm font-bold text-bodywise-950 leading-snug">{product.name}</h4>
                <p className="text-xs text-bodywise-600 leading-relaxed mt-1.5">{product.tagline}</p>

                <button
                  type="button"
                  disabled={isAlreadyOnShelf}
                  onClick={() => handleAdd(product)}
                  className={`w-full mt-4 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isAlreadyOnShelf
                      ? 'bg-bodywise-100 text-bodywise-800 border border-bodywise-300 cursor-default'
                      : 'bg-bodywise-600 text-white hover:bg-bodywise-700 shadow-sm active:scale-98'
                  }`}
                >
                  {isAlreadyOnShelf ? (
                    <><Check className="w-3.5 h-3.5 stroke-[3]" /><span>Added to My Shelf</span></>
                  ) : (
                    <><Plus className="w-3.5 h-3.5" /><span>Add to My Shelf</span></>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-white border-t border-bodywise-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-bodywise-100 text-bodywise-900 text-xs font-bold hover:bg-bodywise-200 transition-colors border border-bodywise-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
