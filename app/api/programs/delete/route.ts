import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerSupabase } from "@/utils/supabase/server";

const COVER_BUCKET = "program-covers";

/** Best-effort removal of cover image from storage. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function cleanupCoverImage(
  supabase: { storage: { from: (bucket: string) => { remove: (paths: string[]) => Promise<{ error: { message: string } | null }> } } },
  coverImageUrl: string | null,
) {
  if (!coverImageUrl) return;
  const bucketBase = `/storage/v1/object/public/${COVER_BUCKET}/`;
  const idx = coverImageUrl.indexOf(bucketBase);
  if (idx === -1) return;
  const path = coverImageUrl.slice(idx + bucketBase.length).split("?")[0];
  const { error } = await supabase.storage.from(COVER_BUCKET).remove([path]);
  if (error) {
    console.warn("[api/programs/delete] cover image cleanup failed", error.message);
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const id = body?.id;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Resolve current authenticated user from server cookies
  const serverSupabase = await createServerSupabase();
  const { data: { user }, error: userErr } = await serverSupabase.auth.getUser();
  if (userErr || !user) {
    console.warn("[api/programs/delete] unauthenticated request", { userErr });
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }


  const serviceKey = process.env.SUPABASE_SERVICE_ROLE;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    console.error("[api/programs/delete] missing NEXT_PUBLIC_SUPABASE_URL");
    return NextResponse.json({ error: "Supabase URL not configured" }, { status: 500 });
  }

  // Try to delete using the authenticated server client first (respects RLS)
  try {
    // Fetch program row and verify ownership using server client
    const { data: before, error: beforeErr } = await serverSupabase
      .from("programs")
      .select("id,user_id,cover_image")
      .eq("id", id)
      .maybeSingle();

    if (beforeErr) {
      console.error("[api/programs/delete] error fetching program (server client)", beforeErr);
      // fall through to possible admin delete below if configured
    }

    if (!before) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    if (before.user_id !== user.id) {
      console.warn("[api/programs/delete] user not owner", { requestedBy: user.id, owner: before.user_id });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: delData, error: delErr } = await serverSupabase
      .from("programs")
      .delete()
      .eq("id", id)
      .select("id,user_id");

    if (!delErr) {
      // Best-effort cleanup of cover image from storage
      await cleanupCoverImage(serverSupabase, before.cover_image);
      return NextResponse.json({ data: delData });
    }

    // If RLS blocked the delete or another server-client error occurred, log and fall back
    console.warn("[api/programs/delete] server-client delete failed, will try service role if available", delErr);
  } catch (err) {
    console.error("[api/programs/delete] unexpected server-client error", err);
    // fall through to admin path
  }

  // Fallback: if a service role key is configured, use it (admin delete)
  if (!serviceKey) {
    console.error("[api/programs/delete] service role not configured; cannot complete delete");
    return NextResponse.json(
      {
        error:
          "Service role key not configured on server. Set SUPABASE_SERVICE_ROLE in your environment to enable program deletion.",
      },
      { status: 500 }
    );
  }

  const supabase = createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  try {
    // Check existence & ownership first (service role used to bypass RLS safely)
    const { data: before, error: beforeErr } = await supabase
      .from("programs")
      .select("id,user_id,cover_image")
      .eq("id", id)
      .maybeSingle();

    console.info("[api/programs/delete] pre-delete check", { before, beforeErr });

    if (!before) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    if (before.user_id !== user.id) {
      console.warn("[api/programs/delete] user not owner", { requestedBy: user.id, owner: before.user_id });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("programs")
      .delete()
      .eq("id", id)
      .select("id,user_id");

    if (error) {
      console.error("[api/programs/delete] supabase error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Best-effort cleanup of cover image from storage
    await cleanupCoverImage(supabase, before.cover_image);

    return NextResponse.json({ data });
  } catch (err) {
    console.error("[api/programs/delete] unexpected", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
