import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MonitorPlay } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { courses } from '../data/courses';

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
        <Button to="/courses">Back to Courses</Button>
      </div>
    );
  }

  return (
    <>
      <SEO title={course.title} description={course.overview} />
      
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link to="/courses" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Courses
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 max-w-2xl">{course.overview}</p>
            </div>
            <div className="flex-shrink-0 bg-gray-800 p-6 rounded-xl border border-gray-700 w-full md:w-64 text-center">
              <div className="text-3xl font-bold mb-4">{course.isFree ? 'Free' : course.price}</div>
              <Button to={course.enrollmentUrl} className="w-full bg-blue-600 hover:bg-blue-700 border-none text-white">Enroll Now</Button>
              <p className="text-xs text-gray-400 mt-3">Secure enrollment via Skilldotpy App</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.learningOutcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Who is this course for?</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {course.targetAudience.map((audience, i) => (
                  <li key={i}>{audience}</li>
                ))}
              </ul>
            </section>

            {course.relatedYoutubeVideos && course.relatedYoutubeVideos.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related YouTube Videos</h2>
                <div className="space-y-4">
                  {course.relatedYoutubeVideos.map((video, i) => (
                    <Card key={i}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <MonitorPlay className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-gray-900">{video.title}</span>
                        </div>
                        <Button href={video.url} variant="outline" size="sm">Watch</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div>
            <div className="sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Course Includes</h3>
              <ul className="space-y-4">
                {course.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-800 mb-4">Read our guide on how to purchase and access courses on the app.</p>
                <Button to="/tutorials/how-to-purchase" variant="outline" size="sm" className="w-full bg-white">View Guide</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
