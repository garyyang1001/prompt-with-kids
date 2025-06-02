import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase/client';
import { Story } from '@/types/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId query parameter' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching stories:', error);
      return NextResponse.json({ error: 'Failed to fetch stories', details: error.message }, { status: 500 });
    }

    return NextResponse.json(data as Story[], { status: 200 });

  } catch (error: any) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories', details: error.message }, { status: 500 });
  }
}
