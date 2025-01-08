document.getElementById("checkLink").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({ action: "checkLink",redirect: true, url: tabs[0].url });
  });

  // Nachricht anzeigen
  const thankYouMessage = document.getElementById("thank-you-message");
  thankYouMessage.style.display = "block";

  // Nachricht nach 3 Sekunden ausblenden
  setTimeout(() => {
    thankYouMessage.style.display = "none";
  }, 3000);
});
