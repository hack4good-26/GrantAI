import SearchForm from "@/components/search/SearchForm";

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-32 right-6 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-accent/70 blur-3xl" />
      <div className="container relative mx-auto px-4 py-10 md:px-8 md:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              GrantAI Navigator
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold tracking-tight text-foreground">
              Turn service ideas into funded projects.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl">
              Build higher-impact proposals with clear filters, transparent reasoning, and
              tailored recommendations that respect your budget and timeline.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Clarity",
                  copy: "Match each idea to grants with explicit fit signals."
                },
                {
                  label: "Momentum",
                  copy: "Move from draft to shortlist in minutes, not days."
                },
                {
                  label: "Control",
                  copy: "Tune budget, duration, and KPI constraints in one place."
                },
                {
                  label: "Confidence",
                  copy: "See why each grant is recommended before you apply."
                }
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm text-foreground">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card/85 p-6 shadow-xl shadow-black/5 backdrop-blur animate-fade-up-delayed">
            <SearchForm />
          </div>
        </div>
      </div>
    </div>
  );
}
