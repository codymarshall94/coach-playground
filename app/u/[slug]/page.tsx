import { getProfileBySlug } from "@/services/profileService";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
      <p className="text-muted-foreground mb-6">{profile.bio}</p>
    </div>
  );
}
