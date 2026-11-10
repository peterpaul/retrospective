# Retrospective tool

This repository builds a single-page-application that can be used to guide/fascilitate an agile retrospective meeting.

## Requirements

### General 

- Participants can be added to the retrospective by the fascilitator
- Any previously added participant will be remembered in local storage to quickly add in a new retrospective
- The fascilitator can start the retrospective
- Output from previous retrospectives can be viewed
- For previous retrospectives the average rating is displayed

### Retrospective

- When the retrospective is started, the tool selects each participant in random order to collect feedback
- For each selected participant there is a rating number input from 1 to 10 that reflects the general feeling of the participant over the last sprint
- A selected participant can be deferred by the fascilitator
- New participants can be added during the retrospective by the fascilitator
- There is a separate input section to collect generic feedback or action items
- When closing a retrospective, the ratings and the feedback are stored in local storage with all metadata
- During a retrospective, the fascilitator can call back the feedback from the previous retrospective
- An average rating is shown during the retrospective
- The fascilitator can close the retrospective
- At the end of the retrospective, deferred participants get one more chance to provide their rating
- After the rating of a participant is entered, the selected answer resets and displays a question mark until a new rating is selected
- When recalling the feedback from a previous retrospective, it is displayed in a pop-up card; items may be selected in that card and are added to the current retrospective outcome upon closure of the card

## Screens

- When the application is started by the fascilitator a dashboard is shown

### Dashboard

- inspect previous retrospectives
- prepare new retrospective
  
### Previous retrospective

- read-only view of retrospective data
- button to delete/forget with double approval

### Prepare next retrospective

- set sprint name/number
- add participants
  - from local storage
  - text input box
  - pre-filled automatically from the most recent retrospective's participants
- remove participants from the squad
- start retrospective

### Ongoing retrospective

- add participant
  - from local storage
  - text input box
- collect each participants number
- collect general/anonymous feedback/action points
- the ongoing view is arranged in two columns
  - the first column (wider) holds the collect-a-rating card, then the feedback/action card
  - the second column holds the sprint retrospective card, then the participants card
- the participants card lists all participants one per line, shows the rating for those who already entered one, shows the current average, and lists participants in alphabetical order so the collection order is not derivable from the listing

## Data

- stored retrospective
  - sprint name/number
  - date/time of retrospective
  - participants
  - ratings
  - feedback/action points
