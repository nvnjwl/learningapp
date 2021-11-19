(function () {
    console.log('middleware');

    let agoraAppId = '1eb1dd97c1104a58a773116df9494cdd';
    let agoraToken = '0061eb1dd97c1104a58a773116df9494cddIAAYFQPmTSJEmbth1YgD3NCHwqdEIjg7TunH9moAc70NDf+vWnwAAAAAEABw2xAIUsKYYQEAAQBswphh';
    let agoraChannel = 'learning101';
    let RTMToken = '0061eb1dd97c1104a58a773116df9494cddIACaDtLjSD54QqIWu15LqHXC2sNjCxH/W7ycIoRP9igUZmLWbU8AAAAAEAAJlZGjKgyZYQEA6AMqDJlh';
    let RTMToken2 = '0061eb1dd97c1104a58a773116df9494cddIABAo6vnGDLGsLtLJJi1Ycql1lBw1FbOSCvftq7yTXJ657E681kAAAAAEAA7DHR';
    let appCertificate = '954cef76a2ea48a09cef01092299e0c5';
    let agoraUserName = 'John Doe';
    let accountName = 'nvnjwl';
    let accountName2 = 'nvnjwl8';
    let agoraUserId = 1000 + Math.floor(Math.random() * 1000);

    function registerBodyOnload() {
        console.log('registerBodyOnload');
        if (document.body) {
            bodyOnload();
        } else {
            window.addEventListener('DOMContentLoaded', bodyOnload);
        }
    }

    function bodyOnload() {
        let applicationConfig = {
            applicationDiv: 'applicationDiv',
            agoraAppId: agoraAppId,
            agoraToken: agoraToken,
            agoraChannel: agoraChannel,
            agoraUserName: agoraUserName,
            agoraUserId: agoraUserId,
            accountName: accountName,
            RTMToken: RTMToken
        };
        if (typeof AgoraVideoCall === 'function') {
            let agoraVideoCallObj = new AgoraVideoCall(applicationConfig);
            window.agoraVideoCallObj = agoraVideoCallObj;
        } else {
            console.log('AgoraVideoCall not defined');
        }
    }
    console.log('middleware 1657');
    registerBodyOnload();
})();
