# GTA VI Portfolio Replica — Ground-Truth Design Spec

## Reference Fidelity Commitment

Yeh project user-provided GTA VI portfolio video ko visual aur interaction reference ke taur par treat karta hai. Chosen approach reference itself hai: desktop-first, full-viewport gaming pause-menu portfolio jisme dark cinematic environment, left-side navigation, character art right side, compact HUD, neon-pink active state, aur narration-quality transitions hon. Fidelity is document mein generic website conventions se zyada important hai.

## Design Movement

**GTA VI promotional key art × interactive pause menu.** Interface ko website ki bajaye playable game menu jaisa feel karna chahiye: cinematic city art ke upar tactical UI panels, badi portrait-led composition, aur micro-HUD details.

## Core Principles

1. **Reference-first composition:** Fixed left navigation, dominant right-side character image, atmospheric background, aur small status HUD reference ke structural anchors hain.
2. **Screen-state storytelling:** About, Experience, Skills aur Projects vertical web sections nahi; ek hi game shell ke replaceable pause-menu states hain.
3. **Cinematic hierarchy:** Bright magenta active UI, white display typography aur controlled overlays dark environment mein focal priority banayenge.
4. **Purposeful motion:** State change ke saath layered fade, short directional drift aur image scale shift use hoga; high-frequency nav interactions compact aur responsive rahengi.

## Color Philosophy

GTA hero ke liye black-charcoal base, sunset crimson/orange environment, violet shadow aur **electric hot pink** active UI accent use honge. Color ka objective neon novelty nahi; vice-city nightlife, heat aur danger ka controlled contrast dena hai. Informational screens reference ke mutabiq blue-violet city atmosphere aur darker translucent panels mein shift karengi.

## Layout Paradigm

Main desktop layout ek full-screen **pause-menu stage** hai: left 30–35% information/navigation lane, right 65–70% image/environment lane. Background full bleed hoga; foreground character title and side panels layered honge. Page scrolling default interaction nahi hogi. Navigation items screen-state replace karenge. Mobile par same experience vertical cinematic card stage mein reshape hoga, na ke standard hamburger landing page mein.

## Signature Elements

1. Narrow uppercase game menu with hot-pink active marker and compact numbered/indicator detail.
2. Money counter, wanted stars, day/time chip aur small frame-map HUD cues.
3. City-art horizon ke against large character silhouette, with scanline/noise texture and dark cinematic vignette.

## Interaction Philosophy

Navigation item hover par concise pink glide aur slight letter-spacing shift hoga. Click par old screen fade/slide out, new environment and character 12–20px lateral drift plus 1.03-to-1 scale settle ke saath enter karenge. Interface keyboard-friendly hoga: arrow keys menu selection change karenge aur Enter current screen activate karega.

## Animation

Screen transition 420–620ms ke andar complete hoga: background opacity crossfade, character transform/opacity, panel content ka 40–60ms stagger, aur accent line ka interpolated movement. Hero backdrop mein sirf very subtle ambient drift allowed hai. `prefers-reduced-motion` ke liye all nonessential movement remove ki jayegi.

## Typography System

`Barlow Condensed` navigation, labels aur data HUD ke liye use hoga; is ka compact game-interface silhouette reference ke qareeb hai. `Bebas Neue` ya comparable tall display font big labels/brand title ke liye use hoga. `DM Sans` body paragraphs/readability ke liye use hoga. Typography intentionally variable weights ke saath cinematic hierarchy banayegi, aur Inter use nahi hogi.

## Brand Essence

**Aapki professional story ko GTA-style interactive mission screen mein present karne wala personal portfolio.** Personality: cinematic, confident, playful.

## Brand Voice

Headlines short aur command-like honge; generic welcome copy avoid hogi. Example lines: “START THE STORY.” aur “MISSION LOG: REAL WORK, REAL RESULTS.”

## Wordmark & Logo

Temporary wordmark `YOUR NAME BUILDS` condensed stacked lettering mein hoga. Actual user name milte hi `YOUR NAME` replace hoga. Logo mark ek bold abstract **V-shaped city/sunset waypoint** hoga: text ke baghair, hot-pink horizon cut aur dark silhouette.

## Signature Brand Color

**Vice Signal Pink — #FF2C8A.**

## Content Replacement Contract

Initial build mein all user content central `portfolioData` object se chalaya jayega. User ko naam, role, bio, skills, experience, projects, social/contact links aur five visual assets provide karne honge. Assets are: hero character cutout, About portrait, Skills portrait, Projects/laptop visual, aur optional Experience city/image. Jab user assets upload karega, existing generated temporary art ko same slots mein replace kiya jayega without layout rewrite.

## Validation Notes

Desktop validation at 1440 × 900 confirms the intended reference composition: fixed dark left rail, dominant right-hand character art, magenta selection state, compact top HUD, right micro-HUD and bottom map remain readable without breaking the cinematic stage. Mobile validation at 390 × 844 confirms the mobile transformation: HUD condenses, navigation becomes horizontally scrollable, and the hero maintains image/text contrast through the dark left-side gradient treatment.

The revised desktop hero at 1440 × 900 verifies that the temporary generated stranger has been replaced by an identity-preserving GTA-style variation created from the user’s supplied portrait. The user’s generated pose remains placed on the right while the left content lane maintains readable contrast.

The mobile hero crop was retuned to a right-biased focal position so the user’s character pose stays visible within the portrait viewport instead of being cropped outside the screen. The dark cinematic overlay continues to protect the main pink and white text hierarchy.

## Motion and Performance Revision

The five original-photo-derived scene images are now served as optimized WebP files rather than 3–4 MB PNG files. Total visual payload for the five scene variants is reduced from approximately 18.7 MB to approximately 236 KB, while only the hero is explicitly preloaded. Each portfolio state now owns a separate desktop and mobile focal point so the portrait composition is no longer forced through one global crop rule.

The revised motion language recreates the reference’s screen-state feel rather than treating the site as static art: a keyed scene wipe runs during each state replacement; the background, bloom and content lane respond at different rates to pointer movement; screen copy reveals in layers; active navigation receives a magenta signal; HUD elements stagger in; stat bars sequence; and dust carries continuous low-intensity atmosphere. The motion is transform/opacity based and honors reduced-motion preferences.

## Motion Component Revision

The final choreography is now driven by a dedicated Motion component system rather than CSS-only entry effects. Each selected section uses presence-aware exit-before-enter content, while background, foreground portrait, bloom, scene wipe and panel copy animate as distinct layers. The foreground portrait has a separate masked layer, so it lifts and drifts independently from the city and car environment. The active nav runner now travels through the pause-menu with a shared spring layout transition. Desktop and mobile validation confirm that this new layer separation does not break portrait framing.

## Boot Intro Cinematic

The opening experience now begins with a full-screen GTA-style boot sequence built around the user’s hero scene. It uses a loading progress timeline, changing mission-status messages, player/class metadata, scanline treatment, corner framing and a skip control. The overlay exits through the same Motion engine into the already-prepared main scene, avoiding a visual background flash. Desktop and mobile destination frames remain readable after the cinematic handoff.

## Full-Stack Asset Vault

The portfolio now runs on the full-stack authentication, database and server runtime. The public pause-menu remains available to visitors, while the owner can access a protected `/vault` route that uploads JPG, PNG, WebP and GIF images through the server-side storage helper. Image bytes live in storage; the database keeps only owner-scoped metadata, the durable storage key, public storage path, type, size, label and current portfolio slot. Assigning an image to Hero, About, Skills, Projects or Experience updates the active slot and the public portfolio reads those assignments through a typed query.

The asset API rejects non-admin callers from library and upload operations. Tests cover owner authorization, latest-per-slot public mapping and storage upload invocation. Desktop and mobile validation confirms both the public cinematic entry and the responsive Asset Vault layout.

An authenticated owner end-to-end verification uploaded the existing hero image through the production storage helper. Storage returned a unique key and `/manus-storage/` URL, asset metadata persisted under the owner, and `currentSlots` immediately returned that URL as the active Hero mapping. The public portfolio consumes the typed current-slot query through a tested slot-resolution helper, so future Vault assignments replace the matching scene image after the standard query refresh.

All five identity-led images that powered the original portfolio are now visible in the Asset Vault as active WebP entries: Hero, About, Skills, Projects and Experience. The owner console shows each stored visual with its assigned slot and LIVE status, while the public portfolio continues to render the Hero from the live storage slot.

A fresh authenticated Asset Vault capture confirms the owner-visible library contains five image cards with visible labels and LIVE slot status for Hero, About, Skills, Projects and Experience.

## Audio and Mission Completion Validation

The original intro score plus navigation, boot-ready and mission-complete cues all resolve successfully from persistent storage. Audio begins muted and changes state only after a user gesture; the shared playback helper resets the cue position, applies the intended volume and safely keeps the interface muted when browser playback is blocked. The Projects Mission Passed choreography has been verified through its live preview state at both desktop and mobile sizes: the project background defocuses behind a centered high-contrast completion card, with readable objective copy and a clear continue action.

The production-like desktop interaction path was also exercised directly: the HUD transitioned from SOUND OFF to SOUND ON after the sound button was clicked, navigation reached Projects, and the real COMPLETE MISSION button displayed the Mission Passed overlay. The overlay then cleared back to the Projects screen after its normal completion interval; the audio button also returned the HUD and rail labels to OFF when toggled. A mobile Mission Passed capture confirms the completion card remains centered and readable in the narrow layout.

## Hero Character Motion

The Hero scene now uses a generated 8-second identity-preserving video loop rather than only a static image. The video is muted, inline and looping, with the hero still retained as both the poster and a runtime fallback. It is only mounted for the Hero screen when reduced motion is not requested; if the clip cannot play, the existing cinematic image remains visible. Desktop and mobile captures retain readable boot copy, controls and subject framing.

Live first-load inspection confirmed the Hero video element is present, muted, looping, actively playing and media-ready, while its static fallback has zero opacity after playback starts. A simulated video error then unmounted the motion layer and restored the stored static Hero poster at full opacity. This verifies both the no-flash video handoff and the runtime fallback path.

A fresh narrow-viewport boot capture confirms the Hero composition holds during mobile first load, with the portrait, essential introductory copy and loading controls remaining visible together. The explicit `shouldRenderHeroMotion` test suite confirms that reduced-motion requests, video failure and non-Hero screens all retain static imagery rather than mounting the video layer.

## Identity-Safe Hero Interim

The synthetic Hero video has been removed because it altered the user's face. The scene now renders the original identity-led Hero image only, retaining transform-based camera drift, independent portrait parallax, ambient bloom and the existing panel choreography. Desktop and mobile checks confirm that the original face, hair and beard are restored while the Hero composition and copy remain readable.

Live DOM verification confirms that no synthetic Hero video element is mounted, the portrait layer is fully visible, and both portrait/backdrop resolve from the original owner-stored Hero asset path. Desktop and mobile captures show the restored face with stable subject alignment and legible foreground copy.

The live owner-stored Hero asset is byte-for-byte identical to the approved original Hero WebP source, verified by matching SHA-256 hashes. Runtime styles use that same asset for both the portrait and backdrop at the configured 76% desktop focal position; mobile captures confirm the corresponding mobile composition remains readable without a synthetic video layer.
