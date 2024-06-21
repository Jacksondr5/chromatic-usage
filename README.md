TODO:

- [x] Setup CI
- [x] Add file upload and parse
  - [ ] add contents to DB
  - [ ] clear on new file upload
- [ ] Convert app IDs to names
- [x] Store app ID -> name in DB
  - [ ] prompt for it if needed
- [ ] Add graphs for the usage
<!-- - [ ] Setup Vercel deployment -->

# Data views

- Use of snapshots over time for this month
  - overall
  - by app
  - trend line
- Use of snapshots over time in a single app
  - overall
  - by browser
- Compare use of snapshots between month
  - overall
  - by app
- Compare skipped snapshots to total snapshots
  - overall
  - by app
  - maybe also as a percentage of snapshots? Since for every 1 un-skipped snapshot, there's actually N snapshots taken because its used for all browsers
- some kind of per-branch analysis?
  - what branches were the most expensive?
  - were there any stand-outs?

## Querying

- group by branch, date, app, browser
- count snapshots, number of builds, skipped snapshots
- filter by branch, app, browser, date range
