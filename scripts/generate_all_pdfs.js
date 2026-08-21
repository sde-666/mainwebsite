import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const downloadsDir = path.resolve('public/downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

const pdfList = [
  {
    fileName: 'm1-r5-syllabus.pdf',
    title: 'NIELIT O Level M1-R5.1: IT Tools & Network Basics',
    subtitle: 'Official Syllabus, Marks Weightage & Examination Scheme (R5.1)',
    sections: [
      {
        heading: '1. Module Overview',
        text: 'Module Code: M1-R5.1 | Total Marks: 100 (60% Theory + 40% Practical Weightage) | Duration: 120 Hours'
      },
      {
        heading: '2. Unit-Wise Marks Distribution',
        text: '• Introduction to Computer & GUI Based Operating System (10 Marks)\n• Word Processing (LibreOffice Writer) (20 Marks)\n• Spreadsheet (LibreOffice Calc) (20 Marks)\n• Presentation (LibreOffice Impress) (20 Marks)\n• Introduction to Internet and WWW, Email & Social Networking (20 Marks)\n• Digital Financial Services & Cyber Security (10 Marks)'
      },
      {
        heading: '3. Examination Criteria',
        text: '• Theory Exam: 100 Multiple Choice Questions (CBT Online Mode), Duration: 90 Minutes, Passing: Min 33%\n• Practical Exam: 100 Marks Lab Practice (3 Questions + Viva), Duration: 50 Minutes, Passing: Min 33%\n• Combined Aggregate Required: 50% (Formula: 0.6 * Theory + 0.4 * Practical)'
      }
    ]
  },
  {
    fileName: 'm1-r5-notes.pdf',
    title: 'M1-R5.1: IT Tools & Network Basics Complete Revision Notes',
    subtitle: 'Comprehensive Bilingual Quick Revision Formula Sheet & Short Notes',
    sections: [
      {
        heading: '1. LibreOffice Writer Shortcuts',
        text: '• Ctrl + N: New Document | Ctrl + O: Open Document | Ctrl + S: Save Document\n• Ctrl + F2: Insert Fields | Ctrl + F12: Insert Table | F7: Spelling & Grammar Check\n• Ctrl + Shift + P: Superscript | Ctrl + Shift + B: Subscript | Ctrl + Enter: Page Break'
      },
      {
        heading: '2. LibreOffice Calc Formulas & Essentials',
        text: '• Default Sheet Name: Sheet1 | Maximum Rows: 1,048,576 | Maximum Columns: 1,024 (AMJ)\n• Formula Start with "=" | Cell range represented with ":" (e.g., A1:B10)\n• Ctrl + F8: Value Highlighting | Ctrl + Shift + F9: Recalculate Hard | F2: Edit active cell'
      },
      {
        heading: '3. LibreOffice Impress Shortcuts',
        text: '• F5: Start Slide Show from First Slide | Shift + F5: Start Slide Show from Current Slide\n• Esc: Exit Slide Show | Ctrl + M: Insert New Slide | F2: Activate Text Tool'
      },
      {
        heading: '4. Digital Financial Tools',
        text: '• UPI: Unified Payments Interface (NPCI, 24x7 instant fund transfer)\n• AEPS: Aadhaar Enabled Payment System (Micro-ATM biometric transactions)\n• USSD: *99# mobile banking without internet on basic feature phones'
      }
    ]
  },
  {
    fileName: 'm2-r5-syllabus.pdf',
    title: 'NIELIT O Level M2-R5.1: Web Designing & Publishing',
    subtitle: 'Official Syllabus & Module Breakdown',
    sections: [
      {
        heading: '1. Module Overview',
        text: 'Module Code: M2-R5.1 | Total Marks: 100 (60% Theory + 40% Practical Weightage) | Duration: 120 Hours'
      },
      {
        heading: '2. Unit Breakdown',
        text: '• Introduction to Web Design & HTML5 Basics (25 Marks)\n• CSS3 Styling & Responsive Frameworks (W3.CSS) (25 Marks)\n• JavaScript & Client-Side Interactivity (20 Marks)\n• Photo Editing with Photoshop / GIMP (15 Marks)\n• Web Publishing, Hosting, FTP & Domain Management (15 Marks)'
      }
    ]
  },
  {
    fileName: 'm2-r5-notes.pdf',
    title: 'M2-R5.1: Web Designing & Publishing Complete Notes',
    subtitle: 'HTML5, CSS3, JavaScript & W3.CSS Essential Handout',
    sections: [
      {
        heading: '1. HTML5 Semantic Elements',
        text: '• <header>, <nav>, <section>, <article>, <aside>, <footer>, <main>\n• Audio/Video: <video src="movie.mp4" controls>, <audio src="audio.mp3" controls>\n• Form Input Types: email, tel, number, range, date, color'
      },
      {
        heading: '2. CSS3 Box Model & Flexbox',
        text: '• Box Model: Content -> Padding -> Border -> Margin\n• Flexbox: display: flex, justify-content: center, align-items: center\n• CSS Selectors: Universal (*), Element (p), Class (.name), ID (#id), Attribute ([type="text"])'
      },
      {
        heading: '3. JavaScript Fundamentals',
        text: '• Variables: let (block-scope), const (constant), var (function-scope)\n• DOM Manipulation: document.getElementById(), document.querySelector()\n• Events: onclick, onmouseover, onsubmit, onchange'
      }
    ]
  },
  {
    fileName: 'm3-r5-syllabus.pdf',
    title: 'NIELIT O Level M3-R5.1: Programming & Problem Solving through Python',
    subtitle: 'Official Syllabus, Practical Criteria & Weightage',
    sections: [
      {
        heading: '1. Module Overview',
        text: 'Module Code: M3-R5.1 | Duration: 120 Hours | Prerequisite: Basic Logic Formulation'
      },
      {
        heading: '2. Unit Breakdown & Marks Distribution',
        text: '• Algorithms & Flowcharts to Solve Problems (10 Marks)\n• Introduction to Python, Variables, Data Types & Operators (20 Marks)\n• Conditional & Iterative Statements (if-elif-else, for, while) (20 Marks)\n• Sequence Data Types (Strings, Lists, Tuples, Dictionaries, Sets) (20 Marks)\n• Functions, Recursion & Scope (15 Marks)\n• File Processing & Introduction to NumPy Array (15 Marks)'
      }
    ]
  },
  {
    fileName: 'm3-r5-notes.pdf',
    title: 'M3-R5.1: Python Programming Master Notes & Syntax Cheat Sheet',
    subtitle: 'Quick Reference Guide by Er. Skilldotpy',
    sections: [
      {
        heading: '1. Python Data Types & Mutability',
        text: '• Mutable: List [1, 2, 3], Dictionary {"a": 1}, Set {1, 2, 3}\n• Immutable: Integer, Float, String "hello", Tuple (1, 2, 3), FrozenSet\n• Indexing: Positive (0 to n-1), Negative (-1 from rightmost)'
      },
      {
        heading: '2. List & String Methods',
        text: '• List: append(), extend(), insert(), pop(), remove(), sort(), reverse()\n• String: lower(), upper(), title(), split(), join(), replace(), find(), count()'
      },
      {
        heading: '3. File Handling in Python',
        text: '• Open File: f = open("data.txt", "r") | Modes: "r" (read), "w" (write), "a" (append), "r+"\n• Read Methods: f.read(), f.readline(), f.readlines()\n• Always close or use context manager: with open(...) as f:'
      },
      {
        heading: '4. NumPy Essentials',
        text: '• import numpy as np | arr = np.array([1, 2, 3])\n• 2D Array: np.array([[1, 2], [3, 4]]) | shape, ndim, dtype, size'
      }
    ]
  },
  {
    fileName: 'm4-r5-syllabus.pdf',
    title: 'NIELIT O Level M4-R5.1: Internet of Things (IoT) & Applications',
    subtitle: 'Official Syllabus & Practical Examination Framework',
    sections: [
      {
        heading: '1. Module Overview',
        text: 'Module Code: M4-R5.1 | Duration: 120 Hours | Focus: Embedded Sensors & Smart Applications'
      },
      {
        heading: '2. Unit Breakdown',
        text: '• Introduction to IoT Architecture & Ecosystem (15 Marks)\n• Sensors, Actuators & Microcontrollers (Arduino Uno) (25 Marks)\n• Building IoT Applications using C/Embedded C on Arduino (25 Marks)\n• IoT Communication Protocols (MQTT, CoAP, HTTP, Bluetooth, ZigBee) (20 Marks)\n• Soft Skills & Personality Development (15 Marks)'
      }
    ]
  },
  {
    fileName: 'm4-r5-notes.pdf',
    title: 'M4-R5.1: Internet of Things (IoT) & Arduino Complete Handout',
    subtitle: 'Sensors, Protocols, Arduino Pins & Personality Development',
    sections: [
      {
        heading: '1. Arduino Uno Pinout Essentials',
        text: '• Microcontroller: ATmega328P | Operating Voltage: 5V\n• Digital I/O Pins: 14 (of which 6 provide PWM output: ~3, ~5, ~6, ~9, ~10, ~11)\n• Analog Input Pins: 6 (A0 to A5) with 10-bit ADC resolution (0-1023)\n• Flash Memory: 32 KB | Clock Speed: 16 MHz'
      },
      {
        heading: '2. IoT Communication Protocols',
        text: '• MQTT: Message Queuing Telemetry Transport (Publish/Subscribe, lightweight, port 1883)\n• CoAP: Constrained Application Protocol (RESTful, UDP-based, port 5683)\n• ZigBee: Low-power, short-range 2.4 GHz wireless mesh network (IEEE 802.15.4)'
      }
    ]
  },
  {
    fileName: 'ccc-syllabus.pdf',
    title: 'NIELIT CCC (Course on Computer Concepts) Official Syllabus',
    subtitle: 'Complete 80-Hour Curriculum Document (Revised)',
    sections: [
      {
        heading: '1. Course Details',
        text: 'Course: CCC | Total Hours: 80 (Theory: 32 Hrs + Practical: 48 Hrs) | Exam Mode: Online CBT (100 MCQs, 90 Mins, No Negative Marking)'
      },
      {
        heading: '2. Chapter Breakdown',
        text: '• Chapter 1: Introduction to Computer & Hardware\n• Chapter 2: Introduction to GUI Operating System (Windows / Linux / Ubuntu)\n• Chapter 3: Word Processing (LibreOffice Writer)\n• Chapter 4: Spreadsheets (LibreOffice Calc)\n• Chapter 5: Presentations (LibreOffice Impress)\n• Chapter 6: Introduction to Internet and WWW\n• Chapter 7: E-mail, Social Networking & e-Governance Services\n• Chapter 8: Digital Financial Tools and Applications (UPI, AEPS, USSD, Cards, Wallets)\n• Chapter 9: Overview of FutureSkills and Cyber Security'
      }
    ]
  },
  {
    fileName: 'ccc-handbook.pdf',
    title: 'NIELIT CCC Master Handout & Shortcut Cheat Sheet',
    subtitle: 'All-in-One Quick Revision Notes for Grade S Score',
    sections: [
      {
        heading: '1. Most Frequent Shortcut Keys in CCC',
        text: '• LibreOffice Writer: Save As = Ctrl + Shift + S | Print Preview = Ctrl + Shift + O\n• LibreOffice Calc: Insert Time = Ctrl + Shift + ; | Insert Date = Ctrl + ;\n• LibreOffice Impress: New Presentation = Ctrl + N | Duplicate Slide = Insert -> Duplicate'
      },
      {
        heading: '2. Important Full Forms in CCC Exam',
        text: '• UPI: Unified Payments Interface | NEFT: National Electronic Funds Transfer\n• RTGS: Real Time Gross Settlement | IMPS: Immediate Payment Service\n• OTP: One Time Password | QR Code: Quick Response Code | IFSC: Indian Financial System Code'
      }
    ]
  },
  {
    fileName: 'libreoffice-shortcuts.pdf',
    title: 'LibreOffice Complete Keyboard Shortcuts Handbook',
    subtitle: 'Writer, Calc & Impress Complete Command Reference',
    sections: [
      {
        heading: '1. Writer Shortcuts',
        text: '• Ctrl+F2: Fields | Ctrl+F3: AutoText | Ctrl+F5: Side Bar | Ctrl+F7: Thesaurus | Ctrl+F12: Table'
      },
      {
        heading: '2. Calc Shortcuts',
        text: '• Ctrl+1: Format Cells | Ctrl+F8: Value Highlighting | Ctrl+Shift+F9: Hard Recalculate'
      },
      {
        heading: '3. Impress Shortcuts',
        text: '• F5: Slide Show from Start | Shift+F5: Slide Show from Current | Ctrl+M: New Slide'
      }
    ]
  },
  {
    fileName: 'o-level-r5-syllabus.pdf',
    title: 'NIELIT O Level (R5.1) Complete 4 Papers Official Syllabus Copy',
    subtitle: 'M1-R5.1, M2-R5.1, M3-R5.1, M4-R5.1 Comprehensive Document',
    sections: [
      {
        heading: '1. Complete O Level Scheme',
        text: '• Paper 1 (M1-R5.1): IT Tools & Network Basics\n• Paper 2 (M2-R5.1): Web Designing & Publishing\n• Paper 3 (M3-R5.1): Programming through Python\n• Paper 4 (M4-R5.1): Internet of Things (IoT)\n• Practical: 100 Marks lab examination for each paper\n• Project: Mandatory submission after passing minimum 2 papers'
      }
    ]
  },
  {
    fileName: 'm1-r5-solved-papers.pdf',
    title: 'M1-R5.1: Solved Question Papers (Past 5 Exam Cycles)',
    subtitle: 'Authentic NIELIT Answer Keys with Step-by-Step Explanations',
    sections: [
      {
        heading: '1. Exam Structure',
        text: '100 MCQs per cycle covering Computer Fundamentals, LibreOffice, Networking & Digital Payments with verified official answer keys.'
      }
    ]
  },
  {
    fileName: 'm2-r5-solved-papers.pdf',
    title: 'M2-R5.1: Web Design Solved Question Papers (Past 5 Cycles)',
    subtitle: 'HTML5, CSS3, JavaScript, Photoshop & Hosting Questions Solved',
    sections: [
      {
        heading: '1. Past Exam Solutions Summary',
        text: '100 MCQs per cycle covering HTML tags, CSS selectors, box model, JS events, and web publishing concepts.'
      }
    ]
  },
  {
    fileName: 'm3-r5-solved-papers.pdf',
    title: 'M3-R5.1: Python Programming Solved Question Papers (Past 5 Cycles)',
    subtitle: 'Complete 100 MCQs per cycle with Step-by-Step Code Output Analysis',
    sections: [
      {
        heading: '1. Past Exam Solutions Summary',
        text: 'High-frequency Python output questions, loop traces, list slice logic, recursion and NumPy array queries solved.'
      }
    ]
  },
  {
    fileName: 'm4-r5-solved-papers.pdf',
    title: 'M4-R5.1: IoT Solved Question Papers (Past 5 Exam Cycles)',
    subtitle: 'Internet of Things & Arduino Exam Questions with Full Explanations',
    sections: [
      {
        heading: '1. Past Exam Solutions Summary',
        text: 'Sensors, actuators, MQTT/CoAP protocols, Arduino pinout and soft skills questions with verified answer keys.'
      }
    ]
  },
  {
    fileName: 'm2-r5-practical-codes.pdf',
    title: 'M2-R5.1: Web Design Solved Practical Lab Programs',
    subtitle: '25+ Ready-to-Run HTML, CSS, JavaScript Lab Questions with Source Code',
    sections: [
      {
        heading: '1. Top Practical Problems Solved',
        text: '1. Student Registration Form with JS Validation\n2. Responsive Navigation Bar with CSS Flexbox\n3. Image Gallery with Hover Effects\n4. Dynamic Digital Clock in JavaScript\n5. CSS Grid Layout Design'
      }
    ]
  },
  {
    fileName: 'm3-r5-practical-codes.pdf',
    title: 'M3-R5.1: Python Programming Top 50 Solved Practical Programs',
    subtitle: 'Verified Python Scripts with Algorithm & Dry Run',
    sections: [
      {
        heading: '1. High Frequency Exam Practical Questions',
        text: '1. Check Prime / Armstrong / Palindrome Number\n2. Fibonacci Series Generation\n3. Matrix Addition & Multiplication using Nested Lists\n4. File Word / Line / Character Counter\n5. Recursive Factorial and GCD Programs'
      }
    ]
  },
  {
    fileName: 'm4-r5-practical-codes.pdf',
    title: 'M4-R5.1: IoT Arduino Lab Simulation Programs (.ino)',
    subtitle: '20+ Solved Arduino Uno Practical Sketches with Pinout Diagrams',
    sections: [
      {
        heading: '1. Arduino Lab Experiments',
        text: '1. LED Blinking & Traffic Light Controller\n2. DHT11 Temperature & Humidity Sensor Reading\n3. LDR Automatic Street Light Circuit\n4. Ultrasonic Distance Measurement with Buzzer Alert\n5. PIR Motion Detector System'
      }
    ]
  },
  {
    fileName: 'o-level-project-guide.pdf',
    title: 'NIELIT O Level Project Guidelines & Proforma Format',
    subtitle: 'Official Format for Project Completion Certificate & Submission',
    sections: [
      {
        heading: '1. Eligibility & Submission Rules',
        text: 'Candidates who have passed at least 2 theory modules (M1, M2, M3, or M4) are eligible to submit the project with a fees of Rs. 100/- directly to NIELIT with candidate certificate proforma.'
      }
    ]
  }
];

async function generatePdfs() {
  console.log('Generating PDF files in public/downloads/...');

  for (const item of pdfList) {
    const doc = await PDFDocument.create();
    const timesRoman = await doc.embedFont(StandardFonts.Helvetica);
    const timesBold = await doc.embedFont(StandardFonts.HelveticaBold);

    const page = doc.addPage([595.28, 841.89]); // A4 Size
    const { width, height } = page.getSize();

    // Top Header Banner
    page.drawRectangle({
      x: 0,
      y: height - 100,
      width: width,
      height: 100,
      color: rgb(0.098, 0.235, 0.722), // Royal Blue
    });

    // Brand / Portal Title
    page.drawText('Skilldotpy - NIELIT O Level & CCC Preparation Portal', {
      x: 40,
      y: height - 40,
      size: 11,
      font: timesBold,
      color: rgb(0.95, 0.95, 1.0),
    });

    // Document Title
    page.drawText(item.title, {
      x: 40,
      y: height - 65,
      size: 15,
      font: timesBold,
      color: rgb(1, 1, 1),
    });

    // Subtitle
    page.drawText(item.subtitle, {
      x: 40,
      y: height - 85,
      size: 10,
      font: timesRoman,
      color: rgb(0.85, 0.9, 1),
    });

    // Body content sections
    let currentY = height - 130;

    for (const sec of item.sections) {
      if (currentY < 120) break;

      // Section Heading Box
      page.drawRectangle({
        x: 40,
        y: currentY - 18,
        width: width - 80,
        height: 24,
        color: rgb(0.93, 0.95, 0.98),
      });

      page.drawText(sec.heading, {
        x: 48,
        y: currentY - 12,
        size: 12,
        font: timesBold,
        color: rgb(0.1, 0.15, 0.3),
      });

      currentY -= 35;

      const lines = sec.text.split('\n');
      for (const line of lines) {
        if (currentY < 80) break;

        page.drawText(line, {
          x: 48,
          y: currentY,
          size: 10,
          font: timesRoman,
          color: rgb(0.2, 0.25, 0.3),
        });
        currentY -= 18;
      }
      currentY -= 15;
    }

    // Footer
    page.drawLine({
      start: { x: 40, y: 50 },
      end: { x: width - 40, y: 50 },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.9),
    });

    page.drawText('Official Study Resource • Published by Skilldotpy (skilldotpy@gmail.com) • Free Distribution', {
      x: 40,
      y: 35,
      size: 9,
      font: timesRoman,
      color: rgb(0.5, 0.5, 0.6),
    });

    page.drawText('Page 1 of 1', {
      x: width - 90,
      y: 35,
      size: 9,
      font: timesBold,
      color: rgb(0.4, 0.4, 0.5),
    });

    const pdfBytes = await doc.save();
    const filePath = path.join(downloadsDir, item.fileName);
    fs.writeFileSync(filePath, pdfBytes);
    console.log(`✓ Generated ${item.fileName} (${pdfBytes.length} bytes)`);
  }

  console.log('All PDF files generated successfully!');
}

generatePdfs().catch(console.error);
