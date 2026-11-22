import React, { useState } from 'react';
import { X, Plus, Check, Sparkles, Droplets, Calendar, Clock } from 'lucide-react';
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
      {/* Drawer Container */}
      <div 
        className="w-full max-w-md h-full bg-bodywise-50 shadow-2xl flex flex-col border-l border-bodywise-200 animate-slide-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-bodywise-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-bodywise-100 flex items-center justify-center text-bodywise-700">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-bodywise-600">Custom Routine Shelf</span>
              <h3 className="text-base font-bold text-bodywise-950">Add Be Bodywise Item</h3>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-bodywise-100 text-bodywise-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational callout */}
        <div className="p-4 bg-bodywise-100/70 border-b border-bodywise-200 text-xs text-bodywise-800 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-bodywise-600 flex-shrink-0 mt-0.5" />
          <p>
            Adding an active clinical item automatically links its recommended clinical frequency, depleting bottle tracker, and science-backed daily boosters to your daily dashboard.
          </p>
        </div>

        {/* Scrollable Item Catalog */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {PRESET_CATALOG_PRODUCTS.map((product) => {
            const isAlreadyOnShelf = activeProductIds.includes(product.id) || addedIds.includes(product.id);

            return (
              <div 
                key={product.id}
                className="p-4 rounded-2xl bg-white border border-bodywise-200 shadow-warm-sm flex flex-col gap-3 hover:border-bodywise-300 transition-all"
              >
                <div className="space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-bodywise-100 text-bodywise-800 border border-bodywise-200">
                        {product.category}
                      </span>
                      <span className="text-[10px] text-bodywise-600 font-medium">
                        {product.concern}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-bodywise-950 leading-snug">
                      {product.name}
                    </h4>
                    <p className="text-xs text-bodywise-700 mt-1 leading-relaxed">
                      {product.tagline}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-xl bg-bodywise-50 border border-bodywise-100 p-2">
                      <span className="block text-[9px] uppercase tracking-wide text-bodywise-500 font-bold">Size</span>
                      <span className="font-semibold text-bodywise-900">{product.totalVolumeMl} ml</span>
                    </div>
                    <div className="rounded-xl bg-bodywise-50 border border-bodywise-100 p-2">
                      <span className="block text-[9px] uppercase tracking-wide text-bodywise-500 font-bold">Frequency</span>
                      <span className="font-semibold text-bodywise-900">{product.frequencyLabel}</span>
                    </div>
                    <div className="rounded-xl bg-bodywise-50 border border-bodywise-100 p-2">
                      <span className="block text-[9px] uppercase tracking-wide text-bodywise-500 font-bold">When to use</span>
                      <span className="font-semibold text-bodywise-900">{product.timeOfDay}</span>
                    </div>
                    <div className="rounded-xl bg-bodywise-50 border border-bodywise-100 p-2">
                      <span className="block text-[9px] uppercase tracking-wide text-bodywise-500 font-bold">Recommended dose</span>
                      <span className="font-semibold text-bodywise-900">{product.doseDescription}</span>
                    </div>
                  </div>

                  {product.clinicalTips?.length > 0 && (
                    <div className="rounded-xl bg-white border border-bodywise-100 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-bodywise-600 mb-1.5">Usage information</p>
                      <ul className="space-y-1.5">
                        {product.clinicalTips.map((tip, index) => (
                          <li key={index} className="text-[11px] text-bodywise-700 leading-relaxed flex gap-2">
                            <span className="text-bodywise-500">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Add Button */}
                <button
                  type="button"
                  disabled={isAlreadyOnShelf}
                  onClick={() => handleAdd(product)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isAlreadyOnShelf
                      ? 'bg-bodywise-100 text-bodywise-800 border border-bodywise-300 cursor-default'
                      : 'bg-bodywise-600 text-white hover:bg-bodywise-700 shadow-sm active:scale-98'
                  }`}
                >
                  {isAlreadyOnShelf ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-bodywise-700 stroke-[3]" />
                      <span>Active on Your Routine Shelf</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to My Shelf</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-bodywise-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-bodywise-100 text-bodywise-900 text-xs font-bold hover:bg-bodywise-200 transition-colors border border-bodywise-200"
          >
            Done Customizing Shelf
          </button>
        </div>
      </div>
    </div>
  );
}
