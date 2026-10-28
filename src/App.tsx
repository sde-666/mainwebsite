import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import { AiAssistantProvider } from './context/AiAssistantContext';

// Pages — lazy-loaded so a visitor only downloads the JS for the page
// they're actually viewing, instead of all 34 pages up front. This is
// purely a client-bundle change: prerendered SEO snapshots are generated
// from AppSSR.tsx (eager imports), completely unaffected by this file.
// IMPORTANT: keep this route table in sync with AppSSR.tsx.
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const OLevelHub = lazy(() => import('./pages/OLevelHub').then(m => ({ default: m.OLevelHub })));
const CCCHub = lazy(() => import('./pages/CCCHub').then(m => ({ default: m.CCCHub })));
const MockTest = lazy(() => import('./pages/MockTest').then(m => ({ default: m.MockTest })));
const McqLanding = lazy(() => import('./pages/McqLanding').then(m => ({ default: m.McqLanding })));
const ChapterWiseMcqHub = lazy(() => import('./pages/ChapterWiseMcqHub').then(m => ({ default: m.ChapterWiseMcqHub })));
const PaperChaptersList = lazy(() => import('./pages/PaperChaptersList').then(m => ({ default: m.PaperChaptersList })));
const ChapterMcqPractice = lazy(() => import('./pages/ChapterMcqPractice').then(m => ({ default: m.ChapterMcqPractice })));
const ChapterWiseNotesHub = lazy(() => import('./pages/ChapterWiseNotesHub').then(m => ({ default: m.ChapterWiseNotesHub })));
const PaperNotesChaptersList = lazy(() => import('./pages/PaperNotesChaptersList').then(m => ({ default: m.PaperNotesChaptersList })));
const SyllabusPage = lazy(() => import('./pages/SyllabusPage').then(m => ({ default: m.SyllabusPage })));
const PracticalHub = lazy(() => import('./pages/PracticalHub').then(m => ({ default: m.PracticalHub })));
const PracticalExamWorkspace = lazy(() => import('./pages/PracticalExamWorkspace').then(m => ({ default: m.PracticalExamWorkspace })));
const Resources = lazy(() => import('./pages/Resources').then(m => ({ default: m.Resources })));
const ResourceCategory = lazy(() => import('./pages/ResourceCategory').then(m => ({ default: m.ResourceCategory })));
const NotesReader = lazy(() => import('./pages/NotesReader').then(m => ({ default: m.NotesReader })));
const OLevelResultCalculator = lazy(() => import('./pages/OLevelResultCalculator').then(m => ({ default: m.OLevelResultCalculator })));
const Courses = lazy(() => import('./pages/Courses').then(m => ({ default: m.Courses })));
const CourseDetail = lazy(() => import('./pages/CourseDetail').then(m => ({ default: m.CourseDetail })));
const MyCourses = lazy(() => import('./pages/MyCourses').then(m => ({ default: m.MyCourses })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Tutorials = lazy(() => import('./pages/Tutorials').then(m => ({ default: m.Tutorials })));
const TutorialDetail = lazy(() => import('./pages/TutorialDetail').then(m => ({ default: m.TutorialDetail })));
const YouTubePage = lazy(() => import('./pages/YouTube').then(m => ({ default: m.YouTubePage })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Founder = lazy(() => import('./pages/Founder').then(m => ({ default: m.Founder })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const PrivacyPolicy = lazy(() => import('./pages/Legal').then(m => ({ default: m.PrivacyPolicy })));
const Terms = lazy(() => import('./pages/Legal').then(m => ({ default: m.Terms })));
const Disclaimer = lazy(() => import('./pages/Legal').then(m => ({ default: m.Disclaimer })));
const RefundPolicy = lazy(() => import('./pages/Legal').then(m => ({ default: m.RefundPolicy })));

// Admin Pages — never crawled/indexed (blocked in robots.txt, skipped by
// prerender), so no SSR-safety concern; also lazy-loaded.
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));

export default function App() {
  return (
    <AuthProvider>
      <AiAssistantProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={null}>
            <Routes>
              {/* Standalone Fullscreen Practical Exam Environment */}
              <Route path="/practical-practice/:testId" element={<PracticalExamWorkspace />} />

              {/* Standalone Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Main Website with Header & Footer Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                
                {/* NIELIT Core Hubs */}
                <Route path="o-level" element={<ChapterWiseNotesHub />} />
                <Route path="o-level/:moduleId" element={<PaperNotesChaptersList />} />
                <Route path="chapter-wise-notes" element={<ChapterWiseNotesHub />} />
                <Route path="chapter-wise-notes/:moduleId" element={<PaperNotesChaptersList />} />
                <Route path="syllabus" element={<SyllabusPage />} />
                <Route path="o-level-syllabus" element={<SyllabusPage />} />
                <Route path="o-level-result-calculator" element={<OLevelResultCalculator />} />
                <Route path="result-calculator" element={<OLevelResultCalculator />} />
                <Route path="ccc" element={<CCCHub />} />
                <Route path="practical-practice" element={<PracticalHub />} />
                
                {/* MCQ Systems: Mode Selection, CBT Mock Tests, & Chapter Wise Practice */}
                <Route path="mcqs" element={<McqLanding />} />
                <Route path="mock-test" element={<MockTest />} />
                <Route path="chapter-wise-mcq" element={<ChapterWiseMcqHub />} />
                <Route path="chapter-wise-mcq/:moduleId" element={<PaperChaptersList />} />
                <Route path="chapter-wise-mcq/:moduleId/:chapterNumber" element={<ChapterMcqPractice />} />
                
                {/* Resources, Notes & Courses */}
                <Route path="resources" element={<Resources />} />
                <Route path="resources/:categoryId" element={<ResourceCategory />} />
                
                {/* Structured Chapter-wise Blog Notes System */}
                <Route path="notes" element={<NotesReader />} />
                <Route path="notes/:courseId" element={<NotesReader />} />
                <Route path="notes/:courseId/:chapterId" element={<NotesReader />} />
                <Route path="notes/:courseId/:chapterId/:topicId" element={<NotesReader />} />
                
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:courseId" element={<CourseDetail />} />
                <Route path="paid-courses" element={<Courses />} />
                <Route path="paid-courses/:courseId" element={<CourseDetail />} />
                <Route path="my-courses" element={<MyCourses />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Login />} />
                <Route path="student-login" element={<Login />} />
                
                {/* App Redirects */}
                <Route path="app" element={<Navigate to="/courses" replace />} />
                <Route path="app/install" element={<Navigate to="/courses" replace />} />
                <Route path="app-download" element={<Navigate to="/courses" replace />} />
                
                {/* Tutorials & YouTube */}
                <Route path="tutorials" element={<Tutorials />} />
                <Route path="tutorials/:tutorialId" element={<TutorialDetail />} />
                <Route path="youtube" element={<YouTubePage />} />
                
                {/* Info & Legal */}
                <Route path="faq" element={<FAQ />} />
                <Route path="about" element={<About />} />
                <Route path="founder" element={<Founder />} />
                <Route path="contact" element={<Contact />} />
                
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms-and-conditions" element={<Terms />} />
                <Route path="disclaimer" element={<Disclaimer />} />
                <Route path="refund-policy" element={<RefundPolicy />} />
                
                <Route path="*" element={
                  <div className="container mx-auto px-4 py-32 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                    <p className="text-xl text-gray-600 mb-8">The page you are looking for does not exist.</p>
                    <a href="/" className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2">
                      Go back to Home
                    </a>
                  </div>
                } />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AiAssistantProvider>
    </AuthProvider>
  );
}
