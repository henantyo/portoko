import { useState, useEffect } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AnimatedBackground } from './components/AnimatedBackground';
import { GridOverlay } from './components/GridOverlay';
import { ScanlineOverlay } from './components/ScanlineOverlay';
import { BootScreen } from './components/BootScreen';
import { ThemeProvider } from './lib/ThemeContext';
import { PortfolioProvider, usePortfolioData } from './hooks/usePortfolioData';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Skills } from './pages/Skills';
import { Projects } from './pages/Projects';
import { ExperiencePage } from './pages/Experience';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

// Database Initialization
import { initializeDatabase } from './lib/db';

// Initialize localStorage on script load
initializeDatabase();

// --------------------------------------------------
// 1. Root Component Layout
// --------------------------------------------------
function RootContent() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const isAdmin = currentPath.startsWith('/admin');
  const { loading } = usePortfolioData();

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#060611]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs text-cyan-400/60 tracking-widest">LOADING_PORTFOLIO...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-[var(--text-primary)] flex flex-col justify-between overflow-x-hidden pt-16">
      <AnimatedBackground />
      <GridOverlay />
      <ScanlineOverlay />
      <Navbar />
      <main className={`flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${isAdmin ? 'py-0' : 'py-8'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function RootComponent() {
  return <RootContent />;
}

// Create Root Route
const rootRoute = createRootRoute({
  component: RootComponent,
});

// --------------------------------------------------
// 2. Route Definitions
// --------------------------------------------------
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const skillsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/skills',
  component: Skills,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: Projects,
});

const experienceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/experience',
  component: ExperiencePage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLogin,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
});

// --------------------------------------------------
// 3. Router Creation & Registration
// --------------------------------------------------
const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  skillsRoute,
  projectsRoute,
  experienceRoute,
  contactRoute,
  adminLoginRoute,
  adminDashboardRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

// Register router for type-safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// --------------------------------------------------
// 4. Main App Wrapper with Boot Sequence
// --------------------------------------------------
export default function App() {
  const [booting, setBooting] = useState(true);

  const handleBootComplete = () => {
    setBooting(false);
  };

  return (
    <>
      <AnimatePresence>
        {booting && <BootScreen onComplete={handleBootComplete} />}
      </AnimatePresence>

      {!booting && (
        <ThemeProvider>
          <PortfolioProvider>
            <RouterProvider router={router} />
          </PortfolioProvider>
        </ThemeProvider>
      )}
    </>
  );
}
