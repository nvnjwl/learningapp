import { STREAM_STATE } from './../constants/index';

export function AgoraInterface(commmunicationMenu) {
    var client;
    var videoProfiles = [
        { label: '480p_1', detail: '640×480, 15fps, 500Kbps', value: '480p_1' },
        { label: '480p_2', detail: '640×480, 30fps, 1000Kbps', value: '480p_2' },
        { label: '720p_1', detail: '1280×720, 15fps, 1130Kbps', value: '720p_1' },
        { label: '720p_2', detail: '1280×720, 30fps, 2000Kbps', value: '720p_2' },
        { label: '1080p_1', detail: '1920×1080, 15fps, 2080Kbps', value: '1080p_1' },
        { label: '1080p_2', detail: '1920×1080, 30fps, 3000Kbps', value: '1080p_2' },
        {
            label: '200×640',
            detail: '200×640, 30fps',
            value: { width: 200, height: 640, frameRate: 30 }
        }
    ];

    var localTracks = {
        videoTrack: null,
        audioTrack: null
    };

    var localTrackState = {
        videoTrackMuted: false,
        audioTrackMuted: false
    };

    var remoteUsers = {};
    var remoteUsersVideoPlayer = {};

    var options = {
        appid: null,
        channel: null,
        uid: null,
        token: null
    };

    var eventHandlers = {};

    //General Class Methods start
    function initInterface() {
        client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        subscribeClientEvent();
    }

    function subscribeClientEvent() {
        //Subscribe to Agora events
        client.enableAudioVolumeIndicator();
        client.on('user-published', onRemoteUserPublished);
        client.on('user-joined', onRemoteUserJoined);
        client.on('user-left', onRemotePeerLeave);
        client.on('user-unpublished', onRemoteUserUnPublished);
        client.on('connection-state-change', connectionStateChange);
        client.on('user-mute-updated', onRemoteUserMuteUpdated);
        client.enableAudioVolumeIndicator();
        client.on('volume-indicator', volumeIndicator);
    }

    async function initClientAndJoinChannel(agoraAppId, token, channelName, uid) {
        options.appid = agoraAppId;
        options.token = token;
        options.channel = channelName;
        options.uid = uid;
        await joinChannel();
        console.log('joinChannel Success');
    }

    function broadcastEvent(eventName, eventData) {
        //broadcast event to all listeners
        if (eventHandlers[eventName]) {
            eventHandlers[eventName](eventData);
        }
    }

    function registerEvent(eventName, callback) {
        // register event listener for the given event name
        eventHandlers[eventName] = callback;
    }

    function volumeIndicator(volumes) {
        let threshold = 5;
        volumes.forEach((volume, index) => {
            //console.log(`${index} UID ${volume.uid} Level ${volume.level}`);
            if (volume.level > threshold) {
                commmunicationMenu.highLightSpeaker(volume.uid);
            } else {
                commmunicationMenu.removeHighLightSpeaker(volume.uid);
            }
        });
    }
    //General Class Methods Ended

    //Local Actions Start
    async function joinChannel() {
        let curVideoProfile = videoProfiles[1];

        // add event listener to play remote tracks when remote users join, publish and leave.

        // join a channel and create local tracks, we can use Promise.all to run them concurrently
        [options.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
            // join the channel
            client.join(options.appid, options.channel, options.token || null, options.uid || null),
            // create local tracks, using microphone and camera
            AgoraRTC.createMicrophoneAudioTrack(),
            AgoraRTC.createCameraVideoTrack({ encoderConfig: curVideoProfile.value })
        ]);

        // play local video track
        localTracks.videoTrack.play('local-video');

        // publish local tracks to channel
        await client.publish(Object.values(localTracks));
        commmunicationMenu.enableUiControls();
        console.log('publish success');
    }

    function toggleMuteState() {
        if (!localTrackState.audioTrackMuted) {
            muteAudio();
        } else {
            unMuteAudio();
        }
    }

    function toggleVideoState() {
        if (!localTrackState.videoTrackMuted) {
            muteVideo();
        } else {
            unMuteVideo();
        }
    }

    async function muteAudio() {
        if (!localTracks.audioTrack) return;
        /**
         * After calling setMuted to mute an audio or video track, the SDK stops sending the audio or video stream. Users whose tracks are muted are not counted as users sending streams.
         * Calling setEnabled to disable a track, the SDK stops audio or video capture
         */
        await localTracks.audioTrack.setMuted(true);
        localTrackState.audioTrackMuted = true;
    }

    async function muteVideo() {
        if (!localTracks.videoTrack) return;
        await localTracks.videoTrack.setMuted(true);
        localTrackState.videoTrackMuted = true;
    }

    async function unMuteAudio() {
        if (!localTracks.audioTrack) return;
        await localTracks.audioTrack.setMuted(false);
        localTrackState.audioTrackMuted = false;
    }

    async function unMuteVideo() {
        if (!localTracks.videoTrack) return;
        await localTracks.videoTrack.setMuted(false);
        localTrackState.videoTrackMuted = false;
    }

    async function leaveChannel() {
        console.log('leaveChannel start');
        for (let trackName in localTracks) {
            var track = localTracks[trackName];
            if (track) {
                track.stop();
                track.close();
                localTracks[trackName] = undefined;
            }
        }

        remoteUsers = {};
        await client.leave();
        console.log('leaveChannel Complete');
        broadcastEvent(STREAM_STATE.SELF_LEAVE);
    }

    function connectionStateChange(curState, prevState) {
        console.log('connectionStateChange', curState, prevState);
    }
    //Local Action Ended

    //Remote Events Start
    async function subscribeRemoteStream(remoteUser, mediaType) {
        const uid = remoteUser.uid;
        await client.subscribe(remoteUser, mediaType);
        console.log('subscribe success');

        if (mediaType === 'video') {
            let remoteVideoTagId = remoteUsersVideoPlayer[uid];
            if (!remoteVideoTagId) {
                remoteVideoTagId = commmunicationMenu.onRemoteUserPublished(uid);
                remoteUsersVideoPlayer[uid] = remoteVideoTagId;
                remoteUser.videoTrack.play(remoteVideoTagId);
            } else {
                remoteUser.videoTrack.play(remoteVideoTagId);
            }
            onRemoteUnMuteVideo(uid);
        }
        if (mediaType === 'audio') {
            onRemoteUnMuteAudio(uid);
            remoteUser.audioTrack.play();
        }
    }

    function onRemoteUserPublished(remoteUser, mediaType) {
        console.log('onRemoteUserPublished', remoteUser, mediaType);
        const id = remoteUser.uid;
        remoteUsers[id] = remoteUser;
        subscribeRemoteStream(remoteUser, mediaType);
    }

    function onRemoteUserUnPublished(remoteUser, mediaType) {
        const uid = remoteUser.uid;
        console.log('onRemoteUserPublished');
        if (mediaType === 'video') {
            onRemoteMuteVideo(uid);
        }
        if (mediaType === 'audio') {
            onRemoteMuteAudio(uid);
        }
    }

    function onRemoteUserMuteUpdated(uid, muted) {
        console.log('onRemoteUserMuteUpdated', uid, muted);
    }

    function onRemoteUserJoined(remoteUser) {
        console.log('onRemoteUserJoined', remoteUser);
    }

    function onRemotePeerLeave(remoteUser) {
        console.log('onRemotePeerLeave', remoteUser);
        const id = remoteUser.uid;
        delete remoteUsers[id];
        commmunicationMenu.onRemotePeerLeave(id);
    }

    function onRemoteMuteAudio(uid) {
        console.log('onRemoteMuteAudio');
        commmunicationMenu.onRemoteMuteAudio(uid);
    }

    function onRemoteMuteVideo(uid) {
        console.log('onRemoteMuteVideo');
        commmunicationMenu.onRemoteMuteVideo(uid);
    }

    function onRemoteUnMuteAudio(uid) {
        console.log('onRemoteUnMuteAudio');
        commmunicationMenu.onRemoteUnMuteAudio(uid);
    }

    function onRemoteUnMuteVideo(uid) {
        console.log('onRemoteUnMuteVideo');
        commmunicationMenu.onRemoteUnMuteVideo(uid);
    }
    //Remote Events Ended

    return {
        initInterface: initInterface,
        registerEvent: registerEvent,
        initClientAndJoinChannel: initClientAndJoinChannel,
        toggleMuteState: toggleMuteState,
        toggleVideoState: toggleVideoState,
        muteAudio: muteAudio,
        muteVideo: muteVideo,
        unMuteAudio: unMuteAudio,
        unMuteVideo: unMuteVideo,
        leaveChannel: leaveChannel
    };
}
