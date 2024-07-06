# Chromatic Usage Tool

**This tool is not affiliated with Chromatic.**

This tool is designed to help you parse the usage report that you can download from the Billing page on your Chromatic Dashboard. It converts the CSV into several graphs that can help you better understand how your team is consuming snapshots.

Graphs:

- Cumulative snapshots over time
  - By app
  - Skipped snapshots (TurboSnaps) vs total snapshots
- Daily snapshots by app
- % of snapshots skipped
  - Per day
  - By app

## Usage

1. Clone the repo
1. Run `pnpm install`
1. Run `pnpm dev`
1. Teach the tool how to convert from Chromatic's app IDs to names. Click the "settings" link in the top right corner and follow the directions on screen.
1. Download the CSV from your Chromatic billing page.
1. Upload the CSV to the tool's main page.

## TODO:

- [x] Setup CI
- [x] Add file upload and parse
  - [x] add contents to DB
  - [x] clear on new file upload
- [x] Convert app IDs to names
- [x] Store app ID -> name in DB
  - [ ] prompt for it if needed
- [ ] Add graphs for the usage
- [x] Add column for total snapshots per build
- [ ] Add error checking when you upload a CSV that the apps exist. Direct people to settings.
- [ ] Refresh on upload

### Data views

- [ ] Use of snapshots over time for this month
  - [x] cumulative
  - [x] by app
  - [ ] trend line
- [x] Compare skipped snapshots to total snapshots
  - [x] overall
  - [x] by app
- [ ] some kind of per-branch analysis?
  - [ ] what branches were the most expensive?
  - [ ] were there any stand-outs?
- [ ] Compare use of snapshots between month
  - [ ] overall
  - [ ] by app
