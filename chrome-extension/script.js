function clickHandler(info, tab) {
	var id = info.linkUrl.match(/vk.com\/([a-z0-9\-\_]+)/i)[1];
    chrome.tabs.create({
        url: "https://vk-audio.herokuapp.com/#/" + id,
        active: false
    });
};

chrome.contextMenus.create({
    title: "Go to vk-audio", 
    contexts:["link"], 
    onclick: clickHandler
});