import { STREAM_STATE } from './../constants/index';

export function AgoraInterface(communicationMenu) {
    //Agora Interface for the Agora SDK to Communicate with the UI
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
        //Migrating to Agora SDK V4 from V3
        client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        AgoraRTC.Logger.enableLogUpload(); // auto upload logs
        subscribeEvent();
    }

    function broadcastEvent(eventName, eventData) {
        //broadcast event to all listeners
        if (eventHandlers[eventName]) {
            eventHandlers[eventName](eventData);
        }
    }

    function subscribeEvent() {
        //Subsrcibe to events
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
        });

        // remove the remote-container when a user leaves the channel
        client.on('peer-leave', function (eventData) {
            var streamId = eventData.stream.getId(); // the the stream id
            if (remoteStreams[streamId] != undefined) {
                remoteStreams[streamId].stop(); // stop playing the feed
                delete remoteStreams[streamId]; // remove stream from list
                var remoteContainerID = '#' + streamId + '_container';
                $(remoteContainerID).empty().remove(); // remove the container
                broadcastEvent(STREAM_STATE.PEER_LEAVE, streamId);
            }
        });

        // show mute icon whenever a remote has muted their mic
        client.on('mute-audio', function (eventData) {
            // eventData.uid: the uid of the remote user who muted their mic.
            communicationMenu.toggleVisibility('#' + eventData.uid + '_mute', true);
        });

        client.on('unmute-audio', function (eventData) {
            // eventData.uid: the uid of the remote user who unmuted their mic.
            communicationMenu.toggleVisibility('#' + eventData.uid + '_mute', false);
        });

        // show user icon whenever a remote has disabled their video
        client.on('mute-video', function (eventData) {
            // eventData.uid: the uid of the remote user who muted their video.
            var remoteId = eventData.uid;
            // if the main user stops their video select a random user from the list
            if (remoteId != mainStreamId) {
                // if not the main vidiel then show the user icon
                communicationMenu.toggleVisibility('#' + remoteId + '_no-video', true);
            }
        });

        client.on('unmute-video', function (eventData) {
            // eventData.uid: the uid of the remote user who unmuted their video.
            communicationMenu.toggleVisibility('#' + eventData.uid + '_no-video', false);
        });
    }

    function initClientAndJoinChannel(agoraAppId, token, channelName, uid) {
        //TODO naveen 1
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
        //TODO Naveen 2
        // join the channel
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
        // create local stream
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
        // leave the channel
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
        // register event listener for the given event name
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
