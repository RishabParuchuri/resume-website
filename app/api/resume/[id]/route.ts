import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch the updated resume data
  const { data, error } = await supabase
    .from('resumes')
    .select('data')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
  }

  return NextResponse.json({ data: data.data });
}
