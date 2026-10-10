---
title: Privacy policy
description: Privacy Policy that explains how Nekori collects, uses, and protects users' personal information.
editLink: false
---

# Privacy policy

Last updated: October 10, 2026.

See also our [Terms of Service](/terms-of-service/).

Nekori is an Open Source app.
This SERVICE is provided at no cost and is intended for use as is.

This page details our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.

If you choose to use our Service, then you agree to the collection and use of information in relation to this policy.
The Personal Information that we collect is used for providing and improving the Service.
We will not use or share your information with anyone except as described in this Privacy Policy.

## Information Collection and Use

For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information.
The information that we request will be retained by us and used as described in this privacy policy.

Nekori does not include Firebase Crashlytics, and this website does not load Google Analytics.
The hosting provider still receives normal web requests.

Sources, plugin repositories, trackers, and optional AI or online TTS providers receive the requests needed for their features.
Translation and summaries send selected text to your configured provider; its own privacy policy and usage limits apply.
Backups can include personal library data and settings, so keep them private.

## Discord OAuth and Rich Presence

Connecting Discord is optional. When you connect, Nekori uses Discord authorization to show your connected account and share activity through Discord Rich Presence. Requests go directly from your device to Discord services; this integration does not route your Discord credentials or activity through a Nekori server.

### Account information and storage

Discord provides your account ID, username, display name, and profile details such as your avatar, banner, and accent color. Nekori uses these details to display your connected account. Discord profile details are held in memory while the app runs; downloaded images may also be cached.

Nekori stores your OAuth access and refresh tokens, and related authorization information such as an ID token if supplied, granted permissions, and expiry time, in encrypted private storage on your device using Android Keystore. This lets you stay connected across app launches. Credentials remain there until you log out or the app clears invalid credentials. The secure credential store is not included in Nekori's normal app backups; Discord-related settings may be included.

### Activity shared with Discord

Depending on your settings and what you are doing, Rich Presence can include:

- App, library, browsing, or reading activity and timestamps.
- A source's name, icon, or link.
- A novel's title, cover, or link.
- A chapter's name or link.

Nekori also sends public cover or source-icon URLs to Discord to display external images. Activity may be visible to other Discord users according to Discord's features and your Discord privacy settings. This integration does not send chapter text or upload your whole library. Nekori does not use this integration to read your messages or retrieve your friends or server lists.

### Your controls and deletion

Use **Settings > Discord Rich Presence** to control activity sharing, including app/library, browsing, and reading activity. Activity options are enabled by default, so review them when connecting your account. Incognito mode suppresses relevant activity sharing. Restrictions for sensitive sources depend on how plugins classify their content; they cannot guarantee that all sensitive content is recognized.

Turning off activity sharing or using Incognito does not disconnect your account. Nekori may still refresh your tokens or fetch your profile while you remain connected.

Select **Logout** in Discord Rich Presence settings to remove locally stored Discord credentials and pending authorization information and clear the connected profile. Nekori also attempts to clear the current Discord activity and revoke the authorization with Discord, but these requests may fail, for example if the network is unavailable. You can independently revoke access in Discord's **Authorized Apps** settings. Logging out does not guarantee deletion of data already received or retained by Discord.

Discord processes information under its own [Privacy Policy](https://discord.com/privacy) and [Terms of Service](https://discord.com/terms). Its policy governs Discord's storage, retention, and deletion of information it receives. For questions about Nekori's handling of Discord data or help with a deletion request, use [Nekori Discussions](https://github.com/Yuneko-dev/Nekori/discussions). Discussions are public: do not post tokens, passwords, or other sensitive account information.

## External Links

This Service contains links to other sites.
If you click on a third-party link, you will be directed to that site.
Note that these external sites are not operated by us.
Therefore, we strongly advise you to review the Privacy Policy of these websites.
We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.

This includes the use of external tracking services (e.g. MyAnimeList).

## Changes to This Privacy Policy

We may periodically update our Privacy Policy.
Thus, you are advised to review this page periodically for any changes.

## Contact Us

If you have any questions or suggestions about this Privacy Policy, do not hesitate to reach out to us on [Nekori Discussions](https://github.com/Yuneko-dev/Nekori/discussions).
