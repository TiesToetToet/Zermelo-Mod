// SERVICE WORKER
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason == chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.local.set({
      colorMain: "#2c3e50",
      colorGeneral: "#7b7bb3",
      colorExam: "#e8cb22",
      colorActivity: "#268e26",
      enabled: true,
      backgroundColor: "#ffffff",
    });
  }
});
