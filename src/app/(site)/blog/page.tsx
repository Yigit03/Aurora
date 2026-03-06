// ─────────────────────────────────────────────
// app/blog/page.tsx
// ─────────────────────────────────────────────
import BlogList from "./BlogList";
import PageTitle from "@/components/layouts/PageTitle";

export const metadata = {
  title: "Blog | Aurora Dil Eğitim Merkezi",
  description: "Tercüme, dil öğrenimi ve Almanca hakkında faydalı yazılar.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageTitle title="Blog" text="20 yıllık deneyimimizle online Almanca eğitiminde öncü konumdayız" />
      {/* ── Blog List ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <BlogList />
        </div>
      </section>
    </main>
  );
}