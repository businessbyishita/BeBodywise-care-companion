# Bodywise Care Companion 🧴✨

A modern, mobile-first clinical web application designed for **Be Bodywise** to prevent post-purchase drop-off, eliminate under-dosing / rationing of active ingredients, and build science-backed micro-habits alongside purchased products.

---

## 🌟 Key Features

1. **Active Routine Dashboard & Smart Frequency Reminders**
   - Pre-populated with 3 core Be Bodywise products:
     - **AHA BHA Underarm Roll-On (6%)**: 3x a week (Mon, Wed, Fri) • 6-week target cycle
     - **1% Salicylic Acid Daily Body Wash**: Daily (PM Shower) • 4-week target cycle
     - **Rosemary & Redensyl Hair Growth Serum**: Daily (Bedtime) • 12-week target cycle
   - **Interactive Notification Preview & Simulator**: Cycle reminders and simulate different weekdays (Mon–Sun) to observe dynamic schedule badges.
   - **+ Add Purchased Product Drawer**: Custom shelf builder featuring 5 preset Be Bodywise SKUs.

2. **Visual Dosage Guide & Interactive Depleting Bottle Tracker**
   - **Illustrated Dosage Reference**: Clean SVG illustrations comparing the exact prescribed dose (e.g. 2 firm swipes, 5 ml coin pump, 1 ml dropper) vs rationing.
   - **Why Rationing Slows Results**: Explains concentration thresholds and why sub-therapeutic doses delay clinical outcomes.
   - **Animated Depleting SVG Bottles**: Semi-transparent liquid level indicators (roll-on, pump, dropper, jar) with graduation marks and wave meniscuses.
   - **Physical Bottle Match Check**: Interactive modal prompting users to verify their physical bottle level with calibration options.

3. **Science-Backed Micro-Habits Companion (Daily Boosters)**
   - Paired dynamically by active product concern (*Underarms, Body Acne, Hair Fall*).
   - Interactive checkboxes updating a real-time **Daily Readiness Ring**.
   - Expandable **"The Science Behind This"** tooltips detailing the dermatological reasoning.

4. **Clinical Aesthetics & Privacy**
   - Warm clinical palette: Cream (`#FAF8F5`), Terracotta (`#E87A64`), Charcoal (`#1F2937`), and Sage Green (`#4D7C6F`).
   - Zero customer personal contact fields.
   - Persistent `localStorage` with a prominent **"Reset Demo"** button.
   - Toggle between **Desktop View** and **iPhone Mobile App Frame**.

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/bodywise-care-companion.git
cd bodywise-care-companion

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Deployment to GitHub Pages

### Option 1: Automated Deployment via GitHub Actions (Recommended)
1. Push this project to a new repository on GitHub.
2. In your repository on GitHub, go to **Settings** &rarr; **Pages**.
3. Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
4. GitHub will detect Vite and deploy your static build automatically!

### Option 2: Deploying via `gh-pages`
```bash
# 1. Install gh-pages
npm install -D gh-pages

# 2. Add deploy scripts to package.json:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# 3. Deploy
npm run deploy
```

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations / Effects**: Canvas Confetti, SVG Clip Paths & Transitions
