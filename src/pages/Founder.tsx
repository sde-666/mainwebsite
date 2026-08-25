import { SEO } from '../components/SEO';
import { siteConfig } from '../data/config';
import { Youtube, Instagram, Send, Mail, Code2, GraduationCap, Users, Calendar, Sparkles } from 'lucide-react';

// A profile photo isn't checked into the repo yet. Drop one at
// public/aditya-pathak.jpg (square, at least 400x400px) and this picks it
// up automatically. Until then, a clean initials avatar is shown instead
// so the page never looks broken.
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
    color: 'bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600',
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
  { icon: Calendar, value: siteConfig.teacher.experience, label: 'Teaching & building online' },
  { icon: Users, value: siteConfig.teacher.studentsTrained, label: 'Students reached' },
  { icon: Code2, value: '2', label: 'Platforms built solo (web + Android)' },
];

export function Founder() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `${siteConfig.teacher.name} - Founder & Developer of Skilldotpy`,
    mainEntity: {
      '@type': 'Person',
      '@id': `${siteConfig.url}/founder#person`,
      name: siteConfig.teacher.name,
      alternateName: siteConfig.teacher.alternateNames,
      jobTitle: siteConfig.teacher.role,
      description: siteConfig.teacher.bio,
      image: `${siteConfig.url}${PROFILE_IMAGE}`,
      url: `${siteConfig.url}/founder`,
      sameAs: [
        siteConfig.links.youtube,
        siteConfig.links.instagram,
        siteConfig.links.telegram,
      ].filter(Boolean),
      knowsAbout: siteConfig.teacher.specialties,
    },
  };

  return (
    <>
      <SEO
        title="Aditya Pathak - Founder & Developer of Skilldotpy"
        description="Meet Aditya Pathak, the founder and developer behind Skilldotpy — who he is, his experience, and where to follow him on YouTube, Instagram and Telegram."
        keywords={[
          'Aditya Pathak',
          'Skilldotpy founder',
          'Skilldotpy developer',
          'who made Skilldotpy',
          'Er. Aditya Pathak',
          'Aditya Pathak Skilldotpy',
        ]}
        schema={personSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Founder', url: '/founder' },
        ]}
      />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white py-24">
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
            <div className="relative mb-6 w-40 h-40">
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-blue-500 via-sky-400 to-indigo-500 opacity-70 blur-sm" aria-hidden="true" />
              {/* Fallback initials avatar sits underneath; the real photo covers it once it loads, and stays hidden if the photo 404s */}
              <div className="absolute inset-0 w-40 h-40 rounded-full border-4 border-slate-900 shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-5xl font-bold text-white">
                AP
              </div>
              <img
                src={PROFILE_IMAGE}
                alt={siteConfig.teacher.name}
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
              Founder &amp; Developer
            </span>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{siteConfig.teacher.name}</h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
              {siteConfig.teacher.role}. I build Skilldotpy — the website, the Android app, and the
              lessons on it — from the ground up, and teach on it too.
            </p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center gap-2">
              <stat.icon className="w-6 h-6 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Who I am / why I built this */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            Who I am
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            I'm {siteConfig.teacher.name}, and I teach and build for students preparing for NIELIT
            O Level, CCC, and practical programming skills. Everything on this site — the notes,
            the mock tests, the Android app — is something I've personally designed, written, or
            coded myself.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            I started this because I kept seeing the same gap: great free tutorials scattered
            across YouTube, but nothing that pulled them together into one place a student could
            actually follow start to finish, practice from, and revise with before an exam. So I
            built one.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            What I know: {siteConfig.teacher.specialties.join(', ')}.
          </p>
        </div>
      </div>

      {/* Social links */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Follow along</h2>
          <p className="text-gray-600 text-center mb-10">
            New notes, shortcuts and exam updates go up here first.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`${link.color} text-white rounded-xl p-5 flex items-center gap-4 shadow-sm transition-colors`}
              >
                <link.icon className="w-7 h-7 shrink-0" />
                <div className="text-left min-w-0">
                  <div className="font-semibold">{link.name}</div>
                  <div className="text-sm text-white/80 truncate">{link.handle}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
