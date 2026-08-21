import { PracticalTestSet } from '../types/practical';

export const initialPracticalTests: PracticalTestSet[] = [
  // ==========================================
  // 1. PYTHON PROGRAMMING (PR3 B2 / M3-R5.1)
  // ==========================================
  {
    id: 'pr3-python-set-1',
    module: 'M3-R5',
    paperCode: 'PR3 B2',
    title: 'Python Programming Practical Lab Exam Set 1',
    hindiTitle: 'पायथन प्रोग्रामिंग प्रैक्टिकल लैब परीक्षा सेट 1',
    description: 'Official model practical exam for M3-R5.1 covering algorithms, sequence data types, functions, file handling, and NumPy matrix operations.',
    durationMinutes: 50,
    totalMarks: 100,
    requiredQuestionsCount: 2,
    codingMarksPerQuestion: 40,
    vivaMarks: 20,
    instructions: [
      'The practical examination carries 100 marks (80 Marks for 2 Coding Questions + 20 Marks for Viva Voce).',
      'You are provided with 3 practical coding questions. You must solve and execute ANY TWO questions (40 marks each).',
      'Use the Run button to test your Python script and inspect console output and input prompts.',
      'After completing the coding questions, proceed to the Viva Voce section to answer 4 conceptual questions.',
      'Grading is done via AI based on standard NIELIT evaluation rubrics.'
    ],
    isFeatured: true,
    questions: [
      {
        id: 'q-py-1',
        number: 1,
        title: 'Write a Python program to accept the radius of a circle from the user and compute the area and circumference.',
        description: `Write an interactive Python program that:
1. Prompts the user to enter the radius of a circle (float/integer).
2. Calculates the Area of the circle using the formula: Area = π * r²
3. Calculates the Circumference of the circle using: Circumference = 2 * π * r
4. Prints both the calculated Area and Circumference formatted to 2 decimal places.
5. Handles invalid negative radius by displaying an appropriate error message.`,
        marks: 40,
        language: 'python',
        starterCode: {
          'main.py': ''
        }
      },
      {
        id: 'q-py-2',
        number: 2,
        title: 'Write a Python program to generate Fibonacci series up to N terms and find the sum of all even terms.',
        description: `Write a Python program that:
1. Prompts the user to enter the number of terms N (where N > 0).
2. Generates the first N terms of the Fibonacci sequence (0, 1, 1, 2, 3, 5, 8, 13, ...).
3. Displays the full generated sequence.
4. Identifies all even Fibonacci numbers in the sequence and prints their sum.`,
        marks: 40,
        language: 'python',
        starterCode: {
          'main.py': ''
        }
      },
      {
        id: 'q-py-3',
        number: 3,
        title: 'Write a Python program using NumPy to create two 3x3 matrices, perform Matrix Addition, Multiplication, and find the Transpose.',
        description: `Write a Python script utilizing the NumPy library that:
1. Creates two 3x3 matrices with sample numeric values.
2. Performs and displays Matrix Addition (A + B).
3. Performs and displays Matrix Multiplication (A @ B or np.dot(A, B)).
4. Calculates and prints the Transpose of Matrix A (A.T).
5. Displays the shape, data type, and diagonal elements of Matrix A.`,
        marks: 40,
        language: 'python',
        starterCode: {
          'main.py': ''
        }
      }
    ],
    vivaQuestions: [
      {
        id: 'v-py-1',
        question: 'What is the primary difference between a Python List and a Tuple in terms of mutability and memory?',
        hindiQuestion: 'म्यूटेबिलिटी और मेमोरी के संदर्भ में पायथन लिस्ट और टपल के बीच मुख्य अंतर क्या है?',
        marks: 5,
        modelAnswer: 'Lists are mutable (elements can be modified, added, or removed after creation) and defined with square brackets []. Tuples are immutable (cannot be altered once defined), defined with parentheses (), and are faster with lower memory footprint.',
        keyPoints: ['List is mutable', 'Tuple is immutable', 'Memory efficiency', 'Syntax difference [] vs ()']
      },
      {
        id: 'v-py-2',
        question: 'Explain the role of the __name__ == "__main__" idiom in Python scripts.',
        hindiQuestion: 'पायथन स्क्रिप्ट में __name__ == "__main__" का क्या उपयोग है?',
        marks: 5,
        modelAnswer: 'When a Python script is executed directly from the terminal, __name__ is automatically assigned "__main__", executing the code block under the if statement. If the script is imported as a module in another file, __name__ equals the module name, preventing unintended top-level execution.',
        keyPoints: ['Direct execution vs module import', 'Controls code execution', '__name__ variable value']
      },
      {
        id: 'v-py-3',
        question: 'Why are NumPy arrays preferred over built-in Python lists for numerical computations in M3-R5?',
        hindiQuestion: 'संख्यात्मक गणनाओं के लिए पायथन लिस्ट की तुलना में NumPy ऐरे को प्राथमिकता क्यों दी जाती है?',
        marks: 5,
        modelAnswer: 'NumPy arrays store elements in contiguous homogeneous memory blocks, support vectorized operations written in C/Fortran without Python loop overhead, consume significantly less memory, and provide built-in linear algebra and matrix broadcasting functions.',
        keyPoints: ['Contiguous memory allocation', 'Homogeneous data types', 'Vectorized execution', 'High performance']
      },
      {
        id: 'v-py-4',
        question: 'How do you handle exceptions in Python using try, except, else, and finally clauses?',
        hindiQuestion: 'पायथन में try, except, else और finally क्लॉज़ का उपयोग करके अपवाद (Exception) को कैसे संभाला जाता है?',
        marks: 5,
        modelAnswer: 'The try block contains code that might raise an exception. The except block catches and handles specific exceptions. The optional else block executes only if no exception occurs in try. The finally block always executes regardless of exceptions, typically used for cleanup (e.g. closing files).',
        keyPoints: ['try block runs code', 'except catches errors', 'else runs on success', 'finally always executes']
      }
    ]
  },

  // ==========================================
  // 2. WEB DESIGNING AND PUBLISHING (PR2 B1 / M2-R5.1)
  // ==========================================
  {
    id: 'pr2-web-set-1',
    module: 'M2-R5',
    paperCode: 'PR2 B1',
    title: 'Web Designing & Publishing Practical Lab Exam Set 1',
    hindiTitle: 'वेब डिजाइनिंग एवं पब्लिशिंग प्रैक्टिकल लैब परीक्षा सेट 1',
    description: 'Official practical exam for M2-R5.1 covering semantic HTML5 forms, modern CSS3 layout styling, responsive design, and JavaScript form validation.',
    durationMinutes: 50,
    totalMarks: 100,
    requiredQuestionsCount: 2,
    codingMarksPerQuestion: 40,
    vivaMarks: 20,
    instructions: [
      'The practical examination carries 100 marks (80 Marks for 2 Coding Questions + 20 Marks for Viva Voce).',
      'You are provided with 3 web design tasks. Select and code ANY TWO tasks.',
      'Edit HTML, CSS, and JavaScript in the editor tabs and check the real-time Live Preview on the right.',
      'Check the browser Console tab to verify JavaScript logs and validation handlers.',
      'Proceed to Viva Voce upon completing the coding part.'
    ],
    isFeatured: true,
    questions: [
      {
        id: 'q-web-1',
        number: 1,
        title: 'Create a responsive Student Registration Form that collects First Name, Last Name, Email, User ID, Password, and Confirm Password with CSS styling and validation.',
        description: `Design a complete web page with HTML5, CSS3, and JavaScript that:
1. Contains a clean registration form with fields: First Name, Last Name, Email Address, User ID, Password, and Confirm Password.
2. Applies modern CSS styling: card container, rounded borders, focus outline effects, and a prominent Submit button.
3. Implements JavaScript validation on submit:
   - All fields must be non-empty.
   - Email format must be valid (contains @ and .).
   - Password must be at least 6 characters long.
   - Password and Confirm Password fields must match.
4. Shows a success banner with user details when valid, or error alerts under respective inputs if invalid.`,
        marks: 40,
        language: 'html',
        starterCode: {
          'index.html': '',
          'styles.css': '',
          'script.js': ''
        }
      },
      {
        id: 'q-web-2',
        number: 2,
        title: 'Create an interactive Live Digital Clock and Stopwatch web widget with Start, Stop, and Reset buttons using JavaScript DOM.',
        description: `Create a clean web interface that includes:
1. A live real-time Digital Clock that automatically updates hours, minutes, seconds, and AM/PM every second.
2. A separate interactive Stopwatch with displays for Minutes, Seconds, and Milliseconds.
3. Three functional control buttons for the Stopwatch: "Start", "Pause / Stop", and "Reset".
4. Styled cards using CSS Flexbox with modern colors and smooth hover animations.`,
        marks: 40,
        language: 'html',
        starterCode: {
          'index.html': '',
          'styles.css': '',
          'script.js': ''
        }
      },
      {
        id: 'q-web-3',
        number: 3,
        title: 'Design a responsive 3-column Course Catalog grid using CSS Grid and Flexbox with product images, badges, and pricing cards.',
        description: `Create a clean course showcase web page that:
1. Implements a responsive header with navigation items.
2. Displays a 3-column CSS Grid layout of course cards (M1, M2, M3, M4).
3. Each card contains a category badge, course title, feature list with checkmarks, price, and an Enroll button.
4. Uses CSS Media Queries to adapt gracefully: 3 columns on desktop, 2 columns on tablet, and 1 column on mobile.`,
        marks: 40,
        language: 'html',
        starterCode: {
          'index.html': '',
          'styles.css': '',
          'script.js': ''
        }
      }
    ],
    vivaQuestions: [
      {
        id: 'v-web-1',
        question: 'What is the structural difference between block-level elements (e.g. <div>) and inline elements (e.g. <span>)?',
        hindiQuestion: 'ब्लॉक-लेवल तत्वों और इनलाइन तत्वों के बीच संरचनात्मक अंतर क्या है?',
        marks: 5,
        modelAnswer: 'Block-level elements always start on a new line and take up the full available width of their parent container (e.g., <div>, <p>, <h1>). Inline elements only take up as much width as necessary for their content and do not cause a line break (e.g., <span>, <a>, <strong>).',
        keyPoints: ['Line breaks', 'Width consumption', 'Examples (div vs span)']
      },
      {
        id: 'v-web-2',
        question: 'Explain the four layers of the CSS Box Model in order from innermost to outermost.',
        hindiQuestion: 'CSS बॉक्स मॉडल की चार परतों को भीतर से बाहर के क्रम में समझाइए।',
        marks: 5,
        modelAnswer: 'The CSS Box Model consists of: 1. Content (the actual text or image), 2. Padding (clears area around content, inside border), 3. Border (a border surrounding padding and content), and 4. Margin (clears area outside border, separating from other elements).',
        keyPoints: ['Content', 'Padding', 'Border', 'Margin']
      },
      {
        id: 'v-web-3',
        question: 'What are the main differences between var, let, and const in modern JavaScript (ES6)?',
        hindiQuestion: 'जावास्क्रिप्ट में var, let और const के बीच क्या मुख्य अंतर हैं?',
        marks: 5,
        modelAnswer: 'var is function-scoped and can be re-declared and updated (hoisted with undefined). let is block-scoped, can be updated but not re-declared in the same scope. const is block-scoped and cannot be reassigned or re-declared after initialization.',
        keyPoints: ['Scope differences (function vs block)', 'Re-declaration rules', 'Re-assignment rules']
      },
      {
        id: 'v-web-4',
        question: 'Why is responsive web design important and how does the viewport meta tag help?',
        hindiQuestion: 'रिस्पॉन्सिव वेब डिज़ाइन क्यों महत्वपूर्ण है और व्यूपोर्ट मेटा टैग कैसे मदद करता है?',
        marks: 5,
        modelAnswer: 'Responsive web design ensures that a web page renders cleanly across all device screen sizes (mobiles, tablets, laptops). The <meta name="viewport" content="width=device-width, initial-scale=1.0"> tag tells the mobile browser to set the viewport width to the device width rather than assuming a default desktop width.',
        keyPoints: ['Multi-device compatibility', 'Viewport meta tag role', 'Initial scale 1.0']
      }
    ]
  },

  // ==========================================
  // 3. IOT & ARDUINO APPLICATIONS (PR4 B3 / M4-R5.1)
  // ==========================================
  {
    id: 'pr4-iot-set-1',
    module: 'M4-R5',
    paperCode: 'PR4 B3',
    title: 'Internet of Things (IoT) & Arduino Lab Exam Set 1',
    hindiTitle: 'इंटरनेट ऑफ थिंग्स (IoT) एवं आर्डुइनो प्रैक्टिकल लैब परीक्षा सेट 1',
    description: 'Official model practical exam for M4-R5.1 covering Arduino Uno microcontrollers, GPIO digital/analog interfacing, LED blinking sequences, and sensor automation.',
    durationMinutes: 50,
    totalMarks: 100,
    requiredQuestionsCount: 2,
    codingMarksPerQuestion: 40,
    vivaMarks: 20,
    instructions: [
      'The practical examination carries 100 marks (80 Marks for 2 Coding Questions + 20 Marks for Viva Voce).',
      'Select and implement ANY TWO Arduino IoT programming tasks (40 marks each).',
      'Use the Arduino C++ code editor with standard setup() and loop() functions.',
      'Use the interactive board visualizer / Wokwi simulation on the right to test circuit behavior, pin states, and Serial monitor logs.',
      'Proceed to Viva Voce once your code is tested.'
    ],
    isFeatured: true,
    questions: [
      {
        id: 'q-iot-1',
        number: 1,
        title: 'Write an Arduino program to blink an LED connected to digital pin 13 with a 1-second interval, and control the blink sequence with a Push Button connected to pin 2.',
        description: `Write a complete Arduino C++ sketch that:
1. Configures Digital Pin 13 as OUTPUT for the LED.
2. Configures Digital Pin 2 as INPUT_PULLUP for the Push Button.
3. Initializes Serial communication at 9600 baud rate in setup().
4. In loop():
   - When the button is pressed (LOW), blink the LED at 500ms intervals and print "Button Pressed: Fast Blinking" to Serial Monitor.
   - When the button is released (HIGH), blink the LED at 1500ms intervals and print "Normal Mode: Slow Blinking" to Serial Monitor.`,
        marks: 40,
        language: 'arduino',
        starterCode: {
          'sketch.ino': '',
          'diagram.json': `{
  "version": 1,
  "author": "Mr. Aditya Pathak",
  "editor": "wokwi",
  "parts": [
    { "type": "wokwi-arduino-uno", "id": "uno", "top": 0, "left": 0, "attrs": {} },
    { "type": "wokwi-led", "id": "led1", "top": -80, "left": 120, "attrs": { "color": "red" } },
    { "type": "wokwi-pushbutton", "id": "btn1", "top": 120, "left": -80, "attrs": { "color": "green" } }
  ],
  "connections": [
    [ "uno:13", "led1:A", "green", [ "v0" ] ],
    [ "uno:GND.1", "led1:C", "black", [ "v0" ] ],
    [ "uno:2", "btn1:2.1", "blue", [ "v0" ] ],
    [ "uno:GND.2", "btn1:1.1", "black", [ "v0" ] ]
  ]
}`
        }
      },
      {
        id: 'q-iot-2',
        number: 2,
        title: 'Design an Automatic Street Light Controller using an LDR Sensor (Analog Pin A0) and Arduino Uno to automatically turn ON an LED in dark conditions.',
        description: `Write an Arduino program that:
1. Connects an LDR (Light Dependent Resistor) sensor circuit to Analog Pin A0.
2. Connects a Street Light indicator LED to Digital Pin 10.
3. In loop():
   - Reads the analog light level using analogRead(A0) (values from 0 to 1023).
   - Prints the raw sensor value and status to Serial Monitor every 1 second.
   - If sensor value is below a threshold (e.g. < 400, indicating darkness), turns the LED ON and prints "NIGHT: Street Light ON".
   - If sensor value is above threshold (>= 400, indicating daylight), turns the LED OFF and prints "DAYLIGHT: Street Light OFF".`,
        marks: 40,
        language: 'arduino',
        starterCode: {
          'sketch.ino': '',
          'diagram.json': `{
  "version": 1,
  "author": "Mr. Aditya Pathak",
  "editor": "wokwi",
  "parts": [
    { "type": "wokwi-arduino-uno", "id": "uno", "top": 0, "left": 0, "attrs": {} },
    { "type": "wokwi-led", "id": "led1", "top": -70, "left": 110, "attrs": { "color": "yellow" } }
  ],
  "connections": [
    [ "uno:10", "led1:A", "yellow", [ "v0" ] ],
    [ "uno:GND.1", "led1:C", "black", [ "v0" ] ]
  ]
}`
        }
      },
      {
        id: 'q-iot-3',
        number: 3,
        title: 'Implement a 3-way Traffic Light Controller on Arduino Uno using Red (Pin 12), Yellow (Pin 11), and Green (Pin 10) LEDs with exact timed intervals.',
        description: `Design an Arduino sketch to simulate a realistic Traffic Light intersection:
1. Connect Red LED to Pin 12, Yellow LED to Pin 11, Green LED to Pin 10.
2. Cycle through the standard sequence:
   - Green ON for 5 seconds (Red & Yellow OFF) -> Print "GREEN LIGHT: GO".
   - Yellow ON for 2 seconds (Red & Green OFF) -> Print "YELLOW LIGHT: READY / CAUTION".
   - Red ON for 5 seconds (Yellow & Green OFF) -> Print "RED LIGHT: STOP".
3. Displays the current state and countdown time to Serial Monitor.`,
        marks: 40,
        language: 'arduino',
        starterCode: {
          'sketch.ino': '',
          'diagram.json': `{
  "version": 1,
  "author": "Mr. Aditya Pathak",
  "editor": "wokwi",
  "parts": [
    { "type": "wokwi-arduino-uno", "id": "uno", "top": 0, "left": 0, "attrs": {} },
    { "type": "wokwi-led", "id": "ledRed", "top": -90, "left": 130, "attrs": { "color": "red" } },
    { "type": "wokwi-led", "id": "ledYellow", "top": -50, "left": 130, "attrs": { "color": "yellow" } },
    { "type": "wokwi-led", "id": "ledGreen", "top": -10, "left": 130, "attrs": { "color": "green" } }
  ],
  "connections": [
    [ "uno:12", "ledRed:A", "red", [ "v0" ] ],
    [ "uno:11", "ledYellow:A", "yellow", [ "v0" ] ],
    [ "uno:10", "ledGreen:A", "green", [ "v0" ] ],
    [ "uno:GND.1", "ledRed:C", "black", [ "v0" ] ],
    [ "uno:GND.1", "ledYellow:C", "black", [ "v0" ] ],
    [ "uno:GND.1", "ledGreen:C", "black", [ "v0" ] ]
  ]
}`
        }
      }
    ],
    vivaQuestions: [
      {
        id: 'v-iot-1',
        question: 'What is the fundamental difference between the setup() and loop() functions in an Arduino sketch?',
        hindiQuestion: 'आर्डुइनो स्केच में setup() और loop() फ़ंक्शन के बीच मूलभूत अंतर क्या है?',
        marks: 5,
        modelAnswer: 'setup() is executed only once when the Arduino is powered on or reset, used for pin configurations (pinMode) and initializing communications (Serial.begin). loop() runs continuously in an infinite cycle after setup() finishes, containing the main program logic.',
        keyPoints: ['setup() runs once', 'loop() executes continuously', 'Initialization vs main logic']
      },
      {
        id: 'v-iot-2',
        question: 'What is the difference between Analog and Digital pins on an Arduino Uno board?',
        hindiQuestion: 'आर्डुइनो यूनो बोर्ड पर एनालॉग और डिजिटल पिन में क्या अंतर होता है?',
        marks: 5,
        modelAnswer: 'Digital pins (0-13) read or output binary discrete signals (HIGH 5V or LOW 0V). Analog pins (A0-A5) connect to a 10-bit Analog-to-Digital Converter (ADC) capable of reading continuous voltage levels between 0V and 5V, converted into numeric integer values from 0 to 1023.',
        keyPoints: ['Digital is binary 0/1', 'Analog is continuous 0-1023 (10-bit ADC)', 'Pin naming']
      },
      {
        id: 'v-iot-3',
        question: 'What is MQTT protocol and why is it preferred over HTTP for IoT sensor networks?',
        hindiQuestion: 'MQTT प्रोटोकॉल क्या है और IoT सेंसर नेटवर्क के लिए इसे HTTP से बेहतर क्यों माना जाता है?',
        marks: 5,
        modelAnswer: 'MQTT (Message Queuing Telemetry Transport) is a lightweight publish/subscribe messaging protocol designed specifically for resource-constrained devices and low-bandwidth networks. Compared to HTTP, MQTT has tiny header overhead (2 bytes vs hundreds), lower power consumption, and real-time push capabilities.',
        keyPoints: ['Publish/Subscribe model', 'Lightweight low header overhead', 'Ideal for low power & bandwidth']
      },
      {
        id: 'v-iot-4',
        question: 'What is the functional difference between Sensors and Actuators in an IoT ecosystem?',
        hindiQuestion: 'IoT इकोसिस्टम में सेंसर और एक्ट्यूएटर के बीच कार्यात्मक अंतर क्या है?',
        marks: 5,
        modelAnswer: 'Sensors are input devices that detect physical phenomena from the environment (e.g. temperature, light, motion) and convert them into electrical signals. Actuators are output devices that take electrical control signals from the controller and perform physical actions (e.g. motors turning, relays switching, LEDs glowing).',
        keyPoints: ['Sensors = Input / Measurement', 'Actuators = Output / Physical action', 'Examples of both']
      }
    ]
  },

  // ==========================================
  // 4. IT TOOLS & NETWORK BASICS (PR1 B1 / M1-R5.1)
  // ==========================================
  {
    id: 'pr1-it-tools-set-1',
    module: 'M1-R5',
    paperCode: 'PR1 B1',
    title: 'IT Tools & Network Basics Practical Lab Exam Set 1',
    hindiTitle: 'आईटी टूल्स एवं नेटवर्क बेसिक्स प्रैक्टिकल लैब परीक्षा सेट 1',
    description: 'Official model practical exam for M1-R5.1 covering LibreOffice Writer document design, Calc spreadsheet formulas, and Linux terminal scripts.',
    durationMinutes: 50,
    totalMarks: 100,
    requiredQuestionsCount: 2,
    codingMarksPerQuestion: 40,
    vivaMarks: 20,
    instructions: [
      'The practical examination carries 100 marks (80 Marks for 2 Coding Questions + 20 Marks for Viva Voce).',
      'Solve and document ANY TWO practical tasks (40 marks each).',
      'Type your solution or formula script in the editor.',
      'Proceed to Viva Voce once your answers are finalized.'
    ],
    isFeatured: true,
    questions: [
      {
        id: 'q-it-1',
        number: 1,
        title: 'Design a Salary Slip Generator in LibreOffice Calc with formulas for HRA (20%), DA (15%), PF (12%), Gross Salary, and Net Payable Salary.',
        description: `Write a calculation script / spreadsheet structure that:
1. Takes Employee Name, Basic Salary as input.
2. Computes HRA = Basic * 20%
3. Computes DA = Basic * 15%
4. Computes Gross Salary = Basic + HRA + DA
5. Computes PF Deduction = Basic * 12%
6. Computes Net Salary = Gross Salary - PF Deduction
7. Formats the output with currency format and displays the breakdown.`,
        marks: 40,
        language: 'general',
        starterCode: {
          'solution.txt': ''
        }
      },
      {
        id: 'q-it-2',
        number: 2,
        title: 'Write Linux Terminal bash commands to create a student directory structure, set permissions (chmod), and search files using grep.',
        description: `Write shell commands to accomplish the following system tasks:
1. Create a directory named "NIELIT_2026" with subdirectories "M1", "M2", "M3", "M4".
2. Create a file "notes.txt" inside "M1" containing the text "LibreOffice Writer & Calc".
3. Change permission of "notes.txt" so only the owner can read, write, and execute (chmod 700).
4. Use grep to find all lines containing the word "Calc" inside "notes.txt".`,
        marks: 40,
        language: 'general',
        starterCode: {
          'solution.sh': ''
        }
      },
      {
        id: 'q-it-3',
        number: 3,
        title: 'Explain step-by-step procedure to perform Mail Merge in LibreOffice Writer to dispatch interview call letters to 50 candidates.',
        description: `Document the exact step-by-step procedure in LibreOffice Writer to:
1. Prepare the Master Document (Interview Call Letter template).
2. Prepare or link a Data Source (Spreadsheet list with Name, Address, Date).
3. Insert Mail Merge Fields into document.
4. Preview merged letters and generate final personalized print documents.`,
        marks: 40,
        language: 'general',
        starterCode: {
          'mail_merge_steps.txt': ''
        }
      }
    ],
    vivaQuestions: [
      {
        id: 'v-it-1',
        question: 'What is the difference between IPv4 and IPv6 addressing schemes in computer networks?',
        hindiQuestion: 'कंप्यूटर नेटवर्क में IPv4 और IPv6 एड्रेसिंग स्कीम में क्या अंतर है?',
        marks: 5,
        modelAnswer: 'IPv4 uses a 32-bit address represented in decimal notation (e.g. 192.168.1.1) supporting ~4.3 billion unique IP addresses. IPv6 uses a 128-bit hexadecimal address (e.g. 2001:0db8::) providing an almost limitless address space and built-in IPsec security.',
        keyPoints: ['32-bit vs 128-bit', 'Decimal vs Hexadecimal', 'Address exhaustion solution']
      },
      {
        id: 'v-it-2',
        question: 'What is the role and importance of a Digital Signature in e-Governance and online transactions?',
        hindiQuestion: 'ई-गवर्नेंस और ऑनलाइन लेनदेन में डिजिटल हस्ताक्षर (Digital Signature) की क्या भूमिका और महत्व है?',
        marks: 5,
        modelAnswer: 'A Digital Signature uses asymmetric cryptography (public-private key pair) to authenticate the identity of the sender, ensure document integrity (tamper-proofing), and provide non-repudiation (sender cannot deny signing).',
        keyPoints: ['Authentication', 'Integrity', 'Non-repudiation', 'Asymmetric encryption']
      },
      {
        id: 'v-it-3',
        question: 'What is the difference between Open Source software (e.g. LibreOffice, Linux) and Proprietary software (e.g. MS Office, Windows)?',
        hindiQuestion: 'ओपन सोर्स सॉफ्टवेयर और प्रोप्रायटरी सॉफ्टवेयर में क्या अंतर है?',
        marks: 5,
        modelAnswer: 'Open Source software provides publicly accessible source code that anyone can inspect, modify, and distribute freely (e.g. Linux, LibreOffice). Proprietary software is closed-source, owned by a commercial vendor, and requires purchasing user licenses (e.g. Microsoft Windows).',
        keyPoints: ['Source code accessibility', 'Licensing cost', 'Community development vs vendor lock-in']
      },
      {
        id: 'v-it-4',
        question: 'What is Phishing attack and what precautions should internet users take to protect themselves?',
        hindiQuestion: 'फ़िशिंग हमला क्या है और इंटरनेट उपयोगकर्ताओं को इससे बचने के लिए क्या सावधानियां बरतनी चाहिए?',
        marks: 5,
        modelAnswer: 'Phishing is a fraudulent cyber-attack where attackers impersonate reputable organizations (banks, government portals) via deceptive emails/SMS to steal sensitive credentials like passwords, OTPs, or credit card numbers. Precautions include verifying URL domains (HTTPS), never sharing OTPs/passwords, and using two-factor authentication.',
        keyPoints: ['Social engineering / deceptive links', 'Credential theft', 'Precautions (HTTPS, 2FA, OTP confidentiality)']
      }
    ]
  }
];
