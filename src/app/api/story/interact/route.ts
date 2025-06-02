import { NextResponse } from 'next/server';
import { learningEngine, ProcessInteractionResponse, LearningSession } from '@/lib/learning/learning-engine';
import { geminiClient } from '@/lib/ai/gemini-client';
import { ToddlerStage, toddlerAdventureTemplateData } from '@/lib/learning/toddler-adventure-template';
import supabase from '@/lib/supabase/client';
import { Story, StoryStageData } from '@/types/database';

// Helper to build image prompt
const buildImagePrompt = (stage: ToddlerStage, userInput: string): string => {
  let prompt = `Vibrant storybook illustration for a young child. `;
  if (stage.visualCues && stage.visualCues.length > 0) {
    prompt += stage.visualCues.join(', ') + ". ";
  }
  prompt += `The child described or chose: "${userInput}". `;
  if (stage.simpleTitle) {
    prompt += `This is for the story stage: "${stage.simpleTitle}".`;
  }
  return prompt;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // stageId is the ID of the stage that was just completed by the user.
    const { sessionId, userInput, stageId } = body;

    if (!sessionId || typeof userInput === 'undefined' || !stageId) {
      return NextResponse.json({ error: 'Missing sessionId, userInput, or stageId' }, { status: 400 });
    }
    
    // The stageId passed from client is the ID of the stage the user just interacted with.
    // processInteraction will use this to determine the current context and then advance.
    const interactionResult: ProcessInteractionResponse = await learningEngine.processInteraction(sessionId, userInput, stageId);

    let imageData: string | null = null;
    let imageError: string | null = null;

    // Image generation logic for Toddler mode
    // Generate image based on the stage that was *just completed* (currentToddlerStage in response)
    // or for a specific event like story completion.
    const justCompletedStage = interactionResult.currentToddlerStage;

    if (justCompletedStage && justCompletedStage.visualCues && justCompletedStage.visualCues.length > 0) {
      // Example: Generate image if the completed stage has visual cues.
      // More specific logic can be added, e.g., only for certain stage IDs like 'character', 'place'.
      // For instance, always generate for 'character' and 'happy_solution'.
      if (['character', 'place', 'happy_solution'].includes(justCompletedStage.id) || interactionResult.isStoryComplete) {
         try {
          const imagePrompt = buildImagePrompt(justCompletedStage, userInput);
          imageData = await geminiClient.generateImage(imagePrompt);
        } catch (e: any) {
          console.error('Image generation error during interaction:', e);
          imageError = e.message || 'Failed to generate image.';
        }
      }
    }
    
    // Prepare the response
    const responsePayload: any = {
      systemResponse: interactionResult.systemResponse,
      promptAnalysis: interactionResult.promptAnalysis, // May be simplified by GeminiClient for toddlers
      isStoryComplete: !!interactionResult.isStoryComplete,
      imageData: imageData,
      imageError: imageError,
      // currentStage is the stage that was just processed.
      // nextStage is what the frontend should display next.
      // If story is complete, nextStage might be null/undefined.
      currentStageData: interactionResult.currentToddlerStage, 
      nextStageData: interactionResult.nextToddlerStage,
      
      // Include these for compatibility or if frontend uses them for non-toddler paths
      levelProgress: interactionResult.levelProgress,
      skillsLearned: interactionResult.skillsLearned,
      nextStep: interactionResult.nextStep,
      shouldAdvanceLevel: interactionResult.shouldAdvanceLevel,
    };
    
    // Remove undefined fields for cleaner API response
    Object.keys(responsePayload).forEach(key => {
      if (responsePayload[key] === undefined) {
        delete responsePayload[key];
      }
    });

    // Save story to Supabase if complete (for toddler adventure)
    if (interactionResult.isStoryComplete && justCompletedStage && interactionResult.currentToddlerStage?.id === toddlerAdventureTemplateData.stages[toddlerAdventureTemplateData.stages.length - 1].id) {
      const session = learningEngine.getSession(sessionId);
      if (session && session.templateId === toddlerAdventureTemplateData.id && session.stageInputs) {
        // Attempt to save the story
        try {
          const characterStageInput = session.stageInputs['character'] || 'A story';
          const storyTitle = `${characterStageInput} - ${toddlerAdventureTemplateData.name}`;

          const stagesData: StoryStageData[] = toddlerAdventureTemplateData.stages.map(stage => {
            let stageImageUrl: string | undefined = undefined;
            // If image was generated for this specific stage (justCompletedStage) and it's the one we are mapping
            if (imageData && justCompletedStage && stage.id === justCompletedStage.id) {
              stageImageUrl = imageData; // Storing base64 for now
            }
            return {
              stage_id: stage.id,
              stage_title: stage.title,
              user_input: session.stageInputs![stage.id] || '',
              image_url: stageImageUrl 
            };
          });
          
          const storyToSave: Story = {
            user_id: session.userId, // Ensure userId is available in session
            title: storyTitle,
            template_id: toddlerAdventureTemplateData.id,
            stages_data: stagesData,
            final_image_url: (interactionResult.isStoryComplete && imageData) ? imageData : undefined, // Storing base64
          };

          const { error: supabaseError } = await supabase.from('stories').insert([storyToSave]);
          if (supabaseError) {
            console.error('Supabase error saving story:', supabaseError);
            // Do not block response to user for this error, just log it
          } else {
            console.log('Story saved successfully to Supabase, storyId (implicit):', storyToSave.id);
          }
        } catch (saveError: any) {
          console.error('Error preparing or saving story:', saveError);
        }
      }
    }

    return NextResponse.json(responsePayload, { status: 200 });

  } catch (error: any) {
    console.error('Error processing interaction:', error);
    if (error && error.message && typeof error.message === 'string' && error.message.includes('不存在')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to process interaction' }, { status: 500 });
  }
}
