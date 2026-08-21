import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingAiDoubtButton, AiDoubtSolverModal } from './AiDoubtSolverModal';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white antialiased">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingAiDoubtButton />
      <AiDoubtSolverModal />
    </div>
  );
}
