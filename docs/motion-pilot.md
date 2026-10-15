# Motion pilot

Authorized October 14, 2026: lobby entrance, Projects tab entrance, pennant and collaborator feedback. This is the review gate before extending motion to other views. No animation dependency, cloned view, exit queue or navigation lock is added.

| Interaction | Specification |
|---|---|
| Lobby entrance | Identity at 0ms; priority-ordered pennants at 60/120/180ms; highlight tiles at 180/240/300ms. Each uses the existing 480ms duration and ease-out. Last element finishes at 780ms. |
| Text during entrance | Opacity starts at 0.92 and reaches 1, with 8px travel. Readability takes precedence over a dramatic fade from invisible text. Base CSS is the final visible state; animation uses backwards fill only. |
| Projects tab pilot | Incoming Projects frame: 200ms, 4px rise, 0.92 → 1 opacity. Native Next links/history remain responsible for navigation. No outgoing copy is retained by the motion implementation. Direct page arrivals use the same entrance. |
| Focus | Focus within an entering group cancels its entrance immediately, so focus does not wait behind a delay or fade. The link itself keeps the unclipped 2px teal ring. |
| Pennants | Existing 4px lift and 1.03 artwork scale, both now 200ms; border/accent response 120ms. Static set-back geometry stays unchanged. |
| Collaborators | Opening popover: 160ms, 4px horizontal travel, 0.92 → 1. Focus within cancels the entrance. Close remains immediate through native popover behavior. |
| Persistent shell | Top bar, rail and backdrop do not receive entrance transforms. Existing static background dimming for inner views is retained. |
| Carousel | Existing 8-second timing, pause/hold/manual behavior, inert slides, announcements and text backing preserved. |
| Reduced motion | Global stylesheet disables keyframes and zeros movement/zoom. Content is immediately in its final position. Existing opacity/color interactions remain at most 120ms. |

Shared additions in `globals.css`: `--dur-stagger` (60ms), `--dur-popover` (160ms), `--move-view` (4px), `--motion-readable-opacity` (0.92). Components carry sequence indices rather than millisecond literals.

Entrance runs when the lobby is mounted or restored by the framework; no session-storage flag is added to suppress return visits. Projects is the only incoming-tab pilot. Other tab entrances and case-study transitions remain for review after this pilot.

An ambient loop is deferred after inspecting the existing bright architectural beam: the composition already supplies depth, while another layer would add continuous distraction and more contrast states. This is a pilot judgment for review, not a permanent ban.

Verification includes actual CSS timing, sampled start/midpoint contrast, focus interruption, navigation during an active entrance, Back history, persistent shell identity, reduced motion, no-JavaScript content, and recordings of both motion modes. Still captures wait for fonts, images and motion to settle; videos show real-time behavior and are not pixel-deterministic benchmarks. See `verification/motion-pilot/README.md` for actual run results.
