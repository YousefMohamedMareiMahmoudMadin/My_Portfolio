import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "./Projects";
import { Github, Linkedin, Mail, Send, CheckCircle2 } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-store";

// 
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const schema = z.object({
  name: z.string().trim().min(2, "Please share your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(200),
  message: z.string().trim().min(10, "Message needs at least 10 characters").max(1000),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function Contact() {
  const { data } = usePortfolioData();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Errors = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as keyof Errors] = i.message;
      });
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);

    try {
      
      const response = await fetch("https://formspree.io/f/xdarbkpo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(result.data)
      });

      if (response.ok) {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message. Please try again or use the social links.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="px-6 py-24 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div className="min-w-0">
          <SectionHeading eyebrow="05 / Contact" title={data.contactHeading} />
          <p className="mt-6 text-muted-foreground">
            Open to junior roles.
          </p>

          <div className="mt-10 space-y-4">
           
            <a
              href="https://wa.me/201127625785"
              target="_blank"
              rel="noreferrer"
              className="glass-panel flex items-center gap-4 rounded-lg p-4 transition-colors hover:border-primary/40"
            >
              <WhatsAppIcon className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp</div>
                <div className="truncate font-mono text-sm">+20 112 762 5785</div>
              </div>
            </a>

            <a
              href={`mailto:${data.profile.email}`}
              className="glass-panel flex items-center gap-4 rounded-lg p-4 transition-colors hover:border-primary/40"
            >
              <Mail className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
                <div className="truncate font-mono text-sm">{data.profile.email}</div>
              </div>
            </a>
            <a
              href={data.profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="glass-panel flex items-center gap-4 rounded-lg p-4 transition-colors hover:border-primary/40"
            >
              <Linkedin className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">LinkedIn</div>
                <div className="truncate font-mono text-sm">{data.profile.linkedin}</div>
              </div>
            </a>
            <a
              href={data.profile.github}
              target="_blank"
              rel="noreferrer"
              className="glass-panel flex items-center gap-4 rounded-lg p-4 transition-colors hover:border-primary/40"
            >
              <Github className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">GitHub</div>
                <div className="truncate font-mono text-sm">{data.profile.github}</div>
              </div>
            </a>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="glass-panel min-w-0 rounded-xl p-6 sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold">Message sent</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                Thanks for reaching out — I'll get back to you shortly.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                Send another
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={update("name")}
                  maxLength={80}
                  autoComplete="name"
                  className="mt-2 h-11"
                  aria-invalid={!!errors.name}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  maxLength={200}
                  autoComplete="email"
                  className="mt-2 h-11"
                  aria-invalid={!!errors.email}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={update("message")}
                  maxLength={1000}
                  rows={6}
                  className="mt-2 resize-none"
                  aria-invalid={!!errors.message}
                  disabled={isSubmitting}
                />
                <div className="mt-1.5 flex items-center justify-between">
                  <p className="text-xs text-destructive">{errors.message ?? ""}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {form.message.length}/1000
                  </p>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                <Send /> {isSubmitting ? "Sending..." : "Send message"}
              </Button>
            </div>
          )}
        </form>
      </div>
<footer suppressHydrationWarning className="text-center font-mono text-xs ...">
  Designed and engineered by {data.profile.name} — {new Date().getFullYear()}
</footer>
    </section>
  );
}