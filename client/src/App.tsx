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
          <Route path="/timeline" component={() => <div className="p-4 pb-24">Timeline</div>} />
          <Route path="/insights" component={() => <div className="p-4 pb-24">Insights</div>} />
          <Route path="/settings" component={() => <div className="p-4 pb-24">Settings</div>} />
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
