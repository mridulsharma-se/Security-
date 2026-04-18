// Example of the kind of code VibeGuard catches.
// IDOR: trusts the URL param, no auth check, no validation.
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('notes').select('*').eq('id', awaitedParams.id).single();
  return NextResponse.json(data);
}
