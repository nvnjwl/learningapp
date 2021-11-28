(function () {
    console.log('middleware');

    let randomUserNameList = ['Adam', 'Adrian', 'Alan', 'Alexander', 'Andrew', 'Anthony', 'Austin', 'Benjamin', 'Blake', 'Boris', 'Brandon', 'Brian', 'Cameron', 'Carl', 'Charles', 'Christian', 'Christopher', 'Colin', 'Connor', 'Dan', 'David', 'Dominic', 'Dylan', 'Edward', 'Eric', 'Evan', 'Frank', 'Gavin', 'Gordon', 'Harry', 'Ian', 'Isaac', 'Jack', 'Jacob', 'Jake', 'James', 'Jason', 'Joe', 'John', 'Jonathan', 'Joseph', 'Joshua', 'Julian', 'Justin', 'Keith', 'Kevin', 'Leonard', 'Liam', 'Lucas', 'Luke', 'Matt', 'Max', 'Michael', 'Nathan', 'Neil', 'Nicholas', 'Oliver', 'Owen', 'Paul', 'Peter', 'Phil', 'Piers', 'Richard', 'Robert', 'Ryan', 'Sam', 'Sean', 'Sebastian', 'Simon', 'Stephen', 'Steven', 'Stewart', 'Thomas', 'Tim', 'Trevor', 'Victor', 'Warren', 'William'];
    window.sampleAgoraToken = '0061eb1dd97c1104a58a773116df9494cddIAAFPT02sxzggyT2JIVl9AQvQ9lvPFJgOgVQY2Q7CtaFHP+vWnwAAAAAEAAUYhZwfTilYQEAAQCXOKVh';
    let agoraAppId = '1eb1dd97c1104a58a773116df9494cdd';
    let agoraToken = '';
    let agoraChannel = 'learning101';
    let RTMToken = '0061eb1dd97c1104a58a773116df9494cddIACaDtLjSD54QqIWu15LqHXC2sNjCxH/W7ycIoRP9igUZmLWbU8AAAAAEAAJlZGjKgyZYQEA6AMqDJlh';
    let appCertificate = '954cef76a2ea48a09cef01092299e0c5';
    let randomUserName = randomUserNameList[Math.floor(Math.random() * randomUserNameList.length)];
    let agoraUserName = randomUserName;
    let accountName = 'nvnjwl';
    let agoraUserId = 1000 + Math.floor(Math.random() * 1000);
    accountName = accountName + agoraUserId;

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
            appCertificate: appCertificate,
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
