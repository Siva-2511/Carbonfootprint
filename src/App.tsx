import React, { lazy, Suspense, useEffect, useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Calculator } from './components/Profile/Calculator';
import { useStore } from './core/store';

// Lazy-load non-initial tabs
const Scorecard = lazy(() => import('./components/Intelligence/Scorecard').then((m) => ({ default: m.Scorecard })));
const Benchmarking = lazy(() => import('./components/Intelligence/Benchmarking').then((m) => ({ default: m.Benchmarking })));
const ProgressTracker = lazy(() => import('./components/Intelligence/ProgressTracker').then((m) => ({ default: m.ProgressTracker })));
const Roadmap = lazy(() => import('./components/Actions/Roadmap').then((m) => ({ default: m.Roadmap })));
const AdvisorChat = lazy(() => import('./components/Actions/AdvisorChat').then((m) => ({ default: m.AdvisorChat })));
const Simulator = lazy(() => import('./components/Intelligence/Simulator').then((m) => ({ default: m.Simulator })));
const IdentityReport = lazy(() => import('./components/Reports/IdentityReport').then((m) => ({ default: m.IdentityReport })));
const OffsetEstimation = lazy(() => import('./components/Reports/OffsetEstimation').then((m) => ({ default: m.OffsetEstimation })));
const Settings = lazy(() => import('./components/Reports/Settings').then((m) => ({ default: m.Settings })));
const DigitalCalculator = lazy(() => import('./components/EcoLab/DigitalCalculator').then((m) => ({ default: m.DigitalCalculator })));
const ProductCompare = lazy(() => import('./components/EcoLab/ProductCompare').then((m) => ({ default: m.ProductCompare })));
const ReceiptScanner = lazy(() => import('./components/EcoLab/ReceiptScanner').then((m) => ({ default: m.ReceiptScanner })));
const DailyChallenge = lazy(() => import('./components/EcoLab/DailyChallenge').then((m) => ({ default: m.DailyChallenge })));
const RecipeWizard = lazy(() => import('./components/Lifestyle/RecipeWizard').then((m) => ({ default: m.RecipeWizard })));
const TravelRouter = lazy(() => import('./components/Lifestyle/TravelRouter').then((m) => ({ default: m.TravelRouter })));

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20" aria-label="Loading" role="status">
      <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function IntelligenceTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <Scorecard />
      </div>
      <Simulator />
      <Benchmarking />
      <div className="lg:col-span-2">
        <ProgressTracker />
      </div>
    </div>
  );
}
function ActionsTab() {
  return <div className="space-y-6"><Roadmap /><AdvisorChat /></div>;
}
function ReportsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <IdentityReport />
      </div>
      <OffsetEstimation />
      <Settings />
    </div>
  );
}
function EcoLabTab() {
  return <div className="space-y-6"><DailyChallenge /><ReceiptScanner /><ProductCompare /><DigitalCalculator /></div>;
}
function LifestyleTab() {
  return <div className="space-y-6"><RecipeWizard /><TravelRouter /></div>;
}

const TAB_LABELS = ['My Carbon Profile', 'Intelligence Center', 'Action Hub', 'Reports & Settings', 'Eco Lab', 'Lifestyle Planner'];

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useStore((s) => s.settings.theme);
  const evaluateSession = useStore((s) => s.evaluateSession);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { evaluateSession(); }, []);

  return (
    <ErrorBoundary>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div
          role="tabpanel"
          aria-label={TAB_LABELS[activeTab]}
          id={`panel-${activeTab}`}
          className="max-w-3xl mx-auto px-4 py-6"
        >
          <Suspense fallback={<Spinner />}>
            {activeTab === 0 && <Calculator />}
            {activeTab === 1 && <IntelligenceTab />}
            {activeTab === 2 && <ActionsTab />}
            {activeTab === 3 && <ReportsTab />}
            {activeTab === 4 && <EcoLabTab />}
            {activeTab === 5 && <LifestyleTab />}
          </Suspense>
        </div>
      </Layout>
    </ErrorBoundary>
  );
}
