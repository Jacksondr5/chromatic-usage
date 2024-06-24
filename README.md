TODO:

- [x] Setup CI
- [x] Add file upload and parse
  - [x] add contents to DB
  - [x] clear on new file upload
- [ ] Convert app IDs to names
- [x] Store app ID -> name in DB
  - [ ] prompt for it if needed
- [ ] Add graphs for the usage
- [ ] Add column for total snapshots per build
- [ ] Add error checking when you upload a CSV that the apps exist. Direct people to settings.
<!-- - [ ] Setup Vercel deployment -->

# Data views

- [ ] Use of snapshots over time for this month
  - [x] cumulative
  - [x] by app
  - [ ] trend line
- [x] Compare skipped snapshots to total snapshots
  - [x] overall
  - [x] by app
- [ ] All of the above, but filtered to a specific app
- [ ] some kind of per-branch analysis?
  - [ ] what branches were the most expensive?
  - [ ] were there any stand-outs?
- [ ] Compare use of snapshots between month
  - [ ] overall
  - [ ] by app

## Querying

- group by branch, date, app, browser
- count snapshots, number of builds, skipped snapshots
- filter by branch, app, browser, date range
