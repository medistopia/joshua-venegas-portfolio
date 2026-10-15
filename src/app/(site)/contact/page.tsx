import type { Metadata } from "next";
import { ContactActions } from "@/components/ui/ContactActions";
import { Panel, ViewFrame } from "@/components/views/ViewFrame";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <ViewFrame kicker="Contact" title="Get in touch">
      <Panel className="max-w-[640px] px-5 py-5">
        <ContactActions />
      </Panel>
    </ViewFrame>
  );
}
