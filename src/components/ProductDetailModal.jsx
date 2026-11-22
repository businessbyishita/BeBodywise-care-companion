import React from 'react';
import { X, Clock, ShieldAlert, Sparkles, CheckCircle2, Droplets, Calendar, AlertCircle } from 'lucide-react';
import DepletingBottleSvg from './DepletingBottleSvg';
import VisualDosageGuide from './VisualDosageGuide';

export default function ProductDetailModal({
  product,
  onClose,
  onOpenMatchCheck
}) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-cream-50 w-full max-w-2xl rounded-3xl shadow-warm-lg border border-cream-300 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-cream-200 bg-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-cream-200 text-charcoal-600">
              {product.category} • {product.concern}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-charcoal-900 mt-0.5">
              {product.name}
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-cream-200 text-charcoal-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Quick Status & Bottle Display */}
          <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-warm-sm flex flex-col sm:flex-row items-center gap-5">
            <div className="flex-shrink-0">
              <DepletingBottleSvg 
                type={product.bottleType}
                fillPercent={product.currentFillPercent}
                liquidColor={product.liquidColor}
                accentColor={product.colorAccent}
                remainingUses={product.remainingUses}
                totalApplications={product.totalApplications}
                dosePerUseMl={product.dosePerUseMl}
                size="md"
              />
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-1 rounded-full bg-cream-100 border border-cream-300 text-xs font-bold text-charcoal-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-terracotta-500" />
                  {product.frequencyLabel}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-sage-50 border border-sage-200 text-xs font-bold text-sage-800">
                  {product.currentFillPercent}% Remaining
                </span>
              </div>

              <p className="text-xs text-charcoal-700 leading-relaxed font-medium">
                {product.tagline}
              </p>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMatchCheck(product);
                  }}
                  className="text-xs text-terracotta-600 font-bold hover:underline"
                >
                  Verify Physical Bottle Fluid Match →
                </button>
              </div>
            </div>
          </div>

          {/* Visual Dosage & Rationing Guide */}
          <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-warm-sm">
            <VisualDosageGuide product={product} compact={false} />
          </div>

          {/* Week-by-Week Expected Results Milestones */}
          <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-warm-sm space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-terracotta-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-800">
                Clinical Timeline ({product.cycleWeeksTotal} Weeks Target Cycle)
              </h4>
            </div>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cream-300">
              {product.timelineMilestones.map((m, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <span className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    m.current ? 'bg-terracotta-500 ring-4 ring-terracotta-100' : 'bg-charcoal-300'
                  }`} />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-charcoal-800">
                        Week {m.week}: {m.title}
                      </span>
                      {m.current && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-terracotta-100 text-terracotta-700 uppercase">
                          Current Stage
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-charcoal-600 mt-0.5 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Tips & Application Protocol */}
          {product.clinicalTips && product.clinicalTips.length > 0 && (
            <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Application Best Practices</span>
              </h4>
              <ul className="space-y-1.5">
                {product.clinicalTips.map((tip, i) => (
                  <li key={i} className="text-xs text-charcoal-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-400 mt-1.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-cream-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-charcoal-800 text-white text-xs font-bold hover:bg-charcoal-900 transition-colors"
          >
            Close Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
