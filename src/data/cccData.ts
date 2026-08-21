export interface CCCChapter {
  number: number;
  title: string;
  hindiTitle: string;
  topics: string[];
  keyShortcuts?: { key: string; action: string }[];
}

export const cccExamInfo = {
  title: 'NIELIT CCC (Course on Computer Concepts)',
  duration: '80 Hours (Theory: 32 hrs + Practical: 48 hrs)',
  examPattern: '100 Questions (MCQs + True/False), 90 Minutes, Online CBT exam, NO negative marking',
  passingMarks: '50% Minimum to qualify (Grade S: 85%+, A: 75-84%, B: 65-74%, C: 55-64%, D: 50-54%)',
  validity: 'Government recognized across all Indian states and central jobs (UPSSSC, RO/ARO, VDO, Banking, Railways)',
  keyModules: ['Computer Basics', 'Operating System', 'LibreOffice Writer', 'LibreOffice Calc', 'LibreOffice Impress', 'Internet & Web', 'Digital Financial Services', 'Cyber Security & FutureSkills']
};

export const cccChapters: CCCChapter[] = [
  {
    number: 1,
    title: 'Chapter 1: Introduction to Computer',
    hindiTitle: 'कंप्यूटर का परिचय',
    topics: ['What is Computer, Characteristics & Limitations', 'Evolution & Generations (1st to 5th Generation)', 'Hardware: CPU, ALU, CU, Registers, Motherboard', 'Input Devices (Keyboard, Mouse, Scanner, OMR, OCR, MICR, Barcode)', 'Output Devices (VDU Monitors, Printers - Dot Matrix, Laser, Inkjet, Plotters)', 'Computer Memory: RAM (SRAM, DRAM), ROM (PROM, EPROM, EEPROM), Secondary Storage (HDD, SSD, Flash)']
  },
  {
    number: 2,
    title: 'Chapter 2: Introduction to Operating System',
    hindiTitle: 'ऑपरेटिंग सिस्टम का परिचय',
    topics: ['Basics of OS, Types (Single-user, Multi-user, Time-sharing, Real-time)', 'GUI vs CLI concepts', 'Windows 10/11 interface, Taskbar, Start Menu, File Explorer', 'Linux fundamentals, Terminal, open-source advantages', 'File and Folder operations (Create, Rename, Delete, Cut, Copy, Paste, Zip)']
  },
  {
    number: 3,
    title: 'Chapter 3: Word Processing (LibreOffice Writer)',
    hindiTitle: 'वर्ड प्रोसेसिंग (लिब्रेऑफिस राइटर)',
    topics: ['Writer Interface: Title Bar, Menu Bar, Standard Bar, Formatting Bar, Status Bar', 'Creating and Saving documents (.odt, .pdf, .docx)', 'Text formatting, Fonts, Superscript/Subscript, Highlighting', 'Tables creation, Cell merging, Borders and shading', 'Header, Footer, Page Number, Watermark, Footnotes & Endnotes', 'Mail Merge Step-by-Step wizard (High frequency exam question!)'],
    keyShortcuts: [
      { key: 'Ctrl + F2', action: 'Insert Fields' },
      { key: 'Ctrl + F12', action: 'Insert Table' },
      { key: 'Ctrl + Shift + P', action: 'Superscript' },
      { key: 'Ctrl + Shift + B', action: 'Subscript' },
      { key: 'Ctrl + F7', action: 'Thesaurus' },
      { key: 'F7', action: 'Spelling Check' },
      { key: 'Ctrl + Enter', action: 'Page Break' }
    ]
  },
  {
    number: 4,
    title: 'Chapter 4: Spreadsheet (LibreOffice Calc)',
    hindiTitle: 'स्प्रेडशीट (लिब्रेऑफिस कैल्क)',
    topics: ['Calc Interface: Cells, Rows (1,048,576), Columns (1,024 - A to AMJ)', 'Data Entry, Text, Numbers, Date/Time values', 'Formulas: Cell references (Relative A1, Absolute $A$1, Mixed $A1 / A$1)', 'Essential Functions: SUM, AVERAGE, MAX, MIN, COUNT, COUNTA, IF, NOW, TODAY, CONCATENATE', 'Charts: Column, Bar, Pie, Line, Area charts', 'Sorting, AutoFilter, Standard Filter, Freezing Panes'],
    keyShortcuts: [
      { key: 'Ctrl + F2', action: 'Function Wizard' },
      { key: 'Ctrl + Shift + F4', action: 'Open Database Beamer' },
      { key: 'Ctrl + ;', action: 'Insert Current Date' },
      { key: 'Ctrl + Shift + ;', action: 'Insert Current Time' },
      { key: 'Ctrl + 1', action: 'Format Cells Dialog' },
      { key: 'Ctrl + Space', action: 'Select entire column' },
      { key: 'Shift + Space', action: 'Select entire row' }
    ]
  },
  {
    number: 5,
    title: 'Chapter 5: Presentation (LibreOffice Impress)',
    hindiTitle: 'प्रेजेंटेशन (लिब्रेऑफिस इम्प्रेस)',
    topics: ['Impress Interface, Slides, Layouts, Master Slides', 'Inserting Text Boxes, Images, Audio, Video, Shapes', 'Slide Transitions and Object Animations', 'Slide Show views: Normal, Outline, Notes, Slide Sorter', 'Exporting presentation to PDF and HTML format'],
    keyShortcuts: [
      { key: 'F5', action: 'Start Slide Show from First Slide' },
      { key: 'Shift + F5', action: 'Start Slide Show from Current Slide' },
      { key: 'Ctrl + M', action: 'Insert New Slide' },
      { key: 'Esc', action: 'End / Exit Slide Show' }
    ]
  },
  {
    number: 6,
    title: 'Chapter 6: Introduction to Internet and WWW',
    hindiTitle: 'इंटरनेट और वर्ल्ड वाइड वेब का परिचय',
    topics: ['Computer Networks: LAN, MAN, WAN, PAN', 'Network Topologies: Bus, Star, Ring, Mesh, Tree, Hybrid', 'Internet concept, IP Addresses (IPv4 32-bit, IPv6 128-bit), MAC Address (48-bit)', 'Protocols: TCP, IP, HTTP, HTTPS, FTP, SMTP, POP3, IMAP, Telnet', 'Web Browsers: Chrome, Firefox, Edge, Safari, Brave', 'Search Engines: Google, Bing, Yahoo, DuckDuckGo']
  },
  {
    number: 7,
    title: 'Chapter 7: E-mail, Social Networking & e-Governance',
    hindiTitle: 'ई-मेल, सोशल नेटवर्किंग और ई-गवर्नेंस',
    topics: ['Email Structure: Header, To, Cc (Carbon Copy), Bcc (Blind Carbon Copy), Subject, Body, Attachments', 'Email Providers: Gmail, Yahoo Mail, Outlook', 'Social Networks: Facebook, Twitter/X, LinkedIn, Instagram, WhatsApp, Telegram', 'e-Governance Services: Railway (IRCTC), Passport Seva, e-Hospital, Aadhaar (UIDAI)', 'UMANG App, DigiLocker (Cloud storage for official certificates)']
  },
  {
    number: 8,
    title: 'Chapter 8: Digital Financial Tools and Applications',
    hindiTitle: 'डिजिटल वित्तीय उपकरण और अनुप्रयोग',
    topics: ['OTP (One Time Password), PIN, QR Code (Quick Response)', 'UPI (Unified Payments Interface), Virtual Payment Address (VPA)', 'AEPS (Aadhaar Enabled Payment System), Micro ATMs', 'USSD (*99#) for offline banking without internet', 'Cards: Debit Card, Credit Card, Rupay Card (NPCI)', 'e-Wallets: Paytm, PhonePe, Google Pay, Mobikwik', 'National Electronic Funds: NEFT, RTGS (Minimum 2 Lakhs), IMPS (Immediate 24x7)']
  },
  {
    number: 9,
    title: 'Chapter 9: Cyber Security & FutureSkills Overview',
    hindiTitle: 'साइबर सुरक्षा और फ्यूचरस्किल्स का अवलोकन',
    topics: ['Cyber Threats: Virus, Worm, Trojan Horse, Spyware, Ransomware, Adware', 'Attacks: Phishing, Spoofing, Denial of Service (DoS), Man-in-the-Middle', 'Security Measures: Antivirus, Firewall, Strong Passwords, Two-Factor Authentication (2FA)', 'IT Act 2000 & Cyber Laws', 'FutureSkills: IoT, Big Data, Cloud Computing, Artificial Intelligence, Blockchain, 3D Printing, Robotics, Virtual Reality']
  }
];

export interface LibreOfficeShortcut {
  module: 'LibreOffice Writer' | 'LibreOffice Calc' | 'LibreOffice Impress';
  shortcut: string;
  keys: string[]; // individual key segments for beautiful mobile keycaps
  description: string;
  hindiDescription: string;
  category: 'File & Window' | 'Editing & Formatting' | 'Navigation' | 'Tables & Cells' | 'Formulas & Functions' | 'Slide Show & Objects' | 'Tools & Special';
  isHighFrequency?: boolean;
}

export const libreOfficeShortcutCheatSheet: LibreOfficeShortcut[] = [
  // --- LIBREOFFICE WRITER ---
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + F2',
    keys: ['Ctrl', 'F2'],
    description: 'Insert Fields (Date, Time, Author, Page No.)',
    hindiDescription: 'डॉक्यूमेंट फ़ील्ड्स (पेज नंबर, तारीख आदि) इन्सर्ट करें',
    category: 'Tools & Special',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + F12',
    keys: ['Ctrl', 'F12'],
    description: 'Insert Table Dialog Box',
    hindiDescription: 'टेबल इन्सर्ट करने का डायलॉग बॉक्स खोलें',
    category: 'Tables & Cells',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + Shift + P',
    keys: ['Ctrl', 'Shift', 'P'],
    description: 'Superscript (e.g. X², 1st)',
    hindiDescription: 'सुपरस्क्रिप्ट (टेक्स्ट ऊपर ले जाएँ)',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + Shift + B',
    keys: ['Ctrl', 'Shift', 'B'],
    description: 'Subscript (e.g. H₂O, CO₂)',
    hindiDescription: 'सबस्क्रिप्ट (टेक्स्ट नीचे ले जाएँ)',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'F7',
    keys: ['F7'],
    description: 'Spelling & Grammar Check Dialog',
    hindiDescription: 'वर्तनी और व्याकरण (Spelling) जाँच',
    category: 'Tools & Special',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Shift + F7',
    keys: ['Shift', 'F7'],
    description: 'Automatic Spell Checking (Toggle On/Off)',
    hindiDescription: 'स्वचालित स्पेलिंग चेक चालू/बंद करें',
    category: 'Tools & Special',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + F7',
    keys: ['Ctrl', 'F7'],
    description: 'Thesaurus / Synonym Lookup',
    hindiDescription: 'पर्यायवाची शब्दकोश (Thesaurus) खोलें',
    category: 'Tools & Special',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + Enter',
    keys: ['Ctrl', 'Enter'],
    description: 'Insert Manual Page Break',
    hindiDescription: 'पेज ब्रेक (नया पेज शुरू करें)',
    category: 'Navigation',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Shift + Enter',
    keys: ['Shift', 'Enter'],
    description: 'Line Break without starting new paragraph',
    hindiDescription: 'पैराग्राफ बदले बिना नई लाइन जोड़ें',
    category: 'Editing & Formatting'
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + Shift + Enter',
    keys: ['Ctrl', 'Shift', 'Enter'],
    description: 'Insert Column Break in multi-column layout',
    hindiDescription: 'कॉलम ब्रेक इन्सर्ट करें',
    category: 'Navigation'
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + Shift + S',
    keys: ['Ctrl', 'Shift', 'S'],
    description: 'Save As (Save with new name/path)',
    hindiDescription: 'सेव एज़ (नए नाम से सुरक्षित करें)',
    category: 'File & Window',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + Shift + O',
    keys: ['Ctrl', 'Shift', 'O'],
    description: 'Print Preview / Page Preview',
    hindiDescription: 'प्रिंट प्रीव्यू देखें',
    category: 'File & Window',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + Q',
    keys: ['Ctrl', 'Q'],
    description: 'Exit / Close Entire LibreOffice Application',
    hindiDescription: 'लिब्रेऑफिस पूरी तरह बंद करें',
    category: 'File & Window',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + W',
    keys: ['Ctrl', 'W'],
    description: 'Close Current Document Window',
    hindiDescription: 'वर्तमान डॉक्यूमेंट विंडो बंद करें',
    category: 'File & Window'
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + Shift + V',
    keys: ['Ctrl', 'Shift', 'V'],
    description: 'Paste Special Dialog',
    hindiDescription: 'पेस्ट स्पेशल डायलॉग बॉक्स',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + Alt + Shift + V',
    keys: ['Ctrl', 'Alt', 'Shift', 'V'],
    description: 'Paste Unformatted Text',
    hindiDescription: 'बिना फॉर्मेटिंग के सामान्य टेक्स्ट पेस्ट करें',
    category: 'Editing & Formatting'
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + H',
    keys: ['Ctrl', 'H'],
    description: 'Find and Replace Dialog',
    hindiDescription: 'खोजें और बदलें (Find & Replace)',
    category: 'Navigation',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + G',
    keys: ['Ctrl', 'G'],
    description: 'Go to Page / Bookmark',
    hindiDescription: 'विशिष्ट पेज नंबर पर सीधे जाएँ',
    category: 'Navigation'
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + 1',
    keys: ['Ctrl', '1'],
    description: 'Apply Heading 1 Paragraph Style',
    hindiDescription: 'हेडिंग 1 स्टाइल लागू करें',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + 2',
    keys: ['Ctrl', '2'],
    description: 'Apply Heading 2 Paragraph Style',
    hindiDescription: 'हेडिंग 2 स्टाइल लागू करें',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + 3',
    keys: ['Ctrl', '3'],
    description: 'Apply Heading 3 Paragraph Style',
    hindiDescription: 'हेडिंग 3 स्टाइल लागू करें',
    category: 'Editing & Formatting'
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + 0',
    keys: ['Ctrl', '0'],
    description: 'Apply Default Text Body Style',
    hindiDescription: 'डिफ़ॉल्ट बॉडी टेक्स्ट स्टाइल लागू करें',
    category: 'Editing & Formatting'
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + E',
    keys: ['Ctrl', 'E'],
    description: 'Align Text Center',
    hindiDescription: 'टेक्स्ट को बीच (Center) में अलाइन करें',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + L',
    keys: ['Ctrl', 'L'],
    description: 'Align Text Left',
    hindiDescription: 'टेक्स्ट को बाएँ (Left) अलाइन करें',
    category: 'Editing & Formatting'
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + R',
    keys: ['Ctrl', 'R'],
    description: 'Align Text Right',
    hindiDescription: 'टेक्स्ट को दाएँ (Right) अलाइन करें',
    category: 'Editing & Formatting'
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + J',
    keys: ['Ctrl', 'J'],
    description: 'Justify Text Evenly',
    hindiDescription: 'टेक्स्ट को दोनों तरफ (Justify) बराबर करें',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + ]',
    keys: ['Ctrl', ']'],
    description: 'Increase Font Size (Grow Font)',
    hindiDescription: 'फॉन्ट साइज़ बढ़ाएँ',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + [',
    keys: ['Ctrl', '['],
    description: 'Decrease Font Size (Shrink Font)',
    hindiDescription: 'फॉन्ट साइज़ घटाएँ',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + M',
    keys: ['Ctrl', 'M'],
    description: 'Clear Direct Formatting (Reset to Default)',
    hindiDescription: 'डायरेक्ट फॉर्मेटिंग हटाकर डिफ़ॉल्ट करें',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'F11',
    keys: ['F11'],
    description: 'Manage Styles & Formatting Sidebar Deck',
    hindiDescription: 'स्टाइल्स साइडबार डेक खोलें',
    category: 'Tools & Special',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + F5',
    keys: ['Ctrl', 'F5'],
    description: 'Toggle Properties / Tools Sidebar',
    hindiDescription: 'साइडबार दिखाएँ या छुपाएँ',
    category: 'Tools & Special',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + Shift + J',
    keys: ['Ctrl', 'Shift', 'J'],
    description: 'Toggle Full Screen Mode',
    hindiDescription: 'फुल स्क्रीन मोड चालू/बंद करें',
    category: 'File & Window',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + K',
    keys: ['Ctrl', 'K'],
    description: 'Insert Hyperlink Dialog',
    hindiDescription: 'हाइपरलिंक इन्सर्ट करें',
    category: 'Tools & Special',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + Alt + C',
    keys: ['Ctrl', 'Alt', 'C'],
    description: 'Insert Comment in Document',
    hindiDescription: 'डॉक्यूमेंट में टिप्पणी/कमेंट जोड़ें',
    category: 'Tools & Special',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Ctrl + F3',
    keys: ['Ctrl', 'F3'],
    description: 'AutoText Selection / Management',
    hindiDescription: 'ऑटोटेक्स्ट विंडो खोलें',
    category: 'Tools & Special',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'F12',
    keys: ['F12'],
    description: 'Toggle Numbered List',
    hindiDescription: 'नंबरिंग लिस्ट चालू/बंद करें',
    category: 'Editing & Formatting'
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'Shift + F12',
    keys: ['Shift', 'F12'],
    description: 'Toggle Bulleted List',
    hindiDescription: 'बुलेटेड लिस्ट चालू/बंद करें',
    category: 'Editing & Formatting'
  },
  {
    module: 'LibreOffice Writer',
    shortcut: 'F2',
    keys: ['F2'],
    description: 'Formula Bar in Writer Table',
    hindiDescription: 'राइटर टेबल में फॉर्मूला बार खोलें',
    category: 'Tables & Cells'
  },

  // --- LIBREOFFICE CALC ---
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + ;',
    keys: ['Ctrl', ';'],
    description: 'Insert Current System Date in Active Cell',
    hindiDescription: 'सेल में वर्तमान तारीख (Date) दर्ज करें',
    category: 'Formulas & Functions',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + Shift + ;',
    keys: ['Ctrl', 'Shift', ';'],
    description: 'Insert Current System Time in Active Cell',
    hindiDescription: 'सेल में वर्तमान समय (Time) दर्ज करें',
    category: 'Formulas & Functions',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + 1',
    keys: ['Ctrl', '1'],
    description: 'Open Format Cells Dialog Box',
    hindiDescription: 'फॉर्मेट सेल्स (Format Cells) डायलॉग बॉक्स खोलें',
    category: 'Tables & Cells',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + F2',
    keys: ['Ctrl', 'F2'],
    description: 'Open Function Wizard (SUM, AVERAGE, IF etc.)',
    hindiDescription: 'फंक्शन विजार्ड (Function Wizard) खोलें',
    category: 'Formulas & Functions',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + Shift + F4',
    keys: ['Ctrl', 'Shift', 'F4'],
    description: 'Open Data Source / Database Beamer View',
    hindiDescription: 'डेटा सोर्स / डेटाबेस बीमर विंडो खोलें',
    category: 'Tools & Special',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + Space',
    keys: ['Ctrl', 'Space'],
    description: 'Select Entire Column of Current Cell',
    hindiDescription: 'पूरा कॉलम (Column) सेलेक्ट करें',
    category: 'Tables & Cells',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Shift + Space',
    keys: ['Shift', 'Space'],
    description: 'Select Entire Row of Current Cell',
    hindiDescription: 'पूरी पंक्ति (Row) सेलेक्ट करें',
    category: 'Tables & Cells',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + Shift + Space',
    keys: ['Ctrl', 'Shift', 'Space'],
    description: 'Select Entire Sheet (All 1,048,576 Rows & 1,024 Columns)',
    hindiDescription: 'पूरी स्प्रेडशीट (Sheet) सेलेक्ट करें',
    category: 'Tables & Cells',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + +',
    keys: ['Ctrl', '+'],
    description: 'Insert Cells / Rows / Columns Dialog',
    hindiDescription: 'नई सेल, रो या कॉलम जोड़ने का डायलॉग',
    category: 'Tables & Cells',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + -',
    keys: ['Ctrl', '-'],
    description: 'Delete Selected Cells / Rows / Columns',
    hindiDescription: 'चुनी हुई सेल, रो या कॉलम डिलीट करें',
    category: 'Tables & Cells',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'F2',
    keys: ['F2'],
    description: 'Edit Current Active Cell Content',
    hindiDescription: 'एक्टिव सेल को एडिट मोड में लाएँ',
    category: 'Tables & Cells',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + F1',
    keys: ['Ctrl', 'F1'],
    description: 'Show / Hide Formulas in Cells (Formula View)',
    hindiDescription: 'सेल में परिणाम के बजाय फॉर्मूला दिखाएँ/छुपाएँ',
    category: 'Formulas & Functions',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'F4',
    keys: ['F4'],
    description: 'Toggle Absolute / Relative Reference ($A$1 -> A$1 -> $A1 -> A1)',
    hindiDescription: 'सेल रेफरेंस ($A$1) एब्सोल्यूट/रिलेटिव बदलें',
    category: 'Formulas & Functions',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + D',
    keys: ['Ctrl', 'D'],
    description: 'Fill Down Content from Above Cell',
    hindiDescription: 'ऊपर वाली सेल का डेटा नीचे फिल करें',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + R',
    keys: ['Ctrl', 'R'],
    description: 'Fill Right Content from Left Cell',
    hindiDescription: 'बाईं सेल का डेटा दाएँ फिल करें',
    category: 'Editing & Formatting'
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + F8',
    keys: ['Ctrl', 'F8'],
    description: 'Value Highlighting (Numbers: Blue, Text: Black, Formulas: Green)',
    hindiDescription: 'वैल्यू हाइलाइटिंग (नंबर नीले, टेक्स्ट काले, फॉर्मूला हरे)',
    category: 'Tools & Special',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'F9',
    keys: ['F9'],
    description: 'Recalculate Formulas in Sheet',
    hindiDescription: 'शीट के सभी फॉर्मूलों को दोबारा कैल्कुलेट करें',
    category: 'Formulas & Functions',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + Shift + F9',
    keys: ['Ctrl', 'Shift', 'F9'],
    description: 'Hard Recalculate all formulas across all open sheets',
    hindiDescription: 'सभी खुली शीट के फॉर्मूलों का हार्ड रीकैल्कुलेशन',
    category: 'Formulas & Functions'
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + Shift + L',
    keys: ['Ctrl', 'Shift', 'L'],
    description: 'Toggle AutoFilter on Active Data Table',
    hindiDescription: 'ऑटोफ़िल्टर (AutoFilter) चालू/बंद करें',
    category: 'Tools & Special',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Alt + Enter',
    keys: ['Alt', 'Enter'],
    description: 'Insert Manual Line Break Inside Active Cell',
    hindiDescription: 'एक ही सेल के अंदर नई लाइन बनाएँ',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + Home',
    keys: ['Ctrl', 'Home'],
    description: 'Jump Immediately to Cell A1 (First Cell)',
    hindiDescription: 'सीधे पहली सेल A1 पर जाएँ',
    category: 'Navigation',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + End',
    keys: ['Ctrl', 'End'],
    description: 'Jump to Last Active / Data Cell in Sheet',
    hindiDescription: 'शीट की अंतिम डेटा सेल पर जाएँ',
    category: 'Navigation'
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + Shift + 1',
    keys: ['Ctrl', 'Shift', '1'],
    description: 'Apply Standard Two-Decimal Number Format',
    hindiDescription: 'दो दशमलव स्थान वाला नंबर फॉर्मेट लागू करें',
    category: 'Editing & Formatting'
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + Shift + 4',
    keys: ['Ctrl', 'Shift', '4'],
    description: 'Apply Currency Format (₹ / $)',
    hindiDescription: 'करेंसी (मुद्रा) फॉर्मेट लागू करें',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + Shift + 5',
    keys: ['Ctrl', 'Shift', '5'],
    description: 'Apply Percentage (%) Format',
    hindiDescription: 'प्रतिशत (%) फॉर्मेट लागू करें',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + Tab',
    keys: ['Ctrl', 'Tab'],
    description: 'Switch to Next Sheet Tab',
    hindiDescription: 'अगली शीट टैब पर जाएँ',
    category: 'Navigation'
  },
  {
    module: 'LibreOffice Calc',
    shortcut: 'Ctrl + Shift + Tab',
    keys: ['Ctrl', 'Shift', 'Tab'],
    description: 'Switch to Previous Sheet Tab',
    hindiDescription: 'पिछली शीट टैब पर जाएँ',
    category: 'Navigation'
  },

  // --- LIBREOFFICE IMPRESS ---
  {
    module: 'LibreOffice Impress',
    shortcut: 'F5',
    keys: ['F5'],
    description: 'Start Slide Show from the First / Beginning Slide',
    hindiDescription: 'पहले स्लाइड से प्रेजेंटेशन / स्लाइड शो शुरू करें',
    category: 'Slide Show & Objects',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'Shift + F5',
    keys: ['Shift', 'F5'],
    description: 'Start Slide Show from the Current Active Slide',
    hindiDescription: 'वर्तमान चुनी हुई स्लाइड से स्लाइड शो शुरू करें',
    category: 'Slide Show & Objects',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'Ctrl + M',
    keys: ['Ctrl', 'M'],
    description: 'Insert New Blank Slide into Presentation',
    hindiDescription: 'नई स्लाइड (New Slide) जोड़ें',
    category: 'Slide Show & Objects',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'Ctrl + Shift + M',
    keys: ['Ctrl', 'Shift', 'M'],
    description: 'Duplicate Currently Selected Slide',
    hindiDescription: 'वर्तमान स्लाइड की डुप्लीकेट कॉपी बनाएँ',
    category: 'Slide Show & Objects'
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'Esc',
    keys: ['Esc'],
    description: 'End / Exit Running Slide Show',
    hindiDescription: 'स्लाइड शो समाप्त / बंद करें',
    category: 'Slide Show & Objects',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'B',
    keys: ['B'],
    description: 'Show Black Screen during Live Slide Show (Toggle)',
    hindiDescription: 'स्लाइड शो के दौरान खाली काली (Black) स्क्रीन दिखाएँ',
    category: 'Slide Show & Objects',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'W',
    keys: ['W'],
    description: 'Show White Screen during Live Slide Show (Toggle)',
    hindiDescription: 'स्लाइड शो के दौरान खाली सफेद (White) स्क्रीन दिखाएँ',
    category: 'Slide Show & Objects',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'Ctrl + G',
    keys: ['Ctrl', 'G'],
    description: 'Group Selected Graphic Objects & Shapes',
    hindiDescription: 'चुने हुए ऑब्जेक्ट्स/शेप्स को ग्रुप करें',
    category: 'Slide Show & Objects',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'Ctrl + Shift + G',
    keys: ['Ctrl', 'Shift', 'G'],
    description: 'Ungroup Selected Grouped Objects',
    hindiDescription: 'ग्रुप किए हुए ऑब्जेक्ट्स को अनग्रुप करें',
    category: 'Slide Show & Objects',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'Ctrl + Shift + K',
    keys: ['Ctrl', 'Shift', 'K'],
    description: 'Combine Selected Vector Objects into Single Shape',
    hindiDescription: 'ऑब्जेक्ट्स को कंबाइन (Combine) करें',
    category: 'Slide Show & Objects'
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'F2',
    keys: ['F2'],
    description: 'Toggle Text Tool / Edit Text Inside Shape',
    hindiDescription: 'शेप के अंदर टेक्स्ट एडिट करने का टूल',
    category: 'Editing & Formatting',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'F3',
    keys: ['F3'],
    description: 'Enter Selected Group to Edit Single Inner Object',
    hindiDescription: 'ग्रुप के अंदर जाकर किसी एक ऑब्जेक्ट को एडिट करें',
    category: 'Slide Show & Objects'
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'Ctrl + F3',
    keys: ['Ctrl', 'F3'],
    description: 'Exit Group Editing Mode',
    hindiDescription: 'ग्रुप एडिटिंग मोड से बाहर निकलें',
    category: 'Slide Show & Objects'
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'F4',
    keys: ['F4'],
    description: 'Position and Size Properties Dialog for Object',
    hindiDescription: 'ऑब्जेक्ट का आकार और स्थिति (Position & Size) डायलॉग',
    category: 'Slide Show & Objects',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'Ctrl + Shift + F5',
    keys: ['Ctrl', 'Shift', 'F5'],
    description: 'Open Slide Navigator Window',
    hindiDescription: 'स्लाइड नेविगेटर विंडो खोलें',
    category: 'Navigation',
    isHighFrequency: true
  },
  {
    module: 'LibreOffice Impress',
    shortcut: 'Ctrl + F5',
    keys: ['Ctrl', 'F5'],
    description: 'Toggle Impress Sidebar (Master Slides / Animation Deck)',
    hindiDescription: 'साइडबार (एनीमेशन / मास्टर स्लाइड) चालू/बंद करें',
    category: 'Tools & Special'
  }
];
