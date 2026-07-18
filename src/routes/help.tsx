import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Phone } from "lucide-react";

import "@/i18n/config";
import { BackButton } from "@/components/sathi/BackButton";
import { MicButton } from "@/components/sathi/MicButton";
import { PageTransition } from "@/components/sathi/PageTransition";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help — Sathi" }] }),
  component: Help,
});

function Help() {
  const { t } = useTranslation();
  const faqs = t("help.faqs", { returnObjects: true }) as {
    q: string;
    a: string;
  }[];

  return (
    <PageTransition>
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 pb-40 pt-8">
        <BackButton to="/home" />
        <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-foreground">
          {t("help.title")}
        </h1>

        <a
          href="tel:+18001110000"
          className="mt-6 inline-flex items-center justify-center gap-3 rounded-3xl bg-emerald px-6 py-5 font-display text-lg font-semibold text-emerald-foreground"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          {t("help.callSupport")}
        </a>

        <Accordion type="single" collapsible className="mt-8 flex flex-col gap-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`f-${i}`}
              className="overflow-hidden rounded-2xl border border-border bg-panel px-5"
            >
              <AccordionTrigger className="py-5 text-left font-display text-lg font-medium hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <MicButton />
      </main>
    </PageTransition>
  );
}
