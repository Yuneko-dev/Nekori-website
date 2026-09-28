---
title: Local source
titleTemplate: Guides
description: For users who would like to download and organize their own media.
---

# Local source

If you like to download and organize your media, then you want to know how to manage your own series in Nekori.

::: warning
This page explores some advanced features.
:::

## Creating local series

1. In your selected storage location (for example, `/Nekori/`), use the `localnovels` folder for local novels (for example, `/Nekori/localnovels/`). Place a folder per novel, or a supported individual book file, inside it.

    > If adding series in folders it is recommended to add a file named `.nomedia` to the local folder so images do not show up in the gallery.

1. You should now be able to access the series in <nav to="sources"> under **Local Novels**.

If you add more chapters then you'll have to manually refresh the chapter list (by pulling down the list).

Supported chapter formats include plain text (`.txt`, `.text`), Markdown (`.md`), HTML (`.html`, `.htm`, `.xhtml`), EPUB, archives containing text/HTML, and directories containing text/HTML files.

A single folder or ZIP/RAR archive is treated as a single chapter; its text/HTML files are concatenated in filename order. EPUB files with multiple table-of-contents entries are split into separate chapters.

### Folder structure

For a novel organized into chapter folders, use the structure below. Supported individual book files can also be placed directly in `localnovels`.
Local novels will be read from the `localnovels` folder in your selected storage location.
When organizing chapters into folders, place each `Chapter` folder inside the corresponding `Series` folder.
Text or HTML files will then go into the chapter folder. You can also place individual chapter files directly inside the series folder.
See below for more information on archive files.
You can refer to the following example:

:::info Example
<div class="tree">
  <ul>
    <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
    <span class="folder root">[your storage location]/localnovels</span>
    <li>
      <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
      <span class="folder main">[the series title]</span>
      <ul>
        <li>
          <img src="/img/jpeg.svg" alt="File" class="tree-icon icon-jpeg">
          <span class="file jpg">cover<span class="file-extension">.jpg</span></span>
        </li>
        <li>
          <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
          <span class="folder">chapter_1</span>
          <ul>
            <li><span class="file">page_1<span class="file-extension">.html</span></span></li>
            <li><span class="file">page_n<span class="file-extension">.html</span></span></li>
          </ul>
        </li>
        <li>
          <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
          <span class="folder">chapter_2</span>
          <ul>
            <li><span class="file">page_1<span class="file-extension">.html</span></span></li>
            <li><span class="file">page_n<span class="file-extension">.html</span></span></li>
          </ul>
        </li>
        <li>
          <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
          <span class="folder">chapter_n</span>
          <ul>
            <li><span class="file">page_1<span class="file-extension">.html</span></span></li>
            <li><span class="file">page_n<span class="file-extension">.html</span></span></li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>
:::

Nekori will see three chapters in a single series.
In this folder-per-chapter example, the path to the text files contains both the series title and the chapter name. Individual chapter files do not need an extra chapter folder.

Use zero-padded filenames such as `001 - Prologue.txt` and `002 - Chapter 1.html` to keep chapters in order. Avoid renaming a novel folder after adding it to your library; the folder name is used to find it.

### Archive files

Archive files such as `ZIP`/`CBZ` are supported but the folder structure inside is not.
Any folders inside the archive file are ignored.
You must place the archive inside the `Series` folder where the name will become the `Chapter` title.
Text and HTML entries inside the archive are read in filename order and combined into one chapter. Image-only comic archives do not provide novel text.

#### Example {#example-archives}

:::tabs
== .ZIP
<div class="tree">
  <ul>
    <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
    <span class="folder root">[your storage location]/localnovels</span>
    <li>
      <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
      <span class="folder main">[the series title]</span>
      <ul>
        <li>
          <img src="/img/jpeg.svg" alt="File" class="tree-icon icon-jpeg">
          <span class="file jpg">cover<span class="file-extension">.jpg</span></span>
        </li>
        <li>
          <img src="/img/zip.svg" alt="Compressed File" class="tree-icon icon-zip">
          <span class="file zip">chapter_1<span class="file-extension">.zip</span></span>
          <ul>
            <li>
              <img src="/img/jpeg.svg" alt="File" class="tree-icon icon-jpeg">
              <span class="file jpg">page_1<span class="file-extension">.html</span></span>
            </li>
            <li>
              <img src="/img/jpeg.svg" alt="File" class="tree-icon icon-jpeg">
              <span class="file jpg">page_n<span class="file-extension">.html</span></span>
            </li>
          </ul>
        </li>
        <li>
          <img src="/img/zip.svg" alt="Compressed File" class="tree-icon icon-zip">
          <span class="file zip">chapter_2<span class="file-extension">.zip</span></span>
          <ul>
            <li>
              <img src="/img/jpeg.svg" alt="File" class="tree-icon icon-jpeg">
              <span class="file jpg">page_1<span class="file-extension">.html</span></span>
            </li>
            <li>
              <img src="/img/jpeg.svg" alt="File" class="tree-icon icon-jpeg">
              <span class="file jpg">page_n<span class="file-extension">.html</span></span>
            </li>
          </ul>
        </li>
        <li>
          <img src="/img/zip.svg" alt="Compressed File" class="tree-icon icon-zip">
          <span class="file zip">chapter_n<span class="file-extension">.zip</span></span>
          <ul>
            <li>
              <img src="/img/jpeg.svg" alt="File" class="tree-icon icon-jpeg">
              <span class="file jpg">page_1<span class="file-extension">.html</span></span>
            </li>
            <li>
              <img src="/img/jpeg.svg" alt="File" class="tree-icon icon-jpeg">
              <span class="file jpg">page_n<span class="file-extension">.html</span></span>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>
:::

## Importing EPUBs with the import screen

The easiest way to add EPUBs is the in-app import screen, which previews and organizes files before importing. You do not have to place files manually.

Open it from the **Library** overflow menu (**Import EPUB**), or send an EPUB to Nekori from another app.

### Opening EPUBs from another app

From a file manager, browser, or any app, use **Share** or **Open with → Nekori** on an `.epub` file. It opens straight in the import screen.

### Novel groups and volumes

Selected files are parsed and grouped into **novel groups**. Each group becomes one novel. The files inside it are its **volumes**. The app guesses the grouping and order from EPUB metadata and filenames.

For each group you can:

- Edit the **novel title**.
- **Reorder volumes** inside a group with the up/down arrows.
- Edit a **volume title** (shown only when a group has more than one volume).
- **Switch a volume** to another group, or to a new group, with the move (folder) menu.
- **Remove** a volume or a whole group.
- Expand a volume to preview its metadata and table of contents.

A group with more than one volume is imported as a single combined novel. The volumes keep their order.

Use **Auto rename & organize** in the top bar to re-group and rename everything from EPUB metadata again.

At the bottom, there is the option to **Add to library automatically** with a **category** picker. Otherwise, the imported EPUBs will be found in the Local Novels option in Browse tab.


## Multi-Volume EPUB Ordering

For multi-volume novels where each volume is an EPUB with multiple TOC chapters:

- Volume file order is determined by filename natural order.
- TOC chapter order is kept within each volume.
- TOC chapters are assigned continuous chapter numbers (1, 2, 3...) in file order.
- Final chapter list is ordered by chapter number, then by chapter title.

Recommended naming:

```text
Volume 01.epub
Volume 02.epub
Volume 03.epub
```

or

```text
001 - Volume 1.epub
002 - Volume 2.epub
003 - Volume 3.epub
```

Avoid unnumbered names like only `Part A.epub`, `Part B.epub` unless lexical order is intended.


## Metadata Notes

- EPUB metadata can populate chapter/novel fields.
- Cover image may be extracted from EPUB (embedded or external URL).
- The last EPUB's cover will be used as cover if none exists
- If metadata is missing, filename-based values are used.

## Troubleshooting

- Wrong order: add zero-padded numbers (`001`, `002`, `003`) to filenames.

## Mixed Content Rules

- Mixed files in the same novel folder are supported: `.epub`, `.txt/.html`, archives, and chapter folders can coexist.
- Ordering is still based on top-level filename natural order.
- EPUB files inside a chapter folder are not treated as EPUB chapters; folder mode reads only text/html files inside that folder.

<style scoped>
  @import "../../../.vitepress/theme/styles/tree.styl"
</style>
