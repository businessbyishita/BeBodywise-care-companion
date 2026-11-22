import React, { useState } from 'react';
import { Bell, Sparkles, X, ChevronRight, Play, RotateCcw, Calendar, CheckCircle2, Check } from 'lucide-react';

export default function NotificationBanner({
  currentDayOfWeek = 3, // 3 = Wednesday
  activeProducts = [],
  onSimulateDayChange,
  onQuickLogDose
}) {
  const [currentNudgeIndex, setCurrentNudgeIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const days = [
    { id: 0, label: 'Sun', full: 'Sunday' },
    { id: 1, label: 'Mon', full: 'Monday' },
    { id: 2, label: 'Tue', full: 'Tuesday' },
    { id: 3, label: 'Wed', full: 'Wednesday' },
    { id: 4, label: 'Thu', full: 'Thursday' },
    { id: 5, label: 'Fri', full: 'Friday' },
    { id: 6, label: 'Sat', full: 'Saturday' },
  ];

  const currentDayObj = days.find(d => d.id === currentDayOfWeek) || days[3];

  // Dynamic scheduled nudges based on active products and current simulated day
  const dueProductsToday = activeProducts.filter(p => p.frequencyDays.includes(currentDayOfWeek) && !p.loggedToday);
  const rollOnProduct = activeProducts.find(p => p.id === 'aha-bha-roll-on');
  const bodyWashProduct = activeProducts.find(p => p.id === 'salicylic-body-wash');
  const hairSerumProduct = activeProducts.find(p => p.id === 'redensyl-hair-serum');

  const simulatedNudges = [
    {
      id: 'nudge-scheduled-day',
      title: `Reminder: It's ${currentDayObj.full}`,
      message: rollOnProduct && rollOnProduct.frequencyDays.includes(currentDayOfWeek)
        ? `Time for your 3x/week AHA BHA Roll-On! Remember: 2 full firm swipes per underarm.`
        : dueProductsToday.length > 0
          ? `You have ${dueProductsToday.length} product dose${dueProductsToday.length > 1 ? 's' : ''} due today! Check in to maintain your streak.`
          : `All routine doses completed for today! Keep up the science-backed daily boosters.`,
      productId: rollOnProduct && rollOnProduct.frequencyDays.includes(currentDayOfWeek) ? rollOnProduct.id : dueProductsToday[0]?.id,
      badge: 'Smart Frequency Nudge',
      time: 'Just now'
    },
    {
      id: 'nudge-pm-shower',
      title: 'Evening Shower Protocol',
      message: 'Body acne booster: Remember to rinse conditioner out completely BEFORE applying your Salicylic Acid Body Wash.',
      productId: bodyWashProduct?.id,
      badge: 'Daily Booster Cue',
      time: '6:30 PM'
    },
    {
      id: 'nudge-bedtime-serum',
      title: 'Nighttime Scalp Routine',
      message: 'Time for Rosemary & Redensyl: 1 full pipette across 4 scalp sections + 60s microcirculation massage.',
      productId: hairSerumProduct?.id,
      badge: 'Bedtime Nudge',
      time: '9:45 PM'
    },
    {
      id: 'nudge-dosage-match',
      title: 'Weekly Bottle Depletion Check',
      message: 'Week 2 milestone reached! Verify your physical bottle level matches your ~74% virtual tracker.',
      productId: rollOnProduct?.id,
      badge: 'Clinical Verification',
      time: 'Yesterday'
    }
  ];

  const activeNudge = simulatedNudges[currentNudgeIndex % simulatedNudges.length];

  const handleNextNudge = () => {
    setDismissed(false);
    setCurrentNudgeIndex(prev => prev + 1);
  };

  return (
    <div className="w-full space-y-2">
      {/* Simulation Controls Strip with Prominently Highlighted Weekday Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#005995]/20 shadow-warm-sm">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#005995]">
            <Calendar className="w-4 h-4 text-[#005995]" />
            <span>Select Day:</span>
          </div>

          {/* Weekday Switcher Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#DCEEF7]/70 rounded-xl border border-[#005995]/20">
            {days.map((day) => {
              const isSelected = day.id === currentDayOfWeek;
              const hasRollOn = [1, 3, 5].includes(day.id);
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => onSimulateDayChange(day.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all relative flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#005995] text-white shadow-md ring-2 ring-[#005995] ring-offset-1 scale-105 font-black z-10'
                      : 'bg-white text-[#005995] hover:bg-[#F0F7FB] border border-[#005995]/20 font-bold'
                  }`}
                  title={`${day.full}${hasRollOn ? ' (Active day for AHA BHA 3x/week)' : ' (Rest day for AHA BHA)'}`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{day.label}</span>
                  {hasRollOn && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#005995]'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Highlight Pill */}
          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#005995] text-white shadow-sm">
            Active: {currentDayObj.full}
          </span>
        </div>

        {/* Simulate Next Reminder Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNextNudge}
            className="px-3 py-1.5 rounded-xl bg-[#DCEEF7] hover:bg-[#BDE0F1] border border-[#005995]/30 text-[#005995] text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            title="Cycle through different clinical notification scenarios"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#005995]" />
            <span>Simulate Next Reminder ({currentNudgeIndex % simulatedNudges.length + 1}/{simulatedNudges.length})</span>
          </button>
        </div>
      </div>

      {/* Interactive Notification Nudge Banner */}
      {!dismissed && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00487A] via-[#005995] to-[#00487A] text-white p-3.5 sm:p-4 shadow-warm-lg animate-fade-in border-2 border-[#005995]">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/30">
                <Bell className="w-4 h-4 text-white animate-bounce" />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-black/25 text-white">
                    {activeNudge.badge}
                  </span>
                  <span className="text-[11px] text-[#DCEEF7] font-medium">
                    {activeNudge.time}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight">
                  {activeNudge.title}
                </h4>

                <p className="text-xs text-white/95 leading-relaxed font-normal max-w-2xl">
                  {activeNudge.message}
                </p>
              </div>
            </div>

            {/* Quick Actions & Dismiss */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {activeNudge.productId && onQuickLogDose && (
                <button
                  type="button"
                  onClick={() => onQuickLogDose(activeNudge.productId)}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-[#005995] hover:bg-[#F0F7FB] text-xs font-bold shadow-sm transition-all"
                >
                  <span>Log Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                title="Dismiss reminder"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
