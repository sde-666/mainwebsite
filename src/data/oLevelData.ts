export interface OLevelChapter {
  number: number;
  title: string;
  hindiTitle?: string;
  theoryHours: number;
  practicalHours: number;
  marksWeightage?: string;
  topics: string[];
  importance: 'High' | 'Medium' | 'Essential';
}

export interface OLevelModule {
  id: string;
  code: string;
  shortName: string;
  title: string;
  hindiTitle: string;
  description: string;
  weightage: string;
  examCode: string;
  badgeColor: string;
  iconName: string;
  totalTheoryHours: number;
  totalPracticalHours: number;
  totalHours: number;
  credits: number;
  marksDistribution: {
    unit: string;
    writtenMarks: number;
  }[];
  chapters: OLevelChapter[];
  practicalTopics: string[];
  keyHighlights: string[];
  sampleQuestions: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
  syllabusPdfUrl: string;
  sampleNotesPdfUrl: string;
  youtubePlaylistUrl: string;
  appCourseUrl: string;
}

export const oLevelExamInfo = {
  title: 'NIELIT O Level (IT) Course Under DOEACC Scheme',
  scheme: 'Revision-5.1 (July 2022 onwards, NSQF Level 4 Aligned)',
  duration: '540 Learning Hours (1 Year for 10+2 / 6 Months after Graduation)',
  totalPapers: 4,
  totalCredits: 18,
  theoryExamPattern: '100 Multiple Choice Questions (MCQ) - 2 Hours duration (Min. 33% to qualify, 60% weightage in final module result, No negative marking)',
  practicalExamPattern: '100 Marks (80 Marks Demonstration + 20 Marks Viva Voce) - 3 Hours duration (Min. 33% to qualify, 40% weightage in final module result)',
  passingCriteria: 'Minimum 33% in Theory, 33% in Practical, and minimum 50% aggregate weighted total (60% Theory + 40% Practical) in each module (Grades: S: ≥85%, A: 75-84%, B: 65-74%, C: 55-64%, D: 50-54%, F: <50%)',
  projectRequirement: 'Mandatory Project (PJ1-R5.1) submission required to qualify O Level IT certificate (Carried out under guidance of faculty/institute)',
  eligibility: '10+2 passed OR ITI Certificate (2 Years after 10th / 1 Year with 1 yr experience) OR 2nd year of Polytechnic Diploma OR 10th with immediate previous NSQF Level certificate',
  jobRoles: [
    'User Interface (UI) Designer',
    'Web Designer',
    'Web Publication Assistant',
    'Office Automation Assistant',
    'IoT Application Integrator'
  ]
};

export const oLevelModules: OLevelModule[] = [
  // ================= PAPER 1: M1-R5.1 =================
  {
    id: 'm1-r5',
    code: 'M1-R5.1',
    shortName: 'IT Tools & Network',
    title: 'Information Technology Tools and Network Basics',
    hindiTitle: 'सूचना प्रौद्योगिकी उपकरण और नेटवर्क मूल बातें',
    description: 'Equips students to use computers professionally and for daily applications. Provides theoretical background and in-depth knowledge of OS, LibreOffice Suite (Writer, Calc, Impress), Internet & WWW, E-Governance, Digital Financial Services, FutureSkills, and Cyber Security.',
    weightage: 'Paper 1 (4 Credits • 120 Hours)',
    examCode: 'M1-R5.1',
    badgeColor: 'blue',
    iconName: 'Laptop',
    totalTheoryHours: 48,
    totalPracticalHours: 72,
    totalHours: 120,
    credits: 4,
    marksDistribution: [
      { unit: '1. Introduction to Computer, Introduction to Operating System', writtenMarks: 10 },
      { unit: '2. Word Processing (LibreOffice Writer)', writtenMarks: 20 },
      { unit: '3. Spreadsheet (LibreOffice Calc)', writtenMarks: 20 },
      { unit: '4. Presentation (LibreOffice Impress)', writtenMarks: 20 },
      { unit: '5. Introduction to Internet and WWW, E-mail, Social Networking & e-Governance', writtenMarks: 20 },
      { unit: '6. Digital Financial Tools and Applications, Overview of FutureSkills & Cyber Security', writtenMarks: 10 }
    ],
    chapters: [
      {
        number: 1,
        title: 'Introduction to Computer',
        hindiTitle: 'कंप्यूटर का परिचय',
        theoryHours: 4,
        practicalHours: 6,
        marksWeightage: '10 Marks (Unit 1)',
        topics: [
          'Computer and Latest IT gadgets, Evolution of Computers & its applications',
          'IT gadgets and their applications, Basics of Hardware and Software',
          'Central Processing Unit (CPU), Input devices, Output devices',
          'Computer Memory & storage (Primary RAM/ROM, Secondary Storage)',
          'Application Software, Systems Software, Utility Software',
          'Open source and Proprietary Software, Mobile Apps'
        ],
        importance: 'High'
      },
      {
        number: 2,
        title: 'Introduction to Operating System',
        hindiTitle: 'ऑपरेटिंग सिस्टम का परिचय',
        theoryHours: 4,
        practicalHours: 6,
        marksWeightage: '10 Marks (Unit 1)',
        topics: [
          'Operating System, Basics of Operating System',
          'Operating Systems for Desktop and Laptop, Operating Systems for Mobile Phone and Tablets',
          'User Interface for Desktop and Laptop, Task Bar, Icons & shortcuts, Running an application',
          'Operating System simple settings, Using mouse and changing its properties',
          'Changing system date and time, Changing display properties',
          'Add or remove Program and its features, Adding, removing & sharing Printers',
          'File and Folder management, Types of file extensions'
        ],
        importance: 'High'
      },
      {
        number: 3,
        title: 'Word Processing',
        hindiTitle: 'वर्ड प्रोसेसिंग (लिब्रेऑफिस राइटर)',
        theoryHours: 6,
        practicalHours: 9,
        marksWeightage: '20 Marks (Unit 2)',
        topics: [
          'Word Processing Basics, Opening Word Processing Package, Title Bar, Menu Bar, Toolbars & Sidebar',
          'Creating a New Document, Opening, Saving (Save & Save As), Closing Document, Using Help',
          'Page Setup, Page Layout, Borders, Watermark, Print Preview, Printing of Documents, PDF file export',
          'Text Creation, manipulation, Editing Text, Text Selection, Cut, Copy, Paste, Font, Color, Style & Size',
          'Alignment of Text, Undo & Redo, AutoCorrect, Spelling & Grammar, Find and Replace, Text Formatting',
          'User defined Styles, Paragraph Indentation, Bullets and Numbering, Change Case, Header & Footer',
          'Table Manipulation: Insert & Draw Table, Changing cell width/height, Alignment, Row/Column Insert/Delete, Merge & Split, Borders & Shading',
          'Mail Merge (creating labels & letters for multiple recipients), Table of Contents, Indexes, Comments, Tracking Changes, Macros'
        ],
        importance: 'Essential'
      },
      {
        number: 4,
        title: 'Spreadsheet',
        hindiTitle: 'स्प्रेडशीट (लिब्रेऑफिस कैल्क)',
        theoryHours: 8,
        practicalHours: 12,
        marksWeightage: '20 Marks (Unit 3)',
        topics: [
          'Elements of Spread Sheet, Creating Spread Sheet, Cell Address [Row and Column] and Selecting a Cell',
          'Entering Data [text, number, date] in Cells, Page Setup, Printing Sheet, Saving, Opening and Closing',
          'Manipulation of Cells & Sheet, Modifying / Editing Cell Content, Formatting Cell (Font, Alignment, Style)',
          'Cut, Copy, Paste & Paste Special, Changing Cell Height and Width, Inserting/Deleting Rows and Columns',
          'AutoFill, Sorting & Filtering, Freezing panes',
          'Formulas & Functions: Basic arithmetic formulas (+, -, *, /), AutoSum',
          'Functions: SUM, COUNT, MAX, MIN, AVERAGE',
          'Sort, Filter, Advanced Filter, Database Functions (DSUM, DMIN, DMAX, DCOUNT, DCOUNTA)',
          'What-if Analysis, Pivot Table, Charts (Bar, Column, Pie, Line), Data Validation'
        ],
        importance: 'Essential'
      },
      {
        number: 5,
        title: 'Presentation',
        hindiTitle: 'प्रेजेंटेशन (लिब्रेऑफिस इम्प्रेस)',
        theoryHours: 6,
        practicalHours: 9,
        marksWeightage: '20 Marks (Unit 4)',
        topics: [
          'Creation of Presentation, Creating Presentation using Template, Creating Blank Presentation',
          'Inserting & Editing Text on Slides, Inserting and Deleting Slides in a Presentation, Saving Presentation',
          'Manipulating Slides, Inserting Table, Adding Pictures, Inserting Other Objects, Resizing and Scaling Objects',
          'Creating & using Master Slide, Presentation of Slides, Choosing a Set Up for Presentation',
          'Running a Slide Show, Transition and Slide Timings, Automating a Slide Show',
          'Providing Aesthetics to Slides & Printing, Enhancing Text Presentation, Working with Color & Line Style',
          'Adding Movie and Sound, Adding Headers, Footers and Notes, Printing Slides and Handouts'
        ],
        importance: 'Essential'
      },
      {
        number: 6,
        title: 'Introduction to Internet and WWW',
        hindiTitle: 'इंटरनेट और WWW का परिचय',
        theoryHours: 6,
        practicalHours: 9,
        marksWeightage: '20 Marks (Unit 5)',
        topics: [
          'Basics of Computer Networks, Local Area Network (LAN), Wide Area Network (WAN), Network Topology',
          'Internet, Concept of Internet & WWW, Applications of Internet, Website Address and URL',
          'Introduction to IP Address, ISP and Role of ISP, Internet Protocol (IP)',
          'Modes of Connecting Internet: HotSpot, WiFi, LAN Cable, BroadBand, USB Tethering',
          'Identifying and uses of IP/MAC/IMEI of various devices',
          'Popular Web Browsers (Internet Explorer/Edge, Chrome, Mozilla Firefox, Opera etc.)',
          'Exploring the Internet, Surfing the web, Popular Search Engines, Searching on Internet',
          'Downloading Web Pages, Printing Web Pages'
        ],
        importance: 'Essential'
      },
      {
        number: 7,
        title: 'E-mail, Social Networking and e-Governance Services',
        hindiTitle: 'ई-मेल, सोशल नेटवर्किंग एवं ई-गवर्नेंस सेवाएं',
        theoryHours: 6,
        practicalHours: 9,
        marksWeightage: '20 Marks (Unit 5)',
        topics: [
          'Structure of E-mail, Using E-mails, Opening Email account, Mailbox: Inbox and Outbox',
          'Creating and Sending a new E-mail, Replying to an E-mail, Forwarding an E-mail, Searching emails',
          'Attaching files with email, Email Signature',
          'Social Networking & e-Commerce: Facebook, Twitter, LinkedIn, Instagram',
          'Instant Messaging: WhatsApp, Facebook Messenger, Telegram, Introduction to Blogs',
          'Basics of E-commerce, Netiquettes',
          'Overview of e-Governance Services: Railway Reservation (IRCTC), Passport, eHospital [ORS], UMANG App, Digital Locker (DigiLocker)'
        ],
        importance: 'High'
      },
      {
        number: 8,
        title: 'Digital Financial Tools and Applications',
        hindiTitle: 'डिजिटल वित्तीय उपकरण और अनुप्रयोग',
        theoryHours: 4,
        practicalHours: 6,
        marksWeightage: '10 Marks (Unit 6)',
        topics: [
          'Digital Financial Tools: OTP (One Time Password), QR (Quick Response) Code',
          'UPI (Unified Payment Interface), AEPS (Aadhaar Enabled Payment System), USSD (*99#)',
          'Cards: Credit Card / Debit Card, Rupay, Point of Sale (PoS), e-Wallets',
          'Internet Banking, National Electronic Fund Transfer (NEFT), Real Time Gross Settlement (RTGS), Immediate Payment Service (IMPS)',
          'Online Bill Payment systems'
        ],
        importance: 'Essential'
      },
      {
        number: 9,
        title: 'Overview of FutureSkills and Cyber Security',
        hindiTitle: 'फ्यूचर स्किल्स एवं साइबर सुरक्षा का अवलोकन',
        theoryHours: 4,
        practicalHours: 6,
        marksWeightage: '10 Marks (Unit 6)',
        topics: [
          'Introduction to Internet of Things (IoT), Big Data Analytics, Cloud Computing',
          'Virtual Reality, Artificial Intelligence (AI), Social & Mobile',
          'Blockchain Technology, 3D Printing / Additive Manufacturing, Robotics Process Automation (RPA)',
          'Cyber Security: Need of Cyber Security, Securing PC, Securing Smart Phone'
        ],
        importance: 'High'
      }
    ],
    practicalTopics: [
      'LibreOffice Writer: Document creation, formatting, table manipulation, and Mail Merge with recipient database',
      'LibreOffice Calc: Spreadsheet formulas (SUM, AVERAGE, MAX, MIN, IF), DSUM, Pivot Tables, and Charts',
      'LibreOffice Impress: Animated slide show presentation with master slide, transitions, and timing',
      'Operating System Settings: User accounts, printer sharing, screen saver, date/time and folder hierarchy management',
      'Internet & Financial: Configuring email accounts, DigiLocker, UMANG App and understanding UPI/NEFT/RTGS workflows'
    ],
    keyHighlights: [
      'Official NIELIT R5.1 Syllabus with full LibreOffice 7.x emphasis',
      'Covers both Theory (100 Marks MCQ) and Practical Lab (100 Marks with Viva)',
      'Mail Merge & Calc Formulas covered with step-by-step practical videos',
      'Bilingual Hindi & English notes and solved past 5 years question papers'
    ],
    sampleQuestions: [
      {
        question: 'What is the default file extension for a document saved in LibreOffice Writer?',
        options: ['.odt', '.docx', '.ods', '.odp'],
        correct: 0,
        explanation: 'LibreOffice Writer saves text documents in OpenDocument Text (.odt) format by default.'
      },
      {
        question: 'What is the maximum number of rows in a LibreOffice Calc spreadsheet?',
        options: ['65,536', '1,048,576', '10,48,598', '16,384'],
        correct: 1,
        explanation: 'LibreOffice Calc supports 1,048,576 rows (2^20) and 1,024 columns.'
      },
      {
        question: 'What is the shortcut key to insert a text box in LibreOffice Impress?',
        options: ['F5', 'F8', 'F3', 'F2'],
        correct: 3,
        explanation: 'In LibreOffice Impress, pressing F2 activates the Text Box insertion tool.'
      }
    ],
    syllabusPdfUrl: '/downloads/m1-r5-syllabus.pdf',
    sampleNotesPdfUrl: '/downloads/m1-r5-notes.pdf',
    youtubePlaylistUrl: 'https://youtube.com/@skilldotpy',
    appCourseUrl: '/courses/o-level-m1'
  },

  // ================= PAPER 2: M2-R5.1 =================
  {
    id: 'm2-r5',
    code: 'M2-R5.1',
    shortName: 'Web Designing',
    title: 'Web Designing and Publishing',
    hindiTitle: 'वेब डिजाइनिंग और पब्लिशिंग',
    description: 'Designed to equip students with skills in designing layouts of websites. Students will learn the structure of the World Wide Web, create responsive web pages using HTML5, CSS3, W3.CSS framework, JavaScript, AngularJS, edit images with Photo Editor, and publish websites.',
    weightage: 'Paper 2 (4 Credits • 120 Hours)',
    examCode: 'M2-R5.1',
    badgeColor: 'emerald',
    iconName: 'Code',
    totalTheoryHours: 48,
    totalPracticalHours: 72,
    totalHours: 120,
    credits: 4,
    marksDistribution: [
      { unit: '1. Introduction to Web Design and Editors, HTML Basics', writtenMarks: 25 },
      { unit: '2. Cascading Style Sheets (CSS)', writtenMarks: 20 },
      { unit: '3. CSS Framework (W3.CSS)', writtenMarks: 15 },
      { unit: '4. JavaScript and Angular JS', writtenMarks: 20 },
      { unit: '5. Photo Editor, Web Publishing and Browsing', writtenMarks: 20 }
    ],
    chapters: [
      {
        number: 1,
        title: 'Introduction to Web Design',
        hindiTitle: 'वेब डिजाइन का परिचय',
        theoryHours: 2,
        practicalHours: 3,
        marksWeightage: '25 Marks (Unit 1)',
        topics: [
          'Introduction of Internet, WWW, Website, Working of Websites, Webpages',
          'Front End and Back End architecture',
          'Client and Server Scripting Languages',
          'Responsive Web Designing concepts',
          'Types of Websites (Static and Dynamic Websites)'
        ],
        importance: 'Medium'
      },
      {
        number: 2,
        title: 'Editors',
        hindiTitle: 'कोड एडिटर्स',
        theoryHours: 2,
        practicalHours: 3,
        marksWeightage: '25 Marks (Unit 1)',
        topics: [
          'Downloading free Editors like Notepad++, Sublime Text Editor, VS Code',
          'Making use of Editors, File creation and editing',
          'Saving files with proper extensions (.html, .css, .js)'
        ],
        importance: 'Medium'
      },
      {
        number: 3,
        title: 'HTML Basics',
        hindiTitle: 'एचटीएमएल बेसिक्स एवं HTML5',
        theoryHours: 10,
        practicalHours: 15,
        marksWeightage: '25 Marks (Unit 1)',
        topics: [
          'HTML: Introduction, Basic Structure of HTML, Head Section and Elements of Head Section',
          'Formatting Tags: Bold, Italic, Underline, Strikethrough, Div, Pre Tag, Anchor links and Named Anchors',
          'Image Tag, Paragraphs, Comments',
          'Tables: Attributes (Border, Cellpadding, Cellspacing, Height, Width), TR, TH, TD, Rowspan, Colspan',
          'Lists: Ordered List (<ol>), Unordered List (<ul>), Definition List (<dl>)',
          'Forms & Form Elements: Input types (text, password, radio, checkbox, submit, reset, date, number, range, email), Text Area, Dropdown (<select>)',
          'Frames: Frameset and nested Frames',
          'HTML5 Introduction: New Elements (section, nav, article, aside, audio, video)',
          'HTML5 Form Validations: required, pattern, autofocus attributes',
          'HTML Embed Multimedia, HTML Layout, HTML Iframe'
        ],
        importance: 'Essential'
      },
      {
        number: 4,
        title: 'Cascading Style Sheets (CSS)',
        hindiTitle: 'कास्केडिंग स्टाइल शीट्स (CSS)',
        theoryHours: 10,
        practicalHours: 15,
        marksWeightage: '20 Marks (Unit 2)',
        topics: [
          'Introduction to CSS, Types of CSS (Inline, Internal, External)',
          'CSS Selectors: Universal Selector, ID selector, Tag/Element Selector, Class Selector, Sub Selector, Attribute Selector, Group Selector',
          'CSS Properties: Background properties, Block Properties, Box Model properties (margin, border, padding, height, width)',
          'List properties, Border Properties, Positioning Properties (static, relative, absolute, fixed)',
          'CSS Lists, CSS Tables, CSS Menu Design, CSS Image Gallery'
        ],
        importance: 'Essential'
      },
      {
        number: 5,
        title: 'CSS Framework',
        hindiTitle: 'सीएसएस फ्रेमवर्क (W3.CSS)',
        theoryHours: 6,
        practicalHours: 9,
        marksWeightage: '15 Marks (Unit 3)',
        topics: [
          'Web Site Development using W3.CSS Framework',
          'W3.CSS Intro, W3.CSS Colors, W3.CSS Containers, W3.CSS Panels',
          'W3.CSS Borders, W3.CSS Fonts, W3.CSS Text, W3.CSS Tables',
          'W3.CSS List, W3.CSS Images, W3.CSS Grid (Responsive layout)'
        ],
        importance: 'High'
      },
      {
        number: 6,
        title: 'JavaScript and Angular JS',
        hindiTitle: 'जावास्क्रिप्ट एवं एंगुलर जेएस',
        theoryHours: 10,
        practicalHours: 15,
        marksWeightage: '20 Marks (Unit 4)',
        topics: [
          'Introduction to Client Side Scripting Language, Variables in JavaScript, Operators in JS',
          'Conditional Statements (if, if-else, switch), Loops (for, while, do-while)',
          'JS Popup Boxes (alert, prompt, confirm), JS Events (onclick, onmouseover, onsubmit, onload)',
          'Basic Form Validations in JavaScript (empty check, email format, password matching)',
          'Introduction to Angular JS: Expressions {{ }}, Modules (ng-app) and Directives (ng-model, ng-bind, ng-init, ng-repeat)'
        ],
        importance: 'Essential'
      },
      {
        number: 7,
        title: 'Photo Editor',
        hindiTitle: 'फोटो एडिटर (Photoshop / GIMP)',
        theoryHours: 6,
        practicalHours: 9,
        marksWeightage: '20 Marks (Unit 5)',
        topics: [
          'Features of Photo Editing, User Interface of Photo Editors',
          'Tools: Selection Tools (Marquee, Lasso, Magic Wand), Paint Tools (Brush, Gradient, Paint Bucket)',
          'Transform Tools (Crop, Scale, Rotate, Flip), Text Tool, Layers management',
          'Brightness / Contrast adjustments, Improve Colors and tone, Filters and Effects',
          'Image Optimization for Web (JPEG, PNG, GIF formats)'
        ],
        importance: 'High'
      },
      {
        number: 8,
        title: 'Web Publishing and Browsing',
        hindiTitle: 'वेब पब्लिशिंग एवं ब्राउजिंग',
        theoryHours: 2,
        practicalHours: 3,
        marksWeightage: '20 Marks (Unit 5)',
        topics: [
          'Overview of Web Publishing, SGML (Standard Generalized Markup Language)',
          'Web hosting Basics, Domain Name Registration, DNS',
          'Documents Interchange Standards, Components of Web Publishing, Document management',
          'Web Page Design Considerations and Principles',
          'Search and Meta Search Engines, WWW, Web Browsers, HTTP/HTTPS protocols, Web Publishing Tools & FTP'
        ],
        importance: 'High'
      }
    ],
    practicalTopics: [
      'HTML5: Designing structured web pages with tables, nested frames, and interactive validation forms',
      'CSS: Creating responsive navigation menus, image galleries, and CSS Box Model styling',
      'W3.CSS: Developing a complete responsive multi-section website with grid layout and containers',
      'JavaScript: Implementing dynamic simple interest calculator, popup alerts, and client-side form validation',
      'Photo Editor: Image retouching, layer masking, cropping and exporting web-optimized graphics'
    ],
    keyHighlights: [
      'Full coverage of W3.CSS Responsive Framework as prescribed in NIELIT R5.1',
      'Hands-on JavaScript DOM events & AngularJS directives syntax',
      'Photo Editing tools simplified for exam practicals & viva',
      'Downloadable HTML/CSS source code files for all practical lab assignments'
    ],
    sampleQuestions: [
      {
        question: 'Which of the following tag is used for inserting the largest heading in HTML?',
        options: ['<head>', '<h1>', '<h6>', '<heading>'],
        correct: 1,
        explanation: '<h1> defines the largest heading in HTML, while <h6> defines the smallest.'
      },
      {
        question: 'Which CSS property is used to make the text bold?',
        options: ['text-decoration: bold', 'font-weight: bold', 'font-style: bold', 'text-align: bold'],
        correct: 1,
        explanation: 'font-weight: bold (or numeric values like 700) is used in CSS to make text bold.'
      },
      {
        question: 'In JavaScript, which function is used to send messages to users requesting text input?',
        options: ['Display()', 'Prompt()', 'Alert()', 'Confirm()'],
        correct: 1,
        explanation: 'prompt() displays a dialog box with an input field prompting the user to enter text.'
      }
    ],
    syllabusPdfUrl: '/downloads/m2-r5-syllabus.pdf',
    sampleNotesPdfUrl: '/downloads/m2-r5-notes.pdf',
    youtubePlaylistUrl: 'https://youtube.com/@skilldotpy',
    appCourseUrl: '/courses/o-level-m2'
  },

  // ================= PAPER 3: M3-R5.1 =================
  {
    id: 'm3-r5',
    code: 'M3-R5.1',
    shortName: 'Python Programming',
    title: 'Programming and Problem Solving Through Python',
    hindiTitle: 'पायथन के माध्यम से प्रोग्रामिंग और समस्या समाधान',
    description: 'Learn computational problem solving using Python. Understand programming concepts like Data Types, Loops, Functions, Lists, Strings, Tuples, Dictionaries, File Processing, Modules, and Elementary Data Handling using NumPy arrays.',
    weightage: 'Paper 3 (4 Credits • 120 Hours)',
    examCode: 'M3-R5.1',
    badgeColor: 'amber',
    iconName: 'FileCode2',
    totalTheoryHours: 48,
    totalPracticalHours: 72,
    totalHours: 120,
    credits: 4,
    marksDistribution: [
      { unit: '1. Introduction to Programming, Algorithm and Flowcharts to solve problems', writtenMarks: 20 },
      { unit: '2. Introduction to Python, Operators, Expressions, Python Statements, Sequence data types', writtenMarks: 30 },
      { unit: '3. Functions, File Processing, Modules', writtenMarks: 40 },
      { unit: '4. NumPy Basics', writtenMarks: 10 }
    ],
    chapters: [
      {
        number: 1,
        title: 'Introduction to Programming',
        hindiTitle: 'प्रोग्रामिंग का परिचय',
        theoryHours: 2,
        practicalHours: 3,
        marksWeightage: '20 Marks (Unit 1)',
        topics: [
          'The basic Model of computation',
          'Algorithms, Flowcharts, Programming Languages',
          'Compilation, Testing & Debugging and Documentation'
        ],
        importance: 'High'
      },
      {
        number: 2,
        title: 'Algorithms and Flowcharts to Solve Problems',
        hindiTitle: 'समस्या समाधान हेतु एल्गोरिदम एवं फ्लोचार्ट',
        theoryHours: 6,
        practicalHours: 9,
        marksWeightage: '20 Marks (Unit 1)',
        topics: [
          'Flow Chart Symbols, Basic algorithms/flowcharts for sequential processing, decision based processing and iterative processing',
          'Classic Problem Examples: Exchanging values of two variables (swapping), Summation of a set of numbers',
          'Decimal Base to Binary Base conversion, Reversing digits of an integer, GCD (Greatest Common Divisor)',
          'Test whether a number is prime, Factorial computation, Fibonacci sequence',
          'Evaluate "sin x" as sum of a series, Reverse order of elements of an array, Find largest number in an array, Print elements of upper triangular matrix'
        ],
        importance: 'Essential'
      },
      {
        number: 3,
        title: 'Introduction to Python',
        hindiTitle: 'पायथन का परिचय',
        theoryHours: 2,
        practicalHours: 3,
        marksWeightage: '30 Marks (Unit 2)',
        topics: [
          'Python Introduction, Technical Strength of Python',
          'Introduction to Python Interpreter and program execution',
          'Using Comments (#), Literals, Constants',
          'Python’s Built-in Data types, Numbers (Integers, Floats, Complex Numbers, Real, Sets)',
          'Strings (Slicing, Indexing, Concatenation, other operations on Strings)',
          'Accepting input from Console (input()), Printing statements (print()), Simple "Python" programs'
        ],
        importance: 'High'
      },
      {
        number: 4,
        title: 'Operators, Expressions and Python Statements',
        hindiTitle: 'ऑपरेटर्स, एक्सप्रेशंस और पायथन स्टेटमेंट्स',
        theoryHours: 10,
        practicalHours: 15,
        marksWeightage: '30 Marks (Unit 2)',
        topics: [
          'Assignment statement, Expressions, Arithmetic, Relational, Logical, Bitwise operators and their precedence',
          'Conditional statements: if, if-else, if-elif-else, simple programs',
          'Notion of iterative computation and control flow: range() function',
          'While Statement, For loop, break statement, Continue Statement, Pass statement, else with loops, assert statement'
        ],
        importance: 'Essential'
      },
      {
        number: 5,
        title: 'Sequence Data Types',
        hindiTitle: 'सीक्वेंस डेटा टाइप्स (Lists, Tuples, Dictionaries)',
        theoryHours: 6,
        practicalHours: 9,
        marksWeightage: '30 Marks (Unit 2)',
        topics: [
          'Lists, Tuples and Dictionary: Slicing, Indexing, Concatenation, other operations on Sequence datatype',
          'Concept of Mutability (Mutable vs Immutable objects)',
          'Examples: Finding maximum, minimum, mean of elements',
          'Linear search on list / tuple of numbers',
          'Counting the frequency of elements in a list using a dictionary'
        ],
        importance: 'Essential'
      },
      {
        number: 6,
        title: 'Functions',
        hindiTitle: 'फंक्शन्स (मॉड्यूलर प्रोग्रामिंग)',
        theoryHours: 10,
        practicalHours: 15,
        marksWeightage: '40 Marks (Unit 3)',
        topics: [
          'Top-down approach of problem solving, Modular programming and functions',
          'Function parameters, Local variables, Return statement, Doc Strings, global statement',
          'Default argument values, Keyword arguments, VarArgs parameters (*args, **kwargs)',
          'Library functions: input(), eval(), print()',
          'String Functions: count(), find(), rfind(), capitalize(), title(), lower(), upper(), swapcase(), islower(), isupper(), istitle(), replace(), strip(), lstrip(), rstrip(), split(), partition(), join(), isspace(), isalpha(), isdigit(), isalnum(), startswith(), endswith(), encode(), decode()',
          'String: Slicing, Membership (in, not in), Pattern Matching',
          'Numeric Functions: eval(), max(), min(), pow(), round(), int(), random(), ceil(), floor(), sqrt(), Date & Time Functions, Recursion'
        ],
        importance: 'Essential'
      },
      {
        number: 7,
        title: 'File Processing',
        hindiTitle: 'फाइल प्रोसेसिंग (File Handling)',
        theoryHours: 6,
        practicalHours: 9,
        marksWeightage: '40 Marks (Unit 3)',
        topics: [
          'Concept of Files (Text and Binary files)',
          'File opening in various modes (r, w, a, r+, w+, a+, rb, wb) and closing of a file',
          'Reading from a file, Writing onto a file',
          'File functions: open(), close(), read(), readline(), readlines(), write(), writelines(), tell(), seek()',
          'Command Line arguments (sys.argv)'
        ],
        importance: 'Essential'
      },
      {
        number: 8,
        title: 'Modules',
        hindiTitle: 'मॉड्यूल्स एवं स्कोप (LEGB Rule)',
        theoryHours: 2,
        practicalHours: 3,
        marksWeightage: '40 Marks (Unit 3)',
        topics: [
          'Scope of objects and Names, LEGB Rule (Local, Enclosing, Global, Built-in)',
          'Module Basics, Module Files as Namespaces',
          'Import Model (import, from ... import), Reloading Modules'
        ],
        importance: 'High'
      },
      {
        number: 9,
        title: 'NumPy Basics',
        hindiTitle: 'नमपाय बेसिक्स (NumPy Arrays)',
        theoryHours: 4,
        practicalHours: 6,
        marksWeightage: '10 Marks (Unit 4)',
        topics: [
          'Introduction to NumPy ndarray, Datatypes, Array attributes (shape, ndim, size, dtype, itemsize)',
          'Array creation routines (np.array, np.arange, np.zeros, np.ones, np.linspace)',
          'Array From Existing Data, Array From Numerical Ranges',
          'NumPy Array Indexing & Slicing, Reshape and Array manipulation'
        ],
        importance: 'High'
      }
    ],
    practicalTopics: [
      'Write a Python program to print all Armstrong numbers in a given range',
      'Obtain sum of series: 1 + x/1! + x^2/2! + x^3/3! + ...',
      'Daily wage computation and employee hours management using loops and conditional logic',
      'Text Processing: Count occurrences of alphabets, vowels, words and compute letter frequencies using dictionary',
      'File Handling: Copy line by line from one file to another, replace characters, and count word statistics',
      'NumPy: Array manipulation, slicing, finding most frequent values and concatenating 2D arrays along axis'
    ],
    keyHighlights: [
      'Covers 50+ Solved Python algorithms, dry-run variable tracing and logic building',
      'Detailed string manipulation methods & recursion programs with step-by-step solutions',
      'NumPy array attributes, indexing and mathematical operations simplified',
      'Full Python Practical Lab assignments with downloadable .py source codes'
    ],
    sampleQuestions: [
      {
        question: 'Which character is used in Python to make a single line comment?',
        options: ['/', '//', '#', '!'],
        correct: 2,
        explanation: 'In Python, the hash symbol (#) is used to begin a single-line comment.'
      },
      {
        question: 'What is the output of print(9 // 2) in Python?',
        options: ['4.5', '4.0', '4', 'Error'],
        correct: 2,
        explanation: '// is the floor division operator in Python which returns the integer floor quotient (4).'
      },
      {
        question: 'What is the main difference between Python lists and tuples?',
        options: [
          'Lists can hold any data type and tuples can only contain int and str objects.',
          'Lists are immutable and tuples are mutable.',
          'Lists are faster and tuples are slower.',
          'Lists are mutable and tuples are immutable.'
        ],
        correct: 3,
        explanation: 'Lists are mutable (elements can be modified in-place), whereas tuples are immutable.'
      }
    ],
    syllabusPdfUrl: '/downloads/m3-r5-syllabus.pdf',
    sampleNotesPdfUrl: '/downloads/m3-r5-notes.pdf',
    youtubePlaylistUrl: 'https://youtube.com/@skilldotpy',
    appCourseUrl: '/courses/o-level-m3'
  },

  // ================= PAPER 4: M4-R5.1 =================
  {
    id: 'm4-r5',
    code: 'M4-R5.1',
    shortName: 'IoT & Applications',
    title: 'Internet of Things and its Applications',
    hindiTitle: 'इंटरनेट ऑफ थिंग्स और इसके अनुप्रयोग',
    description: 'Understand the connected and smarter world of IoT. Covers interfacing sensors and actuators with microcontroller-based Arduino platform, writing Embedded C programs in Arduino IDE, serial communication, IoT security, and personality development/soft skills.',
    weightage: 'Paper 4 (4 Credits • 120 Hours)',
    examCode: 'M4-R5.1',
    badgeColor: 'indigo',
    iconName: 'Cpu',
    totalTheoryHours: 48,
    totalPracticalHours: 72,
    totalHours: 120,
    credits: 4,
    marksDistribution: [
      { unit: '1. Introduction to IoT – Applications/Devices, Protocols and Communication Model', writtenMarks: 10 },
      { unit: '2. Things and Connections', writtenMarks: 10 },
      { unit: '3. Sensors, Actuators and Microcontrollers', writtenMarks: 15 },
      { unit: '4. Building IoT Applications', writtenMarks: 40 },
      { unit: '5. Security and Future of IoT Ecosystem', writtenMarks: 5 },
      { unit: '6. Soft skills - Personality Development', writtenMarks: 20 }
    ],
    chapters: [
      {
        number: 1,
        title: 'Introduction to IoT – Applications/Devices, Protocols and Communication Model',
        hindiTitle: 'IoT का परिचय - अनुप्रयोग, उपकरण, प्रोटोकॉल एवं संचार मॉडल',
        theoryHours: 4,
        practicalHours: 6,
        marksWeightage: '10 Marks (Unit 1)',
        topics: [
          'Overview of Internet of Things (IoT), Characteristics of devices and applications in IoT ecosystem',
          'Building blocks of IoT, Various technologies making up IoT ecosystem, IoT levels, IoT design methodology',
          'Physical Design / Logical Design of IoT',
          'Functional blocks of IoT and Communication Models (Request-Response, Publish-Subscribe, Push-Pull, Exclusive Pair)',
          'Development Tools used in IoT'
        ],
        importance: 'High'
      },
      {
        number: 2,
        title: 'Things and Connections',
        hindiTitle: 'थिंग्स एवं कनेक्शंस (नेटवर्किंग एवं कनेक्टिविटी)',
        theoryHours: 4,
        practicalHours: 6,
        marksWeightage: '10 Marks (Unit 2)',
        topics: [
          'Working of Controlled Systems, Real-time systems with feedback loop (e.g. thermostat in refrigerator, AC, etc.)',
          'Connectivity models – TCP/IP versus OSI model',
          'Different types of modes using wired and wireless methodology (Ethernet, WiFi, Bluetooth, Zigbee, LoRaWAN)',
          'The process flow of an IoT application'
        ],
        importance: 'High'
      },
      {
        number: 3,
        title: 'Sensors, Actuators and Microcontrollers',
        hindiTitle: 'सेंसर्स, एक्चुएटर्स एवं माइक्रोकंट्रोलर्स',
        theoryHours: 8,
        practicalHours: 12,
        marksWeightage: '15 Marks (Unit 3)',
        topics: [
          'Sensors: Measuring physical quantities in digital world (Light sensor, Moisture sensor, Temperature LM35/DHT11, Gas MQ135, IR sensor)',
          'Actuators: Moving or controlling system (DC Motor, Relays, Stepper motor, Servo, Buzzer, LED)',
          'Controllers: Role of microcontroller as gateway to interfacing sensors and actuators',
          'Microcontroller vs Microprocessor differences',
          'Different types of microcontrollers in embedded ecosystem (ATmega328P, Arduino Uno, ESP8266, ESP32)'
        ],
        importance: 'Essential'
      },
      {
        number: 4,
        title: 'Building IoT Applications',
        hindiTitle: 'IoT अनुप्रयोगों का निर्माण (Arduino एवं C प्रोग्रामिंग)',
        theoryHours: 20,
        practicalHours: 30,
        marksWeightage: '40 Marks (Unit 4)',
        topics: [
          'Introduction to Arduino IDE: Writing code in sketch, compiling-debugging, uploading file to Arduino board, role of serial monitor',
          'Embedded "C" Language Basics: Variables and Identifiers, Built-in Data Types, Arithmetic operators & Expressions, Constants & Literals, Assignment',
          'Conditional Statements & Loops: Relational Operators, Logical Connectives, if-else, while, do-while, for loop, Nested loops, Infinite loops, Switch statement',
          'Arrays (declaring and manipulating single dimension arrays), Functions (Standard Library in Arduino IDE, prototype, formal parameters, return type, call)',
          'Interfacing Sensors: Working of digital vs analog pins in Arduino platform (pinMode, digitalRead, digitalWrite, analogRead, analogWrite)',
          'Interfacing LED, Button, Sensors (DHT11, LDR, MQ135, IR)',
          'Displaying data on Liquid Crystal Display (LCD 16x2), Interfacing Keypad (4x4)',
          'Serial Communication: Interfacing HC-05 (Bluetooth module), Baud rates',
          'Control / Handle 220V AC supply – interfacing Relay module',
          'Using ArduBlock GUI tool'
        ],
        importance: 'Essential'
      },
      {
        number: 5,
        title: 'Security and Future of IoT Ecosystem',
        hindiTitle: 'IoT सुरक्षा एवं भविष्य का इकोसिस्टम',
        theoryHours: 4,
        practicalHours: 6,
        marksWeightage: '5 Marks (Unit 5)',
        topics: [
          'Need of security in IoT: Why Security? Privacy for IoT enabled devices',
          'IoT security for consumer devices, Security levels, Protecting IoT devices against Botnet / DDoS / Malware',
          'Future IoT ecosystem: Need of powerful core for building secure algorithms',
          'Examples for new trends: Artificial Intelligence (AI) & Machine Learning (ML) penetration into IoT'
        ],
        importance: 'Medium'
      },
      {
        number: 6,
        title: 'Soft skills - Personality Development',
        hindiTitle: 'सॉफ्ट स्किल्स एवं व्यक्तित्व विकास',
        theoryHours: 8,
        practicalHours: 12,
        marksWeightage: '20 Marks (Unit 6)',
        topics: [
          'Personality Development: Determinants of Personality (Self-awareness, motivation, self-discipline), Building positive personality, Gestures and body language',
          'Self-esteem: Self-efficacy, Self-motivation, Time management, Stress management, Etiquettes & manners',
          'Communication and Writing Skills: Objective, attributes and categories of communication, Tone and pitch',
          'Writing Skills: Resume building (Portfolio, Chronological, Functional), Official Letters, Reports, Presentations',
          'Interview skills, Group discussions and Workplace communication'
        ],
        importance: 'Essential'
      }
    ],
    practicalTopics: [
      'Arduino: Blinking LED with delay and running 4-stage alternating LED patterns',
      'Arduino: Interfacing Push Button and LED (toggle switch on press)',
      'Arduino: Automatic Street Light circuit using Light Dependent Resistor (LDR), ADC read and LED/Relay',
      'Arduino: Reading Temperature & Humidity from DHT11 / LM35 sensor and displaying on 16x2 LCD',
      'Arduino: Interfacing 4x4 Keypad and LCD to implement basic calculator or password security lock system',
      'Arduino: Bluetooth Home Automation (interfacing HC-05 module with smartphone to control 220V AC appliance via Relay)'
    ],
    keyHighlights: [
      'Complete Arduino Uno pin diagram, GPIO modes, and breadboard schematics explained',
      'Ready-to-upload Arduino sketch (.ino) files for all official NIELIT lab assignments',
      'Comprehensive 20-mark Soft Skills & Resume preparation guide included',
      'Full coverage of IoT protocols (MQTT, CoAP, TCP/IP vs OSI) with diagrams'
    ],
    sampleQuestions: [
      {
        question: 'Microcontroller used in Arduino UNO prototyping board is:',
        options: ['ATmega328m', 'ATmega328p', 'ATmega2560', 'ATmega356p'],
        correct: 1,
        explanation: 'Arduino UNO uses the ATmega328P (p stands for picoPower) 8-bit AVR microcontroller.'
      },
      {
        question: 'Which of the following functions is called only once in an Arduino program?',
        options: ['loop()', 'setup()', 'delay()', 'digitalWrite()'],
        correct: 1,
        explanation: 'setup() function is executed exactly once when the Arduino board powers on or is reset.'
      },
      {
        question: 'Which protocol is known as a lightweight publish-subscribe messaging protocol in IoT?',
        options: ['MQTT', 'TCP', 'IP', 'HTTP'],
        correct: 0,
        explanation: 'MQTT (Message Queuing Telemetry Transport) is a lightweight messaging protocol designed for low-bandwidth IoT devices.'
      }
    ],
    syllabusPdfUrl: '/downloads/m4-r5-syllabus.pdf',
    sampleNotesPdfUrl: '/downloads/m4-r5-notes.pdf',
    youtubePlaylistUrl: 'https://youtube.com/@skilldotpy',
    appCourseUrl: '/courses/o-level-m4'
  }
];

