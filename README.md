# NurseBill

Case management and billing software for legal nurse consultants. Runs entirely on your Mac — no subscription, no cloud, no data leaves your machine.

---

## Installation

1. Download `NurseBill-1.0.0-arm64.dmg` (Apple Silicon) or `NurseBill-1.0.0.dmg` (Intel Mac) from the `dist/` folder.
2. Open the `.dmg` file.
3. Drag **NurseBill** into your **Applications** folder.
4. Launch NurseBill from Applications (or Spotlight with `Cmd+Space → NurseBill`).

> **First launch:** macOS may show a security warning. Go to **System Settings → Privacy & Security**, scroll down, and click **Open Anyway**.

---

## First Setup

### 1. Set Your Name

- Click the **Settings** tab (gear icon, bottom of the sidebar).
- Under **Your Name**, enter your name as you want it to appear in the app sidebar (e.g. `Jennifer Grossman BSN, RN, LNC`).

### 2. Choose Your Cases Folder

Your cases folder is where NurseBill stores and opens case files. You can use any folder on your Mac — including an iCloud Drive folder so files stay synced across devices.

- In **Settings**, click **Choose Folder** under **Cases Folder**.
- Select or create the folder you want to use (e.g. `~/Documents/NurseBill Cases`).

#### Using iCloud Drive

To keep your case files synced via iCloud:

1. Open **Finder → iCloud Drive** and create a folder called `NurseBill Cases`.
2. In NurseBill Settings, click **Choose Folder** and select that iCloud Drive folder.
3. macOS will automatically sync everything in that folder to iCloud and across your devices.

> Case files you add in Finder inside that folder will appear in the app, and files saved from the app will sync to iCloud automatically.

---

## Connecting Google Calendar

Google Calendar sync lets NurseBill automatically create and update calendar events when you set due dates or hearing dates on a case. Changes made in Google Calendar sync back to the app.

### Setup

1. Go to **Settings → Google Calendar**.
2. Click **Connect Google Calendar**.
3. Sign in with your Google account and grant calendar access.
4. Once connected, the status shows your email and a last-synced time.

### How It Works

| Action in NurseBill | What happens in Google Calendar |
|---|---|
| Set or change a due date on a case | Event created/updated in your calendar |
| Set or change a hearing date | Event created/updated in your calendar |
| Move a date in Google Calendar | NurseBill picks it up within 5 minutes (or on app focus) |
| Delete a case | Removes the associated calendar event |

- Events are tagged with the case ID so NurseBill knows which client they belong to.
- Sync runs automatically every 5 minutes and whenever you switch back to the app.
- To disconnect, click **Disconnect** in Settings. You can also revoke access from [myaccount.google.com/permissions](https://myaccount.google.com/permissions).

---

## Connecting Gmail

Gmail integration lets you pull case-related emails directly into a case and send invoices without leaving the app.

### Setup

1. Go to **Settings → Gmail Client ID** (or use the default Client ID if pre-configured).
2. In any case, click the **Emails** tab and then **Pull from Gmail**.
3. Sign in with your Google account when prompted and grant Gmail access.
4. NurseBill searches your inbox for emails related to that case and displays them.

### How It Works

| Action | What happens |
|---|---|
| Click **Pull from Gmail** on a case | Searches Gmail for emails mentioning the case/client |
| Click **Send** on a draft invoice email | Sends via Gmail on your behalf |
| Close the app | Gmail token is cleared from memory (nothing saved to disk) |

> NurseBill only accesses Gmail when you explicitly trigger an action. It never reads your email in the background.

---

## Day-to-Day Use

### Adding a Case

1. Click **+ New Intake** at the top of the sidebar.
2. Fill in the client name, attorney, case type, source, and rate.
3. Click **Save**. The case appears in the sidebar under **Intake** status.

### Case Statuses

Move cases through the pipeline by clicking the status pill on a case:

`Intake` → `Need Docs` → `Needs Attention` → `Send Info to Attorney` → `Need to Invoice` → `Invoice Sent` → `Invoice Paid` → `Closed`

### Billing

1. Open a case and fill in the **Rate**, **Units**, and **Product** fields.
2. Set an **Invoice No** (the app suggests one based on the attorney source prefix).
3. Click **Generate Invoice** to export a `.docx` using your invoice template.
4. Use the **Emails** tab to send the invoice directly to the attorney via Gmail.

### Sorting the Case Table

Click any column header to sort: **Name**, **Attorney**, **Status**, **Date Opened**, **Invoice No**, **Total**, etc.

### Excel Import

If you have existing billing data in a spreadsheet:

1. Click **Import Excel** in the top toolbar.
2. Select your `.xlsx` file.
3. NurseBill maps the columns and imports your cases, attorneys, and billing records.

### Deleting a Case

Open a case, scroll to the bottom, and click **Delete Case**. You'll be asked to confirm. If Google Calendar is connected, the associated event is also removed.

---

## Settings Reference

| Setting | What it does |
|---|---|
| Your Name | Sets the name shown in the sidebar subtitle |
| Cases Folder | Where case files are stored and opened from |
| Google Calendar | Connect/disconnect calendar sync |
| Gmail Client ID | The Google Cloud OAuth Client ID for Gmail access |
| Clear All Data | Wipes all cases, attorneys, emails, and events from the app (does not delete files from disk) |

---

## Troubleshooting

**App won't open — "Apple could not verify..."**
Go to System Settings → Privacy & Security → scroll down → click Open Anyway.

**Google Calendar won't connect**
Make sure you're signed into the correct Google account and that the OAuth Client ID in your Google Cloud Console has `http://localhost:17839` listed as an authorized JavaScript origin.

**Gmail pull returns no emails**
The search looks for the client name and case number in subject lines. Make sure the case has a name and case number filled in.

**Due dates aren't syncing to Calendar**
Check Settings to confirm Calendar is connected (shows your email). The sync also runs on app focus — click away and back to trigger it.

**Files aren't showing up in the Cases Folder**
Make sure files are placed inside the correct case subfolder. NurseBill watches the folder you selected in Settings.

**iCloud files show "downloading" in Finder**
iCloud may not have downloaded the file yet. Right-click it in Finder and choose **Download Now**, or turn off iCloud optimize storage in System Settings → Apple ID → iCloud → iCloud Drive → Options.

---

## Support

hello@nursebillhq.com — [nursebillhq.com](https://nursebillhq.com)
