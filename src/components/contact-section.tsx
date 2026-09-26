import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { editor } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { budgets, projectTypes, submitInquiry } from "@/lib/inquiry";
import { useCursor } from "@/components/magnetic-cursor";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppLink, hasWhatsApp } from "@/components/whatsapp-link";

type FormState = {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  footage: string;
};

const empty: FormState = {
  name: "",
  email: "",
  projectType: "",
  budget: "",
  footage: "",
};

export function ContactSection() {
  const { setMode } = useCursor();
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [fail, setFail] = useState("");
  const chat = hasWhatsApp();

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const snapshot: FormState = {
      name: String(data.get("name") ?? form.name).trim(),
      email: String(data.get("email") ?? form.email).trim(),
      projectType: String(data.get("projectType") || form.projectType),
      budget: String(data.get("budget") || form.budget),
      footage: String(data.get("footage") ?? form.footage).trim(),
    };
    setForm(snapshot);
    const next: Partial<FormState> = {};
    if (!snapshot.name) next.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(snapshot.email))
      next.email = "A valid email is required.";
    if (!snapshot.projectType) next.projectType = "Choose a project type.";
    if (!snapshot.budget) next.budget = "Choose a budget range.";
    if (snapshot.footage && !/^https?:\/\//i.test(snapshot.footage))
      next.footage = "Use a full https link.";
    setErrors(next);
    setFail("");
    if (Object.keys(next).length > 0) return;

    setPending(true);
    try {
      const result = await submitInquiry({
        data: {
          name: snapshot.name,
          email: snapshot.email,
          projectType: snapshot.projectType,
          budget: snapshot.budget,
          footage: snapshot.footage,
          honey: String(data.get("company") ?? ""),
        },
      });
      if (!result.ok) {
        if ("errors" in result && result.errors) {
          setErrors({
            name: result.errors.name,
            email: result.errors.email,
            projectType: result.errors.projectType,
            budget: result.errors.budget,
            footage: result.errors.footage,
          });
        }
        setFail(
          "error" in result && result.error
            ? result.error
            : "Could not send. Email me directly.",
        );
        return;
      }
      setSent(true);
    } catch {
      setFail("Could not send just now. Email me directly and I’ll pick it up.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section id="contact" className="bg-surface">
      <div className="mx-auto max-w-[1440px] px-5 py-28 lg:px-10">
        <SectionHeading
          index="06"
          kicker="Project inquiry"
          title={
            <>
              Tell me about the <em className="italic">footage.</em>
            </>
          }
        >
          <p className="mt-4 max-w-xl text-pretty text-stone">
            New campaigns, collabs, and freelance cuts. I read every note —
            it comes straight to my inbox
            {chat ? ", or ping me on WhatsApp if it’s moving fast." : "."}
          </p>
        </SectionHeading>

        <Reveal className="mt-12" delay={0.06}>
          {sent ? (
            <div
              role="status"
              aria-live="polite"
              className="max-w-2xl rounded-3xl border border-line bg-canvas p-10 shadow-[var(--shadow-soft)]"
            >
              <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">
                Inquiry received
              </p>
              <p className="font-display mt-4 text-3xl text-ink italic">
                I’ll reply within two working days.
              </p>
              <p className="mt-3 text-stone">
                For something urgent, write{" "}
                <a
                  className="text-ink underline decoration-line underline-offset-4"
                  href={`mailto:${editor.email}`}
                >
                  {editor.email}
                </a>
                {chat ? (
                  <>
                    {" "}
                    or{" "}
                    <WhatsAppLink className="text-ink underline decoration-line underline-offset-4" />
                  </>
                ) : null}
                .
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              className="cursor-native grid max-w-3xl gap-6 rounded-3xl border border-line bg-canvas p-6 shadow-[var(--shadow-soft)] sm:p-10"
              onMouseEnter={() => setMode("native")}
              onMouseLeave={() => setMode("default")}
            >
              <input type="hidden" name="projectType" value={form.projectType} />
              <input type="hidden" name="budget" value={form.budget} />
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <Field id="name" label="Name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  className={inputClass(Boolean(errors.name))}
                  {...field("name")}
                />
              </Field>

              <Field id="email" label="Email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass(Boolean(errors.email))}
                  {...field("email")}
                />
              </Field>

              <fieldset>
                <legend className="font-mono text-[10px] tracking-[0.18em] text-stone uppercase">
                  Project type
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {projectTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      data-project-type={type}
                      onClick={() =>
                        setForm((f) => ({ ...f, projectType: type }))
                      }
                      className={cn(
                        "rounded-full border px-4 py-2.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-[background-color,border-color,color] duration-150",
                        form.projectType === type
                          ? "border-accent bg-accent text-accent-fg"
                          : "border-line bg-surface text-stone hover:border-accent hover:text-ink",
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.projectType ? (
                  <p className="mt-2 text-sm text-accent">{errors.projectType}</p>
                ) : null}
              </fieldset>

              <fieldset>
                <legend className="font-mono text-[10px] tracking-[0.18em] text-stone uppercase">
                  Estimated budget
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {budgets.map((budget) => (
                    <button
                      key={budget}
                      type="button"
                      data-budget={budget}
                      onClick={() => setForm((f) => ({ ...f, budget }))}
                    className={cn(
                        "rounded-full border px-4 py-2.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-[background-color,border-color,color] duration-150",
                        form.budget === budget
                          ? "border-accent bg-accent text-accent-fg"
                          : "border-line bg-surface text-stone hover:border-accent hover:text-ink",
                      )}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
                {errors.budget ? (
                  <p className="mt-2 text-sm text-accent">{errors.budget}</p>
                ) : null}
              </fieldset>

              <Field
                id="footage"
                label="Footage / Drive link"
                hint="Frame.io, Drive, Dropbox — optional"
                error={errors.footage}
              >
                <input
                  id="footage"
                  name="footage"
                  type="url"
                  placeholder="https://"
                  className={inputClass(Boolean(errors.footage))}
                  {...field("footage")}
                />
              </Field>

              {fail ? (
                <p className="text-sm text-accent" role="alert">
                  {fail}{" "}
                  <a
                    href={`mailto:${editor.email}`}
                    className="underline decoration-line underline-offset-4"
                  >
                    {editor.email}
                  </a>
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <DirectLinks />
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-full bg-ink px-7 py-3.5 font-mono text-[11px] tracking-[0.18em] text-accent-fg uppercase transition-transform duration-150 ease-out active:scale-[0.96] disabled:opacity-60"
                >
                  {pending ? "Sending…" : "Send inquiry"}
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function DirectLinks() {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone">
      <span>Or write directly:</span>
      <a
        href={`mailto:${editor.email}`}
        className="text-ink underline decoration-line underline-offset-4"
      >
        {editor.email}
      </a>
      <WhatsAppLink className="text-ink underline decoration-line underline-offset-4" />
    </p>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "h-12 w-full rounded-xl border bg-surface px-4 text-ink outline-none transition-[border-color] duration-150 placeholder:text-stone/60 focus:border-accent",
    invalid ? "border-accent" : "border-line",
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono text-[10px] tracking-[0.18em] text-stone uppercase"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error ? (
        <p className="mt-1.5 text-xs text-stone">{hint}</p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
