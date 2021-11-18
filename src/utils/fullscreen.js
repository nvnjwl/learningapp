export let fullScreenEventList = [];

function checkFullScreenSupport() {
    let masterFullscreenEventList = [
        ['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'],
        ['requestFullscreen', 'cancelFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'],
        ['webkitRequestFullscreen', 'webkitExitFullScreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror'],
        ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror'],
        ['webkitEnterFullscreen', 'webkitendfullscreen'],
        ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'],
        ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError'],
        ['msRequestFullscreen', 'msCancelFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError']
    ];
    var fakeElem = document.createElement('div');
    for (let cur = 0; cur < masterFullscreenEventList.length; cur++) {
        if (masterFullscreenEventList[cur][1] in document || masterFullscreenEventList[cur][1] in fakeElem) {
            fullScreenEventList = masterFullscreenEventList[cur];
            break;
        }
    }
    fakeElem = null;
    if (fullScreenEventList.length > 4) {
        document.addEventListener(fullScreenEventList[4], fullscreenChangeEvent);
    }
}

export function isFullScreen() {
    try {
        return fullScreenEventList ? document[fullScreenEventList[2]] || false : false;
    } catch (err) {
        return false;
    }
}

export function fullscreenChangeEvent() {
    let isFullScreenActive = isFullScreen();
    console.log('isFullScreenActive :: ', isFullScreenActive);
}

export function toggleFullScreen(fullscreenElem) {
    try {
        fullscreenElem = fullscreenElem || document.body;
        let exitFullScreenEventName = fullScreenEventList[1];
        let enterFullScreenEventName = fullScreenEventList[0];
        if (isFullScreen()) {
            document[exitFullScreenEventName]();
        } else {
            fullscreenElem[enterFullScreenEventName]();
        }
    } catch (e) {}
}

export function exitFullScreen() {
    let exitFullScreenEventName = fullScreenEventList[1];
    if (isFullScreen()) {
        document[exitFullScreenEventName]();
    }
}

export function enterFullScreen() {
    let fullscreenElem = document.body;
    let enterFullScreenEventName = fullScreenEventList[0];
    if (!isFullScreen()) {
        fullscreenElem[enterFullScreenEventName]();
    }
}

checkFullScreenSupport();
