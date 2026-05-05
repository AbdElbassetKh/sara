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
import { Suspense, lazy } from "react";

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

function Router() {
  const { isAuthenticated, loading } = useAuth();

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

  return (
    <div className="mobile-container">
      <Suspense fallback={<div className="p-4 pb-24">Loading...</div>}>
        <Switch>
          <Route path="/setup" component={ChildProfileSetup} />
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
