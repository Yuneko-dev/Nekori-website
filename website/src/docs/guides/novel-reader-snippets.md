---
title: Novel Reader (Advanced)
titleTemplate: Guides
description: Customize Nekori's WebView novel reader with CSS and JavaScript snippets, theme variables, and chapter metadata.
---

# Novel reader snippets

Nekori's WebView novel reader supports custom CSS and JavaScript snippets.
JavaScript uses the public `window.nekori` API; CSS targets the reader's current DOM and theme variables.

## Open advanced settings

1. Open a novel chapter.
2. Open reader settings.
3. Open the **Advanced** tab.

## Advanced tab controls

| Control | What it does | Default |
| --- | --- | --- |
| **Enable embedded CSS** | Preserves styles supplied in chapter HTML, including inline styles. | On |
| **Enable embedded JS** | Preserves script tags supplied in chapter HTML. | Off |
| **Source CSS priority** | Allows source styles to compete with the reader's normal styling instead of enforcing the reader's override rules. | Off |
| **Use plugin custom CSS** | Includes custom CSS supplied by the source plugin. | On |
| **Use plugin custom JavaScript** | Includes custom JavaScript supplied by the source plugin. | On |
| **Find & Replace** | Apply literal or regex replacement rules to this novel or all novels. | No rules |
| **CSS Snippets** / **JavaScript Snippets** | Add, edit, enable, disable, and reorder named snippets. | No snippets |

The embedded-content and plugin toggles are separate from your own snippets. Disabling embedded
JavaScript does not disable your JavaScript snippets.

JavaScript snippets also have **Re-run on infinite-scroll append**. Enable this when a snippet
needs to process newly appended chapters. Without it, appending a chapter does not re-run that
snippet. CSS rules already present in the page also apply to newly added matching elements.

## Content pipeline

Before rendering, chapter content passes through these steps:

1. Remove the chapter title, if enabled.
2. Normalize plain text for `.txt` / `.text` chapter URLs; otherwise detect HTML or Markdown and convert Markdown to HTML.
3. Apply enabled regex replacement rules matching the current target.
4. Force lowercase, if enabled.
5. Automatically split text, if enabled.
6. Translate, when translation is requested.
7. Sanitize HTML for the renderer.

HTML sanitization removes comments and `<noscript>` blocks, strips embedded scripts and styles
according to the toggles, and removes media when media blocking is enabled. Plain-text content
is rendered as text rather than parsed as HTML. User snippets are injected separately.

## Injection order

The initial document loads the reader stylesheet, theme variables, generated reader settings,
plugin CSS, legacy custom CSS, and enabled CSS snippets. Snippets follow their list order.
For declarations with equal importance and specificity, later declarations win. The normal CSS
cascade still applies; turning on **Source CSS priority** does not guarantee every source rule wins.

The document exposes `window.nekori` before its controllers finish initializing.
Enabled source customJS included in the document runs after runtime initialization; user JavaScript snippets run in list order through native commands.
Infinite-scroll appends rerun only user snippets opted into append handling.
Settings updates can reapply changed snippets, so make each snippet safe to run again.

## JavaScript API

Snippets run in Android WebView and use browser APIs such as `document`, `window`, and `MutationObserver`.
Source plugins execute separately in Hermes; their `@libs/*` helpers are not WebView globals.

The public reader object is **`window.nekori`**, with a lowercase `n`.
The document creates a fresh object when it loads and removes it when the runtime is disposed.
Wrap asynchronous work in a function: snippets are classic scripts, so top-level `await` is not supported.

```js
void (async () => {
  const reader = window.nekori
  if (!reader)
    return
  await reader.ready
  console.info(reader.context.novel.name, reader.context.chapter.name)
})().catch(console.error)
```

### Public members

| Member | Type / effect |
| --- | --- |
| `ready` | `Promise<void>`; wait for reader controllers to initialize. |
| `context` | Current document, novel, chapter, loaded-chapter metadata, and runtime state. |
| `config` | Current document configuration; treat it as app-owned data. |
| `events` | Subscription API described below; it has no public `emit` method. |
| `layout` | Layout controller or `null`; check `layout.enabled` before paged operations. |
| `player` | Media controller or `null`; ordinary text documents have no player. |
| `fetch(input, init?)` | `Promise<Response>`; requests through the app's configured reader proxy. |
| `refetch()` | Requests that the native app reload the current chapter from its source; returns `void`. |
| `error(message)` | Reports a string message to the host's reader error channel; returns `void`. |
| `dispose()` | Tears down the runtime; reserved for the embedding app, not routine snippet cleanup. |

`ready` does not mean that images, fonts, page reflow, or media playback have finished.
Read `reader.context` when needed instead of retaining chapter or runtime objects across native updates.
Writing to context/config does not navigate the reader or update native preferences or library data.

There is no public `actions` object for next/previous chapter navigation, TTS control, or translation.
`window.Tsundoku`, `window.TsundokuTheme`, `window.reader`, `window.tts`, `window.pageReader`, and `window.LNReaderPlayer` are not supplied by the current runtime.
Use the reader's normal controls for operations that are not in this public API.

### Context and metadata

| `reader.context` property | Meaning |
| --- | --- |
| `documentId`, `mode` | Document identity and `'reader'`, `'download'`, or `'error'` mode. |
| `novel` | `{ id, name, path }`; all three fields are strings. |
| `chapter` | Current chapter metadata described below. |
| `nextChapter` | Adjacent chapter metadata or `null`. |
| `chapters` | Metadata for chapters supplied to this document; in the app these are the loaded chapters, not the novel's complete table of contents. |
| `runtime` | Current state described below. |
| `strings` | Host-supplied localized labels; keys are strings. |
| `ui`, `style`, `layout`, `player` | Optional configuration data; `context.layout` and `context.player` are not the controller objects. |
| `sourceBaseUrl` | Optional source base URL. |
| `novelId`, `chapterId`, `sourceId` | Optional string identifiers supplied by the host; novel/chapter IDs fall back to the metadata IDs. |

Chapter metadata fields:

| Field | Type / meaning |
| --- | --- |
| `id` | String identifier; keep native database IDs as strings to avoid integer precision loss. |
| `name` | String chapter name. |
| `path` | String source identity, preserved as supplied; it is not necessarily a URL. |
| `progress` | Number holding saved progress supplied by the host, not a live scroll position. |
| `url` | Optional string resolved for navigation; local or unresolved values are not necessarily HTTP URLs. |
| `number` | Optional numeric chapter number; it can be fractional. |

### Runtime state

Read these fields through `reader.context.runtime`:

| Field | Type / meaning |
| --- | --- |
| `editing` | Boolean; reader editing mode. |
| `infinite` | Boolean; infinite scrolling is enabled. |
| `textSelectionBlocked` | Boolean; text selection is blocked. |
| `forcedLowercase` | Boolean; forced lowercase is enabled. |
| `menuVisible` | Boolean; native reader chrome is visible. |
| `immersive` | Boolean; reader chrome is hidden, not an Android fullscreen permission. |
| `ttsState` | `'playing'`, `'paused'`, `'stopped'`, or `'starting'`. |
| `loadingChapter`, `loadingNext` | Booleans; loading the current or next chapter. |
| `noMoreChapters` | Boolean; the host has marked the end of chapter navigation. |

The runtime object has no `progress`, `chapterProgress`, or `currentChapterId` field.
For paged reading, use `reader.layout.position`; there is no public equivalent of the old vertical progress event.

### State subscriptions

Use `reader.events.subscribe('document.stateChanged', listener)`.
The callback receives `{ runtime, event? }`, not a DOM `Event` with `detail`.
`event` is an optional host label; read the runtime fields instead of depending on that label.
This notification runs when the host applies document configuration or a runtime-state patch.
Read the current state once when your snippet starts, then subscribe for updates.

Subscriptions return an unsubscribe function.
Before replacing a listener on a snippet re-run, unsubscribe the previous one:

```js
void (async () => {
  const reader = window.nekori
  if (!reader)
    return
  await reader.ready
  const key = '__myReaderStateUnsubscribe'
  window[key]?.()

  const update = (runtime) => {
    document.documentElement.classList.toggle('my-reader-menu-open', runtime.menuVisible)
  }
  update(reader.context.runtime)
  window[key] = reader.events.subscribe('document.stateChanged', ({ runtime }) => {
    update(runtime)
  })
})().catch(console.error)
```

The old `tsundoku:*` DOM events are not dispatched.
Protocol names such as `layout.positionChanged`, `chapter.appended`, and `reader.error` are sent from the reader to native; they are not automatically echoed to subscription callbacks.
Do not use `events.subscribe` as a substitute for an outgoing-message listener or private native bridge.

### Paged layout

Wait for `ready`, then check `reader.layout?.enabled`.
The controller's `position` can still be `null` before the first page map is available.
Its fields are `chapterId`, `unitIndex`, `unitCount`, `firstPage`, `lastPage`, `totalPages`, and `progress`.
`unitIndex` is zero-based within the visible chapter; a unit is one page or a two-page spread.
`progress` uses `0–1`, while `seekPercent` takes `0–100`.

| Method | Result / effect |
| --- | --- |
| `moveBy(-1)` / `moveBy(1)` | Boolean; move one reading unit. At the forward boundary it can request another chapter. |
| `seekUnit(index)` | Boolean; seek to a zero-based unit in the current visible chapter. |
| `seekPercent(percent)` | Boolean; seek within the current visible chapter, for example `50` for halfway. |
| `revealElement(element)` | Boolean; reveal an existing element in the paged viewport. |
| `reflow(preserveViewport?)` | Boolean; request layout recalculation after changing content. |

For example, reveal a chapter heading in the current layout:

```js
void (async () => {
  const reader = window.nekori
  if (!reader)
    return
  await reader.ready
  const chapter = [...document.querySelectorAll('nekori-chapter')]
    .find(element => element.getAttribute('data-nekori-chapter-id') === reader.context.chapter.id)
  const heading = chapter?.querySelector('h1, h2, h3')
  if (!heading)
    return
  if (reader.layout?.enabled)
    reader.layout.revealElement(heading)
  else
    heading.scrollIntoView({ behavior: 'auto', block: 'start' })
})().catch(console.error)
```

Use `revealElement` instead of `scrollIntoView` in paged mode: native scrolling can displace the column viewport.
`configure`, `prepareSilentTurn`, `finishSilentTurn`, and the controller's `dispose` are exposed for embedding code; leave them to the app.

### Networking and refetch

`reader.fetch` accepts a URL string, `URL`, or `Request`, plus optional standard `RequestInit`.
For HTTP(S) requests, resolve relative paths against a real source URL first; the proxy does not turn an opaque chapter path into an external URL.
Check `response.ok` yourself; an HTTP error still returns a `Response`.
If **Allow local proxy API** is disabled, this method reports an actionable reader error and rejects.
Use the ordinary browser `fetch` for `blob:` and `data:` URLs.

`reader.refetch()` sends a native reload request.
It returns no completion promise and does not synchronously replace the DOM.
A reload creates a new document, so its old reader object, DOM references, and listeners must not be reused.

### Media controller

After `ready`, `reader.player` is `null` unless the document has player configuration.
When present, it exposes `playHls(url, hlsConfig?)`, `playDash(url, { settings?, protectionData? })`, `playDirect(url)`, `playIframe(url)`, `addSubtitles(trackOrTracks)`, `log(message)`, `setDebug(enabled)`, and `toggleDebug()`.
The play/subtitle methods return `Promise<void>`.
Await initialization, but a resolved promise is not proof of successful playback: the player also reports failures through the host's reader error channel.
`log` writes to the console and to the player overlay when debug is enabled.
Player `dispose` belongs to the document lifecycle; engine instances are not public.
See the [plugin WebView documentation](https://github.com/Yuneko-dev/Nekori-plugins/blob/HEAD/docs/docs.md#player-api) for media configuration and subtitle fields.

## CSS theme variables

Use CSS custom properties from `:root`:

| Variables | Meaning |
| --- | --- |
| `--reader-background-color`, `--reader-text-color` | Current reader background and text colors. |
| `--reader-font-size`, `--reader-font-family`, `--reader-line-height` | Reader typography. |
| `--reader-margin-top`, `--reader-margin-right`, `--reader-margin-bottom`, `--reader-margin-left` | Reader content margins. |
| `--reader-text-align`, `--reader-user-select` | Alignment and text-selection setting. |
| `--reader-paragraph-indent`, `--reader-paragraph-spacing`, `--reader-min-fragment-lines` | Paragraph and fragmentation settings. |
| `--md-sys-color-primary`, `--md-sys-color-secondary`, `--md-sys-color-tertiary`, `--md-sys-color-error` | Material theme accent colors. |
| `--md-sys-color-on-primary`, `--md-sys-color-on-secondary`, `--md-sys-color-on-tertiary`, `--md-sys-color-on-error` | Foreground colors for the corresponding accents. |
| `--md-sys-color-*-container`, `--md-sys-color-on-*-container` | Container variants for primary, secondary, tertiary, and error. |
| `--md-sys-color-background`, `--md-sys-color-on-background`, `--md-sys-color-surface`, `--md-sys-color-on-surface` | Theme background/surface colors. |
| `--md-sys-color-surface-variant`, `--md-sys-color-on-surface-variant`, `--md-sys-color-outline` | Other theme surface and outline colors. |

There is no JavaScript theme object.
Read CSS values through the browser when needed:

```js
(() => {
  const primary = getComputedStyle(document.documentElement)
    .getPropertyValue('--md-sys-color-primary').trim()
  console.info(primary)
})()
```

For example, give chapter blockquotes a theme-colored border:

```css
#nekori-reader nekori-chapter blockquote {
  border-inline-start: 3px solid var(--md-sys-color-primary);
  padding-inline-start: 1em;
}
```

## HTML structure and selectors

The reader root is `#nekori-reader`, also marked `.nekori-reader` and `[data-nekori-reader-root]`.
Chapter documents use wrappers across ordinary scrolling, infinite scrolling, and paged layouts:

```html
<div id="nekori-reader" class="nekori-reader" data-nekori-reader-root>
  <nekori-chapter
    class="nekori-chapter"
    data-nekori-chapter-id="123"
    data-nekori-chapter-name="Chapter 1"
    data-nekori-chapter-number="1"
    data-nekori-chapter-path="/novel/ch-1"
    data-nekori-chapter-url="https://example.org/novel/ch-1">
    <!-- Chapter content -->
  </nekori-chapter>
</div>
```

| Selector | Meaning |
| --- | --- |
| `#nekori-reader` / `.nekori-reader` | Document's reader root. |
| `nekori-chapter` / `.nekori-chapter` | A chapter's content wrapper; use the string ID attribute to find a particular loaded chapter. |
| `.nekori-chapter-divider` | Chapter boundary marker, carrying `data-nekori-*` metadata. |
| `.nekori-plain-text` / `[data-nekori-plain-text="1"]` | Plain-text content built as text nodes. |

Avoid replacing the reader root or `body` with `innerHTML`; the reader depends on its existing nodes.
Use your own IDs/classes for added UI instead of app-owned IDs such as `nekori-reader`, `nekori-custom-style`, or `nekori-player-container`.
Summary and feedback widgets have shadow roots; ordinary chapter CSS selectors do not style their internal elements.

## Find & Replace {#regex-rules}

Use **Find & Replace** to fix recurring typos, normalize names, or remove unwanted text before a chapter is displayed.
Open a chapter → reader settings → **Advanced** (the code icon) → **Find & Replace**.
These rules transform reader content; they do not rewrite the source website or downloaded chapter files.

### Create and test a rule

1. Select **This novel** or **Global**, then **Add rule**.
2. Enter a **Title** so you can recognize the rule later.
3. Enter **Find Text** and **Replace with**. Leave the replacement empty to remove matches.
4. Choose the matching options below.
5. Expand **Test**, enter **Sample Input**, and select **Run Test**. Check the **Output**.
6. Select **Save**, then leave the rule manager with Back to persist changes and reload the chapter.

If selection or search is active, Back clears that first.
Saving in the editor updates the manager's draft; leaving the manager applies those edits.
The test evaluates this rule alone, not the other rules or the complete chapter pipeline.

| Option | Behavior |
| --- | --- |
| **Use Regex** | Off by default for new rules. Off treats the find value as literal text; on changes the field to **Regex Pattern**. |
| **Case sensitive matching** | Off by default: `hero` also matches `Hero` and `HERO`. Enable it to distinguish case. |
| **Match whole word** | Available for literal matching only; off by default. Prevents a match next to letters, numbers, or underscores. |

The title and find value must not be blank.
New rules are enabled automatically.
All matching occurrences are replaced, not just the first.

### Scope and execution order

- **Global:** applies to every novel.
- **This novel:** applies to the current source ID and novel URL/path. A novel with the same title on another source is a different target; migrating to a different source or path changes the match.

Enabled Global rules run first, followed by enabled rules for this novel.
Within each scope, rules run in list order, and each rule receives the previous rule's output.
For example, `foo → bar` followed by `bar → baz` turns `foo` into `baz`.

Rules run after content normalization but before lowercase conversion, automatic splitting, translation, and HTML sanitization.
For HTML chapters, the input can include tags and attributes: a broad pattern may change markup as well as visible text.
A rule targeting a word that appears only in the translated result will not match the original chapter.
Start with **This novel** and test representative chapter text before making a rule Global.

### Literal and regex examples

Enter the following values directly into the editor:

| Mode | Find | Replace with | Sample input | Output |
| --- | --- | --- | --- | --- |
| Literal | `Foo` | `bar` | `Foo FOO foo` | `bar bar bar` with case sensitivity off |
| Literal + whole word | `cat` | `dog` | `cats are like a cat` | `cats are like a dog` |
| Literal | `[Advertisement]` | Leave empty | `Hello [Advertisement]` | `Hello` followed by a space |
| Regex | `\d+` | `N` | `chapter 12 of 345` | `chapter N of N` |
| Regex | `(\w+)@(\w+)` | `$2@$1` | `alice@example` | `example@alice` |

Regex mode uses **Kotlin/JVM regular expressions**, not JavaScript regex literals.
Enter `\d+`, not `/\d+/g`; do not double the backslash as you would in a JSON string.
Parentheses capture groups, and `$1`, `$2`, etc. insert them into the replacement.
In regex replacement text, escape a literal dollar sign as `\$` and a literal backslash as `\\`.
In literal mode, dollar signs and backslashes in the replacement are already literal.

An invalid regex is rejected when saving.
A replacement that refers to an invalid capture group can still fail when it encounters a match, so always run a test that actually matches your pattern.
If a saved rule fails during reading, that rule leaves the current text unchanged and later rules continue.

### Manage existing rules

Tap a rule to edit it, or use its switch to disable it without deleting it.
The row menu offers **Move up**, **Move down**, and **Delete**.
Clear the search field before reordering; moving rules is disabled while filtering.
Search matches titles, find patterns, and replacements.
Long-press a rule to select multiple rules for enabling, disabling, or deleting together.

If the preview looks correct but a chapter does not change, check the scope, enabled switch, rule order, and whether the pattern matches the original content before translation.

## Safe snippet practices

Scope CSS to `#nekori-reader` or your own classes. Guard against missing elements and avoid
adding duplicate nodes or listeners. Wrap JavaScript in a function so re-running a snippet does
not redeclare top-level `const` or `let` variables.

This example marks blockquotes without duplicating anything on subsequent runs:

```js
(() => {
  const root = document.getElementById('nekori-reader')
  if (!root)
    return
  root.querySelectorAll('blockquote').forEach((quote) => {
    quote.classList.add('my-reader-quote')
  })
})()
```

Enable **Re-run on infinite-scroll append** for this example if you want it to mark blockquotes
in appended chapters too.

## Troubleshooting

- **Snippet ignored:** enable the snippet and check that its selector matches the current layout.
- **Appended chapters unchanged:** enable **Re-run on infinite-scroll append** for JavaScript that modifies chapter elements.
- **Style does not apply:** check specificity and snippet order. Reader override rules can require a more specific selector and `!important`, or enabling **Source CSS priority**.
- **Script fails on a second run:** wrap it in a function and make repeated changes safe; avoid duplicate listeners and global variable declarations.


