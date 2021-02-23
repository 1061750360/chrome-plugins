// 阻止加载水印图片
chrome.webRequest.onBeforeRequest.addListener((details) => {
    if(details.url.indexOf('gaoding.com')) {
        var flag = details.url.indexOf("20200611-180327-3f35.svg") !== -1
        var callback = function () {
            console.log(2)
        };
        return {cancel: flag};
    }
}, {urls: ["<all_urls>"]}, ["blocking"]);
