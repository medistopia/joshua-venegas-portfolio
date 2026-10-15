import { profile } from "@/content/profile";

export function StatusStrip() {
  return (
    <div className="absolute inset-x-0 bottom-0 hidden h-10 items-center gap-3 border-t border-line bg-bg-deep/80 px-10 backdrop-blur-md lg:flex short:px-8">
      <span className="label text-text-muted">Currently</span>
      <span className="text-sm">{profile.education}</span>
    </div>
  );
}
