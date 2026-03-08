const { version } = chrome.runtime.getManifest();
document.getElementById("version").textContent = `Version: ${version}`;
