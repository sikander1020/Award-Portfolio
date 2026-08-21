# Personalization Guide — GTA VI Portfolio Replica

## Where your content lives

All visible portfolio content is in one file:

```text
client/src/data/portfolioData.ts
```

Replace the `YOUR NAME` placeholder, role, bio, email, money counter, skills, timeline, academy entries and projects in that file. The layout, state transitions and visual structure will remain unchanged.

## Images to provide

Please upload the following five images. Portrait images should be clear, high-quality photos with the face and upper body visible. Landscape images should ideally be at least 1920px wide.

| Slot | Recommended format | Intended placement |
|---|---|---|
| `hero` | Landscape 16:9; your portrait on the right | GTA-style landing screen |
| `about` | Portrait 3:4; seated or relaxed portrait | About Me screen |
| `skills` | Landscape 16:9; desk, laptop or work setup | Skills screen |
| `projects` | Landscape 16:9; project/product/laptop visual | Projects screen |
| `experience` | Landscape 16:9; city, workspace or personal background | Experience timeline screen |

## Asset replacement procedure

After you upload your images, I will place them in the corresponding secure project asset storage and replace the temporary image URLs under the `screens` section of `portfolioData.ts`. No layout rework should be necessary, provided each asset follows the recommended framing.

## Content to send with your images

Send your preferred name, role/title, short introduction, about paragraph, email, location, list of skills with percentage levels, work/experience entries, education entries and up to three featured projects. Each project should include a title, one-line category, concise description, tools/stack and a live project link if available.
