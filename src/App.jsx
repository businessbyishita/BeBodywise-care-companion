import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Plus, 
  Droplet, 
  CheckCircle2, 
  ShieldCheck, 
  Bell, 
  Calendar, 
  Flame, 
  ChevronRight, 
  SlidersHorizontal,
  Smartphone,
  Monitor,
  HeartHandshake,
  Coffee,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { DEFAULT_ACTIVE_PRODUCTS } from './data/products';
import { SCIENCE_HABITS_BY_CONCERN } from './data/habits';

import ProductCard from './components/ProductCard';
import NotificationBanner from './components/NotificationBanner';
import DailyReadinessRing from './components/DailyReadinessRing';
import AddProductDrawer from './components/AddProductDrawer';
import BottleMatchModal from './components/BottleMatchModal';
import ProductDetailModal from './components/ProductDetailModal';

const STORAGE_KEY = 'bodywise_care_companion_state_v6';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function App() {
  // ----------------------------------------------------
  // Persistent State
  // ----------------------------------------------------
  const [activeProducts, setActiveProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeProducts && parsed.activeProducts.length > 0) {
          return parsed.activeProducts;
        }
      }
    } catch (e) {
      console.error('Error loading state:', e);
    }
    return DEFAULT_ACTIVE_PRODUCTS;
  });

  const [checkedHabits, setCheckedHabits] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.checkedHabits) return parsed.checkedHabits;
      }
    } catch (e) {
      console.error('Error loading checked habits:', e);
    }
    // Pre-check 1 habit for friendly initial state
    return { 'habit-dry-60s': true };
  });

  const [simulatedDay, setSimulatedDay] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.simulatedDay === 'number') return parsed.simulatedDay;
      }
    } catch (e) {
      console.error(e);
    }
    return 3; // Wednesday by default (Active day for AHA BHA 3x/week!)
  });

  // Shelf view mode: 'all' (default: nothing disappears, rest days clearly highlighted!) or 'due_only'
  const [shelfFilter, setShelfFilter] = useState('all');

  // Mobile container preview mode toggle ('desktop' | 'mobile-frame')
  const [viewMode, setViewMode] = useState('desktop');

  // Modals & Drawers
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [matchCheckProduct, setMatchCheckProduct] = useState(null);
  const [detailModalProduct, setDetailModalProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        activeProducts,
        checkedHabits,
        simulatedDay
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }, [activeProducts, checkedHabits, simulatedDay]);

  // Show Toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // ----------------------------------------------------
  // Core Actions
  // ----------------------------------------------------

  // 1. Log Today's Dose with fluid drop animation & bottle match prompt
  const handleLogDose = (productId) => {
    setActiveProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;

      // Calculate new remaining uses and fill percent
      const newRemainingUses = Math.max(0, p.remainingUses - 1);
      // Deplete fill percent by one exact dose fraction
      const dosePercentDrop = (p.dosePerUseMl / p.totalVolumeMl) * 100;
      const newFillPercent = Math.max(2, Math.round(p.currentFillPercent - dosePercentDrop));

      return {
        ...p,
        remainingUses: newRemainingUses,
        currentFillPercent: newFillPercent,
        loggedToday: true,
        streakDays: p.streakDays + 1
      };
    }));

    // Trigger celebratory confetti in #005995 brand shades and white
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#005995', '#4DA8D5', '#FFFFFF', '#DCEEF7']
      });
    } catch (e) {}

    const targetProduct = activeProducts.find(p => p.id === productId);
    triggerToast(`Logged dose for ${targetProduct?.shortName || 'item'}! Liquid dropped by ${targetProduct?.dosePerUseMl || 0.5} ml.`);

    // Prompt the Bottle Match Check modal after a brief pause so user watches the fluid drop
    setTimeout(() => {
      if (targetProduct) {
        const updated = {
          ...targetProduct,
          remainingUses: Math.max(0, targetProduct.remainingUses - 1),
          currentFillPercent: Math.max(2, Math.round(targetProduct.currentFillPercent - ((targetProduct.dosePerUseMl / targetProduct.totalVolumeMl) * 100)))
        };
        setMatchCheckProduct(updated);
      }
    }, 900);
  };

  // 2. Toggle Micro-habit
  const handleToggleHabit = (habitId) => {
    setCheckedHabits(prev => {
      const nextState = {
        ...prev,
        [habitId]: !prev[habitId]
      };
      if (nextState[habitId]) {
        triggerToast('Daily booster checked! Readiness boosted.');
      }
      return nextState;
    });
  };

  // 3. Add item to active shelf
  const handleAddProduct = (newProduct) => {
    if (activeProducts.some(p => p.id === newProduct.id)) {
      triggerToast('Item is already active on your shelf!');
      return;
    }
    setActiveProducts(prev => [newProduct, ...prev]);
    triggerToast(`Added ${newProduct.shortName} to your routine shelf!`);
  };

  // 4. Update Fill Percent from Calibration
  const handleUpdateFillPercent = (productId, newPercent) => {
    setActiveProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return {
        ...p,
        currentFillPercent: newPercent,
        remainingUses: Math.round((newPercent / 100) * p.totalApplications)
      };
    }));
    triggerToast(`Calibrated virtual bottle to ${newPercent}% full.`);
  };

  // 5. Reset Demo to initial state
  const handleResetDemo = () => {
    if (window.confirm('Reset all routine doses, bottle levels, and habit streaks to default Be Bodywise demo state?')) {
      localStorage.removeItem(STORAGE_KEY);
      setActiveProducts(DEFAULT_ACTIVE_PRODUCTS);
      setCheckedHabits({ 'habit-dry-60s': true });
      setSimulatedDay(3);
      setShelfFilter('all');
      triggerToast('Demo reset successfully to initial Be Bodywise clinical state!');
    }
  };

  // ----------------------------------------------------
  // Product display list:
  // By default, ALL items stay visible on shelf so nothing disappears!
  // Products not scheduled for today are prominently HIGHLIGHTED as Rest Days.
  // ----------------------------------------------------
  const productsScheduledToday = activeProducts.filter(p => p.frequencyDays.includes(simulatedDay));
  const productsDisplayed = shelfFilter === 'due_only' ? productsScheduledToday : activeProducts;

  // ----------------------------------------------------
  // Derived Readiness Metrics for Today's Scheduled Care
  // ----------------------------------------------------
  const productsDueToday = productsScheduledToday;
  const productsLoggedToday = productsDueToday.filter(p => p.loggedToday).length;

  const todayConcerns = Array.from(new Set(productsDueToday.map(p => p.concernId)));

  let habitsTotalCount = 0;
  let habitsCheckedCount = 0;
  todayConcerns.forEach(cKey => {
    const group = SCIENCE_HABITS_BY_CONCERN[cKey];
    if (group) {
      group.habits.forEach(h => {
        habitsTotalCount++;
        if (checkedHabits[h.id]) habitsCheckedCount++;
      });
    }
  });

  return (
    <div className="min-h-screen bg-[#F0F7FB] text-[#002742] flex flex-col items-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#002742] text-white px-4 py-3 rounded-2xl shadow-warm-lg border-2 border-[#005995] text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#8CC7E5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Wrapper (Responsive / Mobile-frame toggleable) */}
      <div className={`w-full transition-all duration-300 ${
        viewMode === 'mobile-frame' 
          ? 'max-w-md my-6 rounded-[44px] shadow-2xl border-[10px] border-[#002742] bg-[#F0F7FB] overflow-hidden ring-8 ring-[#005995]/20' 
          : 'max-w-5xl'
      }`}>
        {/* ================= HEADER IN PROMINENT BRAND #005995 ================= */}
        <header className="sticky top-0 z-40 bg-[#005995] text-white border-b-2 border-[#00487A] px-4 sm:px-6 py-4 shadow-md">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Clinical Subtitle */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#005995] shadow-sm">
                <ShieldCheck className="w-6 h-6 text-[#005995]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-widest uppercase text-white">
                    BE BODYWISE
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                    CLINICAL
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-black text-white leading-tight">
                  Care Companion
                </h1>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Reset Demo Button */}
              <button
                type="button"
                onClick={handleResetDemo}
                className="px-3 py-1.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm backdrop-blur-sm"
                title="Reset all routine doses and bottle depletion levels to initial demo state"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Reset Demo</span>
              </button>

              {/* + Add Item Button */}
              <button
                type="button"
                onClick={() => setIsAddDrawerOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white text-[#005995] hover:bg-[#F0F7FB] text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">Add Item</span>
              </button>

              {/* Viewport Frame Toggle */}
              <div className="hidden lg:flex items-center border border-white/30 rounded-xl overflow-hidden p-0.5 bg-[#00487A]">
                <button
                  type="button"
                  onClick={() => setViewMode('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    viewMode === 'desktop' ? 'bg-white text-[#005995] shadow-sm font-bold' : 'text-white/80 hover:text-white'
                  }`}
                  title="Full-width Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('mobile-frame')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    viewMode === 'mobile-frame' ? 'bg-white text-[#005995] shadow-sm font-bold' : 'text-white/80 hover:text-white'
                  }`}
                  title="Mobile App Viewport Frame"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ================= MAIN CONTENT ================= */}
        <main className="p-4 sm:p-6 space-y-6">
          {/* Welcome & Clinical Intent Hero Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#005995] via-[#00487A] to-[#00385F] text-white shadow-bodywise border-2 border-[#005995]">
            <div className="space-y-1 max-w-xl">
              <span className="inline-block text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                Post-Purchase Clinical Companion
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Your Routine & Dosage Protocol
              </h2>
              <p className="text-xs text-white/90 leading-relaxed font-normal">
                Formulated actives deliver transformative results when applied at the correct frequency and clinical volume. Track your liquid depletion to prevent under-dosing.
              </p>
            </div>

            {/* Quick summary stats in semi-transparent glass */}
            <div className="flex items-center gap-3 self-start sm:self-auto pt-1 sm:pt-0">
              <div className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-center shadow-sm">
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Due Today</p>
                <p className="text-base font-black text-white">{productsScheduledToday.length} of {activeProducts.length} Items</p>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-center shadow-sm">
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Best Streak</p>
                <p className="text-base font-black text-white flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-white text-white" />
                  <span>{Math.max(...activeProducts.map(p => p.streakDays), 0)} Days</span>
                </p>
              </div>
            </div>
          </div>

          {/* 1. Smart Frequency Reminders & Prominently Highlighted Day Switcher */}
          <section className="space-y-2">
            <NotificationBanner 
              currentDayOfWeek={simulatedDay}
              activeProducts={activeProducts}
              onSimulateDayChange={(newDay) => {
                setSimulatedDay(newDay);
                triggerToast(`Simulating ${DAY_NAMES[newDay]} schedule.`);
              }}
              onQuickLogDose={handleLogDose}
            />
          </section>

          {/* Daily Readiness Ring Card */}
          <section>
            <DailyReadinessRing 
              productsLogged={productsLoggedToday}
              productsTotal={productsDueToday.length}
              habitsChecked={habitsCheckedCount}
              habitsTotal={habitsTotalCount}
            />
          </section>

          {/* 2. Active Routine Dashboard & Depleting Bottle Tracker Shelf */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#005995]">
                  Daily Protocols
                </span>
                <h3 className="text-lg font-black text-[#002742]">
                  {shelfFilter === 'due_only'
                    ? `Due Today on ${DAY_NAMES[simulatedDay]} (${productsScheduledToday.length} Items)`
                    : `Active Routine Shelf for ${DAY_NAMES[simulatedDay]} (${activeProducts.length} Items)`}
                </h3>
              </div>

              {/* Shelf Filter Toggle */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="flex items-center p-1 bg-[#DCEEF7] rounded-xl border border-[#005995]/30 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setShelfFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      shelfFilter === 'all'
                        ? 'bg-[#005995] text-white shadow-sm'
                        : 'text-[#005995] hover:text-[#00385F]'
                    }`}
                  >
                    All Shelf Items ({activeProducts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setShelfFilter('due_only')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      shelfFilter === 'due_only'
                        ? 'bg-[#005995] text-white shadow-sm'
                        : 'text-[#005995] hover:text-[#00385F]'
                    }`}
                  >
                    Due Today Only ({productsScheduledToday.length})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddDrawerOpen(true)}
                  className="text-xs font-bold text-white bg-[#005995] hover:bg-[#00487A] flex items-center gap-1 px-3 py-2 rounded-xl border border-[#005995] transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            {/* List of Product Cards (Each with integrated Science-Backed Daily Boosters as a Dropdown) */}
            <div className="space-y-5">
              {productsDisplayed.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  currentDayOfWeek={simulatedDay}
                  checkedHabits={checkedHabits}
                  onToggleHabit={handleToggleHabit}
                  onLogDose={handleLogDose}
                  onOpenMatchCheck={(prod) => setMatchCheckProduct(prod)}
                  onOpenDetailModal={(prod) => setDetailModalProduct(prod)}
                />
              ))}
            </div>
          </section>

          {/* Educational Clinical Footer Card */}
          <footer className="p-5 rounded-3xl bg-white border-2 border-[#005995]/20 shadow-warm text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#005995] flex items-center justify-center mx-auto text-white shadow-sm">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#005995]">
              The Be Bodywise Clinical Commitment
            </h4>
            <p className="text-xs text-[#00487A] max-w-lg mx-auto leading-relaxed">
              Dermatologically tested formulations designed for female physiology. Active ingredients calibrated to deliver clinical cellular turnover over a 4–12 week period.
            </p>
            <div className="pt-2 text-[11px] text-[#005995] font-semibold">
              Bodywise Care Companion • Interactive Post-Purchase Experience
            </div>
          </footer>
        </main>
      </div>

      {/* ================= MODALS & DRAWERS ================= */}
      {/* 1. Add Product Drawer */}
      <AddProductDrawer 
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        activeProductIds={activeProducts.map(p => p.id)}
        onAddProduct={handleAddProduct}
      />

      {/* 2. Physical Bottle Match Check Modal */}
      {matchCheckProduct && (
        <BottleMatchModal 
          product={matchCheckProduct}
          onClose={() => setMatchCheckProduct(null)}
          onUpdateFillPercent={handleUpdateFillPercent}
        />
      )}

      {/* 3. Deep Clinical Detail & Protocol Modal */}
      {detailModalProduct && (
        <ProductDetailModal 
          product={detailModalProduct}
          onClose={() => setDetailModalProduct(null)}
          onOpenMatchCheck={(prod) => setMatchCheckProduct(prod)}
        />
      )}
    </div>
  );
}
