# Audio correction validation notes

- The first runtime inspection found that an autoplay attempt could leave the background element playing while still muted.
- Deliberate user-triggered playback now explicitly clears that transient mute before calling `play()`, while the automatic bootstrap remains policy-safe and muted during its initial handoff.
