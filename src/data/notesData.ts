import { NoteCourse, NoteChapter, NoteTopic } from '../types/notes';

export const initialNoteCourses: NoteCourse[] = [
  {
    id: 'm1-r5',
    code: 'M1-R5.1 AND CCC',
    title: 'Information Technology Tools & Network Basics',
    hindiTitle: 'आईटी टूल्स एवं नेटवर्क बेसिक्स',
    description: 'Complete chapter-wise notes for NIELIT O Level M1-R5.1 and CCC examination.',
    badge: 'M1-R5.1 & CCC',
    color: 'blue',
    order: 1
  },
  {
    id: 'm2-r5',
    code: 'M2-R5.1',
    title: 'Web Designing & Publishing',
    hindiTitle: 'वेब डिजाइनिंग एवं पब्लिशिंग',
    description: 'HTML5, CSS3, JavaScript, Responsive Web Design & Angular/Bootstrap frameworks.',
    badge: 'M2-R5.1',
    color: 'emerald',
    order: 2
  },
  {
    id: 'm3-r5',
    code: 'M3-R5.1',
    title: 'Programming & Problem Solving Through Python',
    hindiTitle: 'पायथन प्रोग्रामिंग एवं प्रॉब्लम सॉल्विंग',
    description: 'Python syntax, algorithms, data structures (Lists, Tuples, Dictionaries), and NumPy.',
    badge: 'M3-R5.1',
    color: 'amber',
    order: 3
  },
  {
    id: 'm4-r5',
    code: 'M4-R5.1',
    title: 'Internet of Things and Its Applications',
    hindiTitle: 'इंटरनेट ऑफ थिंग्स (IoT)',
    description: 'IoT architecture, Arduino Uno programming, sensors, actuators, and protocols.',
    badge: 'M4-R5.1',
    color: 'purple',
    order: 4
  },
  {
    id: 'ccc',
    code: 'CCC NIELIT',
    title: 'Course on Computer Concepts (CCC)',
    hindiTitle: 'कंप्यूटर कॉन्सेप्ट्स कोर्स',
    description: 'All 9 modules summary notes, shortcut keys, and important exam concepts.',
    badge: 'CCC 2026',
    color: 'indigo',
    order: 5
  }
];

// Clean slate: Chapters and Topics start completely empty so you can build everything from scratch
export const initialNoteChapters: NoteChapter[] = [];

export const initialNoteTopics: NoteTopic[] = [];
