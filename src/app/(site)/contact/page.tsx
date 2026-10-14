import type { Metadata } from "next";
import { ContactActions } from "@/components/ui/ContactActions";
import { PageBody, PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageBody>
      <PageHeader eyebrow="Contact" title="Get in touch" />
      <ContactActions />
    </PageBody>
  );
}
