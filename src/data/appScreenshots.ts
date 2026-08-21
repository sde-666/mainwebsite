export interface AppScreenshotItem {
  id: string;
  number: number;
  title: string;
  hindiTitle?: string;
  category: 'onboarding' | 'auth' | 'dashboard' | 'course' | 'quiz' | 'result';
  subtitle: string;
  description: string;
  imageFileName: string;
  imagePath: string;
  alternatePaths: string[];
  features: string[];
  screenDetails: {
    badge: string;
    headerText: string;
    keyHighlights: string[];
  };
}

export const appScreenshots: AppScreenshotItem[] = [
  {
    id: 'splash-screen',
    number: 1,
    title: 'App Splash & Quick Launch',
    hindiTitle: 'ऐप लोडिंग एवं स्प्लैश स्क्रीन',
    category: 'onboarding',
    subtitle: 'Lightning Fast Startup & Course Initializer',
    description: 'Instant startup screen with the signature Skill.py logo and real-time offline course cache preparation.',
    imageFileName: 'photo_1.jpg',
    imagePath: '/app-screenshots/photo_1.jpg',
    alternatePaths: [
      '/app-screenshots/photo_1_2026-08-16_21-37-13.jpg',
      '/app-screenshots/screen1.jpg',
      '/photo_1_2026-08-16_21-37-13.jpg'
    ],
    features: [
      'Clean modern gradient with signature Skill.py branding',
      'Smart cache validation for offline study access',
      'Zero-lag initialization under 1.5 seconds'
    ],
    screenDetails: {
      badge: 'Step 1: Launch',
      headerText: 'Skill.py - Just learn skills...',
      keyHighlights: ['Brand Identity', 'Fast Boot', 'Offline Cache Ready']
    }
  },
  {
    id: 'auth-screen',
    number: 2,
    title: 'Student Login & Registration',
    hindiTitle: 'सुरक्षित छात्र लॉगिन एवं खाता निर्माण',
    category: 'auth',
    subtitle: 'Secure Multi-Method Authentication Portal',
    description: 'Seamless student sign-in supporting Email/Password, 1-Tap Google authentication, persistent session support, and role-based student access.',
    imageFileName: 'photo_2.jpg',
    imagePath: '/app-screenshots/photo_2.jpg',
    alternatePaths: [
      '/app-screenshots/photo_2_2026-08-16_21-37-13.jpg',
      '/app-screenshots/screen2.jpg',
      '/photo_2_2026-08-16_21-37-13.jpg'
    ],
    features: [
      '1-Tap Google Sign-In & Email Authentication',
      'Student profile syncing across devices',
      'Instant password recovery & remember me token'
    ],
    screenDetails: {
      badge: 'Step 2: Sign In',
      headerText: 'Welcome back - Sign in to continue your learning',
      keyHighlights: ['Email & Google Auth', 'Encrypted Credentials', 'Instant Profile Sync']
    }
  },
  {
    id: 'home-dashboard',
    number: 3,
    title: 'Personalized Student Dashboard',
    hindiTitle: 'व्यक्तिगत होम स्क्रीन एवं कोर्स ट्रैकिंग',
    category: 'dashboard',
    subtitle: 'All-in-One Learning Hub with 1-Tap Resume',
    description: 'Personalized greeting, instant course search bar, live announcement broadcasts, "Continue Learning" shortcut card, and featured NIELIT courses (CCC, LibreOffice, Python).',
    imageFileName: 'photo_3.jpg',
    imagePath: '/app-screenshots/photo_3.jpg',
    alternatePaths: [
      '/app-screenshots/photo_3.svg',
      '/app-screenshots/photo_3_2026-08-16_21-37-13.jpg',
      '/app-screenshots/screen3.jpg',
      '/photo_3_2026-08-16_21-37-13.jpg'
    ],
    features: [
      'Personalized student dashboard with progress memory',
      'Instant search bar across all notes, videos & syllabus',
      'Live notification bell & announcement board'
    ],
    screenDetails: {
      badge: 'Step 3: Dashboard',
      headerText: 'Good Evening, Aditya Pathak',
      keyHighlights: ['Live Announcements', 'Continue Learning', 'Featured NIELIT Modules']
    }
  },
  {
    id: 'course-syllabus',
    number: 4,
    title: 'Course Syllabus & Video/PDF Navigator',
    hindiTitle: 'चैप्टर-वाइज वीडियो लेक्चर्स एवं नोट्स',
    category: 'course',
    subtitle: 'Structured Chapter Accordion with Direct Materials',
    description: 'Chapter-by-chapter curriculum view for Python Programming, O Level (M1-M4), and CCC with integrated video count, downloadable PDF notes, and test links.',
    imageFileName: 'photo_4.jpg',
    imagePath: '/app-screenshots/photo_4.jpg',
    alternatePaths: [
      '/app-screenshots/photo_4_2026-08-16_21-37-13.jpg',
      '/app-screenshots/screen4.jpg',
      '/photo_4_2026-08-16_21-37-13.jpg'
    ],
    features: [
      'Chapter 1 to 5 modular syllabus navigation',
      'Direct HD Video Lecture player & PDF reader links',
      'Seamless enrollment & purchase with instant access'
    ],
    screenDetails: {
      badge: 'Step 4: Course Hub',
      headerText: 'Python Programming (5 Chapters + MCQ Tests)',
      keyHighlights: ['Full Syllabus Breakdown', 'Downloadable PDF Notes', 'Chapter Video Player']
    }
  },
  {
    id: 'cbt-quiz',
    number: 5,
    title: 'Real NIELIT CBT Mock Test Engine',
    hindiTitle: 'ऑनलाइन कंप्यूटर आधारित मॉक टेस्ट',
    category: 'quiz',
    subtitle: 'Exact CBT Exam Interface Simulation',
    description: 'Timed online exam environment simulating actual NIELIT CBT test screens with animated progress bars, question counters, clear radio selection, and easy navigation.',
    imageFileName: 'photo_5.jpg',
    imagePath: '/app-screenshots/photo_5.jpg',
    alternatePaths: [
      '/app-screenshots/photo_5_2026-08-16_21-37-13.jpg',
      '/app-screenshots/screen5.jpg',
      '/photo_5_2026-08-16_21-37-13.jpg'
    ],
    features: [
      'Exact NIELIT CBT online exam interface replica',
      'Real-time question tracking & progress indicators',
      'Distraction-free focus mode during active tests'
    ],
    screenDetails: {
      badge: 'Step 5: CBT Exam',
      headerText: 'Test 1 - Question 1 of 2: Python File Extension',
      keyHighlights: ['Timed CBT Simulation', 'Intuitive Navigation', 'Exam Readiness']
    }
  },
  {
    id: 'test-result',
    number: 6,
    title: 'Instant Scorecard & Solution Review',
    hindiTitle: 'तत्काल परीक्षा परिणाम एवं उत्तर विश्लेषण',
    category: 'result',
    subtitle: '100% Accuracy Scorecard with Detailed Explanations',
    description: 'Celebratory score celebration ("Test Passed! 100% Correct"), complete question-by-question review, selected options, and in-depth conceptual explanations.',
    imageFileName: 'photo_6.jpg',
    imagePath: '/app-screenshots/photo_6.jpg',
    alternatePaths: [
      '/app-screenshots/photo_6_2026-08-16_21-37-13.jpg',
      '/app-screenshots/screen6.jpg',
      '/photo_6_2026-08-16_21-37-13.jpg'
    ],
    features: [
      'Instant test score calculations & pass/fail grades',
      'Question-by-question review with highlighted correct answers',
      'Comprehensive explanations for long-term retention'
    ],
    screenDetails: {
      badge: 'Step 6: Results',
      headerText: '🎉 Test Passed! 2/2 Correct (100%)',
      keyHighlights: ['Instant Grading', 'Detailed Answer Keys', 'Performance Insights']
    }
  }
];
