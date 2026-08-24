import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Card, CardContent } from '../components/Card';
import { tutorials } from '../data/tutorials';

export function Tutorials() {
  const categories = Array.from(new Set(tutorials.map(t => t.category)));

  return (
    <>
      <SEO 
        title="Tutorials & Step-by-Step Guides" 
        description="Step-by-step guides on how to study for NIELIT O Level & CCC, install the Skilldotpy Android app APK, and download study notes."
        keywords={[
          'Skilldotpy tutorials',
          'How to install Skilldotpy APK',
          'How to prepare NIELIT O level at home',
          'How to clear CCC exam in first attempt'
        ]}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Tutorials & Guides', url: '/tutorials' }
        ]}
      />
      
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Tutorials & Guides</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Learn how to use the Skilldotpy platform effectively.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.map(category => (
          <div key={category} className="mb-16 last:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.filter(t => t.category === category).map(tutorial => (
                <Link key={tutorial.id} to={`/tutorials/${tutorial.id}`} className="group">
                  <Card className="h-full hover:border-blue-500 transition-colors">
                    <CardContent className="p-6">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{tutorial.title}</h3>
                      <p className="text-gray-600">{tutorial.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {tutorials.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No tutorials available at the moment.
          </div>
        )}
      </div>
    </>
  );
}
