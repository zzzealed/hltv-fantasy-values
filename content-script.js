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


function parseRating(player) {
  const statDiv = player.querySelector("div.player-card-stats")?.textContent; // Use ? so we get undefined if querySelector can't find the div. Avoids crash
  const rating = parseFloat(statDiv?.match(/Rating([\d.]+)/)?.[1]); // I do not understand regex
  return rating;
}


function parsePrice(player) {
  const buttonDiv = player.querySelector("div.playerButtonText")?.textContent;
  const price = parseInt(buttonDiv.replace(/[$,]/g, '')); // Again whats going on I hate regex
  return price;
}


function addValues(teamPlayer) {
  console.log("addValues");

  // Use parseRating on each player's div
  for (const player of teamPlayer) {
    const rating = parseRating(player);
    const price = parsePrice(player);

    // Calculate "value"
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
  }
}


function updateCombinedRating(picked) {
  console.log("updateCombinedRating");

  let combinedRating = 0;
  for (const player of picked) {
    const rating = parseRating(player);

    // If rating is not NaN we use it to caluclate combinedRating
    if (!isNaN(rating)) {
      combinedRating += rating;
    }

    // Remove potential previous 
    const remainingBudget = document.querySelector("div.remainingBudget"); // We use document because it's outside "picked" div
    remainingBudget.querySelector("div.combinedRating")?.remove(); // Remove potential previous combinedRating div
  
    // Make div and add combinedRatingDiv
    const combinedRatingDiv = document.createElement("div");
    combinedRatingDiv.className = "combinedRating";
    combinedRatingDiv.textContent = `Combined rating: ${combinedRating.toFixed(2)}`; // Round to 2 decimals. Don't know why it's even needed
    const saveButton = remainingBudget.querySelector("button.saveButton");
    remainingBudget.insertBefore(combinedRatingDiv, saveButton); // Insert before saveButton so layout isn't messed up
  }
}
