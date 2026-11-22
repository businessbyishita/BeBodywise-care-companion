import React, { useState } from 'react';
import { X, Plus, Check, Sparkles, Droplets, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';
import { PRESET_CATALOG_PRODUCTS } from '../data/products';
import DepletingBottleSvg from './DepletingBottleSvg';

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
                <div className="flex items-start gap-3">
                  {/* Miniature SVG Bottle preview */}
                  <div className="w-12 h-20 flex-shrink-0">
                    <DepletingBottleSvg 
                      type={product.bottleType}
                      fillPercent={product.initialFillPercent}
                      liquidColor={product.liquidColor}
                      accentColor="#005995"
                      remainingUses={product.remainingUses}
                      totalApplications={product.totalApplications}
                      dosePerUseMl={product.dosePerUseMl}
                      size="sm"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-bodywise-100 text-bodywise-800 border border-bodywise-200">
                        {product.concern}
                      </span>
                      <span className="text-[10px] text-bodywise-500 font-medium">
                        {product.totalVolumeMl} ml
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-bodywise-950 leading-snug">
                      {product.name}
                    </h4>

                    <p className="text-[11px] text-bodywise-600 line-clamp-2">
                      {product.tagline}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] font-semibold text-bodywise-700 pt-1">
                      <span className="flex items-center gap-0.5">
                        <Calendar className="w-3 h-3 text-bodywise-600" />
                        {product.frequencyLabel}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Droplets className="w-3 h-3 text-bodywise-600" />
                        {product.visualDosageValue}
                      </span>
                    </div>
                  </div>
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
