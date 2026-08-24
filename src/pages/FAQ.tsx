import { useState } from 'react';
import { SEO } from '../components/SEO';
import { Button } from '../components/Button';
import { faqs } from '../data/faqs';
import { HelpCircle, Search, ChevronDown, BookOpen, Smartphone, Award, Terminal } from 'lucide-react';

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'o-level', label: 'NIELIT O Level', icon: Award },
    { id: 'ccc', label: 'NIELIT CCC', icon: BookOpen },
    { id: 'app', label: 'Android App', icon: Smartphone },
    { id: 'general', label: 'General / Support', icon: Terminal },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.hindiQuestion && faq.hindiQuestion.toLowerCase().includes(searchQuery.toLowerCase())) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  };

  return (
    <>
      <SEO 
        title="NIELIT O Level & CCC FAQs" 
        description="Instant answers for NIELIT O Level (R5.1) & CCC exams: Passing marks, exam pattern, practical guidelines, project submission & Skilldotpy app info."
        keywords={[
          'Skilldotpy FAQ',
          'NIELIT O level FAQ',
          'CCC exam FAQ questions',
          'O Level passing marks negative marking',
          'O Level project submission fee'
        ]}
        schema={faqSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'FAQ & Help Center', url: '/faq' }
        ]}
      />
      
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-900/40 border border-blue-500/30 px-3 py-1 rounded-full">
            Help Center & Queries
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm text-gray-300">
            Everything you need to know about NIELIT O Level, CCC exam patterns, practicals, project submission, and the Skilldotpy Android app.
          </p>

          {/* Search bar */}
          <div className="mt-6 relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g., negative marking, practical, M1-R5, APK)..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQs list */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{faq.question}</span>
                      </h3>
                      {faq.hindiQuestion && (
                        <p className="text-xs font-medium text-blue-600 pl-6 mt-0.5">
                          {faq.hindiQuestion}
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 mt-1 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-gray-100 pl-11">
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-sm text-gray-600 font-medium">No questions matched your search query.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Clear filters and search
            </button>
          </div>
        )}
        
        <div className="mt-14 bg-blue-50 p-8 rounded-2xl border border-blue-100 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Still have questions about NIELIT O Level or CCC?</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-5 max-w-xl mx-auto">
            Our educational support team is here to help you understand module eligibility, practical exams, project submissions, and course access.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button to="/contact" size="sm">Contact Teacher / Support</Button>
            <Button to="/tutorials" variant="outline" size="sm" className="bg-white">View App Tutorials</Button>
          </div>
        </div>
      </div>
    </>
  );
}
