export interface FAQ {
  id: string;
  category: 'o-level' | 'ccc' | 'app' | 'youtube' | 'general';
  question: string;
  hindiQuestion?: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: 'o-level-pattern',
    category: 'o-level',
    question: 'What is the latest exam pattern of NIELIT O Level (R5.1)?',
    hindiQuestion: 'NIELIT O Level (R5.1) का नवीनतम परीक्षा पैटर्न क्या है?',
    answer: 'Under the revised R5.1 pattern, each of the 4 modules (M1-R5, M2-R5, M3-R5, M4-R5) consists of: 1) Online Theory CBT / OMR exam of 100 Marks (100 MCQs, 90 minutes, NO negative marking) and 2) Practical Lab Exam of 100 Marks (Online coding + Viva Voce, 50 minutes). You need at least 33% in Theory and 33% in Practical, with an overall combined aggregate of 50% in each module to qualify.'
  },
  {
    id: 'o-level-free-vs-app',
    category: 'app',
    question: 'What is the difference between Skilldotpy YouTube classes and the Android App?',
    hindiQuestion: 'Skilldotpy के YouTube और Android App में क्या अंतर है?',
    answer: 'Our YouTube channel offers free foundational lectures, chapter overviews, and exam marathon revision videos. The Skilldotpy Android App provides the complete structured learning system: full chapter-wise HD syllabus videos in exact sequential order, downloadable printable PDF notes, chapter tests, real CBT-timed online mock test series with detailed analytics, full practical code files, project guidance, and 1-on-1 direct doubt resolution with the teacher.'
  },
  {
    id: 'o-level-project-submission',
    category: 'o-level',
    question: 'When can I submit my NIELIT O Level Project, and how does Skilldotpy help?',
    hindiQuestion: 'ओ लेवल प्रोजेक्ट कब जमा करना होता है?',
    answer: 'You can submit your project after clearing at least any 2 theory modules. The project submission fee is ₹100 paid directly to NIELIT. Skilldotpy provides verified project source code, synopses in Python / Web Design / IoT, and proforma formats with guidance so your project is approved on the first submission.'
  },
  {
    id: 'm1-libreoffice-vs-msoffice',
    category: 'o-level',
    question: 'Is MS Office asked in NIELIT O Level M1-R5 or only LibreOffice?',
    hindiQuestion: 'क्या O Level M1-R5 में MS Office पूछा जाता है या केवल LibreOffice?',
    answer: 'NIELIT officially transitioned exclusively to LibreOffice (Writer, Calc, Impress) under the R5/R5.1 syllabus. Almost all word processing, spreadsheet, and presentation questions are based on LibreOffice menu paths and shortcut keys. Skilldotpy provides dedicated LibreOffice courses and shortcut charts.'
  },
  {
    id: 'o-level-negative-marking',
    category: 'o-level',
    question: 'Is there negative marking in the NIELIT O Level or CCC exams?',
    hindiQuestion: 'क्या O Level या CCC परीक्षा में नेगेटिव मार्किंग होती है?',
    answer: 'NO. There is absolutely NO negative marking in both NIELIT O Level theory exams and NIELIT CCC exams. You should attempt all 100 questions in the 90-minute time limit.'
  },
  {
    id: 'ccc-passing-criteria',
    category: 'ccc',
    question: 'How to score Grade S (85%+) in NIELIT CCC in 15 days?',
    hindiQuestion: 'ट्रिपल सी (CCC) में 15 दिनों में Grade S कैसे लाएं?',
    answer: 'To score Grade S in CCC: 1) Master all 9 chapters of the syllabus from our free video series, 2) Memorize the LibreOffice shortcut key chart, 3) Practice our 10 full-length CBT mock tests on the Skilldotpy app. Over 95% of students following this strategy clear CCC with top grades.'
  },
  {
    id: 'app-apk-safety',
    category: 'app',
    question: 'Is the Skilldotpy Android APK safe to install on my phone?',
    hindiQuestion: 'क्या Skilldotpy Android APK सुरक्षित है?',
    answer: 'Yes, 100% safe and verified. Our APK is built with standard Android security standards, contains no malware or unnecessary permissions, and is trusted by over 10,000+ students across India.'
  }
];
