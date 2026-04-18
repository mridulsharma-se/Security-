import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const ParamsSchema = z.object({ id: z.string().uuid() });

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params;
  const parsed = ParamsSchema.safeParse(awaitedParams);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', parsed.data.id)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: 'server error' }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(data);
}
