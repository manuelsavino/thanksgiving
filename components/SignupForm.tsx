"use client";

import { useActionState, useEffect, useRef } from "react";
import { addDish, type FormState } from "@/app/actions";
import { CATEGORIES } from "@/lib/supabase";

const input =
  "w-full rounded-lg border border-gold/50 bg-paper px-3 py-2 text-bark placeholder:text-cocoa/40 focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/20";
const label = "mb-1 block font-serif text-xs font-bold uppercase tracking-[0.15em] text-rust";

export default function SignupForm({ takenDishes }: { takenDishes: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(addDish, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
        <div>
          <label htmlFor="name" className={label}>Your name</label>
          <input id="name" name="name" required maxLength={80} placeholder="Aunt Linda" className={input} />
        </div>
        <div>
          <label htmlFor="guests" className={label}>Party of</label>
          <input id="guests" name="guests" type="number" min={1} max={20} defaultValue={1} required className={input} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
        <div>
          <label htmlFor="dish" className={label}>What you&apos;re bringing</label>
          <input
            id="dish"
            name="dish"
            required
            maxLength={120}
            placeholder="Grandma's sweet potato casserole"
            list="taken"
            className={input}
          />
          <datalist id="taken">
            {takenDishes.map((d) => (
              <option key={d} value={d} label="Already taken" />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="category" className={label}>Category</label>
          <select id="category" name="category" required defaultValue="" className={input}>
            <option value="" disabled>Choose…</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={label}>Notes <span className="normal-case tracking-normal text-cocoa/50">(optional)</span></label>
        <input id="notes" name="notes" maxLength={280} placeholder="Contains nuts, gluten-free, need oven space…" className={input} />
      </div>

      {state && (
        <p
          role="status"
          className={`rounded-lg px-3 py-2 text-sm ${state.ok ? "bg-leaf/15 text-leaf" : "bg-cranberry/10 text-cranberry"}`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-bark px-6 py-3 font-serif text-sm font-bold uppercase tracking-[0.2em] text-cream transition hover:bg-cocoa disabled:opacity-60"
      >
        {pending ? "Adding…" : "Count me in ♥"}
      </button>
    </form>
  );
}
