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
  const [boostersOpen, setBoostersOpen] = useState(true); // Dropdown for daily boosters inside line item
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

  // Status badge calculation for top brand strip
  let statusBadge = {
    text: 'Due Today',
    bg: 'bg-white/20 text-white border-white/30',
    dot: 'bg-white animate-pulse'
  };

  if (isLoggedToday) {
    statusBadge = {
      text: 'Completed Today ✓',
      bg: 'bg-white text-[#005995] border-white font-extrabold',
      dot: 'bg-[#005995]'
    };
  } else if (!isScheduledToday) {
    statusBadge = {
      text: 'Rest Day (Off Today)',
      bg: 'bg-white/10 text-white/80 border-white/20',
      dot: 'bg-white/50'
    };
  }

  // Milestone current index
  const activeMilestone = product.timelineMilestones.find(m => m.current) || product.timelineMilestones[0];
  const progressPercent = Math.min(100, Math.round((product.currentWeek / product.cycleWeeksTotal) * 100));

  return (
    <div className={`rounded-3xl border-2 transition-all duration-300 bg-white shadow-warm hover:shadow-warm-lg overflow-hidden ${
      isLoggedToday ? 'border-[#005995] ring-2 ring-[#005995]/20' : 'border-[#005995]/25 hover:border-[#005995]/50'
    }`}>
      {/* Top Banner Bar in Rich Brand #005995 */}
      <div className="px-5 py-3.5 bg-[#005995] text-white flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2">
          {/* Target Frequency Badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-sm ${statusBadge.bg}`}>
            <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
            {product.frequencyLabel} • {statusBadge.text}
          </span>

          <span className="text-[11px] font-medium text-white/80 hidden sm:inline-block">
            {product.timeOfDay}
          </span>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30 backdrop-blur-sm">
          <Flame className="w-3.5 h-3.5 fill-white text-white" />
          <span>{product.streakDays} Day Streak</span>
        </div>
      </div>

      {/* Main Card Body */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Upper Section: Product + Bottle + Dosage Action */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Interactive Bottle Level SVG */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <DepletingBottleSvg 
              type={product.bottleType}
              fillPercent={product.currentFillPercent}
              liquidColor="rgba(0, 89, 149, 0.55)"
              accentColor="#005995"
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
              className="mt-2 text-[11px] font-bold text-[#005995] hover:text-[#00385F] flex items-center gap-1 underline underline-offset-2 transition-colors"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Verify Bottle Match</span>
            </button>
          </div>

          {/* Product Info & Action Area */}
          <div className="flex-1 space-y-3 w-full">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#005995] text-white shadow-sm">
                  {product.category} • {product.concern}
                </span>
                <span className="text-xs font-bold text-[#005995]">
                  {product.totalVolumeMl} ml Clinical Unit
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-[#002742] mt-1.5">
                {product.name}
              </h3>
              <p className="text-xs text-[#00487A] mt-0.5 leading-relaxed font-medium">
                {product.tagline}
              </p>
            </div>

            {/* Expected Results Timeline Milestone in #005995 tint */}
            <div className="p-3.5 rounded-2xl bg-[#F0F7FB] border border-[#005995]/25 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#002742] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#005995]" />
                  <span>Week {product.currentWeek} of {product.cycleWeeksTotal} Milestone:</span>
                </span>
                <span className="font-extrabold text-[#005995]">
                  {progressPercent}% Journey
                </span>
              </div>

              {/* Progress Bar in #005995 */}
              <div className="w-full h-2.5 rounded-full bg-[#DCEEF7] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-[#005995] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-[#00385F] leading-snug">
                <strong className="text-[#002742] font-bold">{activeMilestone.title}: </strong>
                {activeMilestone.desc}
              </p>
            </div>

            {/* Dosage Action & Call to Action */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleLogClick}
                disabled={isLoggedToday}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all duration-200 active:scale-95 ${
                  isLoggedToday 
                    ? 'bg-[#005995] text-white border-2 border-[#00487A] cursor-default'
                    : 'bg-[#005995] text-white hover:bg-[#00487A] shadow-[#005995]/30'
                }`}
              >
                {isLoggedToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
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
                className="py-3 px-4 rounded-xl text-xs font-bold text-[#005995] bg-white hover:bg-[#F0F7FB] border-2 border-[#005995] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                title="View full clinical study & week-by-week timeline"
              >
                <span>Full Protocol</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#005995]" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= EMBEDDED SCIENCE-BACKED DAILY BOOSTERS AS A DROPDOWN IN #005995 ================= */}
        {productHabits.length > 0 && (
          <div className="rounded-2xl border-2 border-[#005995]/30 bg-[#F0F7FB] overflow-hidden transition-all shadow-sm">
            {/* Clickable Dropdown Trigger Header with Rich #005995 Styling */}
            <div 
              className="p-3.5 bg-[#005995] text-white flex items-center justify-between cursor-pointer select-none hover:bg-[#00487A] transition-colors"
              onClick={() => setBoostersOpen(!boostersOpen)}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30">
                  <Atom className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>Science-Backed Daily Boosters</span>
                    <span className="text-[10px] font-medium text-white/80 normal-case hidden sm:inline">
                      (Paired for {product.concern.split('&')[0].trim()})
                    </span>
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Progress counter badge */}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-[#005995] shadow-sm">
                  {completedHabitsForProduct} of {productHabits.length} Done
                </span>

                <button 
                  type="button" 
                  className="text-white p-0.5 rounded hover:bg-white/10 transition-colors"
                  aria-label="Toggle boosters dropdown"
                >
                  {boostersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Dropdown Collapsible Content */}
            {boostersOpen && (
              <div className="p-3.5 space-y-2.5 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {productHabits.map((habit) => {
                    const isChecked = !!checkedHabits[habit.id];
                    const isScienceOpen = expandedScienceHabitId === habit.id;

                    return (
                      <div
                        key={habit.id}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between ${
                          isChecked
                            ? 'bg-white border-[#005995] ring-2 ring-[#005995]/20 shadow-sm'
                            : 'bg-white border-[#005995]/20 hover:border-[#005995]/40 shadow-sm'
                        }`}
                      >
                        <div>
                          {/* Top Action Tag */}
                          <div className="flex items-center justify-between text-[9px] mb-1.5">
                            <span className="font-bold px-2 py-0.5 rounded bg-[#DCEEF7] text-[#005995]">
                              {habit.actionType}
                            </span>
                            <span className="font-semibold text-[#00487A]">{habit.duration}</span>
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
                              className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                                isChecked
                                  ? 'bg-[#005995] border-[#005995] text-white shadow-sm'
                                  : 'border-[#005995]/40 bg-white group-hover:border-[#005995]'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>

                            <div className="flex-1">
                              <p className={`text-xs font-bold leading-tight transition-colors ${
                                isChecked ? 'text-[#005995] line-through' : 'text-[#002742]'
                              }`}>
                                {habit.title}
                              </p>
                              <p className="text-[11px] text-[#00487A] mt-0.5 leading-snug">
                                {habit.shortDesc}
                              </p>
                            </div>
                          </label>
                        </div>

                        {/* Expandable "The Science" dropdown in #005995 */}
                        <div className="mt-2.5 pt-2 border-t border-[#DCEEF7]">
                          <button
                            type="button"
                            onClick={() => toggleScienceExplanation(habit.id)}
                            className="flex items-center justify-between w-full text-[10px] font-bold text-[#005995] hover:text-[#00385F] transition-colors"
                          >
                            <span className="flex items-center gap-1">
                              <Lightbulb className="w-3 h-3 text-[#005995]" />
                              <span>The Science</span>
                            </span>
                            {isScienceOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          {isScienceOpen && (
                            <div className="mt-1.5 p-2.5 rounded-lg bg-[#F0F7FB] border border-[#005995]/25 text-[10px] text-[#00385F] leading-relaxed animate-fade-in">
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
          </div>
        )}

        {/* Collapsible Dosage & Why Rationing Fails Guide */}
        <div className="pt-2 border-t border-[#DCEEF7]">
          <div 
            className="flex items-center justify-between cursor-pointer select-none py-1 text-[#005995] hover:text-[#00385F]"
            onClick={() => setExpandedDosage(!expandedDosage)}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#005995]" />
              <span className="text-xs font-bold tracking-tight">
                {expandedDosage ? 'Hide Clinical Dosage & Rationing Guide' : 'View Clinical Dosage Guide & Application Spec'}
              </span>
            </div>
            <button type="button" className="text-[#005995]">
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
