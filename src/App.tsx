import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import { AiAssistantProvider } from './context/AiAssistantContext';

// Pages
import { Home } from './pages/Home';
import { OLevelHub } from './pages/OLevelHub';
import { CCCHub } from './pages/CCCHub';
import { MockTest } from './pages/MockTest';
import { McqLanding } from './pages/McqLanding';
import { ChapterWiseMcqHub } from './pages/ChapterWiseMcqHub';
import { PaperChaptersList } from './pages/PaperChaptersList';
import { ChapterMcqPractice } from './pages/ChapterMcqPractice';
import { ChapterWiseNotesHub } from './pages/ChapterWiseNotesHub';
import { PaperNotesChaptersList } from './pages/PaperNotesChaptersList';
import { SyllabusPage } from './pages/SyllabusPage';
import { PracticalHub } from './pages/PracticalHub';
import { PracticalExamWorkspace } from './pages/PracticalExamWorkspace';
import { Resources } from './pages/Resources';
import { ResourceCategory } from './pages/ResourceCategory';
import { NotesReader } from './pages/NotesReader';
import { OLevelResultCalculator } from './pages/OLevelResultCalculator';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { AppPage } from './pages/AppPage';
import { AppInstall } from './pages/AppInstall';
import { Tutorials } from './pages/Tutorials';
import { TutorialDetail } from './pages/TutorialDetail';
import { YouTubePage } from './pages/YouTube';
import { FAQ } from './pages/FAQ';
import { About } from './pages/About';
import { Founder } from './pages/Founder';
import { Contact } from './pages/Contact';
import { PrivacyPolicy, Terms, Disclaimer, RefundPolicy } from './pages/Legal';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLogin } from './pages/admin/AdminLogin';

export default function App() {
  return (
    <AuthProvider>
      <AiAssistantProvider>
        <BrowserRouter>
          <ScrollToTop />
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
                
                {/* App Promotion */}
                <Route path="app" element={<AppPage />} />
                <Route path="app/install" element={<AppInstall />} />
                <Route path="app-download" element={<AppPage />} />
                
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
        </BrowserRouter>
      </AiAssistantProvider>
    </AuthProvider>
  );
}
