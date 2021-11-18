import { ASPECT_RATIO } from './../constants';
import TakeScreenShotFromConfig from './../component/Screenshot';
import { request } from './../utils/network';

export function promisify(callback) {
    return new Promise(function (resolve, reject) {
        callback(resolve, reject);
    });
}

export function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

export function resolveUrl(url) {
    if (url) {
        return url.replace('http://', '').replace('https://', '').replace('//', '');
    }
    return url;
}

export function domainResolve(url) {
    return url.replace('http://', '//').replace('https://', '//');
}

export function isIframe() {
    try {
        return window.self !== window.top;
    } catch (err) {
        return true;
    }
}

export function createSearchParams(obj) {
    const data = new URLSearchParams();
    Object.keys(obj).forEach((key) => {
        data.append(key, obj[key]);
    });
    return data;
}

export function parseJSON(text) {
    if (text) {
        try {
            return JSON.parse(text);
        } catch (err) {
            console.error('Error :: ', err);
            return null;
        }
    }
    return null;
}

export function noop() {}

export function deepCopy(obj) {
    try {
        const str = JSON.stringify(obj);
        return parseJSON(str);
    } catch (err) {
        return obj;
    }
}

export function deepMerge(x, y) {
    if (isObject(x) && isObject(y)) {
        Object.keys(y).forEach((yKey) => {
            if (x[yKey]) {
                if (isObject(x[yKey]) && isObject(y[yKey])) {
                    deepMerge(x[yKey], y[yKey]);
                } else {
                    Object.assign(x, { [yKey]: y[yKey] });
                }
            } else {
                Object.assign(x, { [yKey]: y[yKey] });
            }
        });
    }
    return x;
}

export function random(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function minMax(value, min, max) {
    return value >= max ? max : value <= min ? min : value;
}

export function formatTimeMS(seconds, isHour) {
    isHour = isHour || true;
    if (isNaN(seconds)) {
        if (isHour) {
            return '00:00:00.00';
        } else {
            return '00:00.00';
        }
    }

    var MS = seconds - parseInt(seconds);
    MS = 100 * MS;
    MS = parseInt(MS);
    var HH = parseInt(seconds / 3600) % 24;
    var MM = parseInt(seconds / 60) % 60;
    var SS = parseInt(seconds % 60);

    HH = isNaN(HH) ? '0' : HH;
    MM = isNaN(MM) ? '0' : MM;
    SS = isNaN(SS) ? '0' : SS;
    var hmsStr = '';
    if (isHour || HH > 0) {
        hmsStr = HH < 10 ? '0' + HH + ':' : HH + ':';
    }
    hmsStr += (MM < 10 ? '0' + MM + ':' : MM + ':') + (SS < 10 ? '0' + SS : SS) + '.' + (MS < 10 ? '0' + MS : MS);
    return hmsStr;
}

export function formatTime(seconds, isHour) {
    isHour = isHour || false;
    if (isNaN(seconds)) {
        if (isHour) {
            return '00:00:00';
        } else {
            return '00:00';
        }
    }

    if (seconds < 1) {
        seconds = 0;
    }
    var HH = parseInt(seconds / 3600) % 24;
    var MM = parseInt(seconds / 60) % 60;
    var SS = parseInt(seconds % 60);

    HH = isNaN(HH) ? '0' : HH;
    MM = isNaN(MM) ? '0' : MM;
    SS = isNaN(SS) ? '0' : SS;
    var hmsStr = '';
    if (isHour || HH > 0) {
        hmsStr = HH < 10 ? '0' + HH + ':' : HH + ':';
    }
    hmsStr += (MM < 10 ? '0' + MM + ':' : MM + ':') + (SS < 10 ? '0' + SS : SS);
    return hmsStr;
}

window.scriptModal = {};

function findScript(url) {
    /*var s = document.getElementsByTagName("script");
  var i, l = s.length;
  for(i = 0; i < l; i++){
    if(s[i].src == url) return s[i];
  }
  return null;*/
    if (window.scriptModal[url]) {
        return url;
    } else {
        return null;
    }
}

function loadJs(url, cb, nodeid, sync) {
    //console.trace('test1');
    var s;
    s = findScript(url);
    if (s != null) {
        var isFound = true;
        if (typeof cb === 'function') {
            setTimeout(function () {
                cb(isFound);
            }, 0);
        }
        return;
    }
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('script');
    s.type = 'text/javascript';

    /*if (query.force == true || query.force == "true") {
      var d = new Date();
      var n = d.getTime();
      if (url.indexOf('?') == -1) {
          url = url + "?" + n;
      }
  }*/
    s.src = url;
    //console.log('base.js2 laodJS SRC :: ' + s.src + ", URL is " + url);
    s.async = true;
    s.id = nodeid || 'js' + Math.floor(Math.random() * 899999) + 1e5;

    function ieCallback(el, icb) {
        if (el.readyState === 'loaded' || el.readyState === 'complete') {
            icb();
        } else {
            setTimeout(function () {
                ieCallback(el, icb);
            }, 20);
        }
    }
    if (typeof cb === 'function') {
        if (typeof s.addEventListener !== 'undefined') {
            s.addEventListener(
                'load',
                function () {
                    window.scriptModal[url] = url;
                    cb();
                },
                false
            );
            //s.addEventListener('error', cb, false);
            s.addEventListener(
                'error',
                function () {
                    //console.log("error here Loadjs with url :: " + url);
                    cb('FAILURE');
                },
                false
            );
        } else {
            s.onreadystatechange = function () {
                window.scriptModal[url] = url;
                s.onreadystatechange = null;
                ieCallback(s, cb);
            };
        }
    }
    try {
        head.appendChild(s);
    } catch (err) {
        console.log('error :: ' + err.message);
    }
}
window.loadJs = loadJs;

export function adjustAspectRatio(videoElem, aspectRatioMode) {
    if (!videoElem) {
        return;
    }
    let parentElem = videoElem.parentNode;
    if (!parentElem) {
        return;
    }
    if (!aspectRatioMode) {
        aspectRatioMode = ASPECT_RATIO.BAR;
    }
    let parentWidth = parentElem.offsetWidth;
    let parentHeight = parentElem.offsetHeight;
    if (!parentWidth || !parentHeight) {
        return;
    }
    let parentRatio = parentWidth / parentHeight;
    let videoWidth;
    let videoHeight;

    if (videoElem.tagName === 'IMG') {
        videoWidth = videoElem.naturalWidth;
        videoHeight = videoElem.naturalHeight;
    } else if (videoElem.tagName === 'VIDEO') {
        videoWidth = videoElem.videoWidth;
        videoHeight = videoElem.videoHeight;
    } else {
        return;
    }

    let videoRatio = videoWidth / videoHeight;

    if (isNaN(videoRatio)) {
        videoRatio = 16 / 9;
    }
    let scaledWidth, scaledHeight;
    if (aspectRatioMode === ASPECT_RATIO.BAR) {
        if (parentRatio < videoRatio) {
            scaledWidth = parentWidth;
            scaledHeight = scaledWidth / videoRatio;
        } else {
            scaledHeight = parentHeight;
            scaledWidth = scaledHeight * videoRatio;
        }
    } else if (aspectRatioMode === ASPECT_RATIO.CROP) {
        if (parentRatio > videoRatio) {
            scaledWidth = parentWidth;
            scaledHeight = scaledWidth / videoRatio;
        } else {
            scaledHeight = parentHeight;
            scaledWidth = scaledHeight * videoRatio;
        }
    }
    videoElem.style.width = scaledWidth + 'px';
    videoElem.style.height = scaledHeight + 'px';
}

export function createLoader(outerDiv, hidden) {
    let preloaderOverlay = outerDiv.__createDiv('preloaderOverlay');
    let spinner = preloaderOverlay.__createDiv('spinner-border positionCenter');
    let loadingMsg = spinner.__createDiv('sr-only');
    if (hidden) {
        preloaderOverlay.__hide();
    }
    return preloaderOverlay;
}

export function debounce(func, threshold, execAsap) {
    var timeout;
    return function debounced() {
        var obj = this;
        var args = arguments;
        function delayed() {
            if (!execAsap) {
                func.apply(obj, args);
            }
            timeout = null;
        }

        if (timeout) {
            clearTimeout(timeout);
        } else if (execAsap) {
            func.apply(obj, args);
        }

        timeout = setTimeout(delayed, threshold || 100);
    };
}

export function findInArray(arr, item, key) {
    let position = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i][key] && arr[i][key] === item) {
            position = i;
        }
    }
    return position;
}

export function roundOff(value, precision) {
    precision = precision || 2;
    value = value || 0;
    let newValue = parseFloat(value.toFixed(precision));
    return newValue;
}

export function copyText(text, cb, element) {
    let parentEl = element ? element : document.body;
    try {
        var textarea = document.createElement('textarea');
        parentEl.appendChild(textarea);
        textarea.value = text;
        textarea.focus();
        textarea.select();
        document.execCommand('copy');

        parentEl.removeChild(textarea);
        cb(true);
    } catch (e) {
        parentEl.removeChild(textarea);
        cb(false);
    }
}

export function getQueryParams(qs) {
    qs = qs.split('+').join(' ');
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while ((tokens = re.exec(qs))) {
        params[decodeURIComponent(tokens[1].toLowerCase())] = decodeURIComponent(tokens[2]);
    }
    return params;
}

export function getTimeString() {
    let [month, date, year] = new Date().toLocaleDateString('en-US').split('/');
    let [hour, minute, second] = new Date().toLocaleTimeString('en-US').split(/:| /);
    let dateString = `${date}/${month}/${year}`;
    let timeString = `${hour}:${minute}:${second}`;
    return dateString + '-' + timeString;
}

export function selectItemByValue(selectTag, value) {
    if (!selectTag || !selectTag.options) {
        return;
    }
    for (var i = 0; i < selectTag.options.length; i++) {
        if (selectTag.options[i].value === value) {
            selectTag.selectedIndex = i;
            break;
        }
    }
}

export function isSameArray(array1, array2) {
    array1 = array1 || [];
    array2 = array2 || [];
    if (array1.length !== array2.length) {
        return false;
    }
    let isSame = true;

    for (let i = 0; i < array1.length; i++) {
        if (array1[i].rec_id !== array2[i].rec_id) {
            isSame = false;
            break;
        }
    }
    return isSame;
}

export function takeFullResolutionScreenshot(m3u8Url, timeStamp, callback) {
    console.log('takeFullResolutionScreenshot :: ', m3u8Url, timeStamp);
    getManifestString(m3u8Url, function (manifestString) {
        let fullResolutionManifest = getFullResolutionManifest(manifestString, m3u8Url);
        console.log('fullResolutionManifest :: ', fullResolutionManifest);
        let screenshotConfig = {
            m3u8Url: fullResolutionManifest,
            timeStamp: timeStamp,
            screenShotCount: 1
        };
        let takeScreenShot = new TakeScreenShotFromConfig(screenshotConfig);
        let screenshotPromise = takeScreenShot.getScreenShot();
        screenshotPromise
            .then(function (screenShotArray) {
                // console.log("screenShotArray :: ",screenShotArray);
                if (typeof callback === 'function' && screenShotArray.length > 0) {
                    callback(screenShotArray[0]);
                }
            })
            .catch(function (error) {
                console.log('screenshotPromise Catch :: ', error);
            });
    });
}

function getManifestString(m3u8Url, callback) {
    let requestConfig = {
        url: m3u8Url
    };
    if (m3u8Url) {
        let requestPromise = request(requestConfig);
        requestPromise
            .then(function (responseData) {
                if (typeof callback === 'function') {
                    callback(responseData);
                }
            })
            .catch(function (error) {
                console.log('requestPromise Error', error);
            });
    }
}

export function getFullResolutionManifest(oldPlaylist, m3u8Url) {
    let fullResolutionManifest = '';
    let splitter = '\n';
    let infString = 'EXT-X-STREAM-INF';

    let startLine = 0;
    let currentBandwidth;
    let maximumBandwidth = 0;
    let firstLine;
    let secondLine;
    let basePathArr = m3u8Url.split('/');
    basePathArr.pop();
    let basePath = basePathArr.join('/');
    let manifestArray = oldPlaylist.split(splitter);

    for (let i = 0; i < manifestArray.length; i++) {
        if (manifestArray[i].indexOf(infString) !== -1) {
            startLine = i;
            break;
        }
    }

    for (let i = startLine; i < manifestArray.length; i++) {
        if (manifestArray[i].indexOf(infString) !== -1) {
            currentBandwidth = getBandwidth(manifestArray[i]);
            currentBandwidth = parseInt(currentBandwidth);
        } else {
            continue;
        }
        if (currentBandwidth > maximumBandwidth) {
            maximumBandwidth = currentBandwidth;
            firstLine = manifestArray[i];
            secondLine = manifestArray[i + 1];
        }
    }
    fullResolutionManifest = basePath + '/' + secondLine;
    return fullResolutionManifest;
}

function getBandwidth(extString) {
    let actualBandwidth = 993000;
    let line2;
    let arr2;
    let arr = extString.split('BANDWIDTH=');
    if (arr.length > 1) {
        line2 = arr[1];
        arr2 = line2.split(',');
        if (arr2.length > 0) {
            actualBandwidth = arr2[0];
        }
    }
    return actualBandwidth;
}

export function takeScreenShot(videoTag) {
    let currentScreenShot = null;
    if (videoTag) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = videoTag.videoWidth;
        canvas.height = videoTag.videoHeight;
        ctx.drawImage(videoTag, 0, 0, videoTag.videoWidth, videoTag.videoHeight, 0, 0, canvas.width, canvas.height);
        currentScreenShot = ctx.canvas.toDataURL('image/jpeg', 0.5);
    }
    return currentScreenShot;
}

export function readLocalData(userId, channelId, dataKey) {
    let localKey = 'TNN_EDITOR_DATA';
    let dataValue = '';
    if (!userId) {
        return;
    }
    if (!channelId) {
        return;
    }

    let localStorageObject = {};
    let localStorageStr = JSON.stringify(localStorageObject);
    if (localStorage.getItem(localKey)) {
        localStorageStr = localStorage.getItem(localKey);
    }

    try {
        localStorageObject = JSON.parse(localStorageStr);
    } catch (error) {
        console.log('JSON.parse Error :: ', error);
    }
    localStorageObject[userId] = localStorageObject[userId] || {};
    let userObject = localStorageObject[userId];
    userObject[channelId] = userObject[channelId] || {};
    let channelObject = userObject[channelId];
    dataValue = channelObject[dataKey];
    localStorageObject[userId] = localStorageObject[userId] || {};
    return dataValue;
}

export function writeLocalData(userId, channelId, dataObject) {
    let localKey = 'TNN_EDITOR_DATA';
    if (!userId) {
        return;
    }
    if (!channelId) {
        return;
    }

    let localStorageObject = {};
    let localStorageStr = JSON.stringify(localStorageObject);
    if (localStorage.getItem(localKey)) {
        localStorageStr = localStorage.getItem(localKey);
    }

    try {
        localStorageObject = JSON.parse(localStorageStr);
    } catch (error) {
        console.log('JSON.parse Error :: ', error);
    }

    localStorageObject[userId] = localStorageObject[userId] || {};
    localStorageObject[userId][channelId] = localStorageObject[userId][channelId] || {};
    for (let key in dataObject) {
        localStorageObject[userId][channelId][key] = dataObject[key];
    }
    localStorageStr = JSON.stringify(localStorageObject);
    localStorage.setItem(localKey, localStorageStr);
}

export function clearVideoData(userId, channelId, dataKey) {
    let localKey = 'TNN_EDITOR_DATA';
    if (!userId) {
        return;
    }

    let localStorageObject = {};
    let localStorageStr = JSON.stringify(localStorageObject);
    if (localStorage.getItem(localKey)) {
        localStorageStr = localStorage.getItem(localKey);
    }

    try {
        localStorageObject = JSON.parse(localStorageStr);
    } catch (error) {
        console.log('JSON.parse Error :: ', error);
    }

    if (localStorageObject[userId] && localStorageObject[userId][channelId]) {
        delete localStorageObject[userId][channelId][dataKey];
        localStorageStr = JSON.stringify(localStorageObject);
        localStorage.setItem(localKey, localStorageStr);
    }
}

export function clearChannelData(userId, channelId) {
    let localKey = 'TNN_EDITOR_DATA';
    if (!userId) {
        return;
    }

    let localStorageObject = {};
    let localStorageStr = JSON.stringify(localStorageObject);
    if (localStorage.getItem(localKey)) {
        localStorageStr = localStorage.getItem(localKey);
    }

    try {
        localStorageObject = JSON.parse(localStorageStr);
    } catch (error) {
        console.log('JSON.parse Error :: ', error);
    }

    if (localStorageObject[userId]) {
        delete localStorageObject[userId][channelId];
        localStorageStr = JSON.stringify(localStorageObject);
        localStorage.setItem(localKey, localStorageStr);
    }
}

export function clearUserData(userId) {
    let localKey = 'TNN_EDITOR_DATA';
    if (!userId) {
        return;
    }

    let localStorageObject = {};
    let localStorageStr = JSON.stringify(localStorageObject);
    if (localStorage.getItem(localKey)) {
        localStorageStr = localStorage.getItem(localKey);
    }

    try {
        localStorageObject = JSON.parse(localStorageStr);
    } catch (error) {
        console.log('JSON.parse Error :: ', error);
    }

    delete localStorageObject[userId];
    localStorageStr = JSON.stringify(localStorageObject);
    localStorage.setItem(localKey, localStorageStr);
}

export function generateTable(tableParent, tableArray) {
    var table = document.createElement('TABLE');
    table.border = '1';

    //Get the count of columns.
    var columnCount = tableArray[0].length;

    //Add the header row.
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement('TH');
        headerCell.innerHTML = tableArray[0][i];
        row.appendChild(headerCell);
    }

    //Add the data rows.
    for (var i = 1; i < tableArray.length; i++) {
        row = table.insertRow(-1);
        for (var j = 0; j < columnCount; j++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = tableArray[i][j];
        }
    }

    // tableParent.innerHTML = '';
    tableParent.appendChild(table);
    return table;
}

export function removeAllClassName(selectorClass, activeClass) {
    let activePlayerList = document.getElementsByClassName(selectorClass);
    for (let i = 0; i < activePlayerList.length; i++) {
        if (activePlayerList[i]) {
            activePlayerList[i].__removeClass(activeClass);
            activePlayerList[i].__removeClass(selectorClass);
        }
    }
}

export function cleanThisNumber(num) {
    if (num < 10) {
        num = '0' + num;
    }
    return num;
}

export function calculateCleanTime(timeStamp) {
    let airObj = {
        airDate: null,
        airTime: null
    };
    timeStamp = parseInt(timeStamp);
    if (timeStamp) {
        var date = new Date(timeStamp);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        day = cleanThisNumber(day);
        month = cleanThisNumber(month);
        hours = cleanThisNumber(hours);
        minutes = cleanThisNumber(minutes);
        seconds = cleanThisNumber(seconds);

        let airDate = `${day}/${month}/${year}`;
        let airTime = `${hours}:${minutes}:${seconds}`;

        airObj = {
            airDate: airDate,
            airTime: airTime
        };
    }
    return airObj;
}

export function increaseCleanTime(cleanTimeString, secondsPassed) {
    if (secondsPassed < 1) {
        return cleanTimeString;
    }
    let timeArray = cleanTimeString.split(':');

    let HH = parseInt(timeArray[0]);
    let MM = parseInt(timeArray[1]);
    let SS = parseInt(timeArray[2]);

    SS = SS + secondsPassed;
    let minutesCarry = parseInt(SS / 60);
    SS = SS % 60;

    MM = MM + minutesCarry;
    let hoursCarry = parseInt(MM / 60);
    MM = MM % 60;

    HH = HH + hoursCarry;

    HH = cleanThisNumber(HH);
    MM = cleanThisNumber(MM);
    SS = cleanThisNumber(SS);

    let newTime = `${HH}:${MM}:${SS}`;
    cleanTimeString = newTime;
    return cleanTimeString;
}
