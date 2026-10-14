import type { Metadata } from "next";
import { projectCards } from "@/components/lobby/config";
import { Pennant } from "@/components/lobby/Pennant";
import { ViewFrame } from "@/components/views/ViewFrame";

export const metadata: Metadata = { title: "Projects" };

/** Project selection: featured work in priority order, then experiments. */
export default function ProjectsPage() {
  return (
    <ViewFrame kicker="Projects" title="Select a project">
      <h2 className="sr-only">All projects</h2>
      <ul className="grid gap-x-4 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {projectCards.map((item) => (
          <li key={item.project.slug}>
            <Pennant item={item} variant="grid" selected={item.rank === 1} />
          </li>
        ))}
      </ul>
    </ViewFrame>
  );
}
