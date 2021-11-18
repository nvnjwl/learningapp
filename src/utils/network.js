import { promisify, domainResolve, createSearchParams } from './index';

function checkStatus(response) {
    if (response instanceof Response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        }
        return Promise.reject(response);
    }
    return Promise.resolve(response);
}

function parseResponse(response) {
    if (response instanceof Response) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            return Promise.resolve(response.json());
        }
        return Promise.resolve(response.text());
    }
    return Promise.resolve(response);
}

/*
Request method: use it for ajax operation
@params
config: {
  method: 'GET' ==>  default GET, optional
  headers: {} ==> optional
  url: "http://www.example.com/api"
}
*/

export function request(config) {
    return promisify(function (resolve, reject) {
        if (!config.url) {
            reject('Invalid URL');
            return;
        }
        const url = new URL(domainResolve(config.url), window.location.href);
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Origin: null
            },
            ...config.options
        };
        if (options.payload) {
            if (config.isFormData) {
                options.body = createSearchParams(options.payload);
            } else {
                options.body = JSON.stringify(options.payload);
            }
            delete options.payload;
        }

        if (options.params && options.params !== null) {
            if (!url.searchParams) {
                url.searchParams = new URLSearchParams(url.search);
            }
            Object.keys(options.params).forEach((key) => url.searchParams.append(key, options.params[key]));
        }
        fetch(url, options)
            .then(checkStatus)
            .then(parseResponse)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

export let loadJs = function (url, options = {}) {
    return promisify(function (resolve, reject) {
        const scriptTag = document.createElement('script');
        const head = document.getElementsByTagName('head')[0];
        scriptTag.src = domainResolve(url);
        scriptTag.async = options.async || true;
        scriptTag.id = options.nodeId || '';
        scriptTag.addEventListener('load', function () {
            resolve();
        });
        scriptTag.addEventListener('error', function () {
            reject(new Error('JS load failed'));
        });
        head.appendChild(scriptTag);
    });
};

export function microAjax(B, A, body, method) {
    var t = this;
    t.bindFunction = function (E, D) {
        return function () {
            return E.apply(D, [D]);
        };
    };
    var SC = function (D) {
        if (this.R.readyState === 4) {
            try {
                var obj = JSON.parse(this.R.responseText);
                var location = '';
                try {
                    if (C.getAllResponseHeaders().indexOf('geo') >= 0) {
                        var location = C.getResponseHeader('geo');
                    }
                    console.log('getResponseHeader location = ' + location);
                    obj.geo = location;
                } catch (e) {
                    obj.geo = '';
                }
            } catch (e) {
                var obj = {};
            }
            this.callbackFunction(obj, this.R.responseText);
            //this.callbackFunction(this.R.responseText);
        }
    };
    t.R = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : window.XMLHttpRequest ? new XMLHttpRequest() : false;
    t.Body = body || '';
    t.callbackFunction = A;
    t.url = B;
    if (t.R) {
        var C = t.R;
        //C.withCredentials = true;

        //C.onreadystatechange = SC.apply(t,[t]);
        C.open(!method && t.Body !== '' ? 'POST' : method ? method : 'GET', B, true);
        //C.setRequestHeader("X-Requested-With","XMLHttpRequest");
        if (t.Body !== '') {
            C.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            //C.setRequestHeader("Connection","close");
        } else {
            //C.setRequestHeader("Connection","close");
        }
        C.onload = function (e) {
            if (C.readyState === 4) {
                if (C.status === 200) {
                    //console.log("xhr request ", C.responseText);
                    SC.apply(t, [t]);
                } else {
                    console.log('xhr request error ', C.statusText);
                }
            }
        };
        C.onerror = function (e) {
            console.log('xhr request onerror', C);
            SC.apply(t, [t]);
        };
        C.send(t.Body);
    }
}

export function getUrl(url, cb) {
    return new microAjax(url, cb, '', 'GET');
}

export function postUrl(url, cb, data) {
    return ajaxUtility('POST', url, data, cb);
}

export function getXhr(url, cb) {
    return ajaxUtility('GET', url, '', cb);
}

export function ajaxUtility(method, url, data, callback) {
    var t = this;
    var xhr = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : window.XMLHttpRequest ? new XMLHttpRequest() : false;
    var data = data || '';
    var callbackFunction = typeof callback == 'function' ? callback : '';
    if (xhr) {
        xhr.open(method, url, true);

        if (method == 'POST') {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        xhr.onload = function (e) {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callbackFunction && callbackFunction('SUCCESS', xhr.responseText);
            } else {
                console.log('xhr request error ', xhr);
                callbackFunction && callbackFunction('FAILURE');
            }
        };
        xhr.onerror = function (e) {
            callbackFunction('FAILURE', e);
        };

        if (method == 'POST') {
            xhr.send(data);
        } else {
            xhr.send();
        }
    } else {
        console.log('XHR request is not supported ');
    }
}

export function loadFile(url, options = {}) {
    switch (options.type) {
        case 'js':
            return loadJs(url, options);
        default:
            break;
    }
}
