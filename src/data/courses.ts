export interface Course {
  id: string;
  category: 'o-level' | 'ccc' | 'programming' | 'office-suite';
  categoryLabel: string;
  code?: string;
  title: string;
  hindiTitle: string;
  overview: string;
  targetAudience: string[];
  learningOutcomes: string[];
  features: string[];
  isFree: boolean;
  price?: string;
  originalPrice?: string;
  discountBadge?: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner to Intermediate' | 'All Levels';
  enrollmentUrl: string;
  appDownloadRequired: boolean;
  relatedYoutubeVideos?: { title: string; url: string }[];
}

export const courses: Course[] = [
  // NIELIT O LEVEL COURSES
  {
    id: 'o-level-all-in-one',
    category: 'o-level',
    categoryLabel: 'NIELIT O Level',
    code: 'O-LEVEL-COMBO',
    title: 'NIELIT O Level Complete 4 Modules Master Batch',
    hindiTitle: 'ओ लेवल कम्पलीट 4 पेपर्स मास्टर बैच (M1, M2, M3, M4)',
    overview: 'Our flagship all-inclusive master course designed strictly according to the latest NIELIT R5.1 syllabus. Covers complete theory, solved past 5 years papers, practical lab coding, and project guidance to guarantee Grade S / A in your very first attempt.',
    targetAudience: [
      'Students preparing for NIELIT O Level Exam (January & July cycles)',
      'Government Job Aspirants (UPSSSC, RO/ARO, VDO, Banking, High Court)',
      'Direct & Institute Candidates wanting 100% structured syllabus'
    ],
    learningOutcomes: [
      'Master M1-R5.1: IT Tools, Operating Systems, LibreOffice Suite & Cyber Security',
      'Master M2-R5.1: HTML5, CSS3, JavaScript, W3.CSS & Photoshop/GIMP',
      'Master M3-R5.1: Python Programming, Data Structures, Functions, File Handling & NumPy',
      'Master M4-R5.1: IoT Architecture, Arduino Uno, Sensors, Protocols & Soft Skills',
      'Ace the Practical Exam with solved lab assignments & viva preparation',
      'Complete and submit your official NIELIT Project successfully'
    ],
    features: [
      '200+ Full HD Video Lectures in bilingual Hindi + English',
      'Printable Chapter-wise PDF Notes & Cheat-sheets',
      '1000+ Online CBT Mock Questions with Instant Result & Analytics',
      'Solved Previous 5 Years Question Papers with Video Explanations',
      'All Practical Code Files (HTML, JS, Python, Arduino sketches)',
      'Direct WhatsApp & In-App Doubt Chat Support with Teacher'
    ],
    isFree: false,
    price: '₹999',
    originalPrice: '₹2,999',
    discountBadge: '66% OFF • Best Value',
    duration: '6 Months Access (Extendable)',
    level: 'All Levels',
    enrollmentUrl: '/app-download',
    appDownloadRequired: true,
    relatedYoutubeVideos: [
      { title: 'NIELIT O Level R5.1 Complete Strategy & Exam Pattern', url: 'https://youtube.com/@skilldotpy' },
      { title: 'How to score Grade S in O Level Exam', url: 'https://youtube.com/@skilldotpy' }
    ]
  },
  {
    id: 'o-level-m1',
    category: 'o-level',
    categoryLabel: 'NIELIT O Level',
    code: 'M1-R5.1',
    title: 'M1-R5: IT Tools and Network Basics',
    hindiTitle: 'M1-R5: आईटी टूल्स एवं नेटवर्क बेसिक्स',
    overview: 'Specialized module course focusing on Computer Fundamentals, OS (Windows & Linux), LibreOffice 7 (Writer, Calc, Impress), Internet, Networking, Digital Financial Services, and Cyber Security.',
    targetAudience: [
      'Students appearing specifically for Paper 1 (M1-R5)',
      'Beginners wanting strong computer & LibreOffice fundamentals'
    ],
    learningOutcomes: [
      'Understand Computer Architecture, Memory hierarchy & Operating Systems',
      'Gain expert proficiency in LibreOffice Writer (including Mail Merge)',
      'Master LibreOffice Calc spreadsheet formulas, functions & charts',
      'Design presentations in LibreOffice Impress with animations',
      'Learn Digital Payments (UPI, AEPS, USSD, RTGS) & Cyber Safety'
    ],
    features: [
      '50+ Dedicated Video Lectures',
      'Chapter-wise PDF Notes in Hindi & English',
      '250+ Topic-wise Practice MCQs',
      'Mail Merge & Calc Practical Lab Videos'
    ],
    isFree: false,
    price: '₹349',
    originalPrice: '₹999',
    discountBadge: '65% OFF',
    duration: '3 Months Access',
    level: 'Beginner',
    enrollmentUrl: '/app-download',
    appDownloadRequired: true
  },
  {
    id: 'o-level-m2',
    category: 'o-level',
    categoryLabel: 'NIELIT O Level',
    code: 'M2-R5.1',
    title: 'M2-R5: Web Designing and Publishing',
    hindiTitle: 'M2-R5: वेब डिजाइनिंग एवं पब्लिशिंग',
    overview: 'Comprehensive hands-on training for O Level Paper 2. Learn HTML5 semantic markup, CSS3 styling, responsive frameworks (Bootstrap/W3.CSS), client-side JavaScript programming, DOM manipulation, and photo editing.',
    targetAudience: [
      'Students preparing for O Level Paper 2 (M2-R5)',
      'Aspiring Front-End Web Developers & Design enthusiasts'
    ],
    learningOutcomes: [
      'Build valid, responsive web pages with semantic HTML5 & CSS3',
      'Implement CSS Flexbox, Grid, and W3.CSS responsive frameworks',
      'Write interactive JavaScript code for form validation & DOM events',
      'Edit and optimize images with Photoshop / GIMP for web publishing',
      'FTP web publishing and basic SEO fundamentals'
    ],
    features: [
      '60+ Step-by-Step Practical Coding Lectures',
      'Downloadable HTML/CSS/JS Source Code Templates',
      '300+ Solved MCQs and Previous Paper Solutions',
      'Solved Practical Exam Exercises'
    ],
    isFree: false,
    price: '₹349',
    originalPrice: '₹999',
    discountBadge: '65% OFF',
    duration: '3 Months Access',
    level: 'Beginner',
    enrollmentUrl: '/app-download',
    appDownloadRequired: true
  },
  {
    id: 'o-level-m3',
    category: 'o-level',
    categoryLabel: 'NIELIT O Level',
    code: 'M3-R5.1',
    title: 'M3-R5: Programming through Python Language',
    hindiTitle: 'M3-R5: पायथन प्रोग्रामिंग एवं समस्या समाधान',
    overview: 'Our most popular high-yield module! Master Python logic, algorithms, flowcharts, data types, control flow, functions, recursion, file operations, and the NumPy array library with zero prior coding background.',
    targetAudience: [
      'Students preparing for O Level Paper 3 (M3-R5)',
      'Beginners wanting to learn Python programming from scratch'
    ],
    learningOutcomes: [
      'Build algorithmic thinking and design flowcharts effortlessly',
      'Master Python syntax, variables, expressions, and operators',
      'Write conditional loops, nested loops, and pattern printing code',
      'Utilize Lists, Tuples, Dictionaries, Sets, and String methods',
      'Build user-defined functions, recursion, and file handling routines',
      'Manipulate arrays using NumPy for fast mathematical operations'
    ],
    features: [
      '75+ Detailed Video Lectures with visual dry-run tracing',
      '50+ Solved Practical Programs with line-by-line explanation',
      '350+ MCQs & Output-based Question Bank',
      'Dedicated Doubt Support on Python Logic'
    ],
    isFree: false,
    price: '₹399',
    originalPrice: '₹1,199',
    discountBadge: '67% OFF',
    duration: '3 Months Access',
    level: 'Beginner to Intermediate',
    enrollmentUrl: '/app-download',
    appDownloadRequired: true
  },
  {
    id: 'o-level-m4',
    category: 'o-level',
    categoryLabel: 'NIELIT O Level',
    code: 'M4-R5.1',
    title: 'M4-R5: Internet of Things (IoT) & Applications',
    hindiTitle: 'M4-R5: इंटरनेट ऑफ थिंग्स (IoT) एवं इसके अनुप्रयोग',
    overview: 'Decode the hardware & software of smart devices. Covers IoT architectural layers, Arduino Uno microcontroller, sensor & actuator interfacing, embedded C coding, communication protocols (MQTT, CoAP), and Soft Skills.',
    targetAudience: [
      'Students preparing for O Level Paper 4 (M4-R5)',
      'Tech enthusiasts curious about smart hardware and embedded systems'
    ],
    learningOutcomes: [
      'Understand IoT architecture, sensing elements, and functional blocks',
      'Master Arduino Uno pinout, timers, ADC, and circuit wiring',
      'Write embedded C programs for LEDs, sensors, buzzers, and relays',
      'Implement IoT messaging protocols (MQTT broker, publish/subscribe)',
      'Prepare for soft skills, communication, and interview questions'
    ],
    features: [
      '45+ Video Lectures with circuit diagrams & live demonstrations',
      'Complete Arduino Sketch Code files for all lab practicals',
      '250+ Topic-wise MCQs & Past Exam Papers',
      'Simplified English & Hindi Notes'
    ],
    isFree: false,
    price: '₹349',
    originalPrice: '₹999',
    discountBadge: '65% OFF',
    duration: '3 Months Access',
    level: 'Beginner',
    enrollmentUrl: '/app-download',
    appDownloadRequired: true
  },

  // NIELIT CCC COURSES
  {
    id: 'ccc-master-course',
    category: 'ccc',
    categoryLabel: 'NIELIT CCC',
    code: 'CCC-2026',
    title: 'NIELIT CCC Target Grade S Complete Course',
    hindiTitle: 'ट्रिपल सी (CCC) कम्पलीट बैच - 100% सिलेक्शन गारंटी',
    overview: 'The definitive crash course and mock test series to crack the NIELIT CCC exam in 15 to 30 days with Grade S/A. Covers computer basics, operating systems, complete LibreOffice Suite, Internet, Digital Payments, and Cyber Security.',
    targetAudience: [
      'Candidates preparing for upcoming monthly NIELIT CCC Online Exam',
      'Govt job applicants needing CCC certification (UPSSSC, VDO, Lekhpal, Police, Court)'
    ],
    learningOutcomes: [
      'Understand all 9 chapters of the updated NIELIT CCC syllabus',
      'Memorize all essential LibreOffice Writer, Calc & Impress shortcut keys',
      'Learn digital banking services (UPI, AEPS, USSD, RTGS, NEFT, e-Wallets)',
      'Master 500+ repeated previous year MCQs and True/False questions'
    ],
    features: [
      '30+ Concise, High-Scoring Video Lessons',
      '10 Full-Length 100-Question CBT Online Mock Tests (Real Exam Interface)',
      'LibreOffice Shortcut Key Master Chart PDF',
      'Top 500 Most Repeated Questions PDF'
    ],
    isFree: false,
    price: '₹199',
    originalPrice: '₹699',
    discountBadge: '71% OFF',
    duration: '3 Months Access',
    level: 'Beginner',
    enrollmentUrl: '/app-download',
    appDownloadRequired: true
  },

  // INDEPENDENT PROGRAMMING COURSES
  {
    id: 'python-complete-mastery',
    category: 'programming',
    categoryLabel: 'Programming Languages',
    code: 'PY-HERO',
    title: 'Complete Python Programming: Zero to Hero',
    hindiTitle: 'पायथन प्रोग्रामिंग कम्पलीट कोर्स (शुरुआत से एडवांस)',
    overview: 'Learn modern Python programming from scratch. Designed for beginners, school/college students, and professionals looking to build solid coding logic, solve algorithmic challenges, work with files, and master data structures.',
    targetAudience: [
      'Absolute beginners with zero coding experience',
      'BCA, B.Tech, MCA, B.Sc Computer Science students',
      'Anyone looking to transition into coding, Data Science, or Automation'
    ],
    learningOutcomes: [
      'Master Python core concepts: variables, loops, conditionals, operators',
      'Work comfortably with Lists, Dictionaries, Sets, and Tuples',
      'Understand Object-Oriented Programming (OOP): Classes, Objects, Inheritance',
      'Perform file reading/writing, CSV handling, and Exception Handling',
      'Build 5 real-world CLI projects (Contact Book, Quiz App, File Organizer, etc.)'
    ],
    features: [
      '80+ Practical Video Lectures with source code downloads',
      '50+ Coding challenges & homework assignments with solutions',
      'Certificate of Completion from Skilldotpy',
      'Lifetime community discussion support'
    ],
    isFree: false,
    price: '₹499',
    originalPrice: '₹1,499',
    discountBadge: '66% OFF',
    duration: 'Lifetime Access',
    level: 'All Levels',
    enrollmentUrl: '/app-download',
    appDownloadRequired: true
  },
  {
    id: 'web-dev-fundamentals',
    category: 'programming',
    categoryLabel: 'Programming Languages',
    code: 'WEB-DEV-01',
    title: 'Web Development Bootcamp: HTML, CSS & JavaScript',
    hindiTitle: 'वेब डेवलपमेंट बूटकैंप: HTML, CSS और जावास्क्रिप्ट',
    overview: 'Step into frontend development. Learn how to write semantic HTML5, style beautiful responsive layouts with modern CSS3 & Flexbox/Grid, and make web pages interactive with pure modern JavaScript.',
    targetAudience: [
      'Beginners wanting to build and publish their own websites',
      'Students wanting practical frontend skills beyond theory'
    ],
    learningOutcomes: [
      'Structure clean web pages with modern semantic HTML5 tags',
      'Create responsive, mobile-first designs with CSS3 Flexbox & Grid',
      'Add animations, interactive buttons, modal popups, and dropdown menus',
      'Handle form validation, API fetches, and DOM manipulation in JavaScript',
      'Deploy live websites to the web for free using GitHub Pages & Netlify'
    ],
    features: [
      '50+ Hands-on Project-based Videos',
      'Full Source Code for 4 Portfolio Websites',
      'CSS Flexbox & JavaScript Cheatsheet PDFs',
      'Course Completion Certificate'
    ],
    isFree: false,
    price: '₹499',
    originalPrice: '₹1,499',
    discountBadge: '66% OFF',
    duration: 'Lifetime Access',
    level: 'Beginner',
    enrollmentUrl: '/app-download',
    appDownloadRequired: true
  },

  // OFFICE PRODUCTIVITY SUITE
  {
    id: 'libreoffice-suite-mastery',
    category: 'office-suite',
    categoryLabel: 'Office Suite Programs',
    code: 'LIBRE-OFFICE',
    title: 'Complete LibreOffice Suite Mastery (Writer, Calc, Impress, Base)',
    hindiTitle: 'लिब्रेऑफिस कम्पलीट कोर्स (राइटर, कैल्क, इम्प्रेस, बेस)',
    overview: 'Master the premier open-source office suite used in Government offices, NIELIT exams, and modern workplaces. In-depth training on document formatting, advanced Calc formulas, impactful presentations, and relational databases.',
    targetAudience: [
      'NIELIT O Level & CCC students wanting 100% practical clarity',
      'Office clerks, typists, data entry operators, and administrative staff',
      'Schools and institutions using open-source Linux/LibreOffice systems'
    ],
    learningOutcomes: [
      'Master LibreOffice Writer formatting, tables, styles, and Mail Merge',
      'Use advanced Calc formulas (VLOOKUP, SUMIFS, COUNTIF, nested IF)',
      'Create dynamic pivot tables, charts, and financial data models in Calc',
      'Design professional slide decks with custom timings in Impress',
      'Manage tables, queries, and reports using LibreOffice Base database'
    ],
    features: [
      '40+ Step-by-Step Practical Videos',
      'Practice Excel/Calc Datasets & Document Templates',
      'Keyboard Shortcut Quick Reference Guide',
      'Hindi & English Instruction'
    ],
    isFree: false,
    price: '₹299',
    originalPrice: '₹899',
    discountBadge: '67% OFF',
    duration: 'Lifetime Access',
    level: 'Beginner to Intermediate',
    enrollmentUrl: '/app-download',
    appDownloadRequired: true
  },
  {
    id: 'ms-office-pro',
    category: 'office-suite',
    categoryLabel: 'Office Suite Programs',
    code: 'MS-OFFICE',
    title: 'Microsoft Office Professional Suite (Word, Excel, PowerPoint)',
    hindiTitle: 'माइक्रोसॉफ्ट ऑफिस कम्पलीट कोर्स (Word, Excel, PowerPoint)',
    overview: 'Become an office productivity pro. Master MS Word for professional reporting, MS Excel for business data analysis & dashboards, and MS PowerPoint for high-impact presentations.',
    targetAudience: [
      'Job seekers looking to boost their resume with verified Office skills',
      'Students preparing for corporate jobs, data entry, and accounting roles',
      'Anyone looking to automate and speed up daily computer work'
    ],
    learningOutcomes: [
      'Draft corporate letters, resumes, and multi-page reports in MS Word',
      'Analyze data using Excel VLOOKUP, XLOOKUP, INDEX-MATCH, and Pivot Tables',
      'Create interactive charts, conditional formatting rules, and formulas',
      'Build engaging corporate presentations with slide transitions & morph effects'
    ],
    features: [
      '45+ Practical Video Lessons with downloadable practice files',
      '100+ Ready-to-use Excel Formula Templates',
      'Resume & Invoice Word Templates',
      'Certificate of Completion'
    ],
    isFree: false,
    price: '₹399',
    originalPrice: '₹1,299',
    discountBadge: '69% OFF',
    duration: 'Lifetime Access',
    level: 'Beginner to Intermediate',
    enrollmentUrl: '/app-download',
    appDownloadRequired: true
  }
];
