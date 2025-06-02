'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Story, StoryStageData } from '@/types/database'; // Assuming this path is correct

const userId = 'user_123_mvp'; // Hardcoded user ID for MVP, should match the one used for saving

export default function StoryArchivePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/story/archive?userId=${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch stories: ${response.status}`);
        }
        const data: Story[] = await response.json();
        setStories(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (isLoading) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-blue-700">Loading saved adventures...</div>;
  }

  if (error) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700">Error fetching stories: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50">
      <header className="my-6 text-center">
        <h1 className="text-4xl font-bold text-gray-700">My Saved Adventures</h1>
        <Link href="/story/toddler-adventure" className="mt-2 text-blue-500 hover:text-blue-700 underline">
          Create a new adventure
        </Link>
      </header>

      {stories.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No adventures saved yet. Time to create some memories!</p>
      ) : (
        <div className="space-y-8">
          {stories.map((story) => (
            <div key={story.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-purple-600 mb-2">{story.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                Created on: {new Date(story.created_at!).toLocaleDateString()}
              </p>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Story Chapters:</h3>
                <ul className="space-y-3 pl-2">
                  {story.stages_data.map((stageData, index) => (
                    <li key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">{stageData.stage_title}:</strong> 
                      <span className="text-gray-600 ml-2">{typeof stageData.user_input === 'string' ? stageData.user_input : JSON.stringify(stageData.user_input)}</span>
                      {stageData.image_url && (
                        <div className="mt-2">
                           <img 
                            src={stageData.image_url} 
                            alt={`Image for ${stageData.stage_title}`} 
                            className="rounded shadow-sm w-40 h-40 object-cover border border-purple-200"
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {story.final_image_url && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Our Adventure's Grand Finale Picture:</h3>
                  <img 
                    src={story.final_image_url} 
                    alt="Final story image" 
                    className="rounded-lg shadow-md mx-auto border-4 border-purple-200" 
                    style={{maxWidth: '100%', maxHeight: '400px'}}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
