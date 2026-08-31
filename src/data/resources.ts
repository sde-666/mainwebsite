export interface ResourceCategoryInfo {
  id: string;
  title: string;
  hindiTitle: string;
  description: string;
  badge: string;
  resourceCount: string;
}

export const resourceCategories: ResourceCategoryInfo[] = [
  {
    id: 'o-level',
    title: 'O level (M1,M2,M3,M4)',
    hindiTitle: 'ओ लेवल (M1, M2, M3, M4)',
    description: 'Complete syllabus, handwritten notes, previous 5-year solved papers, and model MCQ question banks for all 4 papers.',
    badge: 'M1,M2,M3,M4',
    resourceCount: '15+ Downloads'
  },
  {
    id: 'm1-r5',
    title: 'M1-R5: IT Tools & Network Basics',
    hindiTitle: 'M1-R5: आईटी टूल्स एवं नेटवर्क बेसिक्स',
    description: 'Free PDF notes, LibreOffice Writer, Calc, Impress tutorials, solved question papers, and official syllabus copies.',
    badge: 'M1-R5.1',
    resourceCount: '6+ Downloads'
  },
  {
    id: 'm2-r5',
    title: 'M2-R5: Web Design & Publishing',
    hindiTitle: 'M2-R5: वेब डिजाइनिंग एवं पब्लिशिंग',
    description: 'HTML5, CSS3, JavaScript, W3.CSS, and photo editing practical programs, source codes, and chapter revision notes.',
    badge: 'M2-R5.1',
    resourceCount: '5+ Downloads'
  },
  {
    id: 'm3-r5',
    title: 'M3-R5: Python Programming',
    hindiTitle: 'M3-R5: पायथन प्रोग्रामिंग',
    description: 'Python handwritten notes, control flow, functions, NumPy, file handling, and solved practical exam code scripts.',
    badge: 'M3-R5.1',
    resourceCount: '8+ Downloads'
  },
  {
    id: 'm4-r5',
    title: 'M4-R5: Internet of Things (IoT)',
    hindiTitle: 'M4-R5: इंटरनेट ऑफ थिंग्स (IoT)',
    description: 'IoT architecture, Arduino Uno sketches, sensor interfacing, MQTT protocols, and personality development notes.',
    badge: 'M4-R5.1',
    resourceCount: '4+ Downloads'
  },
  {
    id: 'practicals',
    title: 'Practical Lab & Source Codes',
    hindiTitle: 'प्रैक्टिकल लैब एवं सोर्स कोड',
    description: 'Solved lab assignment source codes (PR1-PR4), Python scripts, HTML/JS web projects, and Arduino sketches.',
    badge: 'PR1-PR4',
    resourceCount: '10+ Downloads'
  },
  {
    id: 'ccc',
    title: 'CCC (Grade S Prep)',
    hindiTitle: 'ट्रिपल सी (CCC) परीक्षा नोट्स',
    description: 'Official 80-hour syllabus, LibreOffice shortcut chart, digital financial literacy guides, and top 500 MCQ compilations.',
    badge: 'Grade S Prep',
    resourceCount: '8+ Downloads'
  },
  {
    id: 'programming',
    title: 'Programming (Python,Web)',
    hindiTitle: 'प्रोग्रामिंग नोट्स एवं कोड',
    description: 'Python handwritten reference notes, HTML5 & CSS3 cheat sheets, JavaScript snippets, and practice problem sets.',
    badge: 'Python,Web',
    resourceCount: '12+ Downloads'
  },
  {
    id: 'office-suite',
    title: 'Office (LibreOffice & MS Office)',
    hindiTitle: 'लिब्रेऑफिस एवं एमएस ऑफिस',
    description: 'Comprehensive guides and keyboard shortcuts for LibreOffice Writer, Calc, Impress, MS Word, Excel, and PowerPoint.',
    badge: 'LibreOffice & MS Office',
    resourceCount: '6+ Downloads'
  }
];

export interface Resource {
  id: string;
  category: 'o-level' | 'ccc' | 'programming' | 'office-suite' | 'practicals';
  categoryLabel: string;
  moduleCode?: string;
  title: string;
  hindiTitle?: string;
  description: string;
  fileType: 'PDF' | 'ZIP' | 'CODE' | 'SYLLABUS';
  fileSize: string;
  downloadCount: string;
  isOfficialSyllabus?: boolean;
  downloadUrl: string;
  tags: string[];
  isPaid?: boolean;
  price?: number;
  originalPrice?: number;
  previewPageCount?: number;
  totalPages?: number;
  sampleHighlights?: string[];
}

export const resources: Resource[] = [
  // OFFICIAL SYLLABUS FILES (100% FREE)
  {
    id: 'o-level-official-syllabus-r5',
    category: 'o-level',
    categoryLabel: 'NIELIT O Level',
    moduleCode: 'M1 to M4 (R5.1)',
    title: 'NIELIT O Level Official Revised Syllabus (R5.1) Complete PDF',
    hindiTitle: 'ओ लेवल ऑफिशियल संशोधित पाठ्यक्रम (R5.1) कम्पलीट पीडीएफ',
    description: 'Official NIELIT syllabus PDF detailing detailed topic breakdown, marks distribution, practical guidelines, and project criteria for all 4 papers (M1-R5.1, M2-R5.1, M3-R5.1, M4-R5.1).',
    fileType: 'SYLLABUS',
    fileSize: '1.4 MB',
    downloadCount: '45,200+',
    isOfficialSyllabus: true,
    downloadUrl: '/downloads/o-level-r5-syllabus.pdf',
    tags: ['Syllabus', 'Official NIELIT', 'R5.1', 'All Papers'],
    isPaid: false
  },
  {
    id: 'ccc-official-syllabus',
    category: 'ccc',
    categoryLabel: 'NIELIT CCC',
    title: 'NIELIT CCC (Course on Computer Concepts) Official Syllabus PDF',
    hindiTitle: 'ट्रिपल सी (CCC) ऑफिशियल 80-घंटे का सम्पूर्ण पाठ्यक्रम',
    description: 'Complete 80-hour syllabus document covering all 9 chapters: Computer Fundamentals, LibreOffice Suite (Writer, Calc, Impress), Internet, Digital Payments, and Cyber Security.',
    fileType: 'SYLLABUS',
    fileSize: '850 KB',
    downloadCount: '38,100+',
    isOfficialSyllabus: true,
    downloadUrl: '/downloads/ccc-syllabus.pdf',
    tags: ['CCC Syllabus', 'LibreOffice', 'Official'],
    isPaid: false
  },

  // M1-R5 PREMIUM HANDWRITTEN MASTER NOTES (PAID)
  {
    id: 'm1-chapter-wise-notes',
    category: 'o-level',
    categoryLabel: 'NIELIT O Level',
    moduleCode: 'M1-R5.1',
    title: 'M1-R5: IT Tools & Network Basics Complete Handwritten Master Notes PDF',
    hindiTitle: 'M1-R5: आईटी टूल्स कम्पलीट हस्तलिखित मास्टर नोट्स (सॉल्व्ड एक्सरसाइज)',
    description: 'Comprehensive 65-page handwritten & color-coded notes covering Hardware, OS, LibreOffice Writer, Calc, Impress, Internet, Digital Finance, and Cyber Security with 300+ Solved MCQs & Diagrams.',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    downloadCount: '24,500+',
    downloadUrl: '/downloads/m1-r5-notes.pdf',
    tags: ['M1-R5', 'IT Tools', 'LibreOffice Notes', 'Handwritten'],
    isPaid: true,
    price: 39,
    originalPrice: 129,
    previewPageCount: 3,
    totalPages: 65,
    sampleHighlights: [
      'Bilingual Hindi & English explanations with architectural flowcharts',
      'LibreOffice Writer, Calc & Impress complete menu shortcut charts',
      'Digital payment UPI, AEPS, USSD, and Cyber Security threat tables',
      'Chapter-end high-yield summary & 300+ NIELIT exam repeated MCQs'
    ]
  },
  // M1-R5 FREE SOLVED QUESTION PAPERS (FREE)
  {
    id: 'm1-previous-papers',
    category: 'o-level',
    categoryLabel: 'NIELIT O Level',
    moduleCode: 'M1-R5.1',
    title: 'M1-R5: Solved Question Papers (Past 5 Exam Cycles with Answer Key)',
    hindiTitle: 'M1-R5: पिछले 5 वर्षों के हल प्रश्न पत्र (100% फ्री)',
    description: 'Detailed question paper solutions with verified answer keys and bilingual explanations for January & July exam cycles.',
    fileType: 'PDF',
    fileSize: '3.2 MB',
    downloadCount: '19,800+',
    downloadUrl: '/downloads/m1-r5-solved-papers.pdf',
    tags: ['M1-R5', 'Old Papers', 'Solved Questions'],
    isPaid: false
  },

  // M2-R5 WEB DESIGNING PREMIUM BUNDLE (PAID)
  {
    id: 'm2-chapter-wise-notes',
    category: 'o-level',
    categoryLabel: 'NIELIT O Level',
    moduleCode: 'M2-R5.1',
    title: 'M2-R5: Web Designing & Publishing Complete Handwritten Color Notes PDF',
    hindiTitle: 'M2-R5: वेब डिजाइनिंग (HTML5, CSS3, JS, W3.CSS) सम्पूर्ण नोट्स',
    description: 'Covers HTML5 semantic markup, CSS3 Flexbox & Grid, responsive box model, JavaScript DOM manipulation, Photoshop/GIMP tools, and publishing essentials with live code output screenshots.',
    fileType: 'PDF',
    fileSize: '5.2 MB',
    downloadCount: '22,100+',
    downloadUrl: '/downloads/m2-r5-notes.pdf',
    tags: ['M2-R5', 'Web Design', 'HTML5 CSS3', 'JavaScript'],
    isPaid: true,
    price: 49,
    originalPrice: 149,
    previewPageCount: 3,
    totalPages: 78,
    sampleHighlights: [
      'HTML5 semantic tags & CSS3 layout styling with syntax highlights',
      'JavaScript event handling, form validation & DOM code examples',
      'W3.CSS responsive grid framework cheatsheet',
      'Photo editing tools, web publishing FTP/HTTP protocols guide'
    ]
  },
  // M2-R5 FREE PRACTICAL CODE BUNDLE (FREE)
  {
    id: 'm2-practical-code-bundle',
    category: 'practicals',
    categoryLabel: 'Lab & Practical Codes',
    moduleCode: 'M2-R5.1',
    title: 'M2-R5: 25+ Solved Web Design Practical Programs (HTML, CSS, JS Source Code)',
    hindiTitle: 'M2-R5: 25+ प्रैक्टिकल प्रोग्राम्स का सोर्स कोड बंडल (फ्री)',
    description: 'Ready-to-run HTML/CSS/JS source code bundle including Student Admission Form, Animated Navigation Bar, Image Gallery, and Calculator.',
    fileType: 'CODE',
    fileSize: '1.8 MB',
    downloadCount: '17,400+',
    downloadUrl: '/downloads/m2-r5-practical-codes.pdf',
    tags: ['Practical Code', 'HTML Source', 'JS Form Validation'],
    isPaid: false
  },

  // M3-R5 PYTHON PREMIUM MASTERCLASS NOTES (PAID)
  {
    id: 'm3-python-complete-notes',
    category: 'o-level',
    categoryLabel: 'NIELIT O Level',
    moduleCode: 'M3-R5.1',
    title: 'M3-R5: Python Programming Complete Simplified Master Notes PDF',
    hindiTitle: 'M3-R5: पायथन प्रोग्रामिंग कम्पलीट नोट्स (एल्गोरिदम व NumPy सहित)',
    description: 'Master Python effortlessly! Covers Flowcharts, Control Flow, Lists, Tuples, Dictionaries, Sets, Functions, File Handling, Recursion, and NumPy module with syntax diagrams and 400+ solved practice problems.',
    fileType: 'PDF',
    fileSize: '6.1 MB',
    downloadCount: '31,900+',
    downloadUrl: '/downloads/m3-r5-notes.pdf',
    tags: ['M3-R5', 'Python Notes', 'NumPy', 'File Handling'],
    isPaid: true,
    price: 49,
    originalPrice: 199,
    previewPageCount: 3,
    totalPages: 92,
    sampleHighlights: [
      'Line-by-line code execution tracing & dry-run memory tables',
      'Complete coverage of Lists, Tuples, Dicts, Sets and Comprehensions',
      'NumPy 1D/2D array creation, slicing & mathematical operations',
      'File Handling (read, write, append, seek/tell) with exception handling'
    ]
  },
  // M3-R5 FREE PRACTICAL BUNDLE (FREE)
  {
    id: 'm3-python-practical-bundle',
    category: 'practicals',
    categoryLabel: 'Lab & Practical Codes',
    moduleCode: 'M3-R5.1',
    title: 'M3-R5: 50+ Top Repeated Python Practical Exam Programs with .py Files',
    hindiTitle: 'M3-R5: 50+ पायथन प्रैक्टिकल प्रोग्राम्स (.py फाइल्स फ्री)',
    description: 'Complete Python scripts with output screenshots: Armstrong number, Fibonacci series, Palindrome check, Pattern printing, Matrix addition/multiplication, and File word counter.',
    fileType: 'CODE',
    fileSize: '2.4 MB',
    downloadCount: '28,600+',
    downloadUrl: '/downloads/m3-r5-practical-codes.pdf',
    tags: ['Python Code', 'Practicals', 'Algorithms'],
    isPaid: false
  },

  // M4-R5 IOT PREMIUM NOTES & CIRCUITS (PAID)
  {
    id: 'm4-iot-notes',
    category: 'o-level',
    categoryLabel: 'NIELIT O Level',
    moduleCode: 'M4-R5.1',
    title: 'M4-R5: Internet of Things (IoT) Complete Notes & Arduino Pinout Guide',
    hindiTitle: 'M4-R5: इंटरनेट ऑफ थिंग्स (IoT) एवं आर्डुइनो सम्पूर्ण नोट्स',
    description: 'Comprehensive guide to IoT architecture, Sensors (DHT11, LDR, Ultrasonic, PIR), Actuators, Arduino Uno embedded programming, MQTT protocols, and Personality Development.',
    fileType: 'PDF',
    fileSize: '5.5 MB',
    downloadCount: '18,300+',
    downloadUrl: '/downloads/m4-r5-notes.pdf',
    tags: ['M4-R5', 'IoT Notes', 'Arduino Uno', 'MQTT'],
    isPaid: true,
    price: 39,
    originalPrice: 129,
    previewPageCount: 3,
    totalPages: 56,
    sampleHighlights: [
      'Clear circuit wiring schematics for Arduino Uno and ESP8266/ESP32',
      'DHT11 temperature sensor, LDR, PIR motion & Ultrasonic sensor code',
      'MQTT publisher/subscriber IoT network communication protocols',
      'Soft skills, communication & personality development module'
    ]
  },
  // M4-R5 FREE ARDUINO SKETCHES (FREE)
  {
    id: 'm4-arduino-sketches',
    category: 'practicals',
    categoryLabel: 'Lab & Practical Codes',
    moduleCode: 'M4-R5.1',
    title: 'M4-R5: 20+ Arduino Uno Lab Simulation Sketches (.ino Files & Schematics)',
    hindiTitle: 'M4-R5: 20+ आर्डुइनो प्रैक्टिकल स्केच कोड (100% फ्री)',
    description: 'Ready-to-upload Arduino sketch (.ino) files with TinkerCAD circuit diagrams for all practical lab questions.',
    fileType: 'CODE',
    fileSize: '2.1 MB',
    downloadCount: '15,200+',
    downloadUrl: '/downloads/m4-r5-practical-codes.pdf',
    tags: ['Arduino', 'IoT Code', 'Schematics'],
    isPaid: false
  },

  // CHEAT SHEETS & OFFICE SUITE (FREE)
  {
    id: 'libreoffice-shortcut-cheatsheet',
    category: 'office-suite',
    categoryLabel: 'Office Suite Programs',
    title: 'LibreOffice (Writer, Calc, Impress) All Essential Shortcut Keys Chart PDF',
    hindiTitle: 'लिब्रेऑफिस सम्पूर्ण शॉर्टकट कुंजी चार्ट (CCC एवं O Level स्पेशल)',
    description: 'One-page quick revision cheat sheet of all high-frequency shortcut keys tested in NIELIT CCC and M1-R5 exams.',
    fileType: 'PDF',
    fileSize: '950 KB',
    downloadCount: '41,000+',
    downloadUrl: '/downloads/libreoffice-shortcuts.pdf',
    tags: ['Shortcuts', 'LibreOffice', 'Cheat Sheet', 'CCC'],
    isPaid: false
  },
  {
    id: 'o-level-project-guide',
    category: 'o-level',
    categoryLabel: 'NIELIT O Level',
    moduleCode: 'All Papers',
    title: 'NIELIT O Level Official Project Submission Guide & Proforma Format',
    hindiTitle: 'ओ लेवल प्रोजेक्ट सबमिशन गाइड एवं प्रोफार्मा फॉर्मेट',
    description: 'Step-by-step instructions on project synopsis, supervisor certificate eligibility, and online submission to NIELIT headquarters.',
    fileType: 'PDF',
    fileSize: '620 KB',
    downloadCount: '14,300+',
    downloadUrl: '/downloads/o-level-project-guide.pdf',
    tags: ['Project Guide', 'Proforma', 'Certification'],
    isPaid: false
  }
];
