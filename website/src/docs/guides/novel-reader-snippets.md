---
title: Novel Reader (Advanced)
titleTemplate: Guides
description: Customize Nekori's WebView novel reader with CSS and JavaScript snippets, theme variables, and chapter metadata.
---

# Novel reader snippets

Nekori uses a **WebView** novel reader that supports custom CSS and JavaScript snippets. Nekori currently retains the `Tsundoku` names for its reader
JavaScript objects, CSS variables, and some HTML elements; use those names exactly as shown.

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

The document exposes `window.Tsundoku` and `window.TsundokuTheme`. On a chapter load, the reader
refreshes the `Tsundoku` object and runs user JavaScript snippets in list order. Infinite-scroll
appends only re-run snippets opted into append handling. Settings updates can reapply changed
snippets, so write code that remains safe when executed more than once.

## JavaScript API

Reader snippets run inside Android WebView and can use browser APIs such as `document` and `window`.
This is separate from the Hermes runtime used to execute source plugins.
The reader API retains the name **Tsundoku**; there is no replacement `window.Nekori` object.

### Chapter metadata: `window.Tsundoku`

| Property | Type | Meaning |
| --- | --- | --- |
| `novelUrl` | string | Normalized novel URL; may be empty or a local path. |
| `currentChapter` | chapter object | Metadata for the current chapter. |
| `chapters` | array of chapter objects | Chapters supplied to the reader in reading order, not a list of DOM elements or downloaded chapter bodies. |
| `runtime` | object | Reader state; fields described below. |
| `actions` | object | Functions that request reader actions. |

Each chapter object has these fields:

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | number | Chapter database ID; `-1` when unavailable. |
| `title` | string | Chapter title; empty when unavailable. |
| `number` | number | Chapter number, which may be fractional; `-1` when unavailable. |
| `path` | string | Stored chapter path or URL. |
| `url` | string | Resolved URL when possible; local or unresolved paths are not necessarily HTTP URLs. |

Read metadata when you need it instead of retaining an old `currentChapter` object across navigation.
Treat app-owned properties as read-only: changing them does not update the library or navigate the reader.

### Runtime state

Read these properties through `window.Tsundoku.runtime`:

| Property | Type | Meaning |
| --- | --- | --- |
| `isEditMode` | boolean | Whether reader editing mode is active. |
| `isInfScroll` | boolean | Whether infinite scrolling is enabled. |
| `textSelectionBlocked` | boolean | Whether text selection is blocked. |
| `forcedLowercase` | boolean | Whether forced lowercase is enabled. |
| `menuVisible` | boolean | Whether reader controls are visible; the find-in-page bar also counts. |
| `immersive` | boolean | Reader controls are hidden; this is not Android's fullscreen permission or setting. |
| `ttsState` | string | `'stopped'`, `'playing'`, or `'paused'`. |
| `loadingChapter` | boolean | Whether chapter loading is in progress. |
| `progress` | number | Scroll progress through the loaded document, from `0` to `1`. |
| `chapterProgress` | number | Scroll progress through the visible chapter, from `0` to `1`. |
| `currentChapterId` | string or null | Chapter ID reported by scroll tracking, when available. |

The progress fields are published by scroll tracking and may not exist when your snippet first runs.
Do not assume scroll-specific values describe paged mode.
Other runtime fields and helper functions support the reader internally; avoid modifying them.

### Actions

Call these functions through `window.Tsundoku.actions`:

| Method | Parameters | Effect |
| --- | --- | --- |
| `nextChapter()` | None | Request the next chapter. |
| `prevChapter()` | None | Request the previous chapter. |
| `startTts()` | None | Start text-to-speech, if enabled and available. |
| `pauseTts()` | None | Pause text-to-speech. |
| `resumeTts()` | None | Resume text-to-speech. |
| `stopTts()` | None | Stop text-to-speech. |
| `setProgress(percent)` | Integer percentage | Seek within the current reading layout. Values are clamped to `0–100`; pass `50`, not `0.5`, for halfway. |

These functions return no result or completion promise.
They request native reader actions; a missing next chapter or unavailable TTS engine cannot be bypassed by a snippet.
In infinite scrolling, vertical seeking uses the visible chapter's boundaries when available.

For example, this snippet adds a TTS button once per document:

```js
(() => {
  const root = document.getElementById('LNReader-chapter')
  if (!root || document.getElementById('my-start-tts'))
    return
  const button = document.createElement('button')
  button.id = 'my-start-tts'
  button.textContent = 'Read aloud'
  button.addEventListener('click', () => window.Tsundoku?.actions?.startTts())
  root.prepend(button)
})()
```

### Events

Subscribe with `window.addEventListener(eventName, handler)` and read the payload from `event.detail`.
Events report changes, so also read the current runtime state when your snippet starts.

| Event | Payload | Meaning |
| --- | --- | --- |
| `tsundoku:menuvisibilitychange` | `{ menuVisible, immersive }` | Reader controls changed visibility. A fresh-document update can instead send `{ visible }`; accept both forms. |
| `tsundoku:chapternavigate` | `{ direction: 'next' }` or `{ direction: 'prev' }` | Navigation was requested, not a guarantee that the destination has loaded. |
| `tsundoku:chapterloading` | `{ loading: boolean }` | Chapter loading state changed. |
| `tsundoku:ttsstatechange` | `{ state: 'stopped' \| 'playing' \| 'paused' }` | TTS playback state changed. |
| `tsundoku:progresschange` | `{ progress, chapterProgress, chapterId, isLast }` | Throttled scroll progress update. Progress values use `0–1`; `chapterId` can be null. `isLast` means the last loaded chapter, not the novel's final chapter. |

A new document discards its old listeners.
Within the same document, snippets can run again after settings changes or infinite-scroll appends.
Remove your previous listener before installing a replacement:

```js
(() => {
  const key = '__myReaderMenuHandler'
  const eventName = 'tsundoku:menuvisibilitychange'
  if (window[key])
    window.removeEventListener(eventName, window[key])

  const update = (visible) => {
    document.documentElement.classList.toggle('my-reader-menu-open', Boolean(visible))
  }
  window[key] = (event) => {
    const detail = event.detail || {}
    update(detail.menuVisible ?? detail.visible ?? window.Tsundoku?.runtime?.menuVisible)
  }
  window.addEventListener(eventName, window[key])
  update(window.Tsundoku?.runtime?.menuVisible)
})()
```

## `window.TsundokuTheme`

Theme colors are available as hex strings in JavaScript, for example:

```js
window.TsundokuTheme.mdSysColorPrimary
window.TsundokuTheme.mdSysColorOnSurface
window.TsundokuTheme.tsundokuReaderBackground
window.TsundokuTheme.tsundokuReaderText
```

Material color keys use the `mdSysColor` prefix with `Primary`, `Secondary`, `Tertiary`, or
`Error`, plus their `On…`, `…Container`, and `On…Container` variants. Other keys are
`Background`, `OnBackground`, `Surface`, `OnSurface`, `SurfaceVariant`, `OnSurfaceVariant`, and
`Outline`, each with the same prefix.

## CSS theme variables

The page defines these variables on `:root`:

```css
--tsundoku-reader-background
--tsundoku-reader-text

--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-secondary
--md-sys-color-on-secondary
--md-sys-color-tertiary
--md-sys-color-on-tertiary
--md-sys-color-error
--md-sys-color-on-error
--md-sys-color-background
--md-sys-color-on-background
--md-sys-color-surface
--md-sys-color-on-surface
--md-sys-color-surface-variant
--md-sys-color-on-surface-variant
--md-sys-color-outline
```

Primary, secondary, tertiary, and error colors also have `-container` and `on-…-container`
variants. Generated reader settings include `--reader-background-color` and `--reader-text-color`.

For example, give chapter blockquotes a theme-colored border:

```css
#LNReader-chapter blockquote {
  border-left: 3px solid var(--md-sys-color-primary);
  padding-left: 1em;
}
```

## HTML structure and selectors

Chapter content lives inside `#LNReader-chapter`. In infinite-scroll and paged layouts, chapters
with known IDs also have individual wrappers:

```html
<div id="LNReader-chapter">
  <tsundoku-chapter
    data-tsundoku-chapter="1"
    data-chapter-id="123"
    data-chapter-title="Chapter 1"
    data-chapter-number="1"
    data-chapter-path="/novel/ch-1"
    data-chapter-url="https://example.org/novel/ch-1">
    <!-- Chapter content -->
  </tsundoku-chapter>
</div>
```

| Selector | Meaning |
| --- | --- |
| `#LNReader-chapter` | Main chapter content container; works across layouts. |
| `tsundoku-chapter` | Individual chapter wrapper in infinite-scroll or paged layout. Do not assume it exists in every mode. |
| `.tsundoku-chapter-divider` | Infinite-scroll chapter boundary marker, carrying chapter metadata. |
| `.tsundoku-plain-text` / `[data-tsundoku-plain-text="1"]` | Plain-text content. |

Avoid replacing `body` or the whole chapter container with `innerHTML`: the reader depends on
its existing structure. Do not reuse app-owned IDs such as `LNReader-chapter`, `reader-ui`,
`tsundoku-custom-style`, or `next-chapter-btn-container`.

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

Scope CSS to `#LNReader-chapter` or your own classes. Guard against missing elements and avoid
adding duplicate nodes or listeners. Wrap JavaScript in a function so re-running a snippet does
not redeclare top-level `const` or `let` variables.

This example marks blockquotes without duplicating anything on subsequent runs:

```js
(() => {
  const root = document.getElementById('LNReader-chapter')
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


