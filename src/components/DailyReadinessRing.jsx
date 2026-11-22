import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export default function DailyReadinessRing({
  productsLogged = 0,
  productsTotal = 3,
  habitsChecked = 0,
  habitsTotal = 6,
  onResetToday = null
}) {
  const totalTasks = productsTotal + habitsTotal;
  const completedTasks = productsLogged + habitsChecked;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // SVG circular ring calculations
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="p-5 rounded-3xl bg-white border border-cream-300 shadow-warm flex flex-col sm:flex-row items-center gap-5">
      {/* Animated Circular SVG Ring */}
      <div className="relative flex-shrink-0">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F4EFEA"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#4D7C6F" // Sage Green
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-charcoal-900 tracking-tight leading-none">
            {percentage}%
          </span>
          <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider mt-0.5">
            Readiness
          </span>
        </div>
      </div>

      {/* Metrics & Clinical Interpretation */}
      <div className="flex-1 space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-sage-100 text-sage-800">
            {percentage === 100 ? 'Optimal Clinical Efficacy' : 'Active Treatment Window'}
          </span>
          <span className="text-xs text-charcoal-500">
            {completedTasks} of {totalTasks} Care Rituals Done
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-charcoal-800">
          {percentage === 100
            ? 'All Product Doses & Micro-Habits Achieved!'
            : percentage >= 50
            ? 'Strong Cellular Exposure Underway Today'
            : 'Maintain Dosing Frequency to Sustain Drug Gradient'}
        </h3>

        {/* Mini progress stats pills */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
          <div className="px-3 py-1 rounded-xl bg-cream-100 border border-cream-200 text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-terracotta-500" />
            <span className="font-semibold text-charcoal-700">Product Doses:</span>
            <span className="font-bold text-charcoal-900">{productsLogged} / {productsTotal}</span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-cream-100 border border-cream-200 text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sage-500" />
            <span className="font-semibold text-charcoal-700">Micro-Habits:</span>
            <span className="font-bold text-charcoal-900">{habitsChecked} / {habitsTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
