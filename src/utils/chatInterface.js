// import { RTMClient } from './rtmClient';
import RTMClient from './rtmClient';

export function ChatInterface(chatMenu) {
    //RTM interface for the chat Menu
    var rtm;
    var params = {};
    var eventHandlers = {};

    function initInterface() {
        //Read the params from the chatMenu
        let agoraConfig = chatMenu.applicationConfig;
        params.accountName = agoraConfig.accountName || 'Dummy';
        params.token = agoraConfig.RTMToken || 'Dummy';
        params.appId = agoraConfig.agoraAppId || 'Dummy';
        params.peerMessage = agoraConfig.peerMessage || 'Dummy';
        params.peerId = agoraConfig.peerId || 'nvnjwl';
        params.memberId = agoraConfig.memberId || 'Dummy';
        params.channelMessage = agoraConfig.channelMessage || 'Dummy';
        params.channelName = agoraConfig.agoraChannel;
        handleRTM();
    }

    function broadcastEvent(eventName, eventData) {
        console.log('broadcastEvent: ' + eventName);
        if (eventHandlers[eventName]) {
            eventHandlers[eventName](eventData);
        }
    }

    function initClientAndJoinChannel() {
        //Create the RTM client
        //Login to the RTM server
        //Post Login, join the channel
        handleRTM();
        login();
    }

    function registerEvent(eventName, callback) {
        //Should be called from ChatMenu
        eventHandlers[eventName] = callback;
    }

    function handleRTM() {
        if (typeof RTMClient !== 'function') {
            return;
        }
        rtm = new RTMClient();
        window.rtm = rtm;

        rtm.on('ConnectionStateChanged', (newState, reason) => {
            console.log('RTM ON :: ConnectionStateChanged: ' + newState + ' reason: ' + reason);
            //TODO - Handle the connection state change

            // if (newState === 'ABORTED') {
            //     if (reason === 'REMOTE_LOGIN') {
            //         //TODO - Handle the remote login
            //     }
            // }
        });

        rtm.on('MessageFromPeer', async (message, peerId) => {
            console.log('RTM ON ::  MessageFromPeer', message, peerId);
            //TODO - Handle the message from peer

            // if (message.messageType === 'IMAGE') {
            //     const blob = await rtm.client.downloadMedia(message.mediaId);
            //     blobToImage(blob, (image) => {
            //         //TODO - Handle the image
            //     });
            // } else {
            //     console.log('message ' + message.text + ' peerId' + peerId);
            //     //TODO - Handle the message from peer
            // }
        });

        rtm.on('MemberJoined', ({ channelName, args }) => {
            console.log('RTM ON ::  MemberJoined');
            //TODO - Handle the member joined
            const memberId = args[0];
            console.log('channel ', channelName, ' member: ', memberId, ' joined');
        });

        rtm.on('MemberLeft', ({ channelName, args }) => {
            console.log('RTM ON :: MemberLeft channel ', channelName, ' member: ', args[0]);
            //TOOD - Handle the member left
        });

        rtm.on('ChannelMessage', async ({ channelName, args }) => {
            console.log('RTM ON :: ChannelMessage ', channelName, args);
            //TODO - Handle the channel message
            /* Bug : Not able to read the message from the channel*/
            const [message, memberId] = args;
            if (message.messageType === 'IMAGE') {
                //TODO - Handle the image
            } else {
                let chatData = {
                    id: 0,
                    message: message.text,
                    username: memberId,
                    timestamp: new Date().toLocaleString(),
                    userType: 'local'
                };
                let chatObj = { data: chatData };
                chatMenu.onChatReceived(chatObj);
            }
        });
    }

    function sendPeerMessage() {
        if (!rtm._logined) {
            return;
        }

        if (!validator(params, ['appId', 'accountName', 'peerId', 'peerMessage'])) {
            return;
        }

        rtm.sendPeerMessage(params.peerMessage, params.peerId)
            .then(() => {
                console.log('sendPeerMessage success');
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function login() {
        //Do the login to the RTM server, and join the channel
        if (rtm._logined) {
            return;
        }

        try {
            rtm.init(params.appId);

            rtm.login(params.accountName, params.token)
                .then(() => {
                    console.log('login');
                    rtm._logined = true;
                    joinChannel();
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (err) {
            console.error(err);
        }
    }

    function logout() {
        if (!rtm._logined) {
            return;
        }
        rtm.logout()
            .then(() => {
                console.log('logout');
                rtm._logined = false;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function joinChannel() {
        if (!rtm._logined) {
            return;
        }

        if (rtm.channels[params.channelName] || (rtm.channels[params.channelName] && rtm.channels[params.channelName].joined)) {
            return;
        }

        rtm.joinChannel(params.channelName)
            .then(() => {
                console.log('join channel: ', params.channelName);
                rtm.channels[params.channelName].joined = true;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function leaveChannel() {
        if (!rtm._logined) {
            return;
        }

        if (!rtm.channels[params.channelName] || (rtm.channels[params.channelName] && !rtm.channels[params.channelName].joined)) {
            console.log('channel not joined');
        }

        rtm.leaveChannel(params.channelName)
            .then(() => {
                console.log('leave channel: ', params.channelName);

                if (rtm.channels[params.channelName]) {
                    rtm.channels[params.channelName].joined = false;
                    rtm.channels[params.channelName] = null;
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function sendChannelMessage(channelMessage) {
        if (!rtm._logined) {
            return;
        }
        params.channelMessage = channelMessage;

        if (!rtm.channels[params.channelName] || (rtm.channels[params.channelName] && !rtm.channels[params.channelName].joined)) {
            console.log('Please Join first');
        }

        rtm.sendChannelMessage(params.channelMessage, params.channelName)
            .then(() => {
                console.log('send channel message: ', params.channelMessage);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function queryPeer() {
        if (!rtm._logined) {
            return;
        }

        rtm.queryPeersOnlineStatus(params.memberId)
            .then((res) => {
                console.log('query peer online status: ', res);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function sendImage(imageTag) {
        //TODO
        // const src = $('img').attr('src');
        // imageToBlob(src, (blob) => {
        //     rtm.uploadImage(blob, params.peerId);
        // });
    }

    function sendChannelImage() {
        //TODO
        /* const src = $('img').attr('src');
        imageToBlob(src, (blob) => {
            rtm.sendChannelMediaMessage(blob, params.channelName)
                .then(() => {
                    //Render image here
                })
                .catch((err) => {
                    console.error(err);
                });
        });*/
    }

    function validator(params, keys) {
        for (let i = 0; i < keys.length; i++) {
            if (!params[keys[i]]) {
                return false;
            }
        }
        return true;
    }

    return {
        login: login,
        logout: logout,
        joinChannel: joinChannel,
        leaveChannel: leaveChannel,
        sendChannelMessage: sendChannelMessage,
        sendImage: sendImage,
        sendChannelImage: sendChannelImage,
        queryPeer: queryPeer,
        sendPeerMessage: sendPeerMessage,
        initInterface: initInterface,
        initClientAndJoinChannel: initClientAndJoinChannel,
        registerEvent: registerEvent
    };
}
