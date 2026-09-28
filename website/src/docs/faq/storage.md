---
title: Storage
titleTemplate: Frequently Asked Questions
description: Understanding Storage Permissions.
---

# Storage location

Nekori manages several things within a selected storage location, including automatic backups, chapter downloads, and the Local source.

::: tip Selecting a storage location
Keep the following in mind when setting up your Storage location:
* Create a "Nekori" folder at the top-level of your storage (ex. `/Internal Storage/Nekori/`).
* Do not use your device's system folders (such as "**Documents**" or "**Downloads**"), they are restricted by Android and will cause issues when Nekori tries to access them.
* When selecting your storage location during the setup process, give access to the "Nekori" folder, not the folders within.
:::

The following illustrates the folder structure:

:::info Example
<div class="tree">
  <ul>
    <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
    <span class="folder root">[your selected storage location]</span>
    <li>
      <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
      <span class="folder main">autobackup</span>
      <ul>
        <li>
          <img src="/img/nekori-64px.png" alt="File" class="tree-icon icon-nekori">
          <span class="file jpg">[app prefix]_yyyy-mm-dd_hh-mm<span class="file-extension">.tachibk</span></span>
        </li>
        <li>
          <img src="/img/nekori-64px.png" alt="File" class="tree-icon icon-nekori">
          <span>...</span>
        </li>
      </ul>
    </li>
    <li>
      <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
      <span class="folder main">downloads</span>
      <ul>
        <li>
          <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
          <span class="folder dynamic">Source name (LANG)</span>
            <ul>
              <li>
                <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
                <span class="folder dynamic">Series title</span>
                <ul>
                  <li>
                    <img src="/img/zip.svg" alt="Compressed File" class="tree-icon icon-cbz">
                    <span class="file cbz">Chapter01<span class="file-extension">.zip</span></span>
                  </li>
                  <li>
                    <img src="/img/zip.svg" alt="Compressed File" class="tree-icon icon-cbz">
                    <span class="file cbz">...</span>
                  </li>
                </ul>
              </li>
              <li>
                <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
                <span class="folder dynamic">Other series title</span>
                <ul>
                  <li>
                    <img src="/img/zip.svg" alt="Compressed File" class="tree-icon icon-cbz">
                    <span class="file cbz">Chapter01<span class="file-extension">.zip</span></span>
                  </li>
                </ul>
              </li>
            </ul>
        </li>
      </ul>
    </li>
    <li>
      <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
      <span class="folder main">localnovels</span>
      <ul>
        <li>
          <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
          <span class="folder dynamic">Series title</span>
          <ul>
            <li>
              <img src="/img/zip.svg" alt="Compressed File" class="tree-icon icon-cbz">
              <span class="file cbz">Chapter01<span class="file-extension">.zip</span></span>
            </li>
            <li>
              <img src="/img/zip.svg" alt="Compressed File" class="tree-icon icon-cbz">
              <span class="file cbz">...</span>
            </li>
          </ul>
        </li>
        <li>
          <img src="/img/folder.svg" alt="Folder" class="tree-icon icon-folder">
          <span class="folder dynamic">Other series title</span>
          <ul>
            <li>
              <img src="/img/zip.svg" alt="Compressed File" class="tree-icon icon-cbz">
              <span class="file cbz">Chapter01<span class="file-extension">.zip</span></span>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>
:::

Backup file name prefixes are unique for the app to avoid potential collisions between forks.

## Scoped Storage

Since Android 11, most apps are enforced to use [Scoped Storage](https://developer.android.com/about/versions/11/privacy/storage) for better security for users so that apps cannot read everything on the device.

**Scoped Storage**'s introduction affects various storage-related functions in **Nekori**.
These functions may become slower due to **Scoped Storage**'s inherent latency, as discussed in detail [here on Scoped Storage](https://www.xda-developers.com/android-q-storage-access-framework-scoped-storage/).

This can impact tasks like deleting chapters, library loading times, accessing local files like downloads or the local source, and more. As always, using internal storage is recommended over SD cards if latency is of concern.

<style scoped>
  @import "../../.vitepress/theme/styles/tree.styl"
</style>
