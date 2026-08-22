# User Asset Replacement Tasks

- [x] Confirm whether the supplied original portrait should be used unchanged or adapted into additional GTA-style portrait scenes.
- [x] Replace the generated hero character art with the user’s original portrait in the GTA hero screen.
- [x] Collect or create user-approved source images for About, Skills, Projects and Experience screen slots.
- [x] Replace all remaining generated temporary imagery only after the user approves the asset approach.
- [x] Validate desktop and mobile crop/contrast after the original assets are integrated.

## Approved pose-generation tasks

- [x] Generate an identity-preserving GTA-style standing hero pose using the supplied original portrait as the sole person reference.
- [x] Generate an identity-preserving seated About portrait and desk-based Skills portrait from the supplied original photo.
- [x] Generate an identity-preserving Projects scene and an Experience city scene that retain the supplied face, hair and beard identity anchors.
- [x] Replace every temporary generated stranger image in the portfolio data with the approved identity-led assets.

## Motion and performance correction

- [x] Convert the five full-resolution identity-led artworks into responsive WebP derivatives and preload only the hero scene.
- [x] Add per-screen desktop and mobile image focal positions so each portrait remains correctly framed.
- [x] Implement animated background drift, independent character float/parallax, and layered screen-state transition choreography.
- [x] Add navigation indicator glide, panel stagger reveals, stat-bar sequence and project-card transition motion.
- [x] Validate first-load performance plus desktop and mobile motion behavior after the overhaul.

## Cinematic motion choreography revision

- [x] Replace CSS-only scene entry with AnimatePresence-driven exit-before-enter choreography.
- [x] Split each screen into independently animated background, portrait, HUD, panel and copy layers.
- [x] Implement reference-style menu indicator travel and section-specific motion timing.
- [x] Add a character-image foreground lift, background camera drift and content-line stagger that responds to screen selection.
- [x] Validate actual section-switch animation behavior in the live preview.

## Loading intro cinematic

- [x] Create a full-screen GTA-style boot/loading overlay that uses the user's identity-led hero art.
- [x] Implement timed mission lines, a loading progress sequence and an optional skip control.
- [x] Choreograph the intro exit into the main Motion-driven portfolio scene without a visual flash.
- [x] Validate desktop and mobile intro timing, progress bar behavior and skip interaction.

## Audio and mission reveal

- [x] Generate an original, instrumental GTA-inspired nocturnal city synth score for the intro and menu ambience.
- [x] Generate original compact UI sound effects for navigation, intro completion and project mission completion.
- [x] Add user-gesture-based music playback with a visible mute/unmute control.
- [x] Implement a Motion-driven Mission Passed overlay after a project case-file reveal action.
- [x] Verify audio fallback behavior and the Mission Passed sequence on desktop and mobile.

## Full-stack File Storage integration

- [x] Upgrade the static portfolio to the full-stack user/auth and storage runtime.
- [x] Create authenticated asset metadata records that store file URL, storage key, MIME type, label and assigned portfolio slot.
- [x] Add secure upload, asset-library listing and portfolio-slot assignment procedures.
- [x] Add an owner-only asset library interface that updates Hero, About, Skills, Projects and Experience visuals.
- [x] Validate sign-in protection, upload states, asset assignment and portfolio image refresh behavior.

## Pending File Storage end-to-end validation

- [x] Run a real owner upload and slot-assignment flow, then confirm that the public portfolio consumes the stored asset slot.
- [x] Add coverage for asset-slot assignment invalidation and refreshed current-slot consumption in the portfolio UI.

## Existing image migration to Asset Vault

- [x] Audit existing identity-led WebP scene images and current owner storage records.
- [x] Upload About, Skills, Projects and Experience images to owner storage with their matching portfolio slots.
- [x] Confirm Hero, About, Skills, Projects and Experience are all visible as active assets in the Asset Vault library.

## Authenticated Asset Vault visual verification

- [x] Verify the owner-visible Asset Vault lists Hero, About, Skills, Projects and Experience with LIVE status.
- [x] Capture fresh authenticated Asset Vault UI evidence after the existing image migration.

## Audio and mission interaction verification

- [x] Validate desktop and mobile Projects Mission Passed reveal through the live interaction path.
- [x] Verify muted-by-default, user-gesture sound enable and blocked-playback fallback states.

## Audio priority pass

- [x] Confirm generated intro score and all three UI sound cues are available from persistent storage paths.
- [x] Verify sound enable, mute and autoplay-blocked fallback behavior from the portfolio controls.
- [x] Verify Projects Mission Passed overlay choreography on desktop and mobile viewports.

## Cinematic character motion loops

- [ ] Generate a subtle identity-preserving Hero motion loop with eye movement, natural blink, breathing and a slight head turn. Deferred: the user supplied an approved Hero source video, avoiding synthetic identity changes.
- [ ] Generate identity-preserving About, Skills, Projects and Experience motion loops with section-appropriate micro-movement. Deferred: matching user-provided scene videos are active instead.
- [ ] Upload optimized motion clips to persistent web storage and map them to their matching portfolio screens. Deferred with the ungenerated motion-loop scope.
- [ ] Add scene-aware video playback with image fallback, reduced-motion support and mobile-friendly loading behavior. Deferred only as part of this ungenerated motion-loop scope; the separate user-video playback system is already complete.
- [ ] Validate character motion clips on desktop and mobile without obstructing portfolio copy or controls. Deferred pending user approval for generated clips.

## Hero motion clip integration

- [x] Upload the generated Hero micro-motion loop to persistent web storage.
- [x] Render the Hero loop as an autoplaying, muted, inline scene layer with the still image retained as a fallback poster.
- [x] Respect reduced-motion preferences and retain static hero art if the motion clip cannot load.
- [x] Validate Hero video framing, copy contrast and first-load behavior on desktop and mobile.

## Hero motion first-load verification

- [x] Verify the Hero video autoplay-ready path and no-flash handoff from still poster on desktop and mobile.
- [x] Verify the static poster remains usable when the Hero motion video is unavailable or reduced motion is enabled.

## Hero mobile and reduced-motion verification

- [x] Capture mobile first-load evidence that the Hero video requests, autoplays and hands off from the still poster.
- [x] Add explicit reduced-motion decision coverage confirming that the Hero video does not mount and static art remains visible.

## Hero mobile runtime proof

- [x] Collect mobile-viewport runtime evidence that the Hero video is mounted, playing and has handed off from the still fallback.
- [x] Capture explicit mobile runtime evidence that an advancing Hero video frame has replaced the static fallback layers.

## Hero face identity-lock correction

- [ ] Create an identity-corrected Hero motion clip using the original supplied face reference and the existing Hero clip only for movement reference. Deferred: the user supplied an approved identity-safe Hero video instead.
- [ ] Verify the corrected clip preserves the user's facial features, hairline, beard and skin tone while retaining subtle Hero motion. Deferred pending any future corrected generated clip.
- [ ] Replace the current Hero motion source only after identity fidelity is visibly acceptable. Deferred: the active source is already the user-approved original video.
- [ ] Validate the corrected Hero clip in desktop and mobile portfolio compositions. Deferred pending a future corrected generated clip.

## Identity-safe interim Hero motion

- [x] Remove the identity-mismatched Hero video clip from the live scene.
- [x] Restore the original Hero art with subtle camera drift and parallax only; no synthetic facial changes.
- [x] Validate original-face consistency and desktop/mobile Hero framing after the safe interim restoration.

## Restored Hero runtime verification

- [x] Verify the live Hero scene has no mounted synthetic motion video and uses the original stored Hero asset path.
- [x] Document desktop and mobile Hero identity/framing evidence after the safe interim restoration.

## Restored Hero visual evidence

- [x] Produce inspectable desktop and mobile evidence tying the final rendered Hero to the original stored face asset and its focal framing.

## Restored Hero mobile runtime evidence

- [x] Inspect mobile-viewport computed Hero asset path and focal position to confirm the original stored portrait remains active.
- [x] Lock the dormant Hero motion helper to the original static portrait until a user-provided video is assigned.
- [x] Capture live mobile runtime computed styles proving the active Hero layers use the original portrait and no video is mounted.

## Real profile content replacement

- [x] Collect the user's LinkedIn URL, GitHub URL, CV/resume and final approved motion video.
- [x] Extract only verified name, role, biography, skills, experience, education and projects from the provided sources.
- [x] Replace placeholder portfolio copy, project cards, social links and contact details with verified user content.
- [x] Integrate the user-provided final motion video into the prepared Hero visual slot with a static fallback.
- [x] Validate the real-data portfolio on desktop and mobile after content and video replacement.

## User-provided Hero video integration

- [x] Assess `preserved-subtle-animation.mp4` for identity fidelity, framing, duration and playback compatibility.
- [x] Upload the approved user-provided Hero video to persistent web storage.
- [x] Render the approved Hero video only on the Start screen with the original portrait retained as poster and failure fallback.
- [x] Validate the approved Hero video on desktop and mobile, including reduced-motion and playback-failure fallback behavior.

## Current motion scope

- [x] Keep About, Skills, Projects and Experience scenes static until the user supplies approved motion videos for those screens.

## Hero seamless-loop correction

- [x] Inspect the supplied Hero clip's first and final frames to determine a visually safe loop overlap.
- [x] Render an identity-preserving crossfaded Hero loop from the user-supplied source video.
- [x] Replace the current Hero playback source with the seamless-loop asset while retaining poster and failure fallback behavior.
- [x] Validate the corrected loop boundary on desktop and mobile playback.
- [x] Capture live desktop evidence that the seamless-loop Hero video wraps and remains actively playing beyond one clip duration.

## New portrait video replacement

- [x] Assess `night-portrait-living.mp4` to identify the existing portfolio images/scenes it visually matches.
- [x] Upload the approved new portrait video to persistent web storage.
- [x] Replace only the matching existing image slots with scene-aware video layers and retain their static-image fallbacks.
- [x] Validate matching scene-video playback and fallback behavior on desktop and mobile.

## Scene framing correction

- [x] Audit desktop and mobile focal framing for every static image and active scene video.
- [x] Correct over-zoomed object-fit behavior for portrait videos without changing identity or scene content.
- [x] Set separately verified desktop/mobile focal positions so each subject remains visible beside portfolio copy.
- [x] Validate the corrected framing across all seven screens on desktop and mobile.

## Video visibility restoration

- [x] Diagnose why universal mobile contain framing makes active videos visually disappear.
- [x] Restore a balanced visible scale for Hero, About and Academy videos without clipping identity-critical content.
- [x] Keep static image scenes independently framed without forcing their behavior onto active video layers.
- [x] Validate visible video playback and fallback composition on desktop and mobile.

## High-resolution video composition

- [x] Measure the active user-provided video aspect ratios against the desktop and mobile portfolio stages.
- [x] Define dedicated high-resolution video stage rules that preserve prominent subject scale and copy-safe space.
- [x] Implement responsive native-composition playback for Hero, About and Academy videos.
- [x] Validate high-resolution video clarity, framing and static fallback on desktop and mobile.
- [x] Capture fresh post-scale visual evidence that Hero, About and Academy videos remain clearly visible beside portfolio copy.
- [x] Revalidate reduced-motion and blocked-video static fallback after the high-resolution framing update.
- [x] Preserve explicit post-fix Hero, About and Academy desktop/mobile capture findings alongside their live runtime evidence.
- [x] Obtain independent rendered-page visual review evidence for final Hero, About and Academy video visibility and copy readability.
- [x] Run a post-checkpoint trusted review of settled Hero, About and Academy scenes to confirm visible video and readable copy.
- [x] Run direct multimodal analysis of final rendered Hero, About and Academy captures for visible portrait/video and readable copy confirmation.

## Two new user-provided scene videos

- [x] Assess `cinematic-rooftop-bg-motion.mp4` and `rainy-desk-live.mp4` against existing static screen artwork.
- [x] Upload both approved scene videos to persistent web storage.
- [x] Map each video only to matching current static-image screens, with dedicated high-resolution framing and static fallback.
- [x] Validate both new video scenes on desktop and mobile, including reduced-motion and load-failure fallback.

## Contact rooftop video replacement

- [x] Replace the Contact scene's static visual with the newly supplied rooftop video, retaining static fallback behavior.
- [x] Set responsive Contact video framing that keeps the subject and laptop visible without obstructing copy.
- [x] Validate Contact video playback and static fallback on desktop and mobile.

## Scene-video loading and loop continuity

- [x] Audit Academy's delayed video start and current active scene-video loading strategy.
- [x] Create seamless loop assets for the user-provided scene videos that currently show a visible restart.
- [x] Replace the Projects scene static artwork with an approved existing user-provided video and preserve static fallback behavior.
- [x] Optimize playback readiness without increasing initial page-media load cost.
- [x] Validate seamless playback, Project video rendering, and desktop/mobile fallbacks for all adjusted scenes.
- [x] Validate the remapped About, Skills, Experience and Contact seamless videos across desktop/mobile playback and fallback states.
- [x] Confirm active About, Skills, Experience and Contact playback mounts the new seamless storage sources after remapping.

## Experience artwork for animation

- [x] Provide the current Experience static artwork to the user for an identity-preserving animation source.

## Newly supplied motion-video replacement

- [x] Analyze the new supplied motion video and identify every portfolio static image it visually matches.
- [x] Upload the approved video and replace each matching static scene while keeping static fallbacks.
- [x] Validate matching scenes on desktop/mobile, including seamless loop continuity and failure fallback behavior.
- [x] Confirm the new Experience seamless source is actively mounted and playing on desktop.

## Experience no-crop video framing

- [x] Inspect the Experience video crop against the supplied full widescreen composition on desktop and mobile.
- [x] Remove over-zoomed Experience framing while preserving subject, rooftop and city visibility.
- [x] Validate corrected Experience video and static fallback framing on desktop and mobile.

## Original-quality Experience video restoration

- [x] Restore the unmodified user-supplied Experience video and remove the processed loop variant.
- [x] Keep native 16:9 framing with no crop, zoom or visual softening.
- [x] Validate original-quality Experience playback and static fallback on desktop and mobile.

## Experience timeline key warning

- [x] Replace duplicate Experience timeline React keys with stable unique identifiers.
- [x] Verify the Experience screen renders without duplicate-key console warnings.

## Manual sound-off persistence

- [x] Identify every navigation or interaction path that can automatically enable sound.
- [x] Keep sound off after a manual mute until the user explicitly toggles it back on.
- [x] Validate mute persistence across section navigation and Project mission interactions.

## Loading-complete music startup

- [x] Start the background music automatically when the portfolio loading sequence completes.
- [x] Preserve user-controlled SOUND OFF behavior after automatic music startup.
- [x] Validate music startup after loading and persistent mute across navigation.

## Direct-open boot completion repair

- [x] Inspect the 100% loader state and identify the visible boot transition glitch.
- [x] Make direct portfolio opens use a smooth boot completion handoff without the 100% glitch.
- [x] Ensure post-load music startup follows the same behavior as the chat preview where browser policy permits.
- [x] Validate desktop and mobile direct-open boot completion, music state, and manual sound-off behavior.

## Default sound-on and music restoration

- [x] Inspect why direct open presents SOUND OFF and background music is not playing.
- [x] Restore default SOUND ON state and the background music source on portfolio open.
- [x] Validate default music playback plus persistent manual sound-off behavior.
- [x] Start music on the first portfolio interaction only when browser autoplay is blocked and the user has not manually muted it.

## Cinematic loader restoration and automatic music

- [x] Restore the visible 0–100% cinematic loading screen for normal portfolio opens.
- [x] Fix the loader's 100% completion handoff without removing the loading screen.
- [x] Start default SOUND ON music immediately at loading completion rather than on Skills navigation.
- [x] Validate desktop/mobile loading cinematic, automatic music, and persistent manual SOUND OFF behavior.

## Expanded verified Projects section

- [x] Re-review the supplied CV plus public GitHub and LinkedIn sources for every verifiable project.
- [x] Expand the Projects section with source-backed case files and working destination links.
- [x] Validate the additional Projects cards and details on desktop and mobile.

## Requested project removal

- [x] Remove only the Awwwards Portfolio Design card from Projects.
- [x] Validate the remaining Projects cards and mission selector after removal.

## Search-bar name label

- [x] Replace the search-bar placeholder text with SIKANDAR.
- [x] Verify the updated search-bar label renders correctly.

## CV download and Contact social links

- [x] Add a downloadable CV button to the header section using the supplied resume file.
- [x] Present GitHub and LinkedIn as prominent clickable actions in the Contact section.
- [x] Validate CV download access and responsive header/Contact layout on desktop and mobile.

## Direct CV file download

- [x] Serve the CV through a direct-download endpoint with attachment headers.
- [x] Route the header CV action to the direct-download endpoint and verify no new tab opens.

## Functional Contact form and CV hover interaction

- [x] Define visitor message validation, persistence and owner-notification delivery flow.
- [x] Add a functional Contact form with sender name, email, subject and message fields.
- [x] Persist successful submissions and notify the portfolio owner.
- [x] Add a smooth, accessible hover interaction to the DOWNLOAD CV button.
- [x] Validate successful and invalid form states, notification fallback, responsive layout and CV hover behavior.

## Contact social placement and submission feedback

- [x] Move GitHub and LinkedIn profile actions below the Contact form with matching GTA hover treatment.
- [x] Add an accessible success celebration after a successfully submitted Contact message.
- [x] Add a subtle GTA-style spinner and processing state to the Contact submit button.
- [x] Validate Contact success, loading and responsive layouts on desktop and mobile.

## Contact real-time input validation

- [x] Add live validation rules for name, email, subject and message Contact fields.
- [x] Render GTA-style inline error messaging and accessible invalid field states.
- [x] Prevent invalid submission while retaining existing server-side validation and success feedback.
- [x] Validate live error, correction and successful submission states on desktop and mobile.

## GTA cursor and Contact interaction feedback

- [x] Add an accessible GTA-style cursor treatment across pointer-capable portfolio views.
- [x] Add subtle sound feedback for Contact typing and social-profile link activation, respecting manual sound-off state.
- [x] Add weapon-wheel-inspired social profile hover animation with keyboard-equivalent focus feedback.
- [x] Add Contact-specific Mission Passed visual and sound confirmation after successful form submission.
- [x] Validate interaction, reduced-motion, muted-audio, desktop and mobile behavior.

## Wanted Level, radar navigation and radio station

- [x] Add a five-star Wanted Level HUD that escalates one level for each Contact validation error event.
- [x] Make the bottom radar an accessible navigation menu for all portfolio sections.
- [x] Add a radio-style audio player with play/pause and selectable background tracks.
- [x] Preserve manual Sound Off and browser-autoplay fallback behavior across radio controls.
- [x] Validate Wanted Level escalation, radar navigation, radio state and responsive layouts.

## Cursor and radio HUD refinement

- [x] Reduce custom cursor size and remove perceived lag with a more direct, lightweight response.
- [x] Redesign the radio station controls into a cleaner compact GTA HUD treatment.
- [x] Validate desktop cursor responsiveness and desktop/mobile radio visual balance.

## Instant cursor and minimal music control refinement

- [x] Replace motion-driven cursor positioning with immediate DOM-level tracking to remove perceived cursor lag.
- [x] Replace the framed radio deck with a minimal compact music toggle and discreet station cycle control.
- [x] Validate instant cursor responsiveness and unobtrusive desktop/mobile header balance.

## Wanted stars and music control clarity refinement

- [x] Restore a solid, clearly visible five-star Wanted display.
- [x] Add compact visible labels that explain music on/off and track switching actions.
- [x] Validate readable desktop and mobile HUD balance.

## Mobile-first interface redesign

- [x] Redesign the mobile HUD header into a clear two-row hierarchy with uncluttered controls.
- [x] Replace the crowded horizontal mobile navigation with an accessible touch-friendly section selector.
- [x] Rebalance mobile stage spacing, Contact card typography, actions and radar placement.
- [x] Validate the redesigned mobile Contact, Start and Projects layouts without regressing desktop.

## Mobile motion and Mission Briefing interactions

- [x] Optimize mobile scene and content transitions for quicker, smoother scrolling and section switching.
- [x] Center and scale the Contact Mission Passed overlay for mobile viewports.
- [x] Add a GTA-style Mission Briefing popup for every project selection.
- [x] Validate mobile motion, Contact confirmation overlay and Project briefing flows.

## Cursor performance and Mission launch transition

- [x] Remove remaining perceived custom cursor delay with lower-overhead native pointer handling.
- [x] Add a GTA-style project loading transition after Mission Briefing acceptance and before opening the verified source link.
- [x] Preserve Mission Briefing completion behavior for CV-only projects that have no external source link.
- [x] Validate cursor response, loading transition and project launch behavior.

## Visible native cursor regression fix

- [x] Restore visible default cursor behavior across the portfolio without reintroducing overlay tracking.
- [x] Validate visible cursor, pointer affordances and zero follow lag on desktop.

## Direct repository and Complete Mission action placement

- [x] Restore Complete Mission as the Project card action.
- [x] Replace Mission Briefing acceptance loading flow with direct selected-project GitHub repository navigation.
- [x] Retain clear CV-only case-file handling for projects without a repository link.
- [x] Validate project action layout and verified repository destinations.

## GitHub repository launch loading transition

- [x] Show the GTA mission loading transition when opening a selected project’s GitHub repository.
- [x] Keep Complete Mission in its original Project card position.
- [x] Retain CV-only case-file behavior without an external launch.
- [x] Validate loading-to-GitHub launch handoff and responsive project action layout.

## Reliable GitHub loading handoff

- [x] Make the in-page GTA loading mission visibly render before GitHub navigation occurs.
- [x] Replace unreliable pre-opened blank-tab behavior with dependable post-loading repository navigation.
- [x] Validate the full click-to-loading-to-GitHub handoff.

## Consistent project repository launch behavior

- [x] Ensure every GitHub-backed project uses the same click-to-loading-to-repository sequence.
- [x] Prevent project-selection clicks from opening external repositories directly.
- [x] Keep CV-only project selection in the portfolio with clear case-file treatment.
- [x] Validate all project interaction paths for consistent behavior.

## Boot overlay and faster repository launch refinement

- [x] Separate overlapping left-bottom boot-screen text at the 100% loading stage.
- [x] Shorten the GTA loading duration before GitHub repository navigation.
- [x] Validate desktop/mobile boot layout and faster project launch handoff.

## GitHub upload, Vercel deployment and domain connection

- [x] Inspect the Award-Portfolio GitHub repository and confirm authenticated repository access.
- [x] Prepare the current portfolio project for upload to the Award-Portfolio repository.
- [x] Commit and push the complete portfolio source to the user's GitHub repository after confirmation.
- [ ] Deploy the committed repository through Vercel after confirmation.
- [ ] Connect the user's specified custom domain in Vercel and provide the required DNS records.
- [ ] Verify the live Vercel deployment and custom-domain routing.

## Hero navbar-safe framing

- [x] Inspect Hero video and static fallback crop against the fixed top navbar on desktop and mobile.
- [x] Adjust Hero focal position and/or stage positioning so the full head remains visible below the navbar.
- [x] Validate corrected Hero video and fallback framing on desktop and mobile.
- [x] Capture post-change desktop/mobile visual evidence for Hero static fallback navbar clearance.

## Received professional sources

- [x] Receive GitHub profile URL: https://github.com/sikander1020?tab=repositories
- [x] Receive LinkedIn profile URL: https://www.linkedin.com/in/sikandar-jadoon-117403313
- [x] Receive a successful CV/resume upload after the initial attachment failure.
- [x] Cross-check public LinkedIn posts where the direct profile is access-restricted.

## Verified professional data integration

- [x] Replace generic profile identity, headline, location, email and biography with CV-verified content.
- [x] Rebuild the Skills, Experience and Academy screens around the CV-verified technical profile and degree.
- [x] Replace placeholder projects with verified GitHub and public-LinkedIn project case files, including working repository links.
- [x] Add publicly provided GitHub and LinkedIn profile links to the Contact screen.

## Source-verification follow-up

- [x] Replace invented skill percentages with a non-quantified presentation of CV-verified competencies.
- [x] Replace synthesized experience labels and periods with only source-backed project and learning evidence.
- [x] Remove the unverified remote-work location claim and re-audit profile copy for source traceability.
- [x] Neutralize any non-source-backed personalized HUD value and explicitly separate game styling from professional facts.
- [x] Upload the GitHub-ready source tree to Award-Portfolio through the authenticated repository session and verify the resulting initial commit.
- [x] Assess and prepare the GitHub repository for a Vercel-compatible deployment architecture before creating the production deployment.
- [x] Fix Vercel's incorrect frontend root/build configuration so `client/index.html` resolves `client/src/main.tsx` during production builds.
- [x] Correct Vercel's output directory so the live root route serves `dist/public/index.html` instead of exposing `dist/index.js` source.
- [ ] Audit and restore the contact submission, CV download, database notification, and media storage flows for Vercel-compatible serverless deployment.
- [ ] Select and configure a free hosting architecture that preserves the interactive portfolio and essential contact functionality.
- [ ] Diagnose and restore the currently broken public portfolio deployment before further hosting migration changes.
- [x] Update frontend media URLs and contact-form API wiring for an always-on Vercel deployment without Manus-only routes.
- [x] Restrict interface click cues to deliberate supported controls and prevent any automatic or duplicate playback.
- [x] Lower the UI click-cue volume while preserving a clear but subtle interaction acknowledgement.
- [x] Restore background music startup with a first-interaction fallback that preserves an explicit manual Music Off preference.
- [x] Add targeted test coverage and browser verification for UI cue, mute, and background music behavior.
