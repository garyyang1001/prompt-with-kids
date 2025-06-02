'use client';

import { useState, useEffect, FormEvent } from 'react';
import { ToddlerStage, toddlerAdventureTemplateData } from '@/lib/learning/toddler-adventure-template'; // Assuming this path
import { AnalyzePromptResponse } from '@/lib/ai/gemini-client'; // For promptAnalysis type if used directly

// Define a simpler type for story history items on the frontend
interface StoryHistoryItem {
  stageId: string;
  stageTitle: string;
  userInput: string | Record<string, any>;
  imageUrl?: string | null; // If an image was specifically generated for this input
}

// Define the shape of the state for this page
interface AdventureState {
  sessionId: string | null;
  currentStage: ToddlerStage | null;
  userInput: string; // For text input, choice value will be handled directly
  storyHistory: StoryHistoryItem[];
  isLoading: boolean;
  error: string | null;
  generatedImage: string | null; // Base64 image data
  isStoryComplete: boolean;
  systemResponse: string | null; // AI guidance for parent
  promptAnalysis: AnalyzePromptResponse | null; // AI analysis of input
}

const userId = 'user_123_mvp'; // Hardcoded user ID for MVP

export default function ToddlerAdventurePage() {
  const [state, setState] = useState<AdventureState>({
    sessionId: null,
    currentStage: null,
    userInput: '',
    storyHistory: [],
    isLoading: false,
    error: null,
    generatedImage: null,
    isStoryComplete: false,
    systemResponse: null,
    promptAnalysis: null,
  });

  // Function to start a new story
  const startStory = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null, isStoryComplete: false, storyHistory: [], generatedImage: null, sessionId: null, currentStage: null }));
    try {
      const response = await fetch('/api/story/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to start story: ${response.status}`);
      }
      const data = await response.json();
      setState(prev => ({
        ...prev,
        isLoading: false,
        sessionId: data.session.id,
        currentStage: data.currentStage,
        systemResponse: `Let's start our adventure! ${data.currentStage.childPrompt}` // Initial prompt
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  };

  // Start story on component mount
  useEffect(() => {
    startStory();
  }, []);

  // Handle input submission (text or choice)
  const handleNextStage = async (currentInput: string | Record<string, any>) => {
    if (!state.sessionId || !state.currentStage) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, userInput: typeof currentInput === 'string' ? currentInput : '' }));

    try {
      const response = await fetch('/api/story/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.sessionId,
          stageId: state.currentStage.id,
          userInput: currentInput,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to interact with story: ${response.status}`);
      }

      const data = await response.json(); // Should be ProcessInteractionResponse

      setState(prev => ({
        ...prev,
        isLoading: false,
        currentStage: data.nextStageData || null, // nextStageData is the new currentStage
        storyHistory: [
          ...prev.storyHistory,
          {
            stageId: prev.currentStage!.id,
            stageTitle: prev.currentStage!.simpleTitle,
            userInput: currentInput,
            imageUrl: data.imageData && data.currentStageData?.id === prev.currentStage!.id ? data.imageData : null,
          },
        ],
        generatedImage: data.imageData || null, // Display the latest image
        isStoryComplete: !!data.isStoryComplete,
        systemResponse: data.systemResponse,
        promptAnalysis: data.promptAnalysis,
        userInput: '', // Clear text input
      }));

    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  };
  
  const handleSubmitText = (e: FormEvent) => {
    e.preventDefault();
    if (state.userInput.trim()) {
      handleNextStage(state.userInput);
    }
  };


  // Basic loading and error display
  if (state.isLoading && !state.currentStage && !state.isStoryComplete) { // Show initial loading prominently
    return <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50">Loading story...</div>;
  }
  if (state.error && !state.sessionId) { // Show initial error prominently
    return <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700">Error: {state.error} <button onClick={startStory} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Try Again</button></div>;
  }
  
  // Render the current stage or completion message
  return (
    <div className="container mx-auto p-4 max-w-2xl min-h-screen bg-orange-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-orange-600 my-6">Today's Little Adventure!</h1>

      {state.isLoading && <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center z-50"><div className="text-white text-xl bg-orange-500 p-4 rounded-lg">Loading next part...</div></div>}
      {state.error && <div className="my-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300 w-full text-center">Error: {state.error}</div>}


      {state.isStoryComplete ? (
        <div className="text-center p-6 bg-green-50 rounded-lg shadow-md w-full">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">🎉 Hooray! Our story is complete! 🎉</h2>
          {state.generatedImage && (
            <div className="my-4">
              <h3 className="text-lg font-medium text-gray-700">Here's a picture from our adventure:</h3>
              <img src={state.generatedImage} alt="Generated from story" className="mt-2 rounded-lg shadow-lg mx-auto border-4 border-green-200" style={{maxWidth: '100%', maxHeight: '400px'}}/>
            </div>
          )}
          <div className="my-4 text-left">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Adventure Story:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {state.storyHistory.map((item, index) => (
                <li key={index}>
                  <strong>{item.stageTitle}:</strong> {typeof item.userInput === 'string' ? item.userInput : JSON.stringify(item.userInput)}
                  {item.imageUrl && <img src={item.imageUrl} alt={`For stage ${item.stageTitle}`} className="mt-1 rounded shadow-sm w-32 h-32 object-cover"/>}
                </li>
              ))}
            </ul>
          </div>
          <button 
            onClick={startStory} 
            className="mt-6 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition-colors text-lg"
          >
            Start a New Adventure!
          </button>
        </div>
      ) : state.currentStage ? (
        <div className="w-full p-6 bg-white rounded-lg shadow-xl border-2 border-orange-200">
          <div className="text-center mb-4">
            <span className="text-sm font-semibold bg-orange-200 text-orange-700 px-3 py-1 rounded-full">
              Stage {state.currentStage.order} of {toddlerAdventureTemplateData.stages.length}
            </span>
            <h2 className="text-2xl font-bold text-orange-700 mt-2">{state.currentStage.simpleTitle}</h2>
          </div>

          <p className="text-lg text-gray-700 my-4 text-center">{state.currentStage.childPrompt}</p>

          {state.currentStage.interactionType === 'choice' && state.currentStage.suggestions && (
            <div className="grid grid-cols-2 gap-3 my-4">
              {state.currentStage.suggestions.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleNextStage(choice)}
                  disabled={state.isLoading}
                  className="p-3 bg-yellow-400 text-yellow-900 font-medium rounded-lg shadow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50 disabled:opacity-50 transition-colors"
                >
                  {choice}
                </button>
              ))}
            </div>
          )}

          {(state.currentStage.interactionType === 'open_ended' || state.currentStage.interactionType === 'visual_creation') && (
            <form onSubmit={handleSubmitText} className="my-4 flex gap-2">
              <input
                type="text"
                value={state.userInput}
                onChange={(e) => setState(prev => ({ ...prev, userInput: e.target.value }))}
                placeholder="What happens next?"
                disabled={state.isLoading}
                className="flex-grow p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button 
                type="submit" 
                disabled={state.isLoading || !state.userInput.trim()}
                className="px-5 py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 disabled:bg-gray-300"
              >
                Next
              </button>
            </form>
          )}
          
          {state.generatedImage && (
            <div className="my-6 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Look what we imagined!</h3>
              <img src={state.generatedImage} alt="Generated from story" className="mt-2 rounded-lg shadow-lg mx-auto border-4 border-orange-200" style={{maxWidth: '100%', maxHeight: '300px'}}/>
            </div>
          )}

          {state.systemResponse && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-1">Friendly Helper:</h4>
              <p className="text-blue-600">{state.systemResponse}</p>
            </div>
          )}
          
          {state.currentStage.parentGuidance && (
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-700 mb-1">Parent Tip:</h4>
              <p className="text-purple-600 whitespace-pre-line">{state.currentStage.parentGuidance}</p>
            </div>
          )}
          
          {state.currentStage.visualCues && state.currentStage.visualCues.length > 0 && (
             <div className="mt-4 text-xs text-gray-500">
                Visual Cues: {state.currentStage.visualCues.join(', ')}
             </div>
          )}

        </div>
      ) : (
         !state.isLoading && <div className="text-center p-6 bg-yellow-50 rounded-lg shadow-md w-full">Click "Start New Adventure" to begin!</div>
      )}
    </div>
  );
}
