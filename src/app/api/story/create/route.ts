import { NextResponse } from 'next/server';
import { learningEngine } from '@/lib/learning/learning-engine';
import { toddlerAdventureTemplateData, ToddlerStage } from '@/lib/learning/toddler-adventure-template';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body; // templateId is now fixed

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const templateIdToUse = toddlerAdventureTemplateData.id;

    // Ensure the learningEngine has this template loaded (it should be by constructor)
    if (!learningEngine.getTemplate(templateIdToUse)) {
        console.error(`Critical: Toddler template ${templateIdToUse} not found in LearningEngine.`);
        return NextResponse.json({ error: `Template ${templateIdToUse} not found` }, { status: 500 });
    }

    const session = await learningEngine.startSession(userId, templateIdToUse);
    
    // Retrieve the first stage of the toddler adventure template
    // session.currentLevel should be 0 for the first stage of toddler adventure
    const firstStage: ToddlerStage | undefined = toddlerAdventureTemplateData.stages[0];

    if (!firstStage) {
        console.error(`Critical: Toddler template ${templateIdToUse} has no stages defined.`);
        return NextResponse.json({ error: 'Failed to retrieve first stage data' }, { status: 500 });
    }
    
    // The session object from startSession already contains currentLevel = 0 for toddlers
    return NextResponse.json(
      { 
        session, // contains id, userId, templateId, startTime, currentLevel (should be 0)
        currentStage: firstStage // Full details of the first stage
      }, 
      { status: 201 }
    );

  } catch (error: any) { 
    console.error('Error creating story session:', error);
    if (error && error.message && typeof error.message === 'string' && error.message.includes('不存在')) { 
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to create story session' }, { status: 500 });
  }
}
