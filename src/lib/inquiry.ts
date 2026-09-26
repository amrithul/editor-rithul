import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const projectTypes = [
  "Commercial",
  "Music Video",
  "Narrative",
  "Social",
  "Other",
] as const;

export const budgets = [
  "Under $8k",
  "$8–20k",
  "$20–50k",
  "$50k+",
] as const;

const INBOX = "rithullmp4@gmail.com";

const InquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(200),
  projectType: z.enum(projectTypes),
  budget: z.enum(budgets),
  footage: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((value) => value ?? ""),
  honey: z.string().optional(),
});

export type InquiryInput = z.infer<typeof InquirySchema>;

type FieldErrors = Partial<Record<keyof InquiryInput, string>>;

const rate = globalThis as typeof globalThis & {
  __inquiryHits__?: number[];
};

function allowRequest() {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const hits = (rate.__inquiryHits__ ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= 12) return false;
  hits.push(now);
  rate.__inquiryHits__ = hits;
  return true;
}

function fieldErrors(error: z.ZodError): FieldErrors {
  const next: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !next[key as keyof InquiryInput]) {
      next[key as keyof InquiryInput] = issue.message;
    }
  }
  return next;
}

async function deliver(data: InquiryInput) {
  const payload = {
    name: data.name,
    email: data.email,
    _replyto: data.email,
    _subject: `Project inquiry — ${data.projectType}`,
    projectType: data.projectType,
    budget: data.budget,
    footage: data.footage || "(none)",
    _template: "table",
    _captcha: "false",
  };

  const res = await fetch(`https://formsubmit.co/ajax/${INBOX}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: "https://rithul.mp4",
      Referer: "https://rithul.mp4/",
    },
    body: JSON.stringify(payload),
  });

  const body = (await res.json().catch(() => null)) as {
    success?: string | boolean;
    message?: string;
  } | null;

  const flag = String(body?.success ?? "");
  const message = body?.message ?? "";
  if (flag === "true" || /activat/i.test(message)) return;

  throw new Error(message || `Delivery failed (${res.status})`);
}

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((input: unknown) => input)
  .handler(async ({ data }) => {
    const parsed = InquirySchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false as const, errors: fieldErrors(parsed.error) };
    }

    // Silent success for bots that fill the hidden field.
    if (parsed.data.honey) {
      return { ok: true as const };
    }

    if (!allowRequest()) {
      return {
        ok: false as const,
        error: "Too many inquiries just now. Write me directly or try again shortly.",
      };
    }

    try {
      await deliver(parsed.data);
      return { ok: true as const };
    } catch {
      return {
        ok: false as const,
        error: "Could not send just now. Email me directly and I’ll pick it up.",
      };
    }
  });
