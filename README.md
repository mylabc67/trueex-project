trueEX/truePTS Coding Exercise for UI Software Engineers
========================================================

1. Setup Instructions

Start off with the usual:

`npm install`

To run the data-streaming service, run the following command: 

`npm run start-streamer`

This will start up the streaming service on port 3030. Build the UI, and start it up with:

`npm run build`
`npm run start-prod`

The web application will then be available at http://localhost:8080
The core of the application is in the src/ folder (this is the only place you should need to make changes in). The front-end main file is src/client.js 

2. Requirements

* The data-streaming service sends data exactly every 200ms, with a random set of updates. This is way too high an update rate for users to be able to keep
 track of. Implement a throttling mechanism on the UI (using lodash.throttling does not count as implementing...) to only update entries in the table at most twice a second.

    Solutions: Added one more state inside the view to indicate when is the last updated time, only update the view when current time is 500ms more than that.
  
* Even with updates being rendered less often, it is still difficult to keep track of number trends. Implement a visual mechanism whereby if a number in a cell increases,
 the foreground color of that number becomes green, if the number decreases make the foreground color red. 
    
    Solutions: Added one new helper function which could transform the array to record the data from both original array and updated array. From view side, will decide which css class to use based on the comparison with the two values. 

    Also added the jest test for the new helper function. The tests can be run by run the command
    `jest` or `npm test` in the root direction.
 
* Implement a reconnection mechanism to handle streaming-service disconnects (you can kill and restart the data-streaming service to simulate this...)

    Solutions: Added config for the websocket and did not remove socket inside disconnect event. Only remove the socket once it reaches maximum attemp times.

* Document any assumptions you have made
