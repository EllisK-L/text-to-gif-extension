//This is some default code from the official google guide, 
//I'm going to change it later to add toggles
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ colour });
    console.log("Default background colour set to %cgreen", `color: ${colour}`);
})