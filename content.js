chrome.runtime.sendMessage(
  { action: "checkLink",redirect: false, url: window.location.href },
  (response) => {
    if (response && response.linkFound) {
      console.log("Link gefunden:", response.redirectLink);
    }
  }
);

  