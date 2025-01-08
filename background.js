let globalRedirectLink = null;
updateBadge(0);

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  console.log('Notification clicked:', notificationId, 'Button:', buttonIndex);
  if (globalRedirectLink) {
    console.log('Redirecting to:', globalRedirectLink);
    chrome.tabs.update({ url: globalRedirectLink });
    chrome.notifications.clear(notificationId);
    updateBadge(1); // Update the badge
  } else {

    updateBadge(0); // Update the badge
    console.log('No redirect link found');
  }
});

chrome.notifications.onShowSettings.addListener(() => {
  console.log('Notification settings shown');
});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkLink") {
    const currentDomain = new URL(request.url).hostname;
    console.log("Current domain:", currentDomain);

    fetch(`http://localhost:3000/check-link?domain=${request.url}`)
      .then((response) => {
        console.log("Response status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Response data:", data);
        if (data.linkFound) {
          console.log("Creating notification for domain:", currentDomain);
          globalRedirectLink = data.redirectLink;
          if(request.redirect){
            chrome.tabs.create({ url: globalRedirectLink }, (tab) => {
              console.log('New tab opened:', tab);
            });
          }
          console.log("Stored redirect link:", globalRedirectLink);
          updateBadge(1); // Update the badge

          chrome.notifications.create(
            'redirect-notification',
            {
              type: "basic",
              iconUrl: "icons/icon48.png",
              title: "Link gefunden!",
              message: `Es gibt einen neuen Link für ${currentDomain}. Klicken Sie hier, um neu zu laden.`,
              buttons: [{ title: "Neu laden" }],
              requireInteraction: true,
            },
            (notificationId) => {
              console.log('Notification created with ID:', notificationId);
              if (chrome.runtime.lastError) {
                console.error('Notification error:', chrome.runtime.lastError);
              }
            }
          );
        } else {
          updateBadge(0);
          console.log("Kein Link in der Datenbank gefunden.");
        }
      })
      .catch((error) => {
        updateBadge(0);
        console.error("Fehler beim Abrufen der Daten:", error);
      });
  }
});
// Function to update the badge text
// Function to update the badge text
function updateBadge(count) {
  // const badgeText = foundLinkCount > 0 ? foundLinkCount.toString() : '';
  // Use chrome.action for manifest version 3
  chrome.action.setBadgeText({ text: count.toString() });
}
