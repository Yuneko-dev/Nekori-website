---
title: Settings
titleTemplate: Frequently Asked Questions
description: Frequently Asked Questions about various app settings.
---

# Settings
Frequently Asked Questions about various app settings.

## Why is taking screenshots blocked?
Set **Secure screen** to **Never** in <nav to="security-and-privacy">. The **Incognito mode** option blocks screenshots only while Incognito mode is enabled.

## How do I set up AI features?
Open **Settings → AI → Providers** and add a provider. Enter its API key if required, then enter a model or use **Load models** to choose one. Use **Test connection** to check the configuration, then save it.

Back in **Settings → AI**, choose a **Provider** separately under **Chapter summary** and **AI translation**. To use a different server endpoint, select **Custom (OpenAI compatible)** in the provider editor.

## Can summaries and translations use different instructions?
Yes. Create reusable instructions in **Settings → AI → User guidelines**, then select the guidelines separately for **Chapter summary** and **AI translation**. Empty guidelines add no extra instructions.

## How do I limit AI requests or retries?
In **Settings → AI → Resources**, adjust **Requests per minute** and **Retries after an error**. Both apply to summaries and translations; the request limit is shared across AI tasks. Setting the request limit to **Unlimited** does not remove limits imposed by your provider.

## How do I show my reading activity on Discord?
Open **Settings → Discord Rich Presence**, select **Login with Discord**, and complete login. Turn on **Enable Discord Rich Presence**, then choose whether to show app and library activity, browsing activity, or novel and chapter activity.

If activity is missing, check these switches and turn off Incognito mode. Sensitive-content settings in <nav to="security-and-privacy"> can also block Discord Rich Presence for affected sources.

## What is DNS over HTTPS?
**DNS over HTTPS (DoH)** encrypts DNS lookups and may help with DNS-based website blocking. Choose a provider under **Settings → Advanced → Network → DNS over HTTPS**, then restart Nekori for the change to take effect.

## What does Bypass internet censorship do?
**Settings → Advanced → Network → Bypass internet censorship** is an experimental option that splits initial HTTP and TLS traffic to try to bypass DPI filtering. It may help when a network blocks a source, but it is not guaranteed to work on every network.

## When should I use Domain forwarding?
Use **Settings → Advanced → Network → Domain forwarding** when a source has a working replacement domain. Add the **Source origin** and **Target origin**, including `https://`, then choose **Plugin requests only** or **Apply globally**.

Forwarding replaces the URL's origin while keeping its path and query. It cannot fix a plugin when the replacement site uses a different page structure.

## How do I reset website login or WebView data?
In **Settings → Advanced → Network**, use **Clear cookies** to remove stored website cookies, or **Clear WebView data** to reset the embedded browser's data. You may need to sign in to sources again afterward.

## How do I change or reset the user agent?
Use **Settings → Advanced → Network → Default user agent string**. To undo a custom value, select **Reset default user agent string**. Restart Nekori after either change.

## What does Clear rate limit history do?
**Settings → Advanced → Network → Clear rate limit history** resets Nekori's tracked request pacing for each host. It can clear a wait based on stale local history; it does not remove a website's own rate limits.
