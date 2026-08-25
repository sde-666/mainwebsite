import { SEO } from '../components/SEO';
import { siteConfig } from '../data/config';
import {
  Youtube,
  Instagram,
  Send,
  Mail,
  Code2,
  GraduationCap,
  Users,
  Calendar,
  Sparkles,
  BookOpen,
  MonitorPlay,
  Smartphone,
  Award,
  Target,
} from 'lucide-react';

const PROFILE_IMAGE = '/aditya-pathak.jpg';

const socialLinks = [
  {
    name: 'YouTube',
    handle: '@skilldotpy',
    href: siteConfig.links.youtube,
    icon: Youtube,
    color: 'bg-red-600 hover:bg-red-700',
  },
  {
    name: 'Instagram',
    handle: '@skilldotpy',
    href: siteConfig.links.instagram,
    icon: Instagram,
    color:
      'bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600',
  },
  {
    name: 'Telegram',
    handle: '@skilldotpy',
    href: siteConfig.links.telegram,
    icon: Send,
    color: 'bg-sky-500 hover:bg-sky-600',
  },
  {
    name: 'Email',
    handle: siteConfig.links.email,
    href: `mailto:${siteConfig.links.email}`,
    icon: Mail,
    color: 'bg-slate-700 hover:bg-slate-800',
  },
];

const stats = [
  {
    icon: Users,
    value: '6,000+',
    label: 'Students taught',
  },
  {
    icon: GraduationCap,
    value: 'O Level',
    label: 'NIELIT O Level education',
  },
  {
    icon: BookOpen,
    value: 'CCC',
    label: 'CCC education & preparation',
  },
];

export function Founder() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${siteConfig.url}/founder`,
    name: 'Aditya Pathak - Founder of Skilldotpy',
    url: `${siteConfig.url}/founder`,
    description:
      'Official profile of Aditya Pathak, founder and developer of Skilldotpy and an educator teaching NIELIT O Level, CCC and programming courses.',
    mainEntity: {
      '@type': 'Person',
      '@id': `${siteConfig.url}/founder#person`,
      name: 'Aditya Pathak',
      alternateName: [
        'Aditya Pathak Sir',
        'Aditya Sir',
        'Aditya Pathak O Level',
        'O Level By Aditya Sir',
        'Aditya Pathak Skilldotpy',
      ],
      jobTitle: 'Founder, Developer & Educator',
      description:
        'Aditya Pathak is the founder and developer of Skilldotpy, an educational platform providing NIELIT O Level and CCC study material, lecture videos, programming courses, notes, practice resources and educational content. He teaches O Level, CCC and programming courses and has taught more than 6,000 students.',
      image: `${siteConfig.url}${PROFILE_IMAGE}`,
      url: `${siteConfig.url}/founder`,
      worksFor: {
        '@type': 'Organization',
        name: 'Skilldotpy',
        url: siteConfig.url,
      },
      knowsAbout: [
        'NIELIT O Level',
        'O Level Computer Course',
        'O Level Programming',
        'CCC Course',
        'CCC Computer Course',
        'Programming',
        'Web Development',
        'Computer Education',
        'Computer Programming',
        'Online Education',
        'Educational Technology',
      ],
      sameAs: [
        siteConfig.links.youtube,
        siteConfig.links.instagram,
        siteConfig.links.telegram,
      ].filter(Boolean),
    },
  };

  return (
    <>
      <SEO
        title="Aditya Pathak - O Level Teacher, Founder & Developer of Skilldotpy"
        description="Aditya Pathak is the founder and developer of Skilldotpy and an educator who teaches NIELIT O Level, CCC and programming courses. Learn about Aditya Pathak, his teaching journey, 6,000+ students and Skilldotpy."
        keywords={[
          'Aditya Pathak',
          'Aditya Pathak O Level',
          'Aditya Pathak O Level teacher',
          'Aditya Pathak O Level classes',
          'O Level By Aditya Sir',
          'O Level by Aditya Pathak',
          'Aditya Sir O Level',
          'Aditya Sir O Level classes',
          'Aditya Pathak CCC',
          'Aditya Pathak CCC classes',
          'Aditya Pathak programming',
          'Aditya Pathak programming classes',
          'Aditya Pathak Skilldotpy',
          'Skilldotpy founder',
          'Skilldotpy developer',
          'Skilldotpy Aditya Pathak',
          'who is Aditya Pathak',
          'who is Aditya Pathak O Level',
          'O Level teacher',
          'NIELIT O Level teacher',
          'O Level computer course',
          'CCC computer course',
          'programming courses',
          'computer education',
        ]}
        schema={personSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Founder', url: '/founder' },
        ]}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white py-24"
        aria-labelledby="founder-heading"
      >
        <div
          className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute bottom-[-6rem] left-[-8%] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex flex-col items-center text-center">

            {/* Profile Image */}
            <div className="relative mb-6 w-40 h-40">
              <div
                className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-blue-500 via-sky-400 to-indigo-500 opacity-70 blur-sm"
                aria-hidden="true"
              />

              <div className="absolute inset-0 w-40 h-40 rounded-full border-4 border-slate-900 shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-5xl font-bold text-white">
                AP
              </div>

              <img
                src={PROFILE_IMAGE}
                alt="Aditya Pathak - Founder of Skilldotpy and O Level Educator"
                width={160}
                height={160}
                className="absolute inset-0 w-40 h-40 rounded-full object-cover border-4 border-slate-900 shadow-2xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-200 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Founder • Developer • Educator
            </span>

            <h1
              id="founder-heading"
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Aditya Pathak
            </h1>

            <p className="text-xl md:text-2xl font-semibold text-blue-200 mb-4">
              O Level Teacher, Founder & Developer of Skilldotpy
            </p>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">
              I am Aditya Pathak, founder and developer of Skilldotpy. I teach
              NIELIT O Level, CCC and programming courses and create
              educational resources to help students learn computer science,
              programming and prepare for their examinations.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="bg-white border-b border-gray-100"
        aria-label="Aditya Pathak teaching statistics"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center gap-2"
            >
              <stat.icon className="w-7 h-7 text-blue-600" />

              <div className="text-3xl font-bold text-gray-900">
                {stat.value}
              </div>

              <div className="text-sm text-gray-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Aditya Pathak */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-8 h-8 text-blue-600" />

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              About Aditya Pathak
            </h2>
          </div>

          <div className="space-y-5 text-lg text-gray-700 leading-relaxed">

            <p>
              <strong>Aditya Pathak</strong> is the founder and developer of
              <strong> Skilldotpy</strong>, an educational platform created
              for students who want to learn computer education, programming
              and prepare for courses such as <strong>NIELIT O Level</strong>
              and <strong>CCC</strong>.
            </p>

            <p>
              As an educator, I teach <strong>O Level classes, CCC classes and
              programming courses</strong>. Over my teaching journey, I have
              taught and helped <strong>6,000+ students</strong> learn
              computer concepts, programming and examination-oriented topics.
            </p>

            <p>
              Students searching for <strong>O Level by Aditya Sir</strong>,
              <strong> Aditya Pathak O Level classes</strong>, or
              <strong> Aditya Pathak Skilldotpy</strong> can find my educational
              work, courses and learning resources through this platform.
            </p>

            <p>
              My goal as a teacher is simple: make difficult computer and
              programming concepts easier to understand through clear
              explanations, practical examples, lecture videos, notes,
              questions and regular practice.
            </p>

          </div>
        </div>
      </section>

      {/* What I Teach */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold mb-2">
              EDUCATION & COURSES
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What I Teach
            </h2>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              I create and teach practical computer education content for
              students preparing for exams and building programming skills.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <article className="rounded-2xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition-shadow">
              <GraduationCap className="w-10 h-10 text-blue-600 mb-5" />

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                NIELIT O Level
              </h3>

              <p className="text-gray-600 leading-relaxed">
                O Level study material, computer concepts, programming,
                practical topics, notes, lectures, questions and examination
                preparation for NIELIT O Level students.
              </p>
            </article>

            <article className="rounded-2xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition-shadow">
              <BookOpen className="w-10 h-10 text-blue-600 mb-5" />

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                CCC Course
              </h3>

              <p className="text-gray-600 leading-relaxed">
                CCC computer course concepts, study notes, important topics,
                practice questions and educational resources designed to help
                students prepare effectively.
              </p>
            </article>

            <article className="rounded-2xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition-shadow">
              <Code2 className="w-10 h-10 text-blue-600 mb-5" />

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Programming Courses
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Programming and web development concepts explained through
                practical examples, coding lessons and beginner-friendly
                educational content.
              </p>
            </article>

          </div>
        </div>
      </section>

      {/* Why Skilldotpy */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

          <div className="flex items-center gap-3 mb-8">
            <Target className="w-8 h-8 text-blue-600" />

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why I Created Skilldotpy
            </h2>
          </div>

          <div className="space-y-5 text-lg text-gray-700 leading-relaxed">

            <p>
              While teaching students, I noticed that learners often had to
              search across many different websites, YouTube videos and
              documents to find complete study material for their courses.
            </p>

            <p>
              That is why I created <strong>Skilldotpy</strong> — a learning
              platform where students can find educational resources in one
              place.
            </p>

            <p>
              Skilldotpy provides <strong>O Level and CCC study notes,
              lecture videos, programming lessons, practice material and
              other educational resources</strong>. Some resources are
              available free, while selected courses and learning resources
              are also available through the Skilldotpy app as paid
              educational content.
            </p>

            <p>
              As the <strong>founder and developer of Skilldotpy</strong>, I
              work on both sides of the platform: teaching students and
              developing the technology that delivers their learning
              experience through the website and app.
            </p>

          </div>
        </div>
      </section>

      {/* Platform */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Skilldotpy: Learning With Aditya Pathak
            </h2>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              My aim is to combine teaching, technology and practical learning
              resources to make computer education more accessible to students.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="text-center p-6">
              <BookOpen className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">
                Notes & Study Material
              </h3>
              <p className="text-gray-600">
                Structured learning resources for O Level, CCC and programming.
              </p>
            </div>

            <div className="text-center p-6">
              <MonitorPlay className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">
                Lecture Videos
              </h3>
              <p className="text-gray-600">
                Educational lectures and explanations to make complex topics
                easier to understand.
              </p>
            </div>

            <div className="text-center p-6">
              <Smartphone className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">
                Website & App
              </h3>
              <p className="text-gray-600">
                Access Skilldotpy learning resources through the website and
                Android application.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Teaching Journey */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

          <div className="flex items-center gap-3 mb-8">
            <Award className="w-8 h-8 text-blue-600" />

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              My Teaching Journey
            </h2>
          </div>

          <div className="space-y-5 text-lg text-gray-700 leading-relaxed">

            <p>
              Teaching is at the heart of Skilldotpy. I have worked with
              students learning computer fundamentals, NIELIT O Level, CCC and
              programming.
            </p>

            <p>
              With <strong>6,000+ students taught</strong>, I have seen
              different learning styles and the challenges students face while
              preparing for computer courses and examinations.
            </p>

            <p>
              This experience influences the way I create content on
              Skilldotpy: explanations should be understandable, examples
              should be practical and study material should help students
              revise what they have learned.
            </p>

          </div>
        </div>
      </section>

      {/* Social */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Follow Aditya Pathak
          </h2>

          <p className="text-gray-600 text-center mb-10">
            Follow Skilldotpy for O Level, CCC, programming lessons, notes,
            tutorials and educational updates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  link.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className={`${link.color} text-white rounded-xl p-5 flex items-center gap-4 shadow-sm transition-colors`}
              >
                <link.icon className="w-7 h-7 shrink-0" />

                <div className="text-left min-w-0">
                  <div className="font-semibold">{link.name}</div>
                  <div className="text-sm text-white/80 truncate">
                    {link.handle}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Final SEO-friendly introduction */}
      <section className="bg-blue-950 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">

          <h2 className="text-2xl md:text-3xl font-bold mb-5">
            Aditya Pathak - O Level, CCC & Programming Educator
          </h2>

          <p className="text-blue-100 text-lg leading-relaxed">
            I am Aditya Pathak, founder and developer of Skilldotpy and a
            computer educator teaching NIELIT O Level, CCC and programming
            courses. Through Skilldotpy, I provide students with study notes,
            lecture videos, programming lessons and learning resources,
            available through the website and app in both free and paid
            formats.
          </p>

        </div>
      </section>
    </>
  );
}