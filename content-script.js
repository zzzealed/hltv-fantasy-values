// Log that we are running
console.log("HLTV Fantasy Values extension running!");

// Create MutationObserver since this content is loaded dynamically, or some bullshit
const observer = new MutationObserver(() => {
  // Look at class "teamPlayers" since all the playercards, that aren't added to your deck, has this
  const teamPlayers = document.querySelectorAll("div.teamPlayer");
  // If NodeList of teamPlayers contains anything, disconnect observer and run main
  if (teamPlayers.length > 0) {
    observer.disconnect();
    main(teamPlayers);
  };
});

// This is really just the rules for the MutationObserver above
observer.observe(document.body, {
  childList: true, // This checks if elements are added
  subtree: true // This checks all nested elements, which we need cause everything is fucking nested divs
});

// Main function; does the math and appends the "value"-div
function main(teamPlayers) {
 console.log("Running main");
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
    // Finally append "valueDiv" under "playerButton"
    const playerButton = player.querySelector("button.playerButton"); // This is the last time we are finding an element
      if (playerButton) {
        playerButton.appendChild(valueDiv); // TODO: adjust padding/flex so the price on the button is centered again
    };
  });
};
