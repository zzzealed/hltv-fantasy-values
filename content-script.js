console.log("HLTV Fantasy Values extension running!");

const observer = new MutationObserver(() => {
  const pickedCon = document.querySelector("div.pickedCon");
  const teamCons = document.querySelectorAll("div.teamCon");

  if (teamCons) {
    for (const teamCon of teamCons) { // We iterate through each since we can't use .observe on a NodeList
      const teamConObserver = new MutationObserver(() => {
        const teamPlayers = teamCon.querySelectorAll("div.teamPlayer");
        teamConObserver.disconnect();
        addValues(teamPlayers);
      })
      teamConObserver.observe(teamCon, { childList: true, subtree: true });
    }
  }

  if (pickedCon) {
    pickedConObserver = new MutationObserver(() => {
      const picked = pickedCon.querySelectorAll("div.picked");
      updateCombinedRating(picked);
    })
    pickedConObserver.observe(pickedCon, { childList: true, subtree: true });
  }

  observer.disconnect(); // We just disconnect after looking, fuck it

})
observer.observe(document.body, { childList: true, subtree: true }); // We use childList and subtree for all observers since all the divs are nested

function addValues(teamPlayer) {
  console.log("addValues");

  // TODO: use for of instead of forEach
  teamPlayer.forEach(player => {
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
    }

    // Finally append "valueDiv" under "playerButton"
    const playerButton = player.querySelector("button.playerButton"); // This is the last time we are finding an element
    if (playerButton) {
      // I have no idea why but this looks right
      playerButton.style.position = "relative";
      valueDiv.style.position = "absolute";
      valueDiv.style.right = "8px";
      playerButton.appendChild(valueDiv);
    }
  })
}

function updateCombinedRating(picked) {
  console.log("updateCombinedRating");
  const ratings = [];
  for (const player of picked) {
    const statDiv = player.querySelector("div.player-card-stats")?.textContent;
    if (!statDiv) return;
    ratings.push(parseFloat(statDiv.match(/^Rating([\d.]+)/)?.[1]));
  }

  // Add all ratings together
  let combinedRating = 0;
  for (const rating of ratings) {
    combinedRating += rating;
  }

  // Remove potential previous 
  const remainingBudget = document.querySelector("div.remainingBudget");
  remainingBudget.querySelector("div.combinedRating")?.remove(); // Remove potential previous combinedRating div

  // Make and add combinedRatingDiv
  const combinedRatingDiv = document.createElement("div");
  combinedRatingDiv.className = "combinedRating";
  combinedRatingDiv.textContent = `Combined rating: ${combinedRating.toFixed(2)}`; // Round to 2 decimals. Don't know why it's even needed
  const saveButton = remainingBudget.querySelector("button.saveButton");
  remainingBudget.insertBefore(combinedRatingDiv, saveButton);
}
