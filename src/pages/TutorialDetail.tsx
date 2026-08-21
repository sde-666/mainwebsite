import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Button } from '../components/Button';
import { AdBanner } from '../components/AdBanner';
import { tutorials } from '../data/tutorials';

export function TutorialDetail() {
  const { tutorialId } = useParams<{ tutorialId: string }>();
  const tutorial = tutorials.find(t => t.id === tutorialId);

  if (!tutorial) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tutorial Not Found</h1>
        <Button to="/tutorials">Back to Tutorials</Button>
      </div>
    );
  }

  return (
    <>
      <SEO title={tutorial.title} description={tutorial.description} />
      
      <div className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Link to="/tutorials" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tutorials
          </Link>
          <span className="block text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
            {tutorial.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{tutorial.title}</h1>
          <p className="text-xl text-gray-600">
            {tutorial.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">
        <div className="prose prose-lg prose-blue max-w-none">
          {/* Using react-markdown to render the tutorial content */}
          <div className="markdown-body">
            <Markdown>{tutorial.content}</Markdown>
          </div>
        </div>

        {/* Tutorial In-Article Sponsor */}
        <div className="my-10">
          <AdBanner slotId="tutorial-article-bottom" format="in-article" fallbackType="notes" />
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
           <p className="text-gray-500 text-sm">Was this helpful?</p>
           <Button to="/contact" variant="outline" size="sm">Contact Support</Button>
        </div>
      </div>
    </>
  );
}
