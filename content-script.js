console.log("HLTV Fantasy Values extension running!");

// Create MutationObserver since this content is loaded dynamically, or some bullshit
const observer = new MutationObserver(() => {
  const teamPlayers = document.querySelectorAll("div.teamPlayer"); // All players outside deck has "teamPlayer" class
  const pickedPlayers = document.querySelectorAll("div.picked"); // All players inside deck has "picked" class
  // If NodeList of teamPlayers contains anything, disconnect observer and run functions
  if (teamPlayers.length > 0) {
    observer.disconnect();
    addValues(teamPlayers);
    addCollectiveRating(pickedPlayers);
  };
});
observer.observe(document.body, {
  childList: true, // This checks if elements are added
  subtree: true // This checks all nested elements, which we need cause everything is fucking nested divs
});

function addValues(teamPlayers) {
  //console.log("Running addValues");
  // For each entry in `teamPlayers`, get these two divs
  teamPlayers.forEach(player => {
    const statDiv = player.querySelector("div.player-card-stats")?.textContent;
    const buttonDiv = player.querySelector("div.playerButtonText")?.textContent;
    // Strip and format, respectively, so we get pure numbers we can work with
    const rating = parseFloat(statDiv.match(/Rating([\d.]+)/)?.[1]); // I do not understand regex
    const price = parseInt(buttonDiv.replace(/[$,]/g, '')); // Again, what's going on?
    // Super simple formula; divide rating 3.0 with their price and multiply by 100.000 to get a number that's easier to work with
    const value = rating / price * 100000;
    // Create our `valueDiv` to display our "value" on the page
    const valueDiv = document.createElement("div");
    valueDiv.className = "playerValue";
    valueDiv.textContent = `${value.toFixed(3)}`; // Round to 3 decimals so our button isn't filled lol
    // Set margin-right for price text
    const playerButtonText = player.querySelector("div.playerButtonText");
    if (playerButtonText) {
      playerButtonText.style.marginRight = "13.7188px"; // Same width as playerButtonIcon
    };
    // Finally append "valueDiv" under "playerButton"
    const playerButton = player.querySelector("button.playerButton"); // This is the last time we are finding an element
    if (playerButton) {
      // I have no idea why but this looks right
      playerButton.style.position = "relative";
      valueDiv.style.position = "absolute";
      valueDiv.style.right = "8px";
      playerButton.appendChild(valueDiv);
    };
  });
};

// TODO: make function for finding and stripping rating, to reuse

function addCollectiveRating(pickedPlayers) {
  console.log("Running addCollectiveRating");
  const ratings = [];
  pickedPlayers.forEach(player => {
    const statDiv = player.querySelector("div.player-card-stats")?.textContent;
    ratings.push(parseFloat(statDiv.match(/Rating([\d.]+)/)?.[1])); // I do not understand regex
  });
  let collectiveRating = 0;
  for (const rating of ratings) {
    collectiveRating += rating;
  };
  const collectiveRatingDiv = document.createElement("div");
  collectiveRatingDiv.className = "collectiveRating";
  collectiveRatingDiv.textContent = `Collective rating: ${collectiveRating}`;
  const remainingBudget = document.querySelector("div.remainingBudget");
  const saveButton = remainingBudget.querySelector("button.saveButton");
  if (remainingBudget) {
    remainingBudget.insertBefore(collectiveRatingDiv, saveButton);
  };
};
