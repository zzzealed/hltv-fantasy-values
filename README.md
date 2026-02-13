# HLTV Fantasy Values
A browser extension to give a single value for players in HLTV fantasy leagues.

![A screenshot, notice the decimal number to the right of the price](images/screenshot.jpg)

The extension appends a decimal number that represents the "value" or bang-for-your-buck the player offers. \
My [formula](content-script.js#L24) is quite simple. Just `rating / price * 100000`. \
It can then help give an overview of which players are over/under-priced, and if you're as smart as me you might just get top 80%.

## Installation


## TODOs
- [ ] Color code values
- [ ] Re-center price-text
- [ ] Check if extension actually works when originally making lineup and not just after editing
- [ ] Fix issue where you need to refresh edit-page
