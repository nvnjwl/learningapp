import { STREAM_STATE } from './../constants/index';
export function AgoraInterface(communicationMenu) {
    var cameraVideoProfile = '480p_4'; // 640 × 480 @ 30fps  & 750kbs
    var client;
    // stream references (keep track of active streams)
    var remoteStreams = {}; // remote streams obj struct [id : stream]
    var localStreams = {
        camera: {
            id: '',
            stream: {}
        },
        screen: {
            id: '',
            stream: {}
        }
    };
    var mainStreamId; // reference to main stream
    var eventHandlers = {};

    function initInterface() {
        client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        AgoraRTC.Logger.enableLogUpload(); // auto upload logs
        subscribeEvent();
    }

    function broadcastEvent(eventName, eventData) {
        if (eventHandlers[eventName]) {
            eventHandlers[eventName](eventData);
        }
    }

    function subscribeEvent() {
        client.on(STREAM_STATE.STREAM_PUBLISHED, function (eventData) {
            console.log('Publish local stream successfully');
            broadcastEvent(STREAM_STATE.STREAM_PUBLISHED, eventData);
        });

        // connect remote streams
        client.on(STREAM_STATE.STREAM_ADDED, function (eventData) {
            broadcastEvent(STREAM_STATE.STREAM_ADDED, eventData);
            var stream = eventData.stream;
            var streamId = stream.getId();
            console.log('new stream added: ' + streamId);
            // Check if the stream is local
            if (streamId != localStreams.screen.id) {
                console.log('subscribe to remote stream:' + streamId);
                // Subscribe to the stream.
                client.subscribe(stream, function (err) {
                    console.log('[ERROR] : subscribe stream failed', err);
                });
            }
        });

        client.on('stream-subscribed', function (eventData) {
            var remoteStream = eventData.stream;
            var remoteId = remoteStream.getId();
            remoteStreams[remoteId] = remoteStream;
            let remoteStreamVideoTagId = communicationMenu.addRemoteStreamMiniView(remoteId);
            remoteStream.play(remoteStreamVideoTagId);
            client.setRemoteVideoStreamType(remoteStream, 1);
            return;
            if ($('#full-screen-video').is(':empty')) {
                mainStreamId = remoteId;
                remoteStream.play('full-screen-video');
            } else if (remoteId == 49024) {
                // move the current main stream to miniview
                remoteStreams[mainStreamId].stop(); // stop the main video stream playback
                client.setRemoteVideoStreamType(remoteStreams[mainStreamId], 1); // subscribe to the low stream
                communicationMenu.addRemoteStreamMiniView(remoteStreams[mainStreamId]); // send the main video stream to a container
                // set the screen-share as the main
                mainStreamId = remoteId;
                remoteStream.play('full-screen-video');
            } else {
                client.setRemoteVideoStreamType(remoteStream, 1); // subscribe to the low stream
                communicationMenu.addRemoteStreamMiniView(remoteStream);
            }
        });

        // remove the remote-container when a user leaves the channel
        client.on('peer-leave', function (eventData) {
            var streamId = eventData.stream.getId(); // the the stream id
            if (remoteStreams[streamId] != undefined) {
                remoteStreams[streamId].stop(); // stop playing the feed
                delete remoteStreams[streamId]; // remove stream from list
                if (streamId == mainStreamId) {
                    var streamIds = Object.keys(remoteStreams);
                    var randomId = streamIds[Math.floor(Math.random() * streamIds.length)]; // select from the remaining streams
                    remoteStreams[randomId].stop(); // stop the stream's existing playback
                    var remoteContainerID = '#' + randomId + '_container';
                    $(remoteContainerID).empty().remove(); // remove the stream's miniView container
                    remoteStreams[randomId].play('full-screen-video'); // play the random stream as the main stream
                    mainStreamId = randomId; // set the new main remote stream
                } else {
                    var remoteContainerID = '#' + streamId + '_container';
                    $(remoteContainerID).empty().remove(); //
                }
                broadcastEvent(STREAM_STATE.PEER_LEAVE, streamId);
            }
        });

        // show mute icon whenever a remote has muted their mic
        client.on('mute-audio', function (eventData) {
            communicationMenu.toggleVisibility('#' + eventData.uid + '_mute', true);
        });

        client.on('unmute-audio', function (eventData) {
            communicationMenu.toggleVisibility('#' + eventData.uid + '_mute', false);
        });

        // show user icon whenever a remote has disabled their video
        client.on('mute-video', function (eventData) {
            var remoteId = eventData.uid;
            // if the main user stops their video select a random user from the list
            if (remoteId != mainStreamId) {
                // if not the main vidiel then show the user icon
                communicationMenu.toggleVisibility('#' + remoteId + '_no-video', true);
            }
        });

        client.on('unmute-video', function (eventData) {
            communicationMenu.toggleVisibility('#' + eventData.uid + '_no-video', false);
        });
    }

    function initClientAndJoinChannel(agoraAppId, token, channelName, uid) {
        // init Agora SDK
        client.init(
            agoraAppId,
            function () {
                console.log('AgoraRTC client initialized');
                joinChannel(channelName, uid, token); // join channel upon successfull init
            },
            function (err) {
                console.log('[ERROR] : AgoraRTC client init failed', err);
            }
        );
    }

    function joinChannel(channelName, uid, token) {
        client.join(
            token,
            channelName,
            uid,
            function (uid) {
                console.log('User ' + uid + ' join channel successfully');
                createCameraStream(uid);
                localStreams.camera.id = uid; // keep track of the stream uid
            },
            function (err) {
                console.log('[ERROR] : join channel failed', err);
            }
        );
    }

    // video streams for channel
    function createCameraStream(uid) {
        var localStream = AgoraRTC.createStream({
            streamID: uid,
            audio: true,
            video: true,
            screen: false
        });
        localStream.setVideoProfile(cameraVideoProfile);
        localStream.init(
            function () {
                console.log('getUserMedia successfully');
                // TODO: add check for other streams. play local stream full size if alone in channel
                localStream.play('local-video'); // play the given stream within the local-video div

                // publish local stream
                client.publish(localStream, function (err) {
                    console.log('[ERROR] : publish local stream error: ' + err);
                });

                communicationMenu.enableUiControls(localStream); // move after testing
                localStreams.camera.stream = localStream; // keep track of the camera stream for later
            },
            function (err) {
                console.log('[ERROR] : getUserMedia failed', err);
            }
        );
    }

    function leaveChannel() {
        client.leave(
            function () {
                console.log('client leaves channel');
                localStreams.camera.stream.stop(); // stop the camera stream playback
                client.unpublish(localStreams.camera.stream); // unpublish the camera stream
                localStreams.camera.stream.close(); // clean up and close the camera stream
                broadcastEvent(STREAM_STATE.SELF_LEAVE);
            },
            function (err) {
                console.log('client leave failed ', err); //error handling
            }
        );
    }

    function generateToken() {
        return null;
    }

    function registerEvent(eventName, callback) {
        eventHandlers[eventName] = callback;
    }

    return {
        initInterface: initInterface,
        subscribeEvent: subscribeEvent,
        initClientAndJoinChannel: initClientAndJoinChannel,
        joinChannel: joinChannel,
        createCameraStream: createCameraStream,
        leaveChannel: leaveChannel,
        generateToken: generateToken,
        registerEvent: registerEvent
    };
}
