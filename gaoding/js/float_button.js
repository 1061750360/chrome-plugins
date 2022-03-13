// 删除 "移除水印, 畅享高清模板" 这个文字div
function removeTextWatermark() {
    let app_element = $('#app')[0]
    app_element.addEventListener("DOMNodeInserted", function (event) {
        if(event.target.className === 'remove-watermark') {
            $('.remove-watermark').remove()
        }
    }, false);
}

// 该文件用户在页面上增加一个该插件悬浮按钮，用户能够点击按钮进行操作（下载海报等）
function addButton() {
    var div = `<div class="xmzd-button">
                    <div class="xmzd-icon">下载</div>
                    <div class="xmzd-title">去水印下载插件</div>
                    <div class="xmzd-desc">
                        说明： 
                        <p>若下载的图片还存在水印</p>
                        <p>请手动清除浏览器缓存</p>
                        <p>或者更新插件代码</p>
                    </div>
                    <div class="xmzd-btn-wrapper">
                        <button class="xmzd-btn-download">下载图片</button>
                    </div>
                </div>`
    $('body')[0].append($(div)[0])
    // $('.xmzd-btn-clear').click(function () {
    //     console.log(chrome.hasOwnProperty())
    //     var millisecondsPerWeek = 1000 * 60 * 60 * 24;
    //     var ago = (new Date()).getTime() - millisecondsPerWeek;
    //     chrome.browsingData.remove({ "since": ago }, data , function () {
    //         //弹出框
    //         new Notification('chrome chernCache', {
    //             icon: 'clean48.png',
    //             body: '清理缓存成功!'
    //         });
    //     });
    // })
    $('.xmzd-btn-download').click(function () {
        changeImgSize(() => {
            generate_img()
        })
    })
}

// 使用html2cavas下载海报
function generate_img() {
    var getPixelRatio = function (context) { // 获取设备的PixelRatio
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 0.5;
        return (window.devicePixelRatio || 0.5) / backingStore;
    };
    //生成的图片名称
    var date = new Date().getTime()
    var random = Math.floor(Math.random() * 1000)
    var imgName = `${formatDate(date)}-${random}.jpg`;
    var poster_img = document.getElementsByClassName("editor-shell")[0];
    var width = poster_img.offsetWidth;
    var height = poster_img.offsetHeight;
    var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    var scale = getPixelRatio(context); //将canvas的容器扩大PixelRatio倍，再将画布缩放，将图像放大PixelRatio倍。
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    context.scale(scale, scale);
    var opts = {
        scale: 1,
        background: 'transparent',
        useCORS: true
    };
    html2canvas(poster_img, opts).then(function(canvas) {
        context.imageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        var dataUrl = canvas.toDataURL('image/jpeg', 1.0);
        dataURIToBlob(imgName, dataUrl, download);
    });
}

function dataURIToBlob(imgName, dataURI, callback) {
    var binStr = atob(dataURI.split(',')[1]),
        len = binStr.length,
        arr = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }
    callback(imgName, new Blob([arr]));
}

//时间戳转换方法    date:时间戳数字
function formatDate(date) {
    var date = new Date(date);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + '_';
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + '_';
    var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return YY + MM + DD + " " + hh + mm + ss;
}

// 创建a标签开始下载
function download(imgName, blob) {
    var triggerDownload = $("<a>").attr("href", URL.createObjectURL(blob)).attr("download", imgName).appendTo("body").on("click", function () {
        if (navigator.msSaveBlob) {
            return navigator.msSaveBlob(blob, imgName);
        }
    });
    triggerDownload[0].click();
    triggerDownload.remove();
}

// 在下载之前将图片放到最大（100%），否则下载的图片会失真，html2canvas是相当于截屏，当前多大截多大，故放大到100%可以保持海报不失真
function changeImgSize(callback) {
    var childNode = $('.editor-bottom .eui-buttons-bar')[0].children[4];
    var isMax = childNode.firstElementChild.innerText.indexOf('100%') !== -1;
    if(!isMax) {
        childNode.click()
    }
    // 让它先吧海报放大，然后在下载海报
    setTimeout(() => {
        callback()
    }, 200)
}

// 该文件的运行入口
(function () {
    console.log('plugins已启动')
    removeTextWatermark()
    addButton()
})()
