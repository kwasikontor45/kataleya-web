# kataleya-web — RETIRED (2026-07-06)

This repo was a working prototype (onboarding → journal → PIN-gated
clinician view, all localStorage-only) built July 2–3, 2026. It was
never connected to the main Kataleya effort and became an undiscovered
duplicate: a second live "Kataleya" web app at a second domain, built
without the rest of the project's design language, philosophy work,
or ongoing attention.

**Single source of truth going forward:** kontor.studio/kataleya-demo/
(repo: `kwasikontor45/kontor-studio`, path `kataleya-demo/`).

The one genuinely good idea in here — a patient-set PIN that gates a
diagnostic view so they can deliberately show a clinician their real
progress — has been ported over there, reusing the demo's own real
data (the "mirror" screen) instead of a separate duplicate view. See
`kataleya-demo/index.html`'s `clinician_pin_hash` / mirror-gate logic,
and settings screen's "clinician PIN" field.

This repo is archived, not deleted, so the history isn't lost. The
`kataleya.kontor.studio` domain has been detached — nothing is served
there anymore.
