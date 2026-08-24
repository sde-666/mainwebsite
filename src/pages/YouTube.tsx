import { 
  Youtube, 
  PlayCircle, 
  ExternalLink, 
  Sparkles, 
  Award, 
  Smartphone,
  CheckCircle2,
  Users
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { siteConfig } from '../data/config';
import { Link } from 'react-router-dom';

export function YouTube() {
  const playlists = [
    {
      id: 'o-level-m3-python',
      title: 'NIELIT O Level M3-R5: Python Programming Full Free Course',
      hindiTitle: 'ओ लेवल पायथन प्रोग्रामिंग कम्पलीट फ्री वीडियो क्लासेस',
      videosCount: '45+ Videos',
      description: 'Complete syllabus videos covering algorithms, syntax, loops, lists, functions, recursion, file handling, and NumPy from scratch in simple Hindi.',
      badge: 'Flagship Playlist',
      badgeColor: 'bg-amber-100 text-amber-800',
      url: 'https://youtube.com/@skilldotpy'
    },
    {
      id: 'o-level-m1-it-tools',
      title: 'NIELIT O Level M1-R5: IT Tools & LibreOffice 7 Complete Batch',
      hindiTitle: 'M1-R5 आईटी टूल्स एवं लिब्रेऑफिस कम्पलीट क्लासेज',
      videosCount: '35+ Videos',
      description: 'Master Computer Fundamentals, Linux commands, LibreOffice Writer (Mail Merge), Calc (Formulas), Impress, and Cyber Security.',
      badge: 'High Scoring',
      badgeColor: 'bg-blue-100 text-blue-800',
      url: 'https://youtube.com/@skilldotpy'
    },
    {
      id: 'o-level-m2-web-design',
      title: 'NIELIT O Level M2-R5: Web Designing & Publishing (HTML5, CSS3, JS)',
      hindiTitle: 'M2-R5 वेब डिजाइनिंग एवं पब्लिशिंग प्रैक्टिकल क्लासेस',
      videosCount: '40+ Videos',
      description: 'Practical coding tutorials for HTML5 semantic tags, CSS Flexbox/Grid, W3.CSS, and JavaScript form validation & DOM events.',
      badge: 'Practical Focused',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      url: 'https://youtube.com/@skilldotpy'
    },
    {
      id: 'o-level-m4-iot',
      title: 'NIELIT O Level M4-R5: Internet of Things (IoT) & Arduino Uno',
      hindiTitle: 'M4-R5 इंटरनेट ऑफ थिंग्स एवं आर्डुइनो सर्किट्स',
      videosCount: '30+ Videos',
      description: 'Learn IoT architecture, Arduino Uno pinout, sensor interfacing (DHT11, LDR, Ultrasonic), MQTT protocols, and soft skills.',
      badge: 'Hardware & Code',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      url: 'https://youtube.com/@skilldotpy'
    },
    {
      id: 'ccc-master-playlist',
      title: 'NIELIT CCC Target Grade S Complete Video Series (All 9 Chapters)',
      hindiTitle: 'ट्रिपल सी (CCC) 15 दिन टारगेट मास्टर वीडियो सीरीज',
      videosCount: '25+ Videos',
      description: 'Complete 80-hour syllabus explanation, top 500 repeated MCQs, and LibreOffice shortcut tricks to score Grade S.',
      badge: 'Grade S Special',
      badgeColor: 'bg-rose-100 text-rose-800',
      url: 'https://youtube.com/@skilldotpy'
    },
    {
      id: 'python-general-course',
      title: 'Python Programming for Beginners (Independent Course)',
      hindiTitle: 'पायथन प्रोग्रामिंग शुरुआती छात्रों के लिए',
      videosCount: '50+ Videos',
      description: 'Learn Python coding from zero to advanced logic building, data structures, and mini-projects for school and college students.',
      badge: 'Coding Skills',
      badgeColor: 'bg-purple-100 text-purple-800',
      url: 'https://youtube.com/@skilldotpy'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <SEO
        title="Free YouTube Classes"
        description="Watch free educational video lectures on the Skilldotpy YouTube channel: NIELIT O Level 4 papers, CCC playlists & Python programming classes."
        keywords={[
          'Skilldotpy YouTube',
          'Skilldotpy YouTube channel',
          'NIELIT O level video lecture in Hindi',
          'O level Python YouTube class free',
          'CCC marathon class YouTube',
          'Aditya Sir Skilldotpy video lectures'
        ]}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'YouTube Video Library', url: '/youtube' }
        ]}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Header */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
              <Youtube className="w-4 h-4 text-white" /> Official YouTube Channel: @skilldotpy
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Free Video Lectures & Exam Marathons
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-xl leading-relaxed">
              Watch detailed conceptual classes, previous year paper solutions, and live exam revisions created by Er. Skilldotpy completely free.
            </p>
          </div>

          <a
            href={siteConfig.links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 font-extrabold px-6 py-3.5 rounded-xl shadow-lg text-xs shrink-0 transition-colors"
          >
            <Youtube className="w-4 h-4" /> Subscribe on YouTube
          </a>
        </div>

        {/* Playlists Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Official Course Playlists
              </h2>
              <p className="text-xs text-gray-500">
                Categorized video lessons aligned strictly with the NIELIT syllabus.
              </p>
            </div>

            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
            >
              Want structured test series & offline videos? Get App →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${pl.badgeColor}`}>
                      {pl.badge}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {pl.videosCount}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-gray-900 leading-snug">
                    {pl.title}
                  </h3>
                  <p className="text-xs text-red-600 font-semibold mt-0.5">
                    {pl.hindiTitle}
                  </p>

                  <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                    {pl.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={pl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700"
                  >
                    <PlayCircle className="w-4 h-4" /> Watch on YouTube
                  </a>

                  <Link
                    to="/resources"
                    className="text-xs font-semibold text-gray-500 hover:text-blue-600"
                  >
                    Get Notes PDF →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export const YouTubePage = YouTube;
