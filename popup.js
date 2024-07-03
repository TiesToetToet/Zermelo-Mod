let modEnabled;

chrome.storage.local.get(["enabled"]).then((result) => {
  modEnabled = result.enabled;
  // Select the checkbox using its class
  const checkbox = document.querySelector(".promoted-input-checkbox");

  // Check the checkbox
  checkbox.checked = modEnabled;

  // If you need to trigger any change event listeners attached to the checkbox:
  checkbox.dispatchEvent(new Event("change"));
  checkbox.addEventListener("change", function (event) {
    if (this.checked) {
      chrome.storage.local.set({ enabled: true });
    } else {
      chrome.storage.local.set({ enabled: false });
    }
  });
});
