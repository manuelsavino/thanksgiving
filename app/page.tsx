import Image from "next/image";
import { Suspense } from "react";
import SignupForm from "@/components/SignupForm";
import { CATEGORIES, getSupabase, type Dish } from "@/lib/supabase";

const LEAVES = [
  { className: "left-[6%] top-24 rotate-[-20deg] text-gold", size: 34 },
  { className: "right-[8%] top-16 rotate-[30deg] text-leaf", size: 30 },
  { className: "left-[10%] top-80 rotate-[15deg] text-rust", size: 24 },
  { className: "right-[5%] top-72 rotate-[-35deg] text-cranberry", size: 32 },
];

function Leaf({ className, size }: { className: string; size: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`pointer-events-none absolute hidden opacity-80 sm:block ${className}`}
      fill="currentColor"
    >
      <path d="M12 2c3 3 6 6 6 10a6 6 0 0 1-5 5.9V22h-2v-4.1A6 6 0 0 1 6 12c0-4 3-7 6-10Z" />
    </svg>
  );
}

function Rays({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={`h-8 w-8 sm:h-10 sm:w-10 ${className}`}>
      <g stroke="#e3b9a3" strokeWidth="3.5" strokeLinecap="round">
        <line x1="10" y1="8" x2="26" y2="16" />
        <line x1="6" y1="21" x2="28" y2="21" />
        <line x1="10" y1="34" x2="26" y2="26" />
      </g>
    </svg>
  );
}

async function getDishes(): Promise<{ dishes: Dish[]; error: string | null }> {
  try {
    const { data, error } = await getSupabase()
      .from("dishes")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return { dishes: data ?? [], error: null };
  } catch (e) {
    console.error(e);
    return { dishes: [], error: "Couldn't load the menu. Check your Supabase setup." };
  }
}

export default function Home() {
  return (
    <main className="relative mx-auto w-full max-w-3xl px-4 py-10 sm:py-16">
      {LEAVES.map((l, i) => (
        <Leaf key={i} {...l} />
      ))}

      {/* Hero */}
      <header className="text-center">
        <p className="font-serif text-sm font-semibold uppercase tracking-[0.25em] text-rust sm:text-base">
          We are rounding up the
        </p>
        <h1 className="mt-1 flex items-center justify-center font-serif text-6xl font-bold tracking-wide text-bark sm:text-7xl">
          <Rays className="mr-3" />
          GANG
          <Rays className="ml-3 -scale-x-100" />
        </h1>
        <p className="mt-2 font-serif text-sm font-semibold uppercase tracking-[0.25em] text-rust sm:text-base">
          For a little
        </p>
        <p className="-mt-2 font-script text-6xl leading-tight text-bark sm:text-8xl">Thanksgiving Party!</p>

        <Image
          src="/turkeys.jpg"
          alt="Four stylish turkeys in hats, sunglasses, and scarves"
          width={1140}
          height={680}
          priority
          className="mx-auto mt-4 w-full max-w-2xl mix-blend-multiply"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 4%, black 96%, transparent), linear-gradient(to bottom, transparent, black 4%, black 96%, transparent)",
            maskComposite: "intersect",
          }}
        />

        <div className="mt-6 flex items-center justify-center gap-4 font-serif text-2xl font-bold text-bark sm:gap-8 sm:text-4xl">
          <span>NOV</span>
          <span className="h-10 w-px bg-gold" />
          <span>26TH</span>
          <span className="h-10 w-px bg-gold" />
          <span>5:30 PM</span>
        </div>
        <p className="mt-4 font-serif text-base font-bold uppercase tracking-wider text-bark sm:text-xl">
          The Savino-Lopera Household
        </p>
        <div className="mx-auto mt-5 h-px w-48 bg-gold" />
      </header>

      <Suspense fallback={<p className="mt-10 text-center italic text-cocoa/70">Setting the table…</p>}>
        <Potluck />
      </Suspense>

      <footer className="mt-14 text-center text-sm text-cocoa/70">See you there! ♥</footer>
    </main>
  );
}

async function Potluck() {
  const { dishes, error } = await getDishes();
  const headcount = dishes.reduce((sum, d) => sum + d.guests, 0);
  const grouped = CATEGORIES.map((c) => ({ category: c, items: dishes.filter((d) => d.category === c) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <>
      {/* Sign-up */}
      <section className="mt-10 rounded-2xl border border-gold/40 bg-paper p-6 shadow-[0_10px_30px_-15px_rgba(74,42,18,0.35)] sm:p-8">
        <h2 className="text-center font-script text-5xl text-bark">Potluck Sign-up</h2>
        <p className="mb-6 mt-1 text-center text-sm text-cocoa">
          Let us know you&apos;re coming and what you&apos;ll bring — everyone brings something different!
        </p>
        <SignupForm takenDishes={dishes.map((d) => d.dish)} />
      </section>

      {/* Menu */}
      <section className="mt-12">
        <div className="text-center">
          <h2 className="font-script text-5xl text-bark">On the Menu</h2>
          {dishes.length > 0 && (
            <p className="mt-1 font-serif text-xs font-bold uppercase tracking-[0.2em] text-rust">
              {dishes.length} {dishes.length === 1 ? "dish" : "dishes"} · {headcount}{" "}
              {headcount === 1 ? "guest" : "guests"}
            </p>
          )}
        </div>

        {error && <p className="mt-6 text-center text-cranberry">{error}</p>}
        {!error && dishes.length === 0 && (
          <p className="mt-6 text-center italic text-cocoa/70">No dishes yet — be the first to sign up!</p>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {grouped.map(({ category, items }) => (
            <div key={category} className="rounded-2xl border border-gold/30 bg-paper/70 p-5">
              <h3 className="mb-3 border-b border-gold/40 pb-2 font-serif text-sm font-bold uppercase tracking-[0.2em] text-rust">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((d) => (
                  <li key={d.id}>
                    <p className="font-semibold text-bark">{d.dish}</p>
                    <p className="text-sm text-cocoa/80">
                      {d.name}
                      {d.guests > 1 && <span className="text-cocoa/60"> · party of {d.guests}</span>}
                    </p>
                    {d.notes && <p className="text-sm italic text-cocoa/60">{d.notes}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
