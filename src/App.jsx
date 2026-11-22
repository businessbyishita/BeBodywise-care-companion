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

const STORAGE_KEY = 'bodywise_care_companion_state_v3';

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

  // Shelf view mode: 'today' (strictly only products scheduled for today) or 'all'
  const [shelfFilter, setShelfFilter] = useState('today');

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

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#E87A64', '#4D7C6F', '#FAF8F5']
      });
    } catch (e) {}

    const targetProduct = activeProducts.find(p => p.id === productId);
    triggerToast(`Logged dose for ${targetProduct?.shortName || 'product'}! Liquid dropped by ${targetProduct?.dosePerUseMl || 0.5} ml.`);

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
        triggerToast('Micro-habit checked! Daily readiness boosted.');
      }
      return nextState;
    });
  };

  // 3. Add SKU to active shelf
  const handleAddProduct = (newProduct) => {
    if (activeProducts.some(p => p.id === newProduct.id)) {
      triggerToast('Product is already active on your shelf!');
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
      setShelfFilter('today');
      triggerToast('Demo reset successfully to initial Be Bodywise clinical state!');
    }
  };

  // ----------------------------------------------------
  // Filter products by schedule:
  // On days the product is not supposed to be used, it is completely removed from showing!
  // ----------------------------------------------------
  const productsScheduledToday = activeProducts.filter(p => p.frequencyDays.includes(simulatedDay));
  const productsDisplayed = shelfFilter === 'today' ? productsScheduledToday : activeProducts;

  // ----------------------------------------------------
  // Derived Readiness Metrics for Today's Scheduled Care
  // ----------------------------------------------------
  const productsDueToday = productsScheduledToday;
  const productsLoggedToday = productsDueToday.filter(p => p.loggedToday).length;

  // Active concerns from today's scheduled products
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
    <div className="min-h-screen bg-cream-100 text-charcoal-800 flex flex-col items-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-900 text-white px-4 py-3 rounded-2xl shadow-warm-lg border border-charcoal-700 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-terracotta-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Wrapper (Responsive / Mobile-frame toggleable) */}
      <div className={`w-full transition-all duration-300 ${
        viewMode === 'mobile-frame' 
          ? 'max-w-md my-6 rounded-[44px] shadow-2xl border-[10px] border-charcoal-800 bg-cream-100 overflow-hidden ring-8 ring-charcoal-700/20' 
          : 'max-w-5xl'
      }`}>
        {/* ================= HEADER ================= */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200 px-4 sm:px-6 py-3.5 shadow-warm-sm">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Clinical Subtitle */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-terracotta-500 to-terracotta-400 flex items-center justify-center text-white shadow-terracotta">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-widest uppercase text-terracotta-600">
                    BE BODYWISE
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cream-200 text-charcoal-600">
                    CLINICAL
                  </span>
                </div>
                <h1 className="text-sm sm:text-base font-extrabold text-charcoal-900 leading-none">
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
                className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-cream-300 bg-cream-50 hover:bg-cream-200 text-charcoal-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                title="Reset all routine doses and bottle depletion levels to initial demo state"
              >
                <RotateCcw className="w-3.5 h-3.5 text-terracotta-600" />
                <span className="hidden sm:inline">Reset Demo</span>
              </button>

              {/* + Add Product Button */}
              <button
                type="button"
                onClick={() => setIsAddDrawerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-terracotta"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Product</span>
              </button>

              {/* Viewport Frame Toggle */}
              <div className="hidden lg:flex items-center border border-cream-300 rounded-xl overflow-hidden p-0.5 bg-cream-100">
                <button
                  type="button"
                  onClick={() => setViewMode('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    viewMode === 'desktop' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-charcoal-800'
                  }`}
                  title="Full-width Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('mobile-frame')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    viewMode === 'mobile-frame' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-charcoal-800'
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
          {/* Welcome & Clinical Intent Banner (Strictly Privacy-Preserving) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-white via-cream-50 to-white border border-cream-300 shadow-warm">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-terracotta-600">
                Post-Purchase Clinical Companion
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-charcoal-900 tracking-tight mt-0.5">
                Your Routine & Dosage Protocol
              </h2>
              <p className="text-xs text-charcoal-600 mt-1 max-w-xl leading-relaxed">
                Formulated actives deliver transformative results when applied at the correct frequency and clinical volume. Track your liquid depletion to prevent under-dosing.
              </p>
            </div>

            {/* Quick summary stats */}
            <div className="flex items-center gap-3 self-start sm:self-auto pt-1 sm:pt-0">
              <div className="px-3.5 py-2 rounded-2xl bg-white border border-cream-200 text-center shadow-warm-sm">
                <p className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider">Scheduled Today</p>
                <p className="text-sm font-extrabold text-charcoal-900">{productsScheduledToday.length} Products</p>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-white border border-cream-200 text-center shadow-warm-sm">
                <p className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider">Best Streak</p>
                <p className="text-sm font-extrabold text-amber-600 flex items-center justify-center gap-0.5">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{Math.max(...activeProducts.map(p => p.streakDays), 0)} Days</span>
                </p>
              </div>
            </div>
          </div>

          {/* 1. Smart Frequency Reminders & Notification Simulator */}
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

          {/* Daily Readiness Ring Card (Dynamically tied to today's active items) */}
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
                  Daily Protocols
                </span>
                <h3 className="text-lg font-bold text-charcoal-900">
                  {shelfFilter === 'today'
                    ? `Active Routine for ${DAY_NAMES[simulatedDay]}`
                    : 'All Routine Shelf Products'}
                </h3>
              </div>

              {/* Shelf Filter Toggle */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="flex items-center p-0.5 bg-cream-200/80 rounded-xl border border-cream-300 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setShelfFilter('today')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      shelfFilter === 'today'
                        ? 'bg-white text-charcoal-900 shadow-sm'
                        : 'text-charcoal-600 hover:text-charcoal-800'
                    }`}
                  >
                    Scheduled Today ({productsScheduledToday.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setShelfFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      shelfFilter === 'all'
                        ? 'bg-white text-charcoal-900 shadow-sm'
                        : 'text-charcoal-600 hover:text-charcoal-800'
                    }`}
                  >
                    All Shelf SKUs ({activeProducts.length})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddDrawerOpen(true)}
                  className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-cream-300 bg-white hover:bg-cream-50 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add SKU</span>
                </button>
              </div>
            </div>

            {/* List of Product Cards (Each with integrated Science-Backed Daily Boosters) */}
            {productsDisplayed.length > 0 ? (
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
            ) : (
              /* Rest day state when no products are scheduled on this day */
              <div className="p-8 rounded-3xl bg-white border border-cream-300 shadow-warm text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto text-charcoal-500">
                  <Coffee className="w-6 h-6 text-terracotta-500" />
                </div>
                <h4 className="text-base font-bold text-charcoal-800">
                  Rest & Barrier Recovery Day
                </h4>
                <p className="text-xs text-charcoal-600 max-w-md mx-auto leading-relaxed">
                  No active exfoliants or chemical treatments are scheduled for {DAY_NAMES[simulatedDay]}. Your skin lipid barrier is resting and regenerating. See you on your next scheduled dose!
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShelfFilter('all')}
                    className="text-xs font-bold text-terracotta-600 hover:underline"
                  >
                    View all {activeProducts.length} shelf products →
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Educational Clinical Footer Card */}
          <footer className="p-5 rounded-3xl bg-white border border-cream-300 shadow-warm text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center mx-auto text-charcoal-600">
              <ShieldCheck className="w-4 h-4 text-terracotta-500" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-800">
              The Be Bodywise Clinical Commitment
            </h4>
            <p className="text-xs text-charcoal-600 max-w-lg mx-auto leading-relaxed">
              Dermatologically tested formulations designed for female physiology. Active ingredients calibrated to deliver clinical cellular turnover over a 4–12 week period.
            </p>
            <div className="pt-2 text-[11px] text-charcoal-400 font-medium">
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
