# TODO

Backlog from CLAUDE.md, ordered by impact.

- [x] 1. **Stop the bleeding.** Dead links, proficiency %, roadmap progress bar removed.
- [x] 2. **Hero + proof strip.** Problem-first hero (3 options in an HTML comment), tags re-ordered, proof strip (goodput, nicprof, kvwire, HF models). Upstream slot is a `TODO(naresh)`; see below.
- [x] 3. **"Two problems I work on."** Reliability (goodput) and Efficiency (kvwire), honest status, linked.
- [x] 4. **"Upstream & evidence."** nicprof, kptk, LinuxMemoryManager PR #10. vLLM / cudagraph / libbpf entries wait on links.
- [x] 5. **"Foundations."** Skill area → artifact, with stage (runnable / design / early / write-up). Roadmap + Skills removed.
- [x] 6. **Profiles.** Proof of work: GitHub, Hugging Face, LeetCode. Social: LinkedIn, Substack, X. Docker Hub + Google Developers removed.
- [ ] 7. **First case study page** (`work/training-orchestrator.html`), once goodput has something runnable (M2+).
- [x] 8. **Writing index.** `assets/js/data.js`; 5 interactive posts + 4 Substack posts.
- [x] 9. **Share preview.** `og-image.png` (1200×630), `summary_large_image`.
- [x] 10. **Visual refresh.** "Datasheet" direction approved and built in 4 commits: tokens & type, homepage components, hero Fig. 0, posts & OG image.
- [ ] 11. **Second case study** (`work/disaggregated-inference.html`) when kvwire has results.

## New ideas

- [x] Post: "The packet path: kernel stack vs XDP vs DPDK vs RDMA" (`posts/packet-path.html`).
- [x] Post: rail-optimized vs fat-tree topology explorer (`posts/rail-topology.html`).
- [x] Site gaps: `robots.txt`, `sitemap.xml` (update when adding a post), custom `404.html`.
- [ ] When goodput / kvwire publish a first measured result, add it to the proof strip with a link to the run directory.
- [x] Hugging Face update: infra-incident-intel in proof strip, Reliability block (Models row + Space links), Foundations and Profiles; "Interactive notes" wording replaced site-wide.
- [ ] When `infra-failure-bench` or the triage model is published on the Hub, link it directly from the Reliability block and Foundations.
- [x] Nov 2026 refresh: removed LinkedIn, Substack and X site-wide; removed dead links (infra-incident-intel repo 404, infra-triage-demo / infra-rca-demo Spaces, NCCL-RCA model) and pointed them at the `qwen3-nccl-rca-lora` model card; dropped the false "6 model cards / 6 Spaces" row; numbered section kickers, wider featured posts, card hover, balanced headings.

- [x] **Nov 2026 security refresh** (`feature/secure-ai-infra`): new hero line ("can’t be stalled, slowed, or stolen"; 3 options in an HTML comment), "NK" brand replaces `naresh.infra`, Trust-at-scale block, §Security threat map + incident ticker, five security posts (breach field guide, agent blast radius, pickle disassembler, RDMA trust model, prefix-cache side channel), Toolbox with security rows, socials row (LinkedIn, Substack, YouTube, Docker Hub, X), ⌘K palette, writing filters, hero intruder phase + terminal, OG image re-rendered.
- [ ] Add the security posts' one-line claims to goodput / kvwire READMEs where they belong (e.g. goodput RCA tier "recommends, never acts" is marked planned on the site; land it in the repo's design docs).
- [ ] When kvwire decides ADR-0005 (memory-window fencing), update the Trust block and the RDMA post with the measured bind cost.
- [ ] Profile README badge still says `naresh.infra`; rename to match the site.
- [x] **Contact refresh** (`feature/contact-socials-timeless-bio`): socials row moved from Profiles to the homepage footer with a new Gmail link, replacing the footer text links and the contact buttons; each role type links to its proof; hero bio no longer states a year count.

- [x] **Discord** (`feature/discord-invite`): Discord invite added right after Gmail in the homepage socials row, post/404 footers and the ⌘K palette; footer "source" link removed.

- [x] **Titles + README** (`fix/titles-and-readme-roles`): em dash removed from page titles, share title, image alt and JSON-LD job title (now "·"); README gains the "Open to roles" section, mirroring the GitHub profile.

- [x] **Visitor count** (`fix/titles-and-readme-roles`): page-view badge (komarev, key `nareshns2004-portfolio`) under the contact card's "Open to roles in" locations, matching the GitHub profile.

- [x] **Visitor count fix + socials + project sync** (`fix/visitor-count-socials-projects`): komarev stopped counting arbitrary keys (`nareshns2004-portfolio` stayed at 0), so the badge now uses hits.sh (key `naresh.ai-ml-infra.com`, count restarts from 0) and loads eagerly instead of only when Contact scrolls into view. Gmail, Discord and Docker Hub removed from footers, ⌘K palette and JSON-LD. Synced with the Videos repos: nicprof 100 tests + simulator-only scope, kptk 59 tests, dtf = fault-aware NCCL layer, fused-attn repo = kernel lab, inference-engine placeholder dropped (archived, superseded by kvwire), traffic shaper marked paused.

- [x] **Core stack + roadmap** (`feature/core-skills-visual-polish`): new §Core stack section (L5 models & serving → L1 hardware, plus observability & languages) with logo/monogram tiles, each linked to the repo or post that uses it, animated packet rail and staggered entrance (static under reduced motion); Fig. 1 roadmap in Work mirroring goodput (M1a) and kvwire (M1) milestones; goodput status updated from "M1 of 6" to M1a; nav + ⌘K entry "Core stack".
- [x] **Book section** (`feature/book-section`): §The book between Profiles and Contact: working cover (`assets/book/cover.svg`, six stacked layers inside a dashed trust boundary), status "Manuscript in progress · expected 2027", pitch, L1–L6 + trust outline with each part linked to a related post, Substack follow CTA, author signature ("Below the framework layer."). Nav "Book", ⌘K entry, footer credit, JSON-LD `workExample` Book.
- [ ] Book: confirm title, subtitle, outline and 2027 target (`TODO(naresh)` above the section); swap the primary button to a mailing list / pre-order page when one exists; replace the cover with the publisher's when there is one.
- [x] **References** (`feature/references`): §References after the book: "Start here" cards for abiaryan.com (+ gpuengineering.com) and huyenchip.com (+ books, CS 329S); Fig. 2 seven-stage path (systems → networking → distributed systems → GPUs → ML & LLMs → cloud & Kubernetes → AI infra at scale), 27 resources with course/publisher/free-edition/companion-repo links; 34 must-read papers by layer; Papers We Love + Hugging Face Papers (paperswithcode.com now redirects there). All links checked 25 Nov 2026. Nav tightened at ≤1180px and collapses at ≤960px so nine links never wrap.
- [x] **Wildlife theme** (`feature/wildlife-theme`, 26 Nov 2026): removed the References "Start here" cards (abiaryan.com, huyenchip.com) and the "Find more papers" block. A first Celtic/Gothic/Slavic/Greek/Roman ornament pass was replaced the same day by a wildlife ecosystem: every section is a habitat (sky, rainforest, savanna, wetland, forest, peaks, lagoon, tundra, deep sea, aviary, sunset) with a generated horizon border and its animals (60+ silhouettes, credited), hummingbird scroll bar, footer parade. See CLAUDE.md.
- [x] **Wildlife, more** (`feature/wildlife-theme`, 26 Nov 2026): paw trails in every land habitat and into every footer; arctic terns, frigatebird, condor, bald eagle, cassowary; narwhals, Portuguese man o' war, glowing jellies, squid, giant squid, anglerfish with a lit lure; oryx, elk, caribou, bull moose, walrus, seals, giant panda; tiger/leopard/zebra/giraffe coats; lotus, hibiscus, orchid, passionflower, sunflowers; fractals (Barnsley fern, fractal trees, Koch snowflakes, nautilus spiral, phyllotaxis); richer habitat gradients.
- [x] **Footer procession** (`feature/wildlife-theme`): the six-animal parade became an endless three-lane loop on every page: sky (eagles, condors, vultures, frigatebirds, albatross, terns, cranes), land (savanna, desert, prairie, Amazon, polar ice) and deep sea (whales, narwhals, mantas, jellies, man o' war, squid, anglerfish); coats on giraffe/zebra/leopard/tiger.
- [x] **Final wildlife pass** (`feature/wildlife-theme`, 26 Nov 2026): Jurassic and Ice Age interludes (dinosaurs, pterosaurs, fossils in rock strata; mammoths, sabre-tooth, giant elk, woolly rhino, cave bear, permafrost); habitats named for real places; atmosphere on every band (light shafts, mist, heat haze, water shimmer, moonlight, drifting clouds, lagoon caustics, aurora, petals, marine snow); baobabs, a setting sun over sunflowers, taiga birches; prehistoric animals in the footer procession.
- [ ] Wildlife: re-render `og-image.png` from `assets/og/og-source.html` with a habitat horizon and a few animals, so share previews match the site.
- [ ] Wildlife: optional habitat touches for `posts/*` (they only get the leaf mark, hummingbird and footer parade today).
- [ ] References: prune/add to taste (`TODO(naresh)` above the section); re-run a link check every few months.
- [ ] When a milestone closes in goodput or kvwire, flip its `ms next` → `ms done` in Fig. 1 (add a `.ms.done` style then) and link the evidence.

## Open questions for Naresh

- **Toolbox list:** the AI-infra-security tool list (SPIFFE/SPIRE, Falco/Tetragon, Sigstore/SLSA, confidential computing…) was added in the Nov 2026 refresh. Prune anything you can't defend in an interview.

- **vLLM PR #50618**: on GitHub it's by JohnQinAMD and unmerged. Did you contribute under another account, or is it a different PR number? Send the link and it becomes the first proof item.
- Links for the **cudagraph padding issue** and the **libbpf BTF fix**, if they exist.
- ~~Hero line~~: done, blend of A + C.
- ~~Hugging Face~~: done 13 Nov 2026. Four planned artifacts linked (model + Space from goodput, dataset + Space from kvwire); `infra-incident-intel` is dropped for good.
- The removed write-ups (DPDK, virtualization, LLM OS, AI infra roadmap essays; XDP / DPDK PMD / RDMA / RoCE / SR-IOV drafts): rebuild any worth keeping as an on-site post, or add as `kind: "external"` in `data.js`.

Next session starts with: review the wildlife preview (`feature/wildlife-theme`) and say which habitats/animals to keep, tone down or add; then confirm the book's title/outline/target in `#book`, then buy `ai-ml-infra.com`, add `naresh.ai-ml-infra.com` in Vercel → Domains, then merge `chore/custom-domain`.
