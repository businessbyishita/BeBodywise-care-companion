import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, Sparkles, Scale, RefreshCw } from 'lucide-react';
import DepletingBottleSvg from './DepletingBottleSvg';

export default function BottleMatchModal({
  product,
  onClose,
  onUpdateFillPercent = null
}) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [customPercent, setCustomPercent] = useState(product.currentFillPercent);
  const [showCalibrate, setShowCalibrate] = useState(false);

  if (!product) return null;

  const handleMatchSelect = (matchType) => {
    setSelectedMatch(matchType);
  };

  const handleSaveCalibration = () => {
    if (onUpdateFillPercent) {
      onUpdateFillPercent(product.id, customPercent);
    }
    setShowCalibrate(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bodywise-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-bodywise-50 w-full max-w-lg rounded-3xl shadow-warm-lg border border-bodywise-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-bodywise-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-bodywise-100 flex items-center justify-center text-bodywise-700">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-bodywise-600">Clinical Verification</span>
              <h3 className="text-base font-bold text-bodywise-950">Physical Bottle Match Check</h3>
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

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Visual Comparison Box */}
          <div className="p-5 rounded-2xl bg-white border border-bodywise-200 shadow-warm-sm flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <DepletingBottleSvg 
                type={product.bottleType}
                fillPercent={showCalibrate ? customPercent : product.currentFillPercent}
                liquidColor={product.liquidColor}
                accentColor="#005995"
                remainingUses={product.remainingUses}
                totalApplications={product.totalApplications}
                dosePerUseMl={product.dosePerUseMl}
                size="md"
              />
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-bodywise-100 text-bodywise-800 border border-bodywise-200">
                Current App Tracker: {product.currentFillPercent}% Full
              </div>
              <h4 className="text-sm font-bold text-bodywise-950">
                Does your physical bathroom bottle look roughly this full?
              </h4>
              <p className="text-xs text-bodywise-700 leading-relaxed">
                Be Bodywise clinical formulas are measured to deliver maximum biological turnover within a <strong>{product.cycleWeeksTotal}-week cycle</strong>. Checking your physical fluid level ensures you aren't under-applying or rationing doses.
              </p>
            </div>
          </div>

          {/* Interactive User Choices */}
          {!selectedMatch ? (
            <div className="space-y-3">
              <p className="text-xs font-bold text-bodywise-800 uppercase tracking-wider">
                Select what best describes your bottle right now:
              </p>

              {/* Option 1: Matches */}
              <button
                type="button"
                onClick={() => handleMatchSelect('matched')}
                className="w-full text-left p-4 rounded-xl border border-bodywise-200 bg-white hover:border-bodywise-400 hover:bg-bodywise-50 transition-all flex items-start gap-3.5 group shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-bodywise-100 text-bodywise-700 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-bodywise-950 group-hover:text-bodywise-700">
                    Yes, it matches roughly! (~{product.currentFillPercent}% full)
                  </p>
                  <p className="text-[11px] text-bodywise-600 mt-0.5">
                    You are applying the exact clinical amount ({product.doseDescription}). On track for expected results!
                  </p>
                </div>
              </button>

              {/* Option 2: Bottle is Fuller (Rationing warning!) */}
              <button
                type="button"
                onClick={() => handleMatchSelect('fuller')}
                className="w-full text-left p-4 rounded-xl border border-bodywise-200 bg-white hover:border-bodywise-400 hover:bg-bodywise-50 transition-all flex items-start gap-3.5 group shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-bodywise-100 text-bodywise-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-4 h-4 text-bodywise-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-bodywise-950 group-hover:text-bodywise-700">
                    No, my physical bottle is noticeably fuller! (I might be rationing)
                  </p>
                  <p className="text-[11px] text-bodywise-600 mt-0.5">
                    You may be hesitant or applying tiny micro-drops that fall below the active threshold.
                  </p>
                </div>
              </button>

              {/* Option 3: Bottle is Emptier */}
              <button
                type="button"
                onClick={() => handleMatchSelect('emptier')}
                className="w-full text-left p-4 rounded-xl border border-bodywise-200 bg-white hover:border-bodywise-400 hover:bg-bodywise-50 transition-all flex items-start gap-3.5 group shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-bodywise-100 text-bodywise-700 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-bodywise-950">
                    No, my bottle is noticeably emptier than this!
                  </p>
                  <p className="text-[11px] text-bodywise-600 mt-0.5">
                    You may be applying extra or sharing with a sibling or partner.
                  </p>
                </div>
              </button>
            </div>
          ) : (
            /* Selected Feedback Card */
            <div className="space-y-4 animate-fade-in">
              {selectedMatch === 'matched' && (
                <div className="p-4 rounded-2xl bg-bodywise-50 border border-bodywise-300 space-y-2">
                  <div className="flex items-center gap-2 text-bodywise-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-bodywise-600" />
                    <span>Clinical Dosage Calibration: Optimal!</span>
                  </div>
                  <p className="text-xs text-bodywise-800 leading-relaxed">
                    Great job! Your current depletion rate reflects consistent therapeutic dosing ({product.doseDescription}). At this rate, your skin is absorbing the target concentration required for Week {product.currentWeek} cellular milestones.
                  </p>
                </div>
              )}

              {selectedMatch === 'fuller' && (
                <div className="p-4 rounded-2xl bg-bodywise-50 border border-bodywise-300 space-y-3">
                  <div className="flex items-center gap-2 text-bodywise-900 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-bodywise-600 flex-shrink-0" />
                    <span>Clinical Alert: You May Be Rationing Your Active Ingredients</span>
                  </div>
                  <p className="text-xs text-bodywise-800 leading-relaxed font-medium">
                    Because active molecules like <strong>{product.name}</strong> operate on a concentration gradient, under-applying causes the formulation to dry or wash off before penetrating into the dermis.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-bodywise-200 text-xs text-bodywise-800">
                    <strong className="text-bodywise-900">Recommended Action for Tomorrow: </strong>
                    Ensure you apply the full recommended dose: <span className="font-semibold text-bodywise-950">{product.doseDescription}</span>. Don't worry about "running out quickly" — each bottle is specifically filled to last the full <strong>{product.cycleWeeksTotal}-week treatment cycle</strong>.
                  </div>
                </div>
              )}

              {selectedMatch === 'emptier' && (
                <div className="p-4 rounded-2xl bg-bodywise-50 border border-bodywise-200 space-y-2">
                  <div className="flex items-center gap-2 text-bodywise-900 font-bold text-sm">
                    <HelpCircle className="w-5 h-5 text-bodywise-600" />
                    <span>High Depletion Rate Noted</span>
                  </div>
                  <p className="text-xs text-bodywise-800 leading-relaxed">
                    Applying more than <strong>{product.dosePerUseMl} ml</strong> per dose won't speed up cellular results and might cause unnecessary skin sensitivity. Stick to the prescribed {product.doseDescription} so your supply lasts through the expected clinical milestone at Week {product.cycleWeeksTotal}.
                  </p>
                </div>
              )}

              {/* Option to re-select or calibrate slider */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMatch(null)}
                  className="text-xs text-bodywise-600 hover:text-bodywise-900 underline font-medium"
                >
                  ← Pick another observation
                </button>

                <button
                  type="button"
                  onClick={() => setShowCalibrate(!showCalibrate)}
                  className="text-xs text-bodywise-700 hover:text-bodywise-900 font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {showCalibrate ? 'Hide Calibration' : 'Calibrate Virtual Level'}
                </button>
              </div>

              {/* Calibration Slider */}
              {showCalibrate && (
                <div className="p-4 rounded-xl bg-white border border-bodywise-200 space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-bodywise-800">Set Exact Physical Level:</span>
                    <span className="font-bold text-bodywise-700">{customPercent}% Full</span>
                  </div>
                  <input 
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={customPercent}
                    onChange={(e) => setCustomPercent(Number(e.target.value))}
                    className="w-full accent-bodywise-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleSaveCalibration}
                    className="w-full py-2 bg-bodywise-600 text-white rounded-lg text-xs font-bold hover:bg-bodywise-700 transition-colors shadow-sm"
                  >
                    Sync Virtual Bottle to {customPercent}%
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-bodywise-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-bodywise-600 text-white text-xs font-bold hover:bg-bodywise-700 transition-colors shadow-warm-sm"
          >
            Done & Return to Routine
          </button>
        </div>
      </div>
    </div>
  );
}
