import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AppProvider } from "./contexts/AppContext";
import Onboarding from "./pages/Onboarding";
import ChildProfileSetup from "./pages/ChildProfileSetup";
import Dashboard from "./pages/Dashboard";
import BottomNavigation from "./components/BottomNavigation";
import { useAuth } from "@/_core/hooks/useAuth";
import { Suspense, lazy, useEffect } from "react";
import { useAppContext } from "./contexts/AppContext";
import { trpc } from "./lib/trpc";
import type { ChildProfile } from "./contexts/AppContext";

const Meals = lazy(() => import('./pages/Meals'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const Advice = lazy(() => import('./pages/Advice'));
const Symptoms = lazy(() => import('./pages/Symptoms'));
const Growth = lazy(() => import('./pages/Growth'));
const Vaccines = lazy(() => import('./pages/Vaccines'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Insights = lazy(() => import('./pages/Insights'));
const Settings = lazy(() => import('./pages/Settings'));
const Doctor = lazy(() => import('./pages/Doctor'));
const Premium = lazy(() => import('./pages/Premium'));
const DailyCheckin = lazy(() => import('./pages/DailyCheckin'));
const RateApp = lazy(() => import('./pages/RateApp'));
const ExportReport = lazy(() => import('./pages/ExportReport'));
const Legal = lazy(() => import('./pages/Legal'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Appointments = lazy(() => import('./pages/Appointments'));
const ChildSelector = lazy(() => import('./pages/ChildSelector'));
const Doctors = lazy(() => import('./pages/Doctors'));
const Subscription = lazy(() => import('./pages/Subscription'));

function Router() {
  const { isAuthenticated, loading } = useAuth();
  const { selectedChild, setChildren } = useAppContext();

  // Load children list and auto-select if only one child
  const { data: childrenData } = trpc.children.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (childrenData && childrenData.length > 0) {
      const mapped: ChildProfile[] = childrenData.map((c: any) => ({
        id: c.id,
        name: c.name,
        birthDate: c.birthDate ?? '',
        gender: (c.gender as 'boy' | 'girl') ?? 'boy',
        allergies: Array.isArray(c.allergies) ? c.allergies : [],
        photoUrl: c.photoUrl ?? undefined,
      }));
      setChildren(mapped);
    }
  }, [childrenData, setChildren]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Onboarding} />
        <Route component={Onboarding} />
      </Switch>
    );
  }

  // Show child selector if authenticated but no child selected yet
  const showChildSelector = isAuthenticated && !selectedChild && !loading;

  if (showChildSelector) {
    return (
      <div className="mobile-container">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>}>
          <Switch>
            <Route path="/setup" component={ChildProfileSetup} />
            <Route component={ChildSelector} />
          </Switch>
        </Suspense>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <Suspense fallback={<div className="p-4 pb-24">Loading...</div>}>
        <Switch>
          <Route path="/setup" component={ChildProfileSetup} />
          <Route path="/child-select" component={ChildSelector} />
          <Route path="/" component={Dashboard} />
          <Route path="/meals" component={Meals} />
          <Route path="/emergency" component={EmergencyPage} />
          <Route path="/advice" component={Advice} />
          <Route path="/symptoms" component={Symptoms} />
          <Route path="/growth" component={Growth} />
          <Route path="/vaccines" component={Vaccines} />
          <Route path="/timeline" component={Timeline} />
          <Route path="/insights" component={Insights} />
          <Route path="/settings" component={Settings} />
          <Route path="/doctor" component={Doctor} />
          <Route path="/premium" component={Premium} />
          <Route path="/daily-checkin" component={DailyCheckin} />
          <Route path="/rate" component={RateApp} />
          <Route path="/export" component={ExportReport} />
          <Route path="/legal/privacy">{() => <Legal page="privacy" />}</Route>
          <Route path="/legal/terms">{() => <Legal page="terms" />}</Route>
          <Route path="/legal/partners">{() => <Legal page="partners" />}</Route>
          <Route path="/notifications" component={Notifications} />
          <Route path="/appointments" component={Appointments} />
          <Route path="/doctors" component={Doctors} />
          <Route path="/subscription" component={Subscription} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <AppProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AppProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
