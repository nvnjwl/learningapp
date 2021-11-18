export function register(name, fn) {
    Element.prototype[`__${name}`] = fn;
}

export function registerBare(name, fn) {
    Element.prototype[`${name}`] = fn;
}

export function registerDocument(name, fn) {
    Document.prototype[`__${name}`] = fn;
}

export function __el(el) {
    return typeof el === 'string' ? document.getElementById(el) || document.querySelector(el) : el;
}

function addClass(...args) {
    args.forEach((className) => {
        if (className) {
            this.classList.add(className);
        }
    });
    return this;
}

function setAttributes(attributesObj) {
    for (let key in attributesObj) {
        this.setAttribute(key, attributesObj[key]);
    }
}

function removeClass(...args) {
    args.forEach((className) => {
        this.classList.remove(className);
    });
    return this;
}

function createElement(tag, classNames, id = '', content) {
    const el = document.createElement(tag);
    let classNamesArr = [];
    if (typeof classNames === 'string') {
        classNamesArr = classNames.split(' ');
    } else if (Array.isArray(classNames)) {
        classNamesArr = classNames;
    }
    classNamesArr.forEach((className) => {
        el.__addClass(className);
    });
    if (id) {
        el.id = id;
    }
    if (content) {
        el.innerHTML = content;
    }
    this.appendChild(el);
    return el;
}

function createDiv(classNames, id, content) {
    return this.__createElement('div', classNames, id, content);
}

function createPtag(classNames, id, content) {
    return this.__createElement('p', classNames, id, content);
}

function createVideo(classNames, id, attributesObj) {
    let videoTag = this.__createElement('video', classNames, id);
    for (let key in attributesObj) {
        videoTag.setAttribute(key, attributesObj[key]);
    }
    return videoTag;
}

function createImage(classNames, id, src, onLoad, onError) {
    let imageTag = this.__createElement('img', classNames, id);
    if (src) {
        imageTag.src = src;
    }
    if (typeof onload === 'function') {
        imageTag.onLoad = onLoad;
    }
    if (typeof onError === 'function') {
        imageTag.onError = onError;
    }
    return imageTag;
}

function createSpan(classNames, id, content) {
    return this.__createElement('span', classNames, id, content);
}

function removeEl() {
    if (this.parentElement) {
        this.parentElement.removeChild(this);
    }
}

function addStyles(styles) {
    Object.keys(styles).forEach((key) => {
        this.style[key] = styles[key];
    });
}

function domLogger(content) {
    let $logCont = this.querySelector('.__logger');
    if (!$logCont) {
        $logCont = this.__createDiv(['__logger']);
    }
    const $logItem = $logCont.__createDiv(['__logger-itm']);
    $logItem.innerHTML = content;
    $logCont.appendChild($logItem);
}

function containElement(elem) {
    return this && elem && (this === elem || elem.parentElement === this || this.contains(elem));
}

function replaceContent(content) {
    this.innerHTML = content;
}

function hasClass(cls) {
    return this.classList.contains(cls);
}

function hide() {
    this.style.setProperty('display', 'none', 'important');
    // return (this.style.display = 'none');
}

function show() {
    return (this.style.display = 'block');
}

function empty() {
    this.innerHTML = '';
}

function attr(key, val) {
    return this.setAttribute(key, val);
}

function useStyle(styleObj) {
    for (let prop in styleObj) {
        this.style[prop] = styleObj[prop];
    }
}

function onClick(callback) {
    if (typeof callback === 'function') {
        this.addEventListener('click', callback);
    }
}

function onHover(callback) {
    if (typeof callback === 'function') {
        this.addEventListener('mouseenter', callback);
    }
}

function onMouseMove(callback) {
    if (typeof callback === 'function') {
        this.addEventListener('mousemove', callback);
    }
}

function onHoverOut(callback) {
    if (typeof callback === 'function') {
        this.addEventListener('mouseleave', callback);
    }
}

function onDoubleClick(callback) {
    if (typeof callback === 'function') {
        this.addEventListener('dblclick', callback);
    }
}

function onEvent(eventStr, callback) {
    let eventArr;
    if (Array.isArray(eventStr)) {
        eventArr = eventStr;
    } else {
        eventArr = eventStr.split(' ');
    }
    for (let i = 0; i < eventArr.length; i++) {
        if (typeof callback === 'function') {
            this.addEventListener(eventArr[i], callback);
        }
    }
}

function offEvent(eventStr, callback) {
    let eventArr;
    if (Array.isArray(eventStr)) {
        eventArr = eventStr;
    } else {
        eventArr = eventStr.split(' ');
    }
    for (let i = 0; i < eventArr.length; i++) {
        if (typeof callback === 'function') {
            this.removeEventListener(eventArr[i], callback);
        }
    }
}

function setData(key, value) {
    key = key.toLowerCase();
    this.setAttribute(`data-${key}`, value);
    // this.dataset[key] = value;
}

function getData(key) {
    key = key.toLowerCase();
    var value = this.getAttribute(`data-${key}`);
    // var value = this.dataset[key];
    return value;
}

function rect() {
    return this.getBoundingClientRect();
}

export function registerDomMethods() {
    console.log('registerDomMethods');
    register('addClass', addClass);
    register('removeClass', removeClass);
    register('createElement', createElement);
    register('createDiv', createDiv);
    register('createVideo', createVideo);
    register('createPtag', createPtag);
    register('createSpan', createSpan);
    register('removeEl', removeEl);
    register('addStyles', addStyles);
    register('log', domLogger);
    register('containElement', containElement);
    register('replaceContent', replaceContent);
    register('hasClass', hasClass);
    register('hide', hide);
    register('show', show);
    register('attr', attr);
    register('useStyle', useStyle);
    register('onClick', onClick);
    register('onHover', onHover);
    register('onHoverOut', onHoverOut);
    register('onMouseMove', onMouseMove);
    register('setData', setData);
    register('getData', getData);
    register('onEvent', onEvent);
    register('offEvent', offEvent);
    register('rect', rect);
    register('createImage', createImage);
    register('onDoubleClick', onDoubleClick);
    register('setAttributes', setAttributes);
    register('empty', empty);

    registerDocument('onEvent', onEvent);
    registerDocument('offEvent', offEvent);
}
