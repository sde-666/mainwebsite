export interface QuizQuestion {
  id: string;
  module: 'm1' | 'm2' | 'm3' | 'm4' | 'ccc' | 'python';
  moduleLabel: string;
  question: string;
  hindiQuestion?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  // M1-R5 Questions
  {
    id: 'm1-1',
    module: 'm1',
    moduleLabel: 'M1-R5: IT Tools',
    question: 'In LibreOffice Writer, which shortcut key is used for Mail Merge Wizard?',
    hindiQuestion: 'लिब्रेऑफिस राइटर में मेल मर्ज विज़ार्ड के लिए कौन सी शॉर्टकट कुंजी का उपयोग किया जाता है?',
    options: ['Tools > Mail Merge Wizard', 'Ctrl + Shift + M', 'Alt + F12', 'F7'],
    correctIndex: 0,
    explanation: 'In LibreOffice Writer, the Mail Merge Wizard is accessed via the Tools menu > Mail Merge Wizard.'
  },
  {
    id: 'm1-2',
    module: 'm1',
    moduleLabel: 'M1-R5: IT Tools',
    question: 'What is the maximum zoom percentage available in LibreOffice Calc?',
    hindiQuestion: 'लिब्रेऑफिस कैल्क में अधिकतम ज़ूम प्रतिशत कितना होता है?',
    options: ['200%', '400%', '500%', '600%'],
    correctIndex: 1,
    explanation: 'LibreOffice Calc allows a maximum zoom level of 400% (minimum is 20%). In Writer it is 600%, and in Impress it is 3000%.'
  },
  {
    id: 'm1-3',
    module: 'm1',
    moduleLabel: 'M1-R5: IT Tools',
    question: 'Which of the following operates under the Reserve Bank of India (RBI) and NPCI for offline mobile banking without an internet connection?',
    hindiQuestion: 'इंटरनेट कनेक्शन के बिना ऑफलाइन मोबाइल बैंकिंग के लिए निम्नलिखित में से कौन सा कोड काम करता है?',
    options: ['*99# (USSD)', 'UPI 2.0', 'NEFT', 'IMPS'],
    correctIndex: 0,
    explanation: '*99# is an Unstructured Supplementary Service Data (USSD) based mobile banking service provided by NPCI for all GSM mobile users.'
  },
  {
    id: 'm1-4',
    module: 'm1',
    moduleLabel: 'M1-R5: IT Tools',
    question: 'In Linux operating system, which command is used to remove an empty directory?',
    hindiQuestion: 'लिनक्स ऑपरेटिंग सिस्टम में खाली डायरेक्टरी को हटाने के लिए किस कमांड का उपयोग किया जाता है?',
    options: ['rmdir', 'del', 'erase', 'rm -f'],
    correctIndex: 0,
    explanation: 'The rmdir command removes empty directories in Linux / UNIX.'
  },

  // M2-R5 Questions
  {
    id: 'm2-1',
    module: 'm2',
    moduleLabel: 'M2-R5: Web Design',
    question: 'Which HTML5 element is used to specify independent, self-contained content such as a blog post or news article?',
    hindiQuestion: 'ब्लॉग पोस्ट या समाचार लेख जैसी स्वतंत्र सामग्री निर्दिष्ट करने के लिए किस HTML5 तत्व का उपयोग किया जाता है?',
    options: ['<section>', '<article>', '<aside>', '<main>'],
    correctIndex: 1,
    explanation: '<article> tag in HTML5 specifies independent, self-contained content that can be distributed independently.'
  },
  {
    id: 'm2-2',
    module: 'm2',
    moduleLabel: 'M2-R5: Web Design',
    question: 'What is the correct CSS syntax to make all <p> elements bold with a font size of 16px?',
    hindiQuestion: 'सभी <p> तत्वों को बोल्ड और 16px फ़ॉन्ट आकार देने के लिए सही CSS सिंटैक्स क्या है?',
    options: ['p { font-weight: bold; font-size: 16px; }', 'p { text-style: bold; size: 16px; }', '<p style="bold; 16px">', 'p { font: bold 16px; }'],
    correctIndex: 0,
    explanation: 'font-weight: bold; and font-size: 16px; are the standard CSS property-value pairs.'
  },
  {
    id: 'm2-3',
    module: 'm2',
    moduleLabel: 'M2-R5: Web Design',
    question: 'Which JavaScript method is used to write directly into an HTML element with id="test"?',
    hindiQuestion: 'id="test" वाले HTML तत्व में सीधे लिखने के लिए किस जावास्क्रिप्ट विधि का उपयोग किया जाता है?',
    options: ['document.getElementById("test").innerHTML = "Hello";', 'document.getElement("test").value = "Hello";', '#test.text("Hello");', 'response.write("test", "Hello");'],
    correctIndex: 0,
    explanation: 'document.getElementById("test").innerHTML modifies the HTML contents of that matched element.'
  },

  // M3-R5 Questions
  {
    id: 'm3-1',
    module: 'm3',
    moduleLabel: 'M3-R5: Python',
    question: 'What will be the output of the Python expression: bool("False")?',
    hindiQuestion: 'पायथन एक्सप्रेशन bool("False") का आउटपुट क्या होगा?',
    options: ['False', 'True', 'Error', 'None'],
    correctIndex: 1,
    explanation: 'In Python, any non-empty string evaluates to True when passed to bool(). Only an empty string "" evaluates to False.'
  },
  {
    id: 'm3-2',
    module: 'm3',
    moduleLabel: 'M3-R5: Python',
    question: 'Which built-in Python module is specifically used for creating and manipulating multi-dimensional numerical arrays?',
    hindiQuestion: 'मल्टी-डायमेंशनल संख्यात्मक सरणियों के निर्माण और संचालन के लिए विशेष रूप से किस मॉड्यूल का उपयोग किया जाता है?',
    options: ['NumPy', 'Math', 'Random', 'Sys'],
    correctIndex: 0,
    explanation: 'NumPy is the fundamental package for scientific computing and multi-dimensional array operations in Python.'
  },
  {
    id: 'm3-3',
    module: 'm3',
    moduleLabel: 'M3-R5: Python',
    question: 'What is the output of print([i**2 for i in range(4)])?',
    hindiQuestion: 'print([i**2 for i in range(4)]) का आउटपुट क्या होगा?',
    options: ['[0, 1, 4, 9]', '[1, 4, 9, 16]', '[0, 2, 4, 6]', '[0, 1, 2, 3]'],
    correctIndex: 0,
    explanation: 'range(4) produces 0, 1, 2, 3. Squaring each value gives [0**2, 1**2, 2**2, 3**2] = [0, 1, 4, 9].'
  },

  // M4-R5 Questions
  {
    id: 'm4-1',
    module: 'm4',
    moduleLabel: 'M4-R5: IoT',
    question: 'In the MQTT protocol, which central entity is responsible for receiving all messages, filtering them, and publishing them to subscribed clients?',
    hindiQuestion: 'MQTT प्रोटोकॉल में, कौन सी केंद्रीय इकाई सभी संदेश प्राप्त करने और उन्हें सब्सक्राइबर्स को भेजने के लिए जिम्मेदार है?',
    options: ['Broker', 'Publisher', 'Subscriber', 'Gateway'],
    correctIndex: 0,
    explanation: 'The MQTT Broker acts as the central server distributing messages from publishers to subscribers based on topics.'
  },
  {
    id: 'm4-2',
    module: 'm4',
    moduleLabel: 'M4-R5: IoT',
    question: 'How many Analog input pins are available on an Arduino Uno board?',
    hindiQuestion: 'Arduino Uno बोर्ड पर कितने एनालॉग इनपुट पिन उपलब्ध हैं?',
    options: ['6 (A0 to A5)', '14 (0 to 13)', '8 (A0 to A7)', '2 (A0, A1)'],
    correctIndex: 0,
    explanation: 'Arduino Uno has 6 analog input pins labeled A0 through A5, each with 10-bit ADC resolution (0-1023).'
  },

  // CCC Questions
  {
    id: 'ccc-1',
    module: 'ccc',
    moduleLabel: 'NIELIT CCC',
    question: 'What is the full form of AEPS in digital financial services?',
    hindiQuestion: 'डिजिटल वित्तीय सेवाओं में AEPS का पूर्ण रूप क्या है?',
    options: ['Aadhaar Enabled Payment System', 'Automatic Electronic Payment Service', 'Aadhaar Electronic Privacy Standard', 'Advanced Electronic Payment Scheme'],
    correctIndex: 0,
    explanation: 'AEPS stands for Aadhaar Enabled Payment System, developed by NPCI to enable biometric-based banking.'
  },
  {
    id: 'ccc-2',
    module: 'ccc',
    moduleLabel: 'NIELIT CCC',
    question: 'Which shortcut key is used in LibreOffice Impress to start a slide show directly from the current slide?',
    hindiQuestion: 'लिब्रेऑफिस इम्प्रेस में वर्तमान स्लाइड से स्लाइड शो शुरू करने के लिए किस शॉर्टकट कुंजी का उपयोग किया जाता है?',
    options: ['Shift + F5', 'F5', 'Ctrl + F5', 'Alt + F5'],
    correctIndex: 0,
    explanation: 'F5 starts the presentation from the beginning, while Shift + F5 starts from the current active slide.'
  }
];
