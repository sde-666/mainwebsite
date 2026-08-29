import { ChapterMcqItem, ChapterMeta, PaperMeta } from '../types/chapterMcq';

export const paperMetadataList: PaperMeta[] = [
  {
    id: 'm1-r5',
    code: 'M1-R5.1',
    shortName: 'IT Tools & Network Basics',
    title: 'Information Technology Tools and Network Basics',
    hindiTitle: 'सूचना प्रौद्योगिकी उपकरण और नेटवर्क मूल बातें',
    badgeColor: 'blue',
    chaptersCount: 9,
    totalMcqsCount: 688
  },
  {
    id: 'm2-r5',
    code: 'M2-R5.1',
    shortName: 'Web Designing & Publishing',
    title: 'Web Designing and Publishing',
    hindiTitle: 'वेब डिजाइनिंग एवं पब्लिशिंग',
    badgeColor: 'emerald',
    chaptersCount: 8,
    totalMcqsCount: 540
  },
  {
    id: 'm3-r5',
    code: 'M3-R5.1',
    shortName: 'Python Programming',
    title: 'Programming & Problem Solving Through Python',
    hindiTitle: 'पायथन प्रोग्रामिंग एवं प्रॉब्लम सॉल्विंग',
    badgeColor: 'amber',
    chaptersCount: 9,
    totalMcqsCount: 620
  },
  {
    id: 'm4-r5',
    code: 'M4-R5.1',
    shortName: 'Internet of Things (IoT)',
    title: 'Internet of Things and Its Applications',
    hindiTitle: 'इंटरनेट ऑफ थिंग्स (IoT) एवं इसके अनुप्रयोग',
    badgeColor: 'purple',
    chaptersCount: 6,
    totalMcqsCount: 480
  },
  {
    id: 'ccc',
    code: 'CCC',
    shortName: 'Course on Computer Concepts',
    title: 'Course on Computer Concepts (NIELIT CCC)',
    hindiTitle: 'कंप्यूटर कॉन्सेप्ट्स कोर्स (सी.सी.सी.)',
    badgeColor: 'indigo',
    chaptersCount: 9,
    totalMcqsCount: 750
  }
];

export const allChaptersMeta: ChapterMeta[] = [
  // ================= M1-R5.1 CHAPTERS (9 Chapters) =================
  {
    moduleId: 'm1-r5',
    chapterNumber: 1,
    title: 'Introduction to Computer',
    hindiTitle: 'कंप्यूटर का परिचय',
    iconName: 'Laptop',
    mcqCount: 116,
    description: 'Hardware, Software, CPU, Memory (RAM/ROM), Input/Output devices, and IT Gadgets.'
  },
  {
    moduleId: 'm1-r5',
    chapterNumber: 2,
    title: 'Introduction to Operating System',
    hindiTitle: 'ऑपरेटिंग सिस्टम का परिचय',
    iconName: 'Settings',
    mcqCount: 34,
    description: 'OS basics, Linux/Windows UI, File management, taskbar, desktop settings, and control panel.'
  },
  {
    moduleId: 'm1-r5',
    chapterNumber: 3,
    title: 'Word Processing',
    hindiTitle: 'वर्ड प्रोसेसिंग (LibreOffice Writer)',
    iconName: 'FileText',
    mcqCount: 173,
    description: 'LibreOffice Writer, text formatting, mail merge, tables, headers, footers & shortcuts.'
  },
  {
    moduleId: 'm1-r5',
    chapterNumber: 4,
    title: 'Spreadsheet',
    hindiTitle: 'स्प्रेडशीट (LibreOffice Calc)',
    iconName: 'FileSpreadsheet',
    mcqCount: 106,
    description: 'LibreOffice Calc, formulas, functions (SUM, IF, VLOOKUP), cell formatting & charts.'
  },
  {
    moduleId: 'm1-r5',
    chapterNumber: 5,
    title: 'Presentation',
    hindiTitle: 'प्रेजेंटेशन (LibreOffice Impress)',
    iconName: 'Presentation',
    mcqCount: 78,
    description: 'LibreOffice Impress, slide creation, transitions, animations, master slides & slide show.'
  },
  {
    moduleId: 'm1-r5',
    chapterNumber: 6,
    title: 'Introduction to Internet and WWW',
    hindiTitle: 'इंटरनेट और WWW का परिचय',
    iconName: 'Globe',
    mcqCount: 110,
    description: 'LAN/WAN/MAN, IP addressing, DNS, web browsers, search engines, URLs, protocols (HTTP/FTP).'
  },
  {
    moduleId: 'm1-r5',
    chapterNumber: 7,
    title: 'E-mail, Social Networking and e-Governance Services',
    hindiTitle: 'ई-मेल, सोशल नेटवर्किंग और ई-गवर्नेंस सेवाएं',
    iconName: 'Mail',
    mcqCount: 91,
    description: 'Email protocols (SMTP/POP3/IMAP), UMANG, DigiLocker, Passport Seva, IRCTC & social media.'
  },
  {
    moduleId: 'm1-r5',
    chapterNumber: 8,
    title: 'Digital Financial Tools and Applications',
    hindiTitle: 'डिजिटल वित्तीय उपकरण और अनुप्रयोग',
    iconName: 'CreditCard',
    mcqCount: 50,
    description: 'UPI, USSD (*99#), AEPS, NetBanking, QR Code, NEFT, RTGS, IMPS, POS, OTP & Card security.'
  },
  {
    moduleId: 'm1-r5',
    chapterNumber: 9,
    title: 'Overview of Future skills and Cyber Security',
    hindiTitle: 'फ्यूचर स्किल्स और साइबर सुरक्षा का अवलोकन',
    iconName: 'ShieldCheck',
    mcqCount: 30,
    description: 'AI, IoT, Cloud Computing, Big Data, Blockchain, 3D Printing, VR, Malwares & Cyber Ethics.'
  },

  // ================= M2-R5.1 CHAPTERS (8 Chapters Exact NIELIT Syllabus) =================
  {
    moduleId: 'm2-r5',
    chapterNumber: 1,
    title: 'Introduction to Web Design',
    hindiTitle: 'वेब डिजाइन का परिचय',
    iconName: 'Layout',
    mcqCount: 75,
    description: 'Web architecture, Client-Server model, static vs dynamic websites, DNS, URLs, W3C standards.'
  },
  {
    moduleId: 'm2-r5',
    chapterNumber: 2,
    title: 'Editors',
    hindiTitle: 'एडिटर्स (Editors - Notepad++, Sublime Text, VS Code)',
    iconName: 'Code',
    mcqCount: 45,
    description: 'Text editors for web design, Notepad++, Sublime Text, VS Code features, shortcuts and extensions.'
  },
  {
    moduleId: 'm2-r5',
    chapterNumber: 3,
    title: 'HTML Basics',
    hindiTitle: 'HTML बेसिक्स और HTML5 सिमेंटिक टैग्स',
    iconName: 'FileCode',
    mcqCount: 115,
    description: 'HTML5 semantic tags, lists, tables, forms, inputs, multimedia (audio/video), links, and meta tags.'
  },
  {
    moduleId: 'm2-r5',
    chapterNumber: 4,
    title: 'Cascading Style Sheets (CSS)',
    hindiTitle: 'कैस्केडिंग स्टाइल शीट्स (CSS3)',
    iconName: 'Palette',
    mcqCount: 120,
    description: 'CSS selectors, Box Model (Margin/Border/Padding), Flexbox, Grid, colors, typography, transitions.'
  },
  {
    moduleId: 'm2-r5',
    chapterNumber: 5,
    title: 'CSS Framework',
    hindiTitle: 'CSS फ्रेमवर्क (W3.CSS और रिस्पॉन्सिव डिजाइन)',
    iconName: 'Smartphone',
    mcqCount: 85,
    description: 'W3.CSS grid system, containers, cards, tables, navigation bars, responsive breakpoints & media queries.'
  },
  {
    moduleId: 'm2-r5',
    chapterNumber: 6,
    title: 'JavaScript and Angular JS',
    hindiTitle: 'जावास्क्रिप्ट और एंगुलर जेएस',
    iconName: 'Terminal',
    mcqCount: 95,
    description: 'JavaScript variables, operators, functions, DOM manipulation, event handling, and AngularJS directives.'
  },
  {
    moduleId: 'm2-r5',
    chapterNumber: 7,
    title: 'Photo Editors',
    hindiTitle: 'फोटो एडिटर्स (GIMP / Photoshop बेसिक्स)',
    iconName: 'Image',
    mcqCount: 50,
    description: 'GIMP photo editor tools, layers, selection tools, masks, color correction, resizing & image compression.'
  },
  {
    moduleId: 'm2-r5',
    chapterNumber: 8,
    title: 'Web Publishing and Browsing',
    hindiTitle: 'वेब पब्लिशिंग और ब्राउजिंग',
    iconName: 'Globe',
    mcqCount: 65,
    description: 'Web hosting, domain name registration, FTP file transfer, SEO basics, web browser settings & security.'
  },

  // ================= M3-R5.1 CHAPTERS (9 Chapters Exact NIELIT Syllabus) =================
  {
    moduleId: 'm3-r5',
    chapterNumber: 1,
    title: 'Introduction to Programming',
    hindiTitle: 'प्रोग्रामिंग का परिचय',
    iconName: 'Cpu',
    mcqCount: 65,
    description: 'Machine language, Assembly, High-level language, Compilers vs Interpreters, memory model & execution.'
  },
  {
    moduleId: 'm3-r5',
    chapterNumber: 2,
    title: 'Algorithms and Flowcharts to Solve Problems',
    hindiTitle: 'एल्गोरिदम और फ्लोचार्ट',
    iconName: 'GitBranch',
    mcqCount: 75,
    description: 'Flowchart symbols, algorithm representation, pseudocode, dry run, conditional logic and tracing.'
  },
  {
    moduleId: 'm3-r5',
    chapterNumber: 3,
    title: 'Introduction to Python',
    hindiTitle: 'पायथन का परिचय और सिंटैक्स',
    iconName: 'Terminal',
    mcqCount: 90,
    description: 'Python features, IDLE, variables, keywords, indentation, dynamic typing, print() and input() functions.'
  },
  {
    moduleId: 'm3-r5',
    chapterNumber: 4,
    title: 'Operators, Expressions and Python Statements',
    hindiTitle: 'ऑपरेटर्स, एक्सप्रेशंस और कंट्रोल फ्लो स्टेटमेंट्स',
    iconName: 'Calculator',
    mcqCount: 110,
    description: 'Arithmetic, logical, bitwise operators, precedence, if-elif-else, while/for loops, break & continue.'
  },
  {
    moduleId: 'm3-r5',
    chapterNumber: 5,
    title: 'Sequence Data Types',
    hindiTitle: 'सीक्वेंस डेटा टाइप्स (Strings, Lists, Tuples, Dictionaries, Sets)',
    iconName: 'Layers',
    mcqCount: 130,
    description: 'Slicing, indexing, mutable vs immutable types, list comprehensions, dictionary key-value methods & sets.'
  },
  {
    moduleId: 'm3-r5',
    chapterNumber: 6,
    title: 'Functions',
    hindiTitle: 'फंक्शंस (Functions)',
    iconName: 'Code',
    mcqCount: 85,
    description: 'def keyword, parameters, default arguments, *args/**kwargs, return values, lambda functions & recursion.'
  },
  {
    moduleId: 'm3-r5',
    chapterNumber: 7,
    title: 'File Processing',
    hindiTitle: 'फाइल प्रोसेसिंग (File Handling in Python)',
    iconName: 'FileText',
    mcqCount: 50,
    description: 'open(), read(), readline(), write(), close(), with statement, file modes (r, w, a, r+), tell() & seek().'
  },
  {
    moduleId: 'm3-r5',
    chapterNumber: 8,
    title: 'Scope and Modules',
    hindiTitle: 'स्कोप और मॉड्यूल्स (Scope and Modules)',
    iconName: 'Package',
    mcqCount: 55,
    description: 'LEGB scope rule, global keyword, math module, random module, sys, time, creating and importing custom modules.'
  },
  {
    moduleId: 'm3-r5',
    chapterNumber: 9,
    title: 'NumPy Basics',
    hindiTitle: 'NumPy बेसिक्स (NumPy Arrays & Operations)',
    iconName: 'Database',
    mcqCount: 60,
    description: 'NumPy ndarray creation, 1D & 2D arrays, slicing, indexing, shape, reshape, array arithmetic and methods.'
  },

  // ================= M4-R5.1 CHAPTERS (6 Chapters Exact NIELIT Syllabus) =================
  {
    moduleId: 'm4-r5',
    chapterNumber: 1,
    title: 'Introduction to Internet of Things (IoT)',
    hindiTitle: 'इंटरनेट ऑफ थिंग्स (IoT) का परिचय',
    iconName: 'Cloud',
    mcqCount: 80,
    description: 'IoT definition, characteristics, history, physical design, logical design & IoT functional blocks.'
  },
  {
    moduleId: 'm4-r5',
    chapterNumber: 2,
    title: 'Things and Connections',
    hindiTitle: 'थिंग्स और कनेक्शन्स (Things and Connections)',
    iconName: 'Wifi',
    mcqCount: 95,
    description: 'Protocols: MQTT, CoAP, HTTP, Bluetooth, ZigBee, RFID, IPv4 vs IPv6, 6LoWPAN & WiFi topologies.'
  },
  {
    moduleId: 'm4-r5',
    chapterNumber: 3,
    title: 'Sensors, Actuators and Microcontrollers',
    hindiTitle: 'सेंसर, एक्चुएटर और माइक्रोकंट्रोलर',
    iconName: 'Cpu',
    mcqCount: 110,
    description: 'PIR, Ultrasonic, LDR, DHT11 sensors, relays, DC/Servo motors, Microcontroller vs Microprocessor architecture.'
  },
  {
    moduleId: 'm4-r5',
    chapterNumber: 4,
    title: 'Building IoT Applications',
    hindiTitle: 'IoT ऍप्लिकेशन्स का निर्माण (Arduino & C)',
    iconName: 'Activity',
    mcqCount: 95,
    description: 'Arduino Uno architecture, pinMode, digitalWrite, analogRead, delay, serial communication & Embedded C.'
  },
  {
    moduleId: 'm4-r5',
    chapterNumber: 5,
    title: 'Security and Cyber Attacks in IoT',
    hindiTitle: 'IoT में सुरक्षा और साइबर हमले',
    iconName: 'ShieldCheck',
    mcqCount: 60,
    description: 'Threats in IoT, vulnerability analysis, encryption, authentication, botnets (Mirai) & secure IoT design.'
  },
  {
    moduleId: 'm4-r5',
    chapterNumber: 6,
    title: 'Soft Skills - Personality Development',
    hindiTitle: 'सॉफ्ट स्किल्स एवं पर्सनालिटी डेवलपमेंट',
    iconName: 'Users',
    mcqCount: 40,
    description: 'Communication skills, body language, presentation skills, resume building & interview preparation.'
  },

  // ================= CCC CHAPTERS (9 Chapters Exact NIELIT Syllabus) =================
  {
    moduleId: 'ccc',
    chapterNumber: 1,
    title: 'Introduction to Computer',
    hindiTitle: 'कंप्यूटर का परिचय',
    iconName: 'Laptop',
    mcqCount: 95,
    description: 'Computer generations, hardware, RAM/ROM, input/output devices & IT applications.'
  },
  {
    moduleId: 'ccc',
    chapterNumber: 2,
    title: 'Introduction to Operating System',
    hindiTitle: 'ऑपरेटिंग सिस्टम का परिचय',
    iconName: 'Settings',
    mcqCount: 65,
    description: 'Windows/Linux basics, file structures, shortcut icons & system settings.'
  },
  {
    moduleId: 'ccc',
    chapterNumber: 3,
    title: 'Word Processing (LibreOffice Writer)',
    hindiTitle: 'वर्ड प्रोसेसिंग (LibreOffice Writer)',
    iconName: 'FileText',
    mcqCount: 120,
    description: 'Writer menus, shortcut keys, mail merge, tables, find/replace & page formatting.'
  },
  {
    moduleId: 'ccc',
    chapterNumber: 4,
    title: 'Spreadsheet (LibreOffice Calc)',
    hindiTitle: 'स्प्रेडशीट (LibreOffice Calc)',
    iconName: 'FileSpreadsheet',
    mcqCount: 110,
    description: 'Calc formulas, cell reference ($A$1), SUM, COUNT, MAX, AVERAGE & charts.'
  },
  {
    moduleId: 'ccc',
    chapterNumber: 5,
    title: 'Presentation (LibreOffice Impress)',
    hindiTitle: 'प्रेजेंटेशन (LibreOffice Impress)',
    iconName: 'Presentation',
    mcqCount: 80,
    description: 'Impress slide transitions, master slides, slide show shortcuts (F5, Shift+F5).'
  },
  {
    moduleId: 'ccc',
    chapterNumber: 6,
    title: 'Introduction to Internet and WWW',
    hindiTitle: 'इंटरनेट और WWW का परिचय',
    iconName: 'Globe',
    mcqCount: 90,
    description: 'Web browsers, search engines, IP addresses, ISP, protocols, domain name extensions.'
  },
  {
    moduleId: 'ccc',
    chapterNumber: 7,
    title: 'E-mail, Social Networking and e-Governance Services',
    hindiTitle: 'ई-मेल, सोशल नेटवर्किंग और ई-गवर्नेंस सेवाएं',
    iconName: 'Mail',
    mcqCount: 85,
    description: 'Email drafting, CC/BCC, UMANG app, DigiLocker, Aadhaar services & cyber etiquette.'
  },
  {
    moduleId: 'ccc',
    chapterNumber: 8,
    title: 'Digital Financial Tools and Applications',
    hindiTitle: 'डिजिटल वित्तीय उपकरण और अनुप्रयोग',
    iconName: 'CreditCard',
    mcqCount: 65,
    description: 'OTP, UPI, QR Code, AEPS, USSD (*99#), Net Banking, NEFT, RTGS & IMPS timing.'
  },
  {
    moduleId: 'ccc',
    chapterNumber: 9,
    title: 'Overview of FutureSkills & Cyber Security',
    hindiTitle: 'फ्यूचर स्किल्स और साइबर सुरक्षा',
    iconName: 'ShieldCheck',
    mcqCount: 40,
    description: 'Cyber threats, Phishing, Ransomware, strong passwords, 2FA & FutureSkills technologies.'
  }
];

// ================= RICH PRE-SEEDED QUESTIONS FOR CHAPTER-BY-CHAPTER INSTANT PRACTICE =================
export const initialChapterMcqSeedData: ChapterMcqItem[] = [
  // ================= M1-R5.1: CHAPTER 1 - INTRODUCTION TO COMPUTER =================
  {
    id: 'm1-c1-q1',
    moduleId: 'm1-r5',
    chapterNumber: 1,
    chapterTitle: 'Introduction to Computer',
    question: 'Which of the following is considered as the Brain of a computer system?',
    hindiQuestion: 'निम्नलिखित में से किसे कंप्यूटर सिस्टम का मस्तिष्क (Brain) माना जाता है?',
    options: ['ALU (Arithmetic Logic Unit)', 'CPU (Central Processing Unit)', 'RAM (Random Access Memory)', 'Control Unit'],
    hindiOptions: ['एएलयू (Arithmetic Logic Unit)', 'सीपीयू (Central Processing Unit)', 'रैम (Random Access Memory)', 'कंट्रोल यूनिट'],
    correctIndex: 1,
    explanation: 'The Central Processing Unit (CPU) performs all processing, calculations, and execution of instructions in a computer, hence called the brain of the computer.',
    hindiExplanation: 'सेंट्रल प्रोसेसिंग यूनिट (CPU) कंप्यूटर के सभी निर्देशों को निष्पादित करता है और गणनाएं करता है, इसलिए इसे कंप्यूटर का मस्तिष्क कहा जाता है।'
  },
  {
    id: 'm1-c1-q2',
    moduleId: 'm1-r5',
    chapterNumber: 1,
    chapterTitle: 'Introduction to Computer',
    question: 'Which type of computer memory is Non-Volatile and holds startup firmware (BIOS)?',
    hindiQuestion: 'कंप्यूटर की कौन सी मेमोरी नॉन-वोलेटाइल (स्थायी) होती है और स्टार्टअप फर्मवेयर (BIOS) को स्टोर रखती है?',
    options: ['SRAM', 'DRAM', 'ROM (Read Only Memory)', 'Cache Memory'],
    hindiOptions: ['एस-रैम', 'डी-रैम', 'रॉम (Read Only Memory)', 'कैश मेमोरी'],
    correctIndex: 2,
    explanation: 'ROM (Read Only Memory) is permanent non-volatile memory. Its contents are retained even when power is turned off, containing BIOS/bootstrap loaders.',
    hindiExplanation: 'रॉम (ROM) एक स्थायी नॉन-वोलेटाइल मेमोरी है जो बिजली बंद होने पर भी डेटा सुरक्षित रखती है। इसमें बूटस्ट्रैप लोडर और BIOS सेव रहता है।'
  },
  {
    id: 'm1-c1-q3',
    moduleId: 'm1-r5',
    chapterNumber: 1,
    chapterTitle: 'Introduction to Computer',
    question: 'What is 1 Nibble equal to in computer storage terms?',
    hindiQuestion: 'कंप्यूटर स्टोरेज शब्दावली में 1 निबल (Nibble) किसके बराबर होता है?',
    options: ['2 Bits', '4 Bits (Half Byte)', '8 Bits', '16 Bits'],
    hindiOptions: ['2 बिट्स', '4 बिट्स (आधा बाइट)', '8 बिट्स', '16 बिट्स'],
    correctIndex: 1,
    explanation: 'A nibble is a four-bit aggregation, or half an octet (half a byte). 1 Byte = 8 bits = 2 Nibbles.',
    hindiExplanation: '1 निबल = 4 बिट्स (अर्थात आधा बाइट) होता है। 1 बाइट में 8 बिट्स या 2 निबल होते हैं।'
  },
  {
    id: 'm1-c1-q4',
    moduleId: 'm1-r5',
    chapterNumber: 1,
    chapterTitle: 'Introduction to Computer',
    question: 'Which of the following is an example of an Open Source Operating System?',
    hindiQuestion: 'निम्नलिखित में से कौन सा ओपन सोर्स ऑपरेटिंग सिस्टम (Open Source OS) का उदाहरण है?',
    options: ['Microsoft Windows 11', 'Apple macOS', 'Linux (Ubuntu / Fedora)', 'iOS'],
    hindiOptions: ['माइक्रोसॉफ्ट विंडोज 11', 'एप्पल मैकओएस', 'लिनक्स (उबंटू / फेडोरा)', 'आईओएस'],
    correctIndex: 2,
    explanation: 'Linux is an open-source operating system whose source code is freely available to view, modify, and redistribute under GPL.',
    hindiExplanation: 'लिनक्स (Linux) एक फ्री एवं ओपन सोर्स ऑपरेटिंग सिस्टम है जिसका सोर्स कोड सभी के लिए मुफ्त में उपलब्ध रहता है।'
  },
  {
    id: 'm1-c1-q5',
    moduleId: 'm1-r5',
    chapterNumber: 1,
    chapterTitle: 'Introduction to Computer',
    question: 'Which device is used to convert physical printed paper documents into digital digital image format?',
    hindiQuestion: 'मुद्रित कागजी दस्तावेजों को डिजिटल इमेज फॉर्मेट में बदलने के लिए किस उपकरण का उपयोग किया जाता है?',
    options: ['Plotter', 'Scanner', 'OMR Reader', 'Bar Code Reader'],
    hindiOptions: ['प्लॉटर', 'स्कैनर', 'ओएमआर रीडर', 'बार कोड रीडर'],
    correctIndex: 1,
    explanation: 'A scanner is an optical input device that captures images of physical documents and converts them into digital computer files.',
    hindiExplanation: 'स्कैनर एक ऑप्टिकल इनपुट डिवाइस है जो भौतिक कागज़ को स्कैन कर डिजिटल फाइल में बदलता है।'
  },
  {
    id: 'm1-c1-q6',
    moduleId: 'm1-r5',
    chapterNumber: 1,
    chapterTitle: 'Introduction to Computer',
    question: 'First generation computers used which key hardware component for circuitry?',
    hindiQuestion: 'प्रथम पीढ़ी (First Generation) के कंप्यूटरों में सर्किट के लिए किस प्रमुख हार्डवेयर घटक का उपयोग किया गया था?',
    options: ['Transistors', 'Vacuum Tubes', 'Integrated Circuits (ICs)', 'Microprocessors (VLSI)'],
    hindiOptions: ['ट्रांजिस्टर', 'वैक्यूम ट्यूब्स (Vacuum Tubes)', 'इंटीग्रेटेड सर्किट (IC)', 'माइक्रोप्रोसेसर'],
    correctIndex: 1,
    explanation: 'First generation computers (1940-1956) like ENIAC, EDVAC used Vacuum Tubes as their primary electronic circuitry.',
    hindiExplanation: 'प्रथम पीढ़ी के कंप्यूटरों (जैसे ENIAC, UNIVAC) में मुख्य इलेक्ट्रॉनिक पुर्जे के रूप में वैक्यूम ट्यूब्स का प्रयोग होता था।'
  },

  // ================= M1-R5.1: CHAPTER 2 - OPERATING SYSTEM =================
  {
    id: 'm1-c2-q1',
    moduleId: 'm1-r5',
    chapterNumber: 2,
    chapterTitle: 'Introduction to Operating System',
    question: 'In GUI Operating Systems, what is the default bar located at the bottom of the screen called?',
    hindiQuestion: 'GUI ऑपरेटिंग सिस्टम में स्क्रीन के सबसे निचले भाग पर स्थित डिफॉल्ट बार को क्या कहा जाता है?',
    options: ['Title Bar', 'Taskbar', 'Status Bar', 'Scroll Bar'],
    hindiOptions: ['टाइटल बार', 'टास्कबार (Taskbar)', 'स्टेटस बार', 'स्क्रॉल बार'],
    correctIndex: 1,
    explanation: 'The Taskbar is the bar located at the bottom of the desktop displaying running application icons, start button, and notification area.',
    hindiExplanation: 'टास्कबार डेस्कटॉप के निचले सिरे पर स्थित पट्टी होती है जहाँ स्टार्ट बटन, रनिंग ऍप्लिकेशन्स और सिस्टम ट्रे क्लॉक होती है।'
  },
  {
    id: 'm1-c2-q2',
    moduleId: 'm1-r5',
    chapterNumber: 2,
    chapterTitle: 'Introduction to Operating System',
    question: 'Which command in Linux is used to create a new empty directory (folder)?',
    hindiQuestion: 'लिनक्स (Linux) में नया खाली डायरेक्टरी (फोल्डर) बनाने के लिए किस कमांड का उपयोग किया जाता है?',
    options: ['create', 'cd', 'mkdir', 'rmdir'],
    hindiOptions: ['create', 'cd', 'mkdir', 'rmdir'],
    correctIndex: 2,
    explanation: 'The `mkdir` (Make Directory) command in Linux and Unix environments is used to create one or more new directories.',
    hindiExplanation: 'लिनक्स में `mkdir` (Make Directory) कमांड का उपयोग नया फोल्डर/डायरेक्टरी बनाने के लिए किया जाता है।'
  },
  {
    id: 'm1-c2-q3',
    moduleId: 'm1-r5',
    chapterNumber: 2,
    chapterTitle: 'Introduction to Operating System',
    question: 'What is the standard file extension of an Executable application setup file in Windows OS?',
    hindiQuestion: 'विंडोज ओएस में किसी निष्पादन योग्य (Executable) सेटअप फाइल का मानक एक्सटेंशन क्या होता है?',
    options: ['.txt', '.exe', '.odt', '.pdf'],
    hindiOptions: ['.txt', '.exe', '.odt', '.pdf'],
    correctIndex: 1,
    explanation: '.exe stands for Executable File in Windows Operating System.',
    hindiExplanation: 'विंडोज में प्रोग्राम व सॉफ्टवेयर की निष्पादन योग्य फाइल का एक्सटेंशन `.exe` (Executable) होता है।'
  },

  // ================= M1-R5.1: CHAPTER 3 - WORD PROCESSING (LIBREOFFICE WRITER) =================
  {
    id: 'm1-c3-q1',
    moduleId: 'm1-r5',
    chapterNumber: 3,
    chapterTitle: 'Word Processing',
    question: 'What is the default file extension of a document saved in LibreOffice Writer?',
    hindiQuestion: 'लिब्रेऑफिस राइटर (LibreOffice Writer) में सेव किए गए डॉक्यूमेंट का डिफॉल्ट फाइल एक्सटेंशन क्या होता है?',
    options: ['.docx', '.odt', '.ods', '.odp'],
    hindiOptions: ['.docx', '.odt (OpenDocument Text)', '.ods', '.odp'],
    correctIndex: 1,
    explanation: 'LibreOffice Writer saves text documents with `.odt` (OpenDocument Text) format by default as per open standards.',
    hindiExplanation: 'लिब्रेऑफिस राइटर का डिफॉल्ट फाइल एक्सटेंशन `.odt` (OpenDocument Text) होता है।'
  },
  {
    id: 'm1-c3-q2',
    moduleId: 'm1-r5',
    chapterNumber: 3,
    chapterTitle: 'Word Processing',
    question: 'What is the shortcut key for Print Preview in LibreOffice Writer?',
    hindiQuestion: 'लिब्रेऑफिस राइटर में प्रिंट प्रीव्यू (Print Preview) की शॉर्टकट की क्या है?',
    options: ['Ctrl + P', 'Ctrl + Shift + O', 'Ctrl + F2', 'Alt + P'],
    hindiOptions: ['Ctrl + P', 'Ctrl + Shift + O', 'Ctrl + F2', 'Alt + P'],
    correctIndex: 1,
    explanation: 'In LibreOffice Writer, `Ctrl + Shift + O` opens Print Preview, whereas `Ctrl + P` opens the direct Print dialog box.',
    hindiExplanation: 'लिब्रेऑफिस राइटर में प्रिंट प्रीव्यू के लिए `Ctrl + Shift + O` शॉर्टकट की का उपयोग होता है।'
  },
  {
    id: 'm1-c3-q3',
    moduleId: 'm1-r5',
    chapterNumber: 3,
    chapterTitle: 'Word Processing',
    question: 'What is the maximum zoom percentage possible in LibreOffice Writer?',
    hindiQuestion: 'लिब्रेऑफिस राइटर में अधिकतम ज़ूम (Maximum Zoom) कितना प्रतिशत संभव है?',
    options: ['400%', '500%', '600%', '3000%'],
    hindiOptions: ['400%', '500%', '600%', '3000%'],
    correctIndex: 2,
    explanation: 'In LibreOffice Writer, minimum zoom is 20% and maximum zoom is 600%. In LibreOffice Calc it is 400%, and in Impress it is 3000%.',
    hindiExplanation: 'लिब्रेऑफिस राइटर में न्यूनतम ज़ूम 20% और अधिकतम ज़ूम 600% तक किया जा सकता है।'
  },
  {
    id: 'm1-c3-q4',
    moduleId: 'm1-r5',
    chapterNumber: 3,
    chapterTitle: 'Word Processing',
    question: 'Which feature in LibreOffice Writer allows you to send personalized letters or envelopes to multiple recipients simultaneously?',
    hindiQuestion: 'लिब्रेऑफिस राइटर का कौन सा फीचर एक साथ कई लोगों को व्यक्तिगत पत्र, इनवॉइस या लिफाफे भेजने की सुविधा देता है?',
    options: ['Macro', 'Mail Merge', 'AutoCorrect', 'Track Changes'],
    hindiOptions: ['मैक्रो (Macro)', 'मेल मर्ज (Mail Merge)', 'ऑटोकरेक्ट', 'ट्रैक चेंज'],
    correctIndex: 1,
    explanation: 'Mail Merge merges a master text template with a data recipient source list to generate individualized copies for multiple people.',
    hindiExplanation: 'मेल मर्ज (Mail Merge) के माध्यम से एक मुख्य पत्र को डेटा स्रोत सूची से जोड़कर अनेक प्राप्तकर्ताओं के लिए स्वचालित पत्र तैयार किए जाते हैं।'
  },

  // ================= M1-R5.1: CHAPTER 4 - SPREADSHEET (LIBREOFFICE CALC) =================
  {
    id: 'm1-c4-q1',
    moduleId: 'm1-r5',
    chapterNumber: 4,
    chapterTitle: 'Spreadsheet',
    question: 'All formulas in LibreOffice Calc MUST begin with which mathematical symbol?',
    hindiQuestion: 'लिब्रेऑफिस कैल्क (LibreOffice Calc) में सभी फॉर्मूले अनिवार्य रूप से किस चिन्ह से शुरू होने चाहिए?',
    options: ['+ (Plus)', '= (Equal to)', '# (Hash)', '$ (Dollar)'],
    hindiOptions: ['+ (प्लस)', '= (बराबर चिन्ह)', '# (हैश)', '$ (डॉलर)'],
    correctIndex: 1,
    explanation: 'Formulas and calculations in Calc/Excel must start with the equal sign `=` so the spreadsheet engine knows it is a calculation formula.',
    hindiExplanation: 'कैल्क में सभी फॉर्मूलों की शुरुआत `=` (Equal to) चिन्ह से होती है।'
  },
  {
    id: 'm1-c4-q2',
    moduleId: 'm1-r5',
    chapterNumber: 4,
    chapterTitle: 'Spreadsheet',
    question: 'What is the default file extension of a LibreOffice Calc spreadsheet?',
    hindiQuestion: 'लिब्रेऑफिस कैल्क (Calc) स्प्रेडशीट का डिफॉल्ट फाइल एक्सटेंशन क्या होता है?',
    options: ['.xlsx', '.ods', '.odt', '.odp'],
    hindiOptions: ['.xlsx', '.ods (OpenDocument Spreadsheet)', '.odt', '.odp'],
    correctIndex: 1,
    explanation: 'LibreOffice Calc spreadsheet files use the `.ods` (OpenDocument Spreadsheet) extension.',
    hindiExplanation: 'लिब्रेऑफिस कैल्क का डिफॉल्ट एक्सटेंशन `.ods` (OpenDocument Spreadsheet) होता है।'
  },
  {
    id: 'm1-c4-q3',
    moduleId: 'm1-r5',
    chapterNumber: 4,
    chapterTitle: 'Spreadsheet',
    question: 'What is the output of the formula `=SUM(5, 10, MAX(2, 8))` in LibreOffice Calc?',
    hindiQuestion: 'लिब्रेऑफिस कैल्क में फॉर्मूला `=SUM(5, 10, MAX(2, 8))` का परिणाम क्या होगा?',
    options: ['15', '23', '25', '17'],
    hindiOptions: ['15', '23', '25', '17'],
    correctIndex: 1,
    explanation: '`MAX(2, 8)` evaluates to 8. Then `=SUM(5, 10, 8)` results in 5 + 10 + 8 = 23.',
    hindiExplanation: '`MAX(2, 8)` का मान 8 आएगा। इसके बाद `=SUM(5, 10, 8)` हल होकर 5 + 10 + 8 = 23 देगा।'
  },

  // ================= M1-R5.1: CHAPTER 5 - PRESENTATION (LIBREOFFICE IMPRESS) =================
  {
    id: 'm1-c5-q1',
    moduleId: 'm1-r5',
    chapterNumber: 5,
    chapterTitle: 'Presentation',
    question: 'Which shortcut key is used to start a Slide Show from the Current Active Slide in LibreOffice Impress?',
    hindiQuestion: 'लिब्रेऑफिस इम्प्रेस में वर्तमान (Current) एक्टिव स्लाइड से स्लाइड शो शुरू करने की शॉर्टकट की क्या है?',
    options: ['F5', 'Shift + F5', 'Ctrl + F5', 'Alt + F5'],
    hindiOptions: ['F5', 'Shift + F5', 'Ctrl + F5', 'Alt + F5'],
    correctIndex: 1,
    explanation: 'In LibreOffice Impress, `F5` starts presentation from slide 1 (first slide), while `Shift + F5` starts from the current active slide.',
    hindiExplanation: 'लिब्रेऑफिस इम्प्रेस में पहली स्लाइड से शो शुरू करने के लिए `F5` और वर्तमान स्लाइड से शुरू करने के लिए `Shift + F5` दबाते हैं।'
  },
  {
    id: 'm1-c5-q2',
    moduleId: 'm1-r5',
    chapterNumber: 5,
    chapterTitle: 'Presentation',
    question: 'What is the default file extension of a LibreOffice Impress presentation file?',
    hindiQuestion: 'लिब्रेऑफिस इम्प्रेस (Impress) प्रेजेंटेशन का डिफॉल्ट फाइल एक्सटेंशन क्या होता है?',
    options: ['.ppt', '.odp', '.ods', '.odt'],
    hindiOptions: ['.ppt', '.odp (OpenDocument Presentation)', '.ods', '.odt'],
    correctIndex: 1,
    explanation: 'LibreOffice Impress files are saved with `.odp` (OpenDocument Presentation) extension.',
    hindiExplanation: 'लिब्रेऑफिस इम्प्रेस का डिफॉल्ट एक्सटेंशन `.odp` (OpenDocument Presentation) होता है।'
  },

  // ================= M2-R5.1: CHAPTER 1 & 2 - WEB DESIGN & HTML5 =================
  {
    id: 'm2-c2-q1',
    moduleId: 'm2-r5',
    chapterNumber: 2,
    chapterTitle: 'Editors & HTML5 Basics',
    question: 'Which HTML5 semantic element is used to represent introductory content or a set of navigational links?',
    hindiQuestion: 'HTML5 का कौन सा सिमेंटिक एलिमेंट परिचयात्मक सामग्री या नेविगेशनल लिंक को दर्शाने के लिए उपयोग किया जाता है?',
    options: ['<section>', '<header>', '<aside>', '<article>'],
    hindiOptions: ['<section>', '<header>', '<aside>', '<article>'],
    correctIndex: 1,
    explanation: 'The `<header>` tag in HTML5 represents a container for introductory content or a set of navigational links.',
    hindiExplanation: 'HTML5 में `<header>` टैग किसी पेज या सेक्शन के प्रारंभिक शीर्ष भाग एवं नेविगेशन को दर्शाता है।'
  },
  {
    id: 'm2-c2-q2',
    moduleId: 'm2-r5',
    chapterNumber: 2,
    chapterTitle: 'Editors & HTML5 Basics',
    question: 'Which HTML attribute is used to provide alternative text for an image if it cannot be loaded?',
    hindiQuestion: 'यदि कोई इमेज लोड न हो पाए तो वैकल्पिक टेक्स्ट (Alternative Text) दिखाने के लिए किस HTML एट्रिब्यूट का उपयोग किया जाता है?',
    options: ['title', 'alt', 'src', 'caption'],
    hindiOptions: ['title', 'alt', 'src', 'caption'],
    correctIndex: 1,
    explanation: 'The `alt` attribute specifies an alternate text for an image if the image cannot be displayed or for screen readers.',
    hindiExplanation: '`alt` (Alternate Text) एट्रिब्यूट का उपयोग इमेज के न दिखने पर टेक्स्ट विवरण प्रदर्शित करने के लिए किया जाता है।'
  },

  // ================= M2-R5.1: CHAPTER 3 - CSS3 =================
  {
    id: 'm2-c3-q1',
    moduleId: 'm2-r5',
    chapterNumber: 3,
    chapterTitle: 'Cascading Style Sheets (CSS3)',
    question: 'In the standard CSS Box Model, which layer sits between Padding and Margin?',
    hindiQuestion: 'CSS बॉक्स मॉडल में पैडिंग (Padding) और मार्जिन (Margin) के बीच कौन सी लेयर स्थित होती है?',
    options: ['Content', 'Border', 'Outline', 'Background'],
    hindiOptions: ['Content', 'Border (बॉर्डर)', 'Outline', 'Background'],
    correctIndex: 1,
    explanation: 'The CSS Box Model order from inside to outside is: Content -> Padding -> Border -> Margin.',
    hindiExplanation: 'CSS बॉक्स मॉडल का अंदर से बाहर क्रम: Content -> Padding -> Border -> Margin होता है।'
  },

  // ================= M3-R5.1: CHAPTER 3 - PYTHON PROGRAMMING =================
  {
    id: 'm3-c3-q1',
    moduleId: 'm3-r5',
    chapterNumber: 3,
    chapterTitle: 'Introduction to Python & Syntax',
    question: 'Who created the Python Programming Language and in which year was it first released?',
    hindiQuestion: 'पायथन प्रोग्रामिंग भाषा का विकास किसने किया था और यह पहली बार किस वर्ष जारी की गई थी?',
    options: ['Dennis Ritchie, 1972', 'Guido van Rossum, 1991', 'Bjarne Stroustrup, 1985', 'James Gosling, 1995'],
    hindiOptions: ['डेनिस रिची (1972)', 'गुइडो वैन रोसुम (Guido van Rossum, 1991)', 'बजार्ने स्ट्रॉस्ट्रुप (1985)', 'जेम्स गोस्लिंग (1995)'],
    correctIndex: 1,
    explanation: 'Python was designed and implemented by Guido van Rossum at CWI in the Netherlands and first released in 1991.',
    hindiExplanation: 'पायथन भाषा का आविष्कार गुइडो वैन रोसुम (Guido van Rossum) द्वारा किया गया था और इसे वर्ष 1991 में जारी किया गया था।'
  },
  {
    id: 'm3-c4-q1',
    moduleId: 'm3-r5',
    chapterNumber: 4,
    chapterTitle: 'Operators, Expressions and Python Statements',
    question: 'What is the output of `print(19 // 4)` in Python 3?',
    hindiQuestion: 'पायथन 3 में `print(19 // 4)` का आउटपुट क्या होगा?',
    options: ['4.75', '4', '3', '5'],
    hindiOptions: ['4.75', '4', '3', '5'],
    correctIndex: 1,
    explanation: 'The `//` operator performs floor division, rounding down to the nearest whole integer: 19 // 4 = 4.',
    hindiExplanation: 'पायथन में `//` फ्लोअर डिवीजन ऑपरेटर है जो दशमलव हटाकर पूर्णांक भाग (4) लौटाता है।'
  },
  {
    id: 'm3-c5-q1',
    moduleId: 'm3-r5',
    chapterNumber: 5,
    chapterTitle: 'Sequence Data Types (Strings, Lists, Tuples, Dictionaries)',
    question: 'Which of the following data structures in Python is Immutable (cannot be changed after creation)?',
    hindiQuestion: 'पायथन में निम्नलिखित में से कौन सा डेटा स्ट्रक्चर इम्यूटेबल (अपरिवर्तनीय) होता है?',
    options: ['List `[1, 2, 3]`', 'Dictionary `{"a": 1}`', 'Tuple `(1, 2, 3)`', 'Set `{1, 2, 3}`'],
    hindiOptions: ['List (लिस्ट)', 'Dictionary (डिक्शनरी)', 'Tuple (टुपल)', 'Set (सेट)'],
    correctIndex: 2,
    explanation: 'Tuples and Strings are immutable in Python; their elements cannot be modified, assigned, or removed after creation.',
    hindiExplanation: 'पायथन में टुपल (Tuple) और स्ट्रिंग इम्यूटेबल होते हैं, जिनका मान निर्माण के बाद बदला नहीं जा सकता।'
  },

  // ================= M4-R5.1: CHAPTER 1 & 2 - INTERNET OF THINGS (IoT) =================
  {
    id: 'm4-c1-q1',
    moduleId: 'm4-r5',
    chapterNumber: 1,
    chapterTitle: 'Introduction to Internet of Things (IoT)',
    question: 'Who coined the term "Internet of Things" (IoT) in 1999?',
    hindiQuestion: '1999 में "इंटरनेट ऑफ थिंग्स" (IoT) शब्द किसने गढ़ा था?',
    options: ['Tim Berners-Lee', 'Kevin Ashton', 'Steve Jobs', 'Alan Turing'],
    hindiOptions: ['टिम बर्नर्स-ली', 'केविन एश्टन (Kevin Ashton)', 'स्टीव जॉब्स', 'एलन ट्यूरिंग'],
    correctIndex: 1,
    explanation: 'Kevin Ashton coined the term "Internet of Things" in 1999 during his presentation at Procter & Gamble (P&G).',
    hindiExplanation: 'केविन एश्टन (Kevin Ashton) ने 1999 में P&G में RFID तकनीक के संदर्भ में पहली बार IoT शब्द दिया था।'
  },
  {
    id: 'm4-c2-q1',
    moduleId: 'm4-r5',
    chapterNumber: 2,
    chapterTitle: 'Things and Connections in IoT',
    question: 'Which lightweight messaging protocol is widely used in IoT applications and follows a Publish-Subscribe model?',
    hindiQuestion: 'IoT में कौन सा हल्का मैसेजिंग प्रोटोकॉल उपयोग किया जाता है जो पब्लिश-सब्सक्राइब (Pub-Sub) मॉडल पर कार्य करता है?',
    options: ['HTTP', 'SMTP', 'MQTT (Message Queuing Telemetry Transport)', 'FTP'],
    hindiOptions: ['HTTP', 'SMTP', 'MQTT (Message Queuing Telemetry Transport)', 'FTP'],
    correctIndex: 2,
    explanation: 'MQTT (Message Queuing Telemetry Transport) is a lightweight publish/subscribe protocol designed for low-bandwidth and high-latency IoT networks.',
    hindiExplanation: 'MQTT एक हल्का एवं कुशल पब्लिश-सब्सक्राइब प्रोटोकॉल है जो कम बैंडविड्थ और सेंसर संचार के लिए आदर्श है।'
  },
  {
    id: 'm4-c4-q1',
    moduleId: 'm4-r5',
    chapterNumber: 4,
    chapterTitle: 'Building IoT Applications with Arduino & C',
    question: 'What microcontroller chip is used in the standard Arduino Uno R3 board?',
    hindiQuestion: 'स्टैंडर्ड Arduino Uno R3 बोर्ड में किस माइक्रोकंट्रोलर चिप का उपयोग किया जाता है?',
    options: ['ATmega328P', 'ARM Cortex-M4', 'ESP8266', 'PIC16F877A'],
    hindiOptions: ['ATmega328P', 'ARM Cortex-M4', 'ESP8266', 'PIC16F877A'],
    correctIndex: 0,
    explanation: 'The Arduino Uno board is based on the Microchip ATmega328P 8-bit AVR microcontroller with 32 KB flash memory.',
    hindiExplanation: 'Arduino Uno बोर्ड ATmega328P 8-बिट AVR माइक्रोकंट्रोलर चिप पर आधारित होता है।'
  },

  // ================= CCC: CHAPTER 8 - DIGITAL FINANCIAL SERVICES =================
  {
    id: 'ccc-c8-q1',
    moduleId: 'ccc',
    chapterNumber: 8,
    chapterTitle: 'Digital Financial Tools and Applications',
    question: 'What is the full form of UPI developed by NPCI?',
    hindiQuestion: 'NPCI द्वारा विकसित UPI का पूर्ण रूप (Full Form) क्या है?',
    options: ['Universal Payment Interface', 'Unified Payments Interface', 'Unique Public Identifier', 'Union Pay of India'],
    hindiOptions: ['Universal Payment Interface', 'Unified Payments Interface', 'Unique Public Identifier', 'Union Pay of India'],
    correctIndex: 1,
    explanation: 'UPI stands for Unified Payments Interface, developed by National Payments Corporation of India (NPCI) for instant mobile interbank transfers.',
    hindiExplanation: 'UPI का फुल फॉर्म Unified Payments Interface है जिसे NPCI द्वारा मोबाइल फंड ट्रांसफर के लिए विकसित किया गया है।'
  },
  {
    id: 'ccc-c8-q2',
    moduleId: 'ccc',
    chapterNumber: 8,
    chapterTitle: 'Digital Financial Tools and Applications',
    question: 'Which USSD code is dialed on mobile phones for banking transactions without an internet connection in India?',
    hindiQuestion: 'भारत में बिना इंटरनेट कनेक्शन के मोबाइल बैंकिंग के लिए किस USSD कोड को डायल किया जाता है?',
    options: ['*121#', '*99#', '*199#', '*100#'],
    hindiOptions: ['*121#', '*99# (NUUP)', '*199#', '*100#'],
    correctIndex: 1,
    explanation: '*99# is the National Unified USSD Platform (NUUP) code enabling mobile banking across all telecom providers without internet.',
    hindiExplanation: '*99# एक गैर-इंटरनेट आधारित USSD मोबाइल बैंकिंग सेवा (NUUP) है।'
  }
];
