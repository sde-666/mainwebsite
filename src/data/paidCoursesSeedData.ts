import { CourseItem, CourseChapter, CourseLesson } from '../types/paidCourse';

export const initialPaidCoursesSeed: CourseItem[] = [
  {
    id: 'olevel-m3-python-flagship',
    title: 'NIELIT O Level Python (M3-R5.1) Complete Masterclass Batch',
    hindiTitle: 'ओ लेवल पायथन प्रोग्रामिंग कम्पलीट वीडियो बैच + चैप्टर नोट्स + प्रैक्टिकल',
    subtitle: 'Step-by-Step Python Programming from Zero to Advanced with Solved Lab Experiments',
    overview: 'Comprehensive video course covering Python variables, conditionals, loops, functions, file handling, NumPy basics, solved 100+ coding problems, and previous year practical questions designed specifically for NIELIT O Level M3-R5 exam.',
    badge: 'Best Seller • 2026 Edition',
    category: 'm3',
    price: 499,
    originalPrice: 1499,
    thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60',
    bannerUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&auto=format&fit=crop&q=80',
    isPublished: true,
    features: [
      '35+ HD Video Lectures (Unlisted YouTube)',
      'Chapter-wise Hindi + English PDF Notes',
      '50+ Solved Python Practical Codes & Lab Files',
      'Direct WhatsApp Mentorship by Aditya Sir',
      'Free 2 Demo Lectures & 2 PDF Notes'
    ],
    learningOutcomes: [
      'Master Python syntax, data types, lists, tuples, and dictionaries',
      'Solve loops, recursion, and pattern questions for NIELIT exams',
      'File handling (reading, writing, appending files) with practical code',
      'NumPy array manipulations and mathematical operations',
      'Score S or A Grade in NIELIT M3-R5 theory and practical exams'
    ],
    targetAudience: [
      'NIELIT O Level students appearing for M3-R5 paper',
      'Beginners wanting to learn Python programming from scratch in Hindi',
      'College students seeking structured coding foundation with notes'
    ],
    teacherName: 'Er. Aditya Pathak',
    duration: '35+ Hours',
    language: 'Hinglish (Hindi + English)',
    chaptersCount: 6,
    lecturesCount: 18,
    notesCount: 12,
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now()
  },
  {
    id: 'olevel-m1-it-tools-foundation',
    title: 'NIELIT O Level M1-R5.1 IT Tools & Basics Foundation Course',
    hindiTitle: 'एम1-आर5.1 आईटी टूल्स, लिब्रे ऑफिस एवं नेटवर्क बेसिक्स कम्पलीट कोर्स',
    subtitle: 'Full Coverage of LibreOffice Writer, Calc, Impress, Operating Systems & Digital Financial Tools',
    overview: 'Master M1-R5.1 syllabus with in-depth lectures on computer hardware, OS, LibreOffice Writer shortcuts, Calc formulas, Impress slides, networking fundamentals, cybersecurity, and future IT skills.',
    badge: 'Foundation Batch',
    category: 'm1',
    price: 399,
    originalPrice: 1199,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
    bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    isPublished: true,
    features: [
      '28+ Chapter Video Classes',
      'All LibreOffice Menu Shortcuts & Calc Formulas PDF',
      '1000+ Topic Wise Solved MCQs & Explanations',
      'Bilingual Explanation (Hindi + English)'
    ],
    learningOutcomes: [
      'Understand computer components, CPU, and memory hierarchy',
      'Master LibreOffice Writer formatting, tables, and mail merge',
      'Execute complex calculations using Calc spreadsheet functions',
      'Learn networking, IP addressing, DNS, and digital payment security'
    ],
    targetAudience: [
      'O Level Aspirants preparing for Paper 1 (M1-R5)',
      'Government exam aspirants needing computer literacy certification'
    ],
    teacherName: 'Er. Aditya Pathak',
    duration: '28+ Hours',
    language: 'Hinglish (Hindi + English)',
    chaptersCount: 6,
    lecturesCount: 16,
    notesCount: 10,
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now()
  },
  {
    id: 'olevel-m2-web-design-mastery',
    title: 'NIELIT O Level M2-R5.1 Web Design & Publishing Video Batch',
    hindiTitle: 'एम2-आर5.1 वेब डिजाइनिंग (HTML5, CSS3, JavaScript, W3.CSS, Angular)',
    subtitle: 'From Basic HTML Tags to Responsive Websites, CSS Grid, and Photo Editing',
    overview: 'Hands-on practical video course covering HTML5 semantic tags, CSS3 selectors and responsive layouts, JavaScript DOM manipulation, W3.CSS framework, and photo editor tools for M2-R5 practical and theory.',
    badge: 'Popular',
    category: 'm2',
    price: 449,
    originalPrice: 1299,
    thumbnailUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=60',
    bannerUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&auto=format&fit=crop&q=80',
    isPublished: true,
    features: [
      'Complete Web Development Practical Coding',
      'Pre-built HTML & CSS Code Templates Download',
      'Interactive JavaScript Exercises',
      'W3.CSS Framework and Photo Editing Tips'
    ],
    learningOutcomes: [
      'Design modern, mobile-responsive web pages with HTML5 & CSS3',
      'Implement interactive web features using vanilla JavaScript',
      'Understand Web Publishing, FTP, Web Hosting, and Domain registration'
    ],
    targetAudience: [
      'NIELIT O Level M2-R5 students',
      'Aspiring Front-end Web Developers'
    ],
    teacherName: 'Er. Aditya Pathak',
    duration: '30+ Hours',
    language: 'Hinglish (Hindi + English)',
    chaptersCount: 6,
    lecturesCount: 15,
    notesCount: 9,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now()
  },
  {
    id: 'ccc-master-superfast-batch',
    title: 'NIELIT CCC Complete Target Batch (Theory + Practical + MCQs)',
    hindiTitle: 'ट्रिपल सी (CCC) सुपरफ़ास्ट तैयारी बैच — 100% गारंटीड सफलता',
    subtitle: 'All 9 Chapters Explained with Shortcut Keys, Digital Banking & 1500+ Practice MCQs',
    overview: 'The definitive CCC course designed to help students score S or A grade in the first attempt. Includes video lectures for all 9 syllabus chapters, LibreOffice walkthroughs, and 1500+ questions.',
    badge: 'Instant Result',
    category: 'ccc',
    price: 299,
    originalPrice: 799,
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60',
    bannerUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
    isPublished: true,
    features: [
      'Full 9 Chapters Video Modules',
      '1500+ Solved CCC Exam MCQs with Hindi Explanations',
      'LibreOffice Shortcuts Sheet PDF',
      'Online CBT Mock Test Simulator'
    ],
    learningOutcomes: [
      'Pass CCC exam with high marks (S or A Grade)',
      'Master LibreOffice shortcuts and keyboard tricks',
      'Understand digital banking (UPI, AEPS, NEFT, RTGS, USSD) safely'
    ],
    targetAudience: [
      'Students preparing for NIELIT CCC monthly exams',
      'Candidates preparing for UPSSSC, Railway, Bank, and State Govt jobs'
    ],
    teacherName: 'Er. Aditya Pathak',
    duration: '20+ Hours',
    language: 'Hinglish (Hindi + English)',
    chaptersCount: 9,
    lecturesCount: 18,
    notesCount: 9,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now()
  }
];

export const initialPaidChaptersSeed: CourseChapter[] = [
  // M3 Python Chapters
  {
    id: 'ch-m3-1',
    courseId: 'olevel-m3-python-flagship',
    chapterNumber: 1,
    title: 'Introduction to Programming & Algorithms',
    hindiTitle: 'प्रोग्रामिंग, एल्गोरिदम एवं फ्लोचार्ट की बुनियादी बातें',
    description: 'Problem solving approaches, flowchart symbols, pseudocode, and intro to Python interpreter.',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now()
  },
  {
    id: 'ch-m3-2',
    courseId: 'olevel-m3-python-flagship',
    chapterNumber: 2,
    title: 'Python Language Fundamentals & Data Types',
    hindiTitle: 'पायथन फंडामेंटल्स, वेरिएबल्स, ऑपरेटर्स एवं डेटा टाइप्स',
    description: 'Variables, dynamic typing, arithmetic & logical operators, type casting, input/print.',
    createdAt: Date.now() - 86400000 * 9,
    updatedAt: Date.now()
  },
  {
    id: 'ch-m3-3',
    courseId: 'olevel-m3-python-flagship',
    chapterNumber: 3,
    title: 'Control Flow (If-Else, Loops, Break & Continue)',
    hindiTitle: 'कंट्रोल फ्लो (इफ-एल्स, फॉर/वाइल लूप, ब्रेक व कंटिन्यू)',
    description: 'Decision making structures, for and while loops, nested loops, range function, and patterns.',
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now()
  },
  {
    id: 'ch-m3-4',
    courseId: 'olevel-m3-python-flagship',
    chapterNumber: 4,
    title: 'Strings, Lists, Tuples, Dictionaries & Sets',
    hindiTitle: 'स्ट्रिंग्स, लिस्ट, टुपल्स, डिक्शनरी एवं सेट्स',
    description: 'Sequence types, slicing, indexing, list comprehensions, built-in methods.',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now()
  },

  // M1 IT Tools Chapters
  {
    id: 'ch-m1-1',
    courseId: 'olevel-m1-it-tools-foundation',
    chapterNumber: 1,
    title: 'Introduction to Computer & Operating System',
    hindiTitle: 'कंप्यूटर का परिचय एवं ऑपरेटिंग सिस्टम',
    description: 'Hardware architecture, RAM/ROM, input-output devices, Windows & Linux/Ubuntu basics.',
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now()
  },
  {
    id: 'ch-m1-2',
    courseId: 'olevel-m1-it-tools-foundation',
    chapterNumber: 2,
    title: 'Word Processing (LibreOffice Writer)',
    hindiTitle: 'वर्ड प्रोसेसिंग (लिब्रे ऑफिस राइटर)',
    description: 'Document editing, font formatting, table insertion, styles, and Mail Merge in depth.',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now()
  }
];

export const initialPaidLessonsSeed: CourseLesson[] = [
  // M3 Lessons
  {
    id: 'les-m3-1',
    courseId: 'olevel-m3-python-flagship',
    chapterId: 'ch-m3-1',
    chapterNumber: 1,
    lessonNumber: 1,
    title: 'L01: What is Programming & Python Installation',
    hindiTitle: 'प्रोग्रामिंग क्या है एवं पायथन और VS Code इनस्टॉल कैसे करें?',
    duration: '22:15',
    videoType: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    videoId: 'kqtD5dpn9C8',
    hasPdf: true,
    pdfTitle: 'Chapter 1 Complete Theory & Installation Guide PDF',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: 8,
    isFreePreview: true, // Free Demo 1
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now()
  },
  {
    id: 'les-m3-2',
    courseId: 'olevel-m3-python-flagship',
    chapterId: 'ch-m3-1',
    chapterNumber: 1,
    lessonNumber: 2,
    title: 'L02: Algorithms, Flowcharts & Flowchart Symbols',
    hindiTitle: 'एल्गोरिदम, फ्लोचार्ट सिम्बल्स एवं स्टेप-बाय-स्टेप लॉजिक',
    duration: '26:40',
    videoType: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=7wnove7K-ZQ',
    videoId: '7wnove7K-ZQ',
    hasPdf: true,
    pdfTitle: 'Flowchart Symbols & Example Problem PDF Notes',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: 12,
    isFreePreview: true, // Free Demo 2
    createdAt: Date.now() - 86400000 * 9,
    updatedAt: Date.now()
  },
  {
    id: 'les-m3-3',
    courseId: 'olevel-m3-python-flagship',
    chapterId: 'ch-m3-2',
    chapterNumber: 2,
    lessonNumber: 3,
    title: 'L03: Variables, Identifiers & Memory Allocation in Python',
    hindiTitle: 'पायथन में वेरिएबल्स, आइडेंटिफायर्स एवं मेमोरी मैनेजमेंट',
    duration: '31:10',
    videoType: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=YYXdXT2l-Gg',
    videoId: 'YYXdXT2l-Gg',
    hasPdf: true,
    pdfTitle: 'Variables & Data Types Handwritten Formula Notes',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: 15,
    isFreePreview: false, // LOCKED (Paid only)
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now()
  },
  {
    id: 'les-m3-4',
    courseId: 'olevel-m3-python-flagship',
    chapterId: 'ch-m3-2',
    chapterNumber: 2,
    lessonNumber: 4,
    title: 'L04: Python Operators (Arithmetic, Relational, Logical, Bitwise)',
    hindiTitle: 'पायथन के सभी ऑपरेटर्स और एक्सप्रेशन इवैल्यूएशन',
    duration: '35:20',
    videoType: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=vLqTf2b6GZw',
    videoId: 'vLqTf2b6GZw',
    hasPdf: true,
    pdfTitle: 'Operator Precedence & Evaluation Rules Sheet',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: 10,
    isFreePreview: false, // LOCKED (Paid only)
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now()
  },
  {
    id: 'les-m3-5',
    courseId: 'olevel-m3-python-flagship',
    chapterId: 'ch-m3-3',
    chapterNumber: 3,
    lessonNumber: 5,
    title: 'L05: If, Elif, Else Conditions & Nested Branching',
    hindiTitle: 'इफ, एलीफ और एल्स कंडीशनल स्टेटमेंट्स',
    duration: '28:50',
    videoType: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    videoId: 'kqtD5dpn9C8',
    hasPdf: true,
    pdfTitle: 'Conditional Statements Solved Code Examples PDF',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: 14,
    isFreePreview: false, // LOCKED
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now()
  },

  // M1 Lessons
  {
    id: 'les-m1-1',
    courseId: 'olevel-m1-it-tools-foundation',
    chapterId: 'ch-m1-1',
    chapterNumber: 1,
    lessonNumber: 1,
    title: 'L01: Computer Basics, Generations & Architecture',
    hindiTitle: 'कंप्यूटर का परिचय, जनरेशन्स एवं आर्किटेक्चर',
    duration: '24:30',
    videoType: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    videoId: 'kqtD5dpn9C8',
    hasPdf: true,
    pdfTitle: 'Computer Fundamentals Chapter 1 Notes PDF',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: 11,
    isFreePreview: true, // Free Demo 1
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now()
  },
  {
    id: 'les-m1-2',
    courseId: 'olevel-m1-it-tools-foundation',
    chapterId: 'ch-m1-1',
    chapterNumber: 1,
    lessonNumber: 2,
    title: 'L02: Operating System, GUI & File Management',
    hindiTitle: 'ऑपरेटिंग सिस्टम, जीयूआई एवं फाइल सिस्टम',
    duration: '27:15',
    videoType: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=7wnove7K-ZQ',
    videoId: '7wnove7K-ZQ',
    hasPdf: true,
    pdfTitle: 'Operating System Short Notes & Shortcuts PDF',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: 9,
    isFreePreview: true, // Free Demo 2
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now()
  },
  {
    id: 'les-m1-3',
    courseId: 'olevel-m1-it-tools-foundation',
    chapterId: 'ch-m1-2',
    chapterNumber: 2,
    lessonNumber: 3,
    title: 'L03: LibreOffice Writer Interface & Formatting Tools',
    hindiTitle: 'लिब्रे ऑफिस राइटर का परिचय एवं फॉर्मेटिंग टूल्स',
    duration: '33:45',
    videoType: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=YYXdXT2l-Gg',
    videoId: 'YYXdXT2l-Gg',
    hasPdf: true,
    pdfTitle: 'LibreOffice Writer All Menu & Shortcuts Sheet',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: 16,
    isFreePreview: false, // LOCKED
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now()
  }
];
