// Example of the kind of code VibeGuard catches.
// IDOR: trusts the URL param, no auth check, no validation.
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from('notes').select('*').eq('id', params.id).single();
  return NextResponse.json(data);
}
