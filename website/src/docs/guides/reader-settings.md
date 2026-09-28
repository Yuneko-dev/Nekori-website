---
title: Reader settings
titleTemplate: Guides
description: This section relates to the reading experience in the app and navigating the reader.
---

# Reader settings

This section relates to the reading experience in the app and navigating the reader.

## Options

### Default reading mode <Badge type="info" text="Scroll" />

This setting sets the reader's layout when you open a novel.

::: tabs
== Scroll
Read chapter text in a continuous vertical layout.
== Paged
Read text one page at a time. Page spread and transition effects can be configured in the reader settings.
:::

::: tip
Open a chapter and tap the middle of the screen to show the reader controls, then open the settings to adjust the reading experience.
:::

### Rendering mode

Nekori uses the **WebView** novel renderer. It renders chapter HTML and supports custom CSS and JavaScript snippets in the **Advanced** tab.

### Show reading mode <Badge type="info" text="On" />
Briefly show the current reading mode when the reader is opened.

### Show tap zones overlay <Badge type="info" text="Off" />
Briefly shows an overlay for the current tap zones when reader is opened.

### Animate page transitions <Badge type="info" text="On" />
This setting applies a smooth transition when tapping to change page.

## Display

### Default rotation type <Badge type="info" text="Free" />

This allows you to control how the screen is going to be oriented.

::: tabs
== Free
TBA
== Portrait
TBA
== Landscape
TBA
== Locked portrait
TBA
== Locked landscape
TBA
== Reverse portrait
TBA
:::

### Background color

Choose a reader theme, or set custom text and background colors. Available themes include App, Light, Dark, Sepia, Black, Gray, and Custom.

### Fullscreen <Badge type="info" text="On" />
Allows app elements to extend to the edges of the screen, including the status and navigation bars.

### Show content in cutout area <Badge type="info" text="On" />
Displays reader content in the camera cutout area, maximizing the use of the entire screen.

### Keep screen on <Badge type="info" text="Off" />
Keeps the screen from going to sleep.

## E-ink
### Flash on page change <Badge type="info" text="Off" />
Flashes the screen on page change to reduce ghosting on E-ink displays.

## Reading

### Skip chapters marked read <Badge type="info" text="Off" />
Skips over already read chapters while reading.

### Skip filtered chapters <Badge type="info" text="On" />
Skips over filtered chapters while reading.

### Skip duplicate chapters <Badge type="info" text="Off" />
Skips over chapters detected as duplicates.

### Tap zones {#tap-zones-pages}

Choose the tap-zone layout in reader settings to control navigation and opening the menu. Use the in-app preview to see where each action applies.

### Invert tap zones <Badge type="info" text="None" /> {#invert-tap-zones-pages}

::: tabs
== None
Keeps the default tap zones.
== Horizontal
Changes so that the tap zones are flipped horizontally.
== Vertical
Changes so that the tap zones are flipped vertically.
== Both
Changes so that the tap zones are flipped horizontally and vertically.
:::

### Font size and line height
Adjust font size and the spacing between lines to make chapter text comfortable to read. The defaults are 16 for font size and 1.6 for line height.

### Font family and alignment
Choose a font family and align the text left, center, right, or justified. Original source fonts can be retained with the corresponding reader option.

### Paragraph indentation and margins
Set paragraph indentation and the space around the text. Left, right, top, and bottom margins can be adjusted independently.

## Reading - Paged only

### Page spread
Use the page spread setting to control the layout of paged text, including double-page reading. Font size and margins affect how much text fits on each page.

### Page transitions
Choose a page effect and enable swipe navigation for turning pages. Automatic page turns use the configured interval.

## Reading - Scroll only

### Auto scroll
Adjust automatic scrolling speed to match your reading pace.

## Navigation

### Volume keys <Badge type="info" text="Off" />
Navigate chapter text using the volume keys. The scroll distance can be adjusted in reader settings.

### Invert volume keys <Badge type="info" text="Off" />
Invert the direction of the volume buttons

## Actions

### Text selection
Enable text selection to select and copy chapter text.

### Advanced styling
Open **Advanced** to configure embedded CSS and JavaScript, source CSS priority, and named CSS/JavaScript snippets.
See [Novel Reader (Advanced)](/docs/guides/novel-reader-snippets) for details and examples.

### Find & Replace
Create literal or regex replacement rules for **This novel** or **Global**, test them with sample text, and control their execution order.
See [Find & Replace](/docs/guides/novel-reader-snippets#regex-rules) for setup, matching options, and examples.
