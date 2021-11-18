export function ChatInterface(chatMenu) {
    var chatClient;
    var eventHandlers = {};
    function initInterface() {
        chatClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        subscribeEvent();
    }

    function broadcastEvent(eventName, eventData) {
        console.log('broadcastEvent: ' + eventName);
        if (eventHandlers[eventName]) {
            eventHandlers[eventName](eventData);
        }
    }

    function subscribeEvent() {
        console.log('subscribeEvent');
    }

    function initClientAndJoinChannel(agoraAppId, token, channelName, uid) {
        //Should be called from  chatMenu.
        console.log('initClientAndJoinChannel');
    }

    function joinChannel(channelName, uid, token) {
        console.log('joinChannel');
    }

    function registerEvent(eventName, callback) {
        //Should be called from ChatMenu
        eventHandlers[eventName] = callback;
    }

    return {
        initInterface: initInterface,
        initClientAndJoinChannel: initClientAndJoinChannel,
        initInterface: initInterface,
        registerEvent: registerEvent
    };
}
