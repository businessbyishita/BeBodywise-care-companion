import React, { useState } from 'react';
import { 
  Check, 
  Flame, 
  Clock, 
  Calendar, 
  Droplet, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck,
  Scale,
  Atom,
  Lightbulb
} from 'lucide-react';
import DepletingBottleSvg from './DepletingBottleSvg';
import VisualDosageGuide from './VisualDosageGuide';
import { SCIENCE_HABITS_BY_CONCERN } from '../data/habits';

export default function ProductCard({
  product,
  currentDayOfWeek = 3, // 0=Sun, 1=Mon, ..., 3=Wed, etc.
  checkedHabits = {},
  onToggleHabit = null,
  onLogDose,
  onOpenMatchCheck,
  onOpenDetailModal,
  onRemoveProduct = null
}) {
  const [expandedDosage, setExpandedDosage] = useState(false);
  const [expandedScienceHabitId, setExpandedScienceHabitId] = useState(null);
  const [animatingDrop, setAnimatingDrop] = useState(false);

  // Check if product is scheduled for today's simulated day of week
  const isScheduledToday = product.frequencyDays.includes(currentDayOfWeek);
  const isLoggedToday = product.loggedToday;

  // Retrieve paired science-backed habits for this product's concern
  const pairedConcernGroup = SCIENCE_HABITS_BY_CONCERN[product.concernId];
  const productHabits = pairedConcernGroup?.habits || [];

  const completedHabitsForProduct = productHabits.filter(h => !!checkedHabits[h.id]).length;

  const handleLogClick = () => {
    setAnimatingDrop(true);
    setTimeout(() => {
      setAnimatingDrop(false);
    }, 800);
    onLogDose(product.id);
  };

  const toggleScienceExplanation = (habitId) => {
    setExpandedScienceHabitId(prev => prev === habitId ? null : habitId);
  };

  // Status badge calculation
  let statusBadge = {
    text: 'Due Today',
    bg: 'bg-terracotta-100 text-terracotta-800 border-terracotta-300',
    dot: 'bg-terracotta-500'
  };

  if (isLoggedToday) {
    statusBadge = {
      text: 'Completed Today ✓',
      bg: 'bg-sage-100 text-sage-800 border-sage-300',
      dot: 'bg-sage-500'
    };
  } else if (!isScheduledToday) {
    statusBadge = {
      text: 'Rest Day (Off Today)',
      bg: 'bg-cream-200 text-charcoal-600 border-cream-300',
      dot: 'bg-charcoal-400'
    };
  }

  // Milestone current index
  const activeMilestone = product.timelineMilestones.find(m => m.current) || product.timelineMilestones[0];
  const progressPercent = Math.min(100, Math.round((product.currentWeek / product.cycleWeeksTotal) * 100));

  return (
    <div className={`rounded-3xl border transition-all duration-300 bg-white shadow-warm hover:shadow-warm-lg overflow-hidden ${
      isLoggedToday ? 'border-sage-300/80 ring-1 ring-sage-200/50' : 'border-cream-300'
    }`}>
      {/* Top Banner Bar */}
      <div className="px-5 py-3 border-b border-cream-200/70 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-cream-50 via-white to-cream-50">
        <div className="flex items-center gap-2">
          {/* Target Frequency Badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadge.bg}`}>
            <span className={`w-2 h-2 rounded-full ${statusBadge.dot} ${isScheduledToday && !isLoggedToday ? 'animate-pulse' : ''}`} />
            {product.frequencyLabel} • {statusBadge.text}
          </span>

          <span className="text-[11px] font-semibold text-charcoal-500 hidden sm:inline-block">
            {product.timeOfDay}
          </span>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-200/70 text-charcoal-700 text-xs font-bold">
          <Flame className={`w-3.5 h-3.5 ${product.streakDays > 0 ? 'text-amber-500 fill-amber-500' : 'text-charcoal-400'}`} />
          <span>{product.streakDays} Day Streak</span>
        </div>
      </div>

      {/* Main Card Body */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Upper Section: Product + Bottle + Dosage Action */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Interactive Bottle Level SVG */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <DepletingBottleSvg 
              type={product.bottleType}
              fillPercent={product.currentFillPercent}
              liquidColor={product.liquidColor}
              accentColor={product.colorAccent}
              remainingUses={product.remainingUses}
              totalApplications={product.totalApplications}
              dosePerUseMl={product.dosePerUseMl}
              isAnimating={animatingDrop}
              onOpenMatchCheck={() => onOpenMatchCheck(product)}
              size="md"
            />
            
            <button
              type="button"
              onClick={() => onOpenMatchCheck(product)}
              className="mt-2 text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-800 flex items-center gap-1 underline underline-offset-2 transition-colors"
            >
              <Scale className="w-3 h-3" />
              <span>Verify Bottle Match</span>
            </button>
          </div>

          {/* Product Info & Action Area */}
          <div className="flex-1 space-y-3 w-full">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-cream-200 text-charcoal-600">
                  {product.category} • {product.concern}
                </span>
                <span className="text-xs font-semibold text-charcoal-500">
                  {product.totalVolumeMl} ml Clinical Unit
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-charcoal-900 mt-1">
                {product.name}
              </h3>
              <p className="text-xs text-charcoal-600 mt-0.5 leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Expected Results Timeline Milestone */}
            <div className="p-3 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-charcoal-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-terracotta-500" />
                  <span>Week {product.currentWeek} of {product.cycleWeeksTotal} Milestone:</span>
                </span>
                <span className="font-bold text-terracotta-600">
                  {progressPercent}% Journey
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-cream-200 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progressPercent}%`,
                    backgroundColor: product.colorAccent 
                  }}
                />
              </div>

              <p className="text-[11px] text-charcoal-700">
                <strong className="text-charcoal-900">{activeMilestone.title}: </strong>
                {activeMilestone.desc}
              </p>
            </div>

            {/* Dosage Action & Call to Action */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleLogClick}
                disabled={isLoggedToday}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-95 ${
                  isLoggedToday 
                    ? 'bg-sage-100 text-sage-800 border border-sage-300 cursor-default'
                    : 'bg-terracotta-500 text-white hover:bg-terracotta-600 shadow-terracotta'
                }`}
              >
                {isLoggedToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-sage-600" />
                    <span>Dose Logged for Today ({product.doseDescription})</span>
                  </>
                ) : (
                  <>
                    <Droplet className="w-4 h-4 fill-white" />
                    <span>Log Today's Dose ({product.doseDescription})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onOpenDetailModal(product)}
                className="py-3 px-3.5 rounded-xl text-xs font-bold text-charcoal-700 bg-cream-100 hover:bg-cream-200 border border-cream-300 flex items-center justify-center gap-1.5 transition-colors"
                title="View full clinical study & week-by-week timeline"
              >
                <span>Full Protocol</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= EMBEDDED SCIENCE-BACKED DAILY BOOSTERS TRACKER ================= */}
        {productHabits.length > 0 && (
          <div className="rounded-2xl border border-cream-200 bg-cream-50/70 p-4 space-y-3 shadow-warm-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
                  <Atom className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Science-Backed Daily Boosters</span>
                    <span className="text-[10px] font-semibold text-charcoal-500 normal-case">
                      (Paired for {product.concern.split('&')[0].trim()})
                    </span>
                  </h4>
                </div>
              </div>

              {/* Progress counter badge */}
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                completedHabitsForProduct === productHabits.length
                  ? 'bg-sage-100 text-sage-800 border-sage-300'
                  : 'bg-white text-charcoal-700 border-cream-300'
              }`}>
                {completedHabitsForProduct} of {productHabits.length} Boosters Done
              </span>
            </div>

            {/* List of Habits for this product */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              {productHabits.map((habit) => {
                const isChecked = !!checkedHabits[habit.id];
                const isScienceOpen = expandedScienceHabitId === habit.id;

                return (
                  <div
                    key={habit.id}
                    className={`p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                      isChecked
                        ? 'bg-sage-50/90 border-sage-300 ring-1 ring-sage-200'
                        : 'bg-white border-cream-200 hover:border-cream-300 shadow-warm-sm'
                    }`}
                  >
                    <div>
                      {/* Top Action Tag */}
                      <div className="flex items-center justify-between text-[9px] text-charcoal-500 mb-1.5">
                        <span className="font-semibold px-1.5 py-0.5 rounded bg-cream-100 text-charcoal-600">
                          {habit.actionType}
                        </span>
                        <span className="font-medium text-charcoal-400">{habit.duration}</span>
                      </div>

                      {/* Checkbox & Title */}
                      <label 
                        className="flex items-start gap-2.5 cursor-pointer select-none group"
                        onClick={(e) => {
                          e.preventDefault();
                          onToggleHabit && onToggleHabit(habit.id);
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                            isChecked
                              ? 'bg-sage-500 border-sage-600 text-white shadow-sm'
                              : 'border-cream-400 bg-cream-50 group-hover:border-sage-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        <div className="flex-1">
                          <p className={`text-xs font-bold leading-tight transition-colors ${
                            isChecked ? 'text-sage-900 line-through decoration-sage-400' : 'text-charcoal-800'
                          }`}>
                            {habit.title}
                          </p>
                          <p className="text-[11px] text-charcoal-500 mt-0.5 leading-snug">
                            {habit.shortDesc}
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Expandable "The Science" dropdown */}
                    <div className="mt-2.5 pt-2 border-t border-cream-200/80">
                      <button
                        type="button"
                        onClick={() => toggleScienceExplanation(habit.id)}
                        className="flex items-center justify-between w-full text-[10px] font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors"
                      >
                        <span className="flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-terracotta-500" />
                          <span>The Science</span>
                        </span>
                        {isScienceOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {isScienceOpen && (
                        <div className="mt-1.5 p-2 rounded-lg bg-cream-100/90 border border-cream-200 text-[10px] text-charcoal-700 leading-relaxed animate-fade-in">
                          {habit.science}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Collapsible Dosage & Why Rationing Fails Guide */}
        <div className="pt-3 border-t border-cream-200">
          <div 
            className="flex items-center justify-between cursor-pointer select-none py-1 text-charcoal-700 hover:text-charcoal-900"
            onClick={() => setExpandedDosage(!expandedDosage)}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-terracotta-500" />
              <span className="text-xs font-bold tracking-tight">
                {expandedDosage ? 'Hide Clinical Dosage & Rationing Guide' : 'View Clinical Dosage Guide & Application Spec'}
              </span>
            </div>
            <button type="button" className="text-charcoal-500">
              {expandedDosage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {expandedDosage && (
            <div className="mt-3 animate-fade-in space-y-4">
              <VisualDosageGuide product={product} compact={false} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
