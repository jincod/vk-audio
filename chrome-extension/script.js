function clickHandler(info, tab) {
    chrome.tabs.create({
        url: "https://vk-audio.herokuapp.com/#/" + info.linkUrl.match(/vk.com\/([a-z0-9\-\_]+)/i)[1]
    });
};

chrome.contextMenus.create({
    title: "Go to vk-audio", 
    contexts:["link"], 
    onclick: clickHandler
});