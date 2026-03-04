# NurseBill

Case management and billing software for criminal defense legal nurse consultants. Runs entirely on your Mac — no subscription, no cloud, no data leaves your machine.

---

## Installation

1. Download the `.dmg` file you were sent:
   - `NurseBill-x.x.x-arm64.dmg` — Apple Silicon (M1/M2/M3/M4 Mac)
   - `NurseBill-x.x.x.dmg` — Intel Mac
2. Open the `.dmg` file.
3. Drag **NurseBill** into your **Applications** folder.
4. Eject the disk image from the Finder sidebar (⏏ next to the volume name).
5. Launch NurseBill from Applications or Spotlight (`Cmd+Space → NurseBill`).

> **Updates are automatic.** Once installed, NurseBill checks for updates on launch and prompts you to install them — no need to re-download.

> **First launch on older macOS:** If you see a security warning, go to **System Settings → Privacy & Security**, scroll down, and click **Open Anyway**.

---

## First Setup

### 1. Set Your Name

- Click the **Settings** tab (gear icon, bottom of the sidebar).
- Under **Your Profile**, enter your name and credentials (e.g. `Jennifer Grossman BSN, RN, LNC`).
- Add your phone number and payment address — these appear on invoices.

### 2. Set Your Email Signature

- Still in **Settings → Your Profile**, fill in your **Email Signature**.
- This is automatically appended to every email you send from NurseBill.

### 3. Choose Your Cases Folder

Your cases folder is where NurseBill stores and opens case files. You can use any folder on your Mac, including an iCloud Drive folder so files stay in sync.

- In **Settings**, click **Choose Folder** under **Cases Folder**.
- Select or create the folder you want to use (e.g. `~/Documents/NurseBill Cases`).

#### Using iCloud Drive

1. Open **Finder → iCloud Drive** and create a folder called `NurseBill Cases`.
2. In NurseBill Settings, click **Choose Folder** and select that folder.
3. macOS syncs everything in that folder to iCloud automatically.

---

## Connecting Gmail

Gmail integration lets you pull case-related emails into a case and send invoices without leaving the app.

### Setup

1. Go to **Settings → Gmail** and click **Connect Gmail**.
2. Sign in with your Google account and grant Gmail access.
3. Once connected, your email address appears with a green indicator.

### How It Works

| Action | What happens |
|---|---|
| Click **Pull from Gmail** on a case | Searches your inbox for emails related to that case |
| Click **Send** on an invoice email | Sends via Gmail with your signature attached |
| Click **Disconnect** | Revokes access and clears the token |

> NurseBill only reads Gmail when you explicitly trigger an action. It never reads email in the background.

---

## Connecting Google Calendar

Google Calendar sync lets NurseBill create calendar events for due dates, hearings, meetings, and testimony dates.

### Setup

1. Go to **Settings → Google Calendar** and click **Connect Google Calendar**.
2. Sign in with your Google account and grant calendar access.

### How It Works

| Action in NurseBill | What happens in Google Calendar |
|---|---|
| Set a due date on a case | Event created/updated in your calendar |
| Click **+ Meeting** on a case | Meeting event added to your calendar |
| Click **+ Testimony** on a case | Testimony event added (billable) |
| Click **+ Add Event** in Calendar tab | Custom event added to your calendar |
| Move a date in Google Calendar | NurseBill picks it up within 5 minutes |
| Delete a case | Removes the associated calendar events |

- Sync runs every 5 minutes and whenever you switch back to the app.
- To disconnect, click **Disconnect** in Settings or revoke access at [myaccount.google.com/permissions](https://myaccount.google.com/permissions).

---

## Day-to-Day Use

### Adding a Case

1. Click **+ New Intake** at the top of the sidebar.
2. Fill in the client name, attorney, case type, source, and rate.
3. Click **Save**. The case appears in the sidebar under **Intake** status.

### Case Status Pipeline

Move cases through the pipeline by clicking the status pill on a case:

`Intake` → `Need Docs` → `Needs Attention` → `Send Info to Attorney` → `Need to Invoice` → `Invoice Sent` → `Invoice Paid` → `Closed`

### Billing & Invoices

1. Open a case and fill in the **Rate**, **Units**, and **Product** fields.
2. Set an **Invoice No** (the app suggests one based on the attorney source prefix).
3. Click **Generate Invoice** to export a PDF.
4. Use the **Emails** tab on the invoice to send it directly to the attorney via Gmail.

### Scheduling Events on a Case

Inside any case, use the scheduling buttons to add calendar events:

- **+ Add Event** — generic billable event
- **+ Meeting** — non-billable meeting with notes
- **+ Testimony** — billable testimony date

Each creates a local case event and, if Google Calendar is connected, adds it to your calendar automatically.

### File Uploads

The **File Uploads** tab shows files associated with each case stored in your cases folder. Files added to the case folder in Finder appear here automatically.

### Sorting the Case Table

Click any column header to sort by **Name**, **Attorney**, **Status**, **Date Opened**, **Invoice No**, **Total**, and more.

### Excel Import

If you have existing billing data in a spreadsheet:

1. Click **Import** in the top toolbar.
2. Select your `.xlsx` file.
3. NurseBill maps the columns and imports your cases, attorneys, and billing records.

### Deleting a Case

Open a case, scroll to the bottom, and click **Delete Case**. You'll be asked to confirm. If Google Calendar is connected, associated calendar events are also removed.

---

## Settings Reference

| Setting | What it does |
|---|---|
| Name & Credentials | Shown in the sidebar and on invoices |
| Phone Number | Shown on invoices |
| Payment Address | Shown on invoices |
| Email Signature | Appended to every email sent from NurseBill |
| Cases Folder | Where case files are stored and watched |
| Gmail | Connect/disconnect Gmail access |
| Google Calendar | Connect/disconnect calendar sync |
| Clear All Data | Wipes all cases, attorneys, emails, and events (does not delete files from disk) |

---

## Troubleshooting

**App won't open — "Apple could not verify..."**
Go to System Settings → Privacy & Security → scroll down → click Open Anyway.

**Gmail or Calendar won't stay connected**
NurseBill stores tokens locally and refreshes them automatically. If you're repeatedly prompted to reconnect, try disconnecting and reconnecting once from Settings.

**Gmail pull returns no emails**
The search uses the client name and case number. Make sure both are filled in on the case.

**Due dates or events aren't syncing to Calendar**
Confirm Calendar is connected in Settings (shows your email in green). Sync also runs when you switch back to the app — click away and back to trigger it manually.

**Files aren't showing up in the Uploads tab**
Make sure files are placed inside the correct case subfolder. NurseBill watches the folder you selected in Settings.

**iCloud files show "downloading" in Finder**
iCloud may not have synced yet. Right-click the file in Finder and choose **Download Now**, or disable iCloud optimize storage in System Settings → Apple ID → iCloud → iCloud Drive.

---

## Support

hello@nursebillhq.com — [nursebillhq.com](https://nursebillhq.com)
