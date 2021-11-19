// import { RTMClient } from './rtmClient';
import RTMClient from './rtmClient';

export function ChatInterface(chatMenu) {
    var rtm;
    var params = {};
    var eventHandlers = {};
    function initInterface() {
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

    function subscribeEvent() {
        console.log('subscribeEvent');
    }

    function initClientAndJoinChannel() {
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
            // console.log('reason', reason);
            // const view = $('<div/>', {
            //     text: ['newState: ' + newState, ', reason: ', reason].join('')
            // });
            // $('#log').append(view);
            // if (newState === 'ABORTED') {
            //     if (reason === 'REMOTE_LOGIN') {
            //         //Toast.error('You have already been kicked off!');
            //         $('#accountName').text('Agora Chatroom');

            //         $('#dialogue-list')[0].innerHTML = '';
            //         $('#chat-message')[0].innerHTML = '';
            //     }
            // }
        });

        rtm.on('MessageFromPeer', async (message, peerId) => {
            console.log('RTM ON ::  MessageFromPeer', message, peerId);
            // if (message.messageType === 'IMAGE') {
            //     const blob = await rtm.client.downloadMedia(message.mediaId);
            //     blobToImage(blob, (image) => {
            //         const view = $('<div/>', {
            //             text: [' peer: ', peerId].join('')
            //         });
            //         $('#log').append(view);
            //         $('#log').append(`<img src= '${image.src}'/>`);
            //     });
            // } else {
            //     console.log('message ' + message.text + ' peerId' + peerId);
            //     const view = $('<div/>', {
            //         text: ['message.text: ' + message.text, ', peer: ', peerId].join('')
            //     });
            //     $('#log').append(view);
            // }
        });

        rtm.on('MemberJoined', ({ channelName, args }) => {
            console.log('RTM ON ::  MemberJoined');
            // const memberId = args[0];
            // console.log('channel ', channelName, ' member: ', memberId, ' joined');
            // const view = $('<div/>', {
            //     text: ['event: MemberJoined ', ', channel: ', channelName, ', memberId: ', memberId].join('')
            // });
            // $('#log').append(view);
        });

        rtm.on('MemberLeft', ({ channelName, args }) => {
            console.log('RTM ON :: MemberLeft channel ', channelName, ' member: ', args[0]);
            // const memberId = args[0];
            // console.log('channel ', channelName, ' member: ', memberId, ' joined');
            // const view = $('<div/>', {
            //     text: ['event: MemberLeft ', ', channel: ', channelName, ', memberId: ', memberId].join('')
            // });
            // $('#log').append(view);
        });

        rtm.on('ChannelMessage', async ({ channelName, args }) => {
            console.log('RTM ON :: ChannelMessage ', channelName, args);
            const [message, memberId] = args;
            if (message.messageType === 'IMAGE') {
                //TODO
                // const blob = await rtm.client.downloadMedia(message.mediaId);
                // blobToImage(blob, (image) => {
                //     const view = $('<div/>', {
                //         text: ['event: ChannelMessage ', 'channel: ', channelName, ' memberId: ', memberId].join('')
                //     });
                //     $('#log').append(view);
                //     $('#log').append(`<img src= '${image.src}'/>`);
                // });
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
                // console.log('channel ', channelName, ', messsage: ', message.text, ', memberId: ', memberId);
                // const view = $('<div/>', {
                //     text: ['event: ChannelMessage ', 'channel: ', channelName, ', message: ', message.text, ', memberId: ', memberId].join('')
                // });
                // $('#log').append(view);
            }
        });
    }

    function handleRTMActions() {
        //Not needed
        //Doing  this via interface
        $('#login').on('click', login);
        $('#logout').on('click', logout);
        $('#join').on('click', joinChannel);
        $('#leave').on('click', leaveChannel);
        $('#send_channel_message').on('click', sendChannelMessage);
        $('#send-image').on('click', sendImage);
        $('#send-channel-image').on('click', sendChannelImage);
        $('#query_peer').on('click', queryPeer);
        $('#send_peer_message').on('click', sendPeerMessage);
    }

    function sendPeerMessage() {
        if (!rtm._logined) {
            //Toast.error('Please Login First');
            return;
        }

        if (!validator(params, ['appId', 'accountName', 'peerId', 'peerMessage'])) {
            return;
        }

        rtm.sendPeerMessage(params.peerMessage, params.peerId)
            .then(() => {
                const view = $('<div/>', {
                    text: 'account: ' + rtm.accountName + ' send : ' + params.peerMessage + ' peerId: ' + params.peerId
                });
                $('#log').append(view);
            })
            .catch((err) => {
                //Toast.error('Send message to peer ' + params.peerId + ' failed, please open console see more details.');
                console.error(err);
            });
    }

    function login() {
        if (rtm._logined) {
            //Toast.error('You already logined');
            return;
        }

        if (!validator(params, ['appId', 'accountName'])) {
            return;
        }

        try {
            rtm.init(params.appId);

            rtm.login(params.accountName, params.token)
                .then(() => {
                    console.log('login');
                    rtm._logined = true;
                    joinChannel();
                    //Toast.notice('Login: ' + params.accountName, ' token: ', params.token);
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (err) {
            //Toast.error('Login failed, please open console see more details');
            console.error(err);
        }
    }

    function logout() {
        if (!rtm._logined) {
            //Toast.error('You already logout');
            return;
        }
        rtm.logout()
            .then(() => {
                console.log('logout');
                rtm._logined = false;
                //Toast.notice('Logout: ' + rtm.accountName);
            })
            .catch((err) => {
                //Toast.error('Logout failed, please open console see more details');
                console.log(err);
            });
    }

    function joinChannel() {
        if (!rtm._logined) {
            //Toast.error('Please Login First');
            return;
        }

        //

        // if (!validator(params, ['appId', 'accountName', 'channelName'])) {
        //     return;
        // }

        if (rtm.channels[params.channelName] || (rtm.channels[params.channelName] && rtm.channels[params.channelName].joined)) {
            //Toast.error('You already joined');
            return;
        }

        rtm.joinChannel(params.channelName)
            .then(() => {
                console.log('join channel: ', params.channelName);
                // const view = $('<div/>', {
                //     text: rtm.accountName + ' join channel success'
                // });
                // $('#log').append(view);
                rtm.channels[params.channelName].joined = true;
            })
            .catch((err) => {
                //Toast.error('Join channel failed, please open console see more details.');
                console.error(err);
            });
    }

    function leaveChannel() {
        if (!rtm._logined) {
            //Toast.error('Please Login First');
            return;
        }

        //

        // if (!validator(params, ['appId', 'accountName', 'channelName'])) {
        //     return;
        // }

        if (!rtm.channels[params.channelName] || (rtm.channels[params.channelName] && !rtm.channels[params.channelName].joined)) {
            //Toast.error('You already leave');
        }

        rtm.leaveChannel(params.channelName)
            .then(() => {
                console.log('leave channel: ', params.channelName);
                // const view = $('<div/>', {
                //     text: rtm.accountName + ' leave channel success'
                // });
                // $('#log').append(view);
                if (rtm.channels[params.channelName]) {
                    rtm.channels[params.channelName].joined = false;
                    rtm.channels[params.channelName] = null;
                }
            })
            .catch((err) => {
                //Toast.error('Leave channel failed, please open console see more details.');
                console.error(err);
            });
    }

    function sendChannelMessage(channelMessage) {
        if (!rtm._logined) {
            //Toast.error('Please Login First');
            return;
        }
        params.channelMessage = channelMessage;
        //

        // if (!validator(params, ['appId', 'accountName', 'channelName', 'channelMessage'])) {
        //     return;
        // }

        if (!rtm.channels[params.channelName] || (rtm.channels[params.channelName] && !rtm.channels[params.channelName].joined)) {
            //Toast.error('Please Join first');
        }

        rtm.sendChannelMessage(params.channelMessage, params.channelName)
            .then(() => {
                console.log('send channel message: ', params.channelMessage);
                // const view = $('<div/>', {
                //     text: 'account: ' + rtm.accountName + ' send : ' + params.channelMessage + ' channel: ' + params.channelName
                // });
                // $('#log').append(view);
            })
            .catch((err) => {
                //Toast.error('Send message to channel ' + params.channelName + ' failed, please open console see more details.');
                console.error(err);
            });
    }

    function queryPeer() {
        if (!rtm._logined) {
            //Toast.error('Please Login First');
            return;
        }

        if (!validator(params, ['appId', 'accountName', 'memberId'])) {
            return;
        }

        rtm.queryPeersOnlineStatus(params.memberId)
            .then((res) => {
                console.log('query peer online status: ', res);
                // const view = $('<div/>', {
                //     text: 'memberId: ' + params.memberId + ', online: ' + res[params.memberId]
                // });
                // $('#log').append(view);
            })
            .catch((err) => {
                //Toast.error('query peer online status failed, please open console see more details.');
                console.error(err);
            });
    }

    function sendImage() {
        //
        // if (!validator(params, ['appId', 'accountName', 'peerId'])) {
        //     return;
        // }
        // const src = $('img').attr('src');
        // imageToBlob(src, (blob) => {
        //     rtm.uploadImage(blob, params.peerId);
        // });
    }

    function sendChannelImage() {
        /*
        
        

        if (!validator(params, ['appId', 'accountName', 'channelName'])) {
            return;
        }
        const src = $('img').attr('src');
        imageToBlob(src, (blob) => {
            rtm.sendChannelMediaMessage(blob, params.channelName)
                .then(() => {
                    // const view = $('<div/>', {
                    //     text: 'account: ' + rtm.accountName + ' channel: ' + params.channelName
                    // });
                    // $('#log').append(view);
                    // $('#log').append(`<img src= '${src}'/>`);
                })
                .catch((err) => {
                    //Toast.error('Send message to channel ' + params.channelName + ' failed, please open console see more details.');
                    console.error(err);
                });
        });*/
    }

    function validator(params, keys) {
        for (let i = 0; i < keys.length; i++) {
            if (!params[keys[i]]) {
                //Toast.error(`${keys[i]} is required`);
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
