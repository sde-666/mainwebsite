export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'Course Tutorials' | 'Study Tutorials' | 'Technical Tutorials';
  content: string; // Markdown content
}

export const tutorials: Tutorial[] = [
  {
    id: 'how-to-purchase',
    title: 'How to Enroll in a Course on Skilldotpy',
    description: 'A step-by-step guide to enrolling and purchasing paid masterclasses & video batches directly on the Skilldotpy website.',
    category: 'Course Tutorials',
    content: `
Enrolling in a course on the Skilldotpy web portal is fast, transparent, and secure. Follow these steps:

### Step 1: Browse Available Courses
Visit the [Paid Courses & Batches](/courses) section on the Skilldotpy website to view our latest NIELIT O Level, CCC, and Python batches.

### Step 2: Choose Your Desired Course
Click on any course card or click "View Batch Details" to review the curriculum, chapter notes, doubt-clearing sessions, and fee structure.

### Step 3: Click "Enroll Now"
Click the prominent "Enroll Now" or "Get Instant Access" button on the course details page.

### Step 4: Complete the Secure Checkout
Enter your name, email, and mobile number. Complete the payment securely via UPI (Google Pay, PhonePe, Paytm), Net Banking, Debit/Credit Cards, or Wallets powered by Razorpay.

### Step 5: Instant Enrollment & Access
Upon successful transaction, you receive instant access to batch resources, Telegram premium group links, video lectures, and PDF study material.

*Note: You will also receive an automated confirmation email with your enrollment ID and access links. For any questions, our support team is available via WhatsApp or email.*
`
  },
  {
    id: 'how-to-access-notes-mock-tests',
    title: 'How to Practice CBT Mock Tests & Download Notes',
    description: 'Learn how to attempt free online NIELIT O Level & CCC mock tests and access bilingual revision notes on Skilldotpy.',
    category: 'Study Tutorials',
    content: `
Skilldotpy provides free interactive CBT mock tests and chapter-wise study notes for NIELIT exams. Follow these steps:

### Step 1: Select Your Exam Track
Navigate to either the [NIELIT O Level Hub](/o-level) or [CCC Exam Hub](/ccc) from the top navigation bar.

### Step 2: Choose Your Subject / Module
Select your specific module (e.g., M1-R5 IT Tools, M2-R5 Web Designing, M3-R5 Python, or M4-R5 IoT).

### Step 3: Launch Mock Tests
Click on the "Mock Test" section to experience realistic exam simulations featuring real-time timer countdowns, negative-marking toggles, and instant bilingual score reports.

### Step 4: Download PDF Notes & Syllabus
Scroll to the "Chapter Notes & Syllabus" section to access or download comprehensive revision guides and question banks for offline study.
`
  }
];

