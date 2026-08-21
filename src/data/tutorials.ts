export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'App Tutorials' | 'Course Tutorials' | 'Study Tutorials' | 'Technical Tutorials';
  content: string; // Markdown content
}

export const tutorials: Tutorial[] = [
  {
    id: 'how-to-purchase',
    title: 'How to Purchase a Course in the Skilldotpy App',
    description: 'A step-by-step guide to enrolling and purchasing premium courses on the Skilldotpy Android app.',
    category: 'Course Tutorials',
    content: `
Purchasing a course on the Skilldotpy app is simple and secure. Follow these steps:

### Step 1: Open Skilldotpy App
Launch the Skilldotpy application on your Android device.

### Step 2: Login or Register
If you haven't already, create a free account or log in with your existing credentials.

### Step 3: Select the Course
Navigate to the "Courses" section and tap on the course you wish to purchase (e.g., O Level Complete Course).

### Step 4: Click Purchase / Enroll
Tap the prominent "Buy Now" or "Enroll" button on the course details screen.

### Step 5: Complete the Payment
Follow the on-screen instructions to complete your payment. We support various payment methods for your convenience.

### Step 6: Payment Confirmation
Once payment is successful, you will receive a confirmation message.

### Step 7: Access Your Course
Go to the "My Courses" tab to access your newly purchased content. You can now start learning!

*Note: If your course requires manual verification, it may take a few hours to activate. Please contact support if you face any issues.*
`
  },
  {
    id: 'how-to-install-apk',
    title: 'How to Install the Skilldotpy APK',
    description: 'Learn how to easily install the Skilldotpy Android app on your smartphone.',
    category: 'App Tutorials',
    content: `
Follow these simple steps to install the Skilldotpy Android app:

1. **Download the APK:** Click the "Download App" button on our website to download the latest \`.apk\` file.
2. **Open the downloaded APK:** Once downloaded, tap on the notification or find the file in your "Downloads" folder and tap to open it.
3. **Allow installation from unknown sources:** Android will prompt you that installation from unknown sources is not allowed. Tap "Settings" on the prompt, and toggle on "Allow from this source".
4. **Install:** Go back, and tap "Install".
5. **Open Skilldotpy:** Once installed, tap "Open" to launch the app.
6. **Register or log in:** Create a new account or log in to your existing one.
7. **Start Learning:** Explore our free resources, notes, and courses!
`
  }
];
