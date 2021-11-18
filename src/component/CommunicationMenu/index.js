import { AgoraInterface } from './../../utils/agoraInterface';
import { STREAM_STATE } from './../../constants/index';
import ChatMenu from '../ChatMenu';
export default function CommunicationMenu(applicationConfig) {
    let agoraInterface;
    let communicationMenuUI;
    let videoStreamOuter;

    var agoraAppId = applicationConfig.agoraAppId;
    var agoraToken = applicationConfig.agoraToken;
    var agoraChannel = applicationConfig.agoraChannel;
    let agoraUserName = applicationConfig.agoraUserName;
    let agoraUserId = makeUserId(agoraUserName);

    function render() {
        if (!applicationConfig) {
            console.error('applicationConfig not found');
            return;
        }
        applicationConfig = applicationConfig;
        applicationConfig.OBJ.CommunicationMenu = this;
        communicationMenuUI = applicationConfig.UI.communicationMenuUI;
        if (!communicationMenuUI) {
            console.error('communicationMenuUI not found');
            return;
        }

        if (typeof AgoraInterface !== 'undefined') {
            agoraInterface = new AgoraInterface(this);
            registerEvents();
            agoraInterface.initInterface();
            applicationConfig.agoraInterface = agoraInterface;
        } else {
            console.log('agoraInterface not found');
        }
        renderCommunicationMenuItems();
        initClientAndJoinChannel();
        renderChatMenu();
    }

    function renderChatMenu() {
        let chatMenuUI = communicationMenuUI.__createDiv('chatMenuOuter', '');
        applicationConfig.UI.chatMenuUI = chatMenuUI;
        let chatMenu = new ChatMenu(applicationConfig);
        chatMenu.render();
    }

    function registerEvents() {
        agoraInterface.registerEvent(STREAM_STATE.STREAM_PUBLISHED, onStreamPublished);
        agoraInterface.registerEvent(STREAM_STATE.STREAM_ADDED, onStreramAdded);
    }

    function onStreamPublished(eventData) {
        console.log('onStreamPublished');
    }

    function onStreramAdded(eventData) {
        console.log('onStreramAdded');
    }

    function makeUserId(agoraUserName) {
        if (!agoraUserName) {
            agoraUserName = 'user' + Math.floor(Math.random() * 100);
        }
        // let agoraUserId = agoraUserName.toLowerCase().replace(/\s/g, '');
        let agoraUserId = 1000 + Math.floor(Math.random() * 1000);
        return agoraUserId;
    }

    function initClientAndJoinChannel() {
        agoraInterface.initClientAndJoinChannel(agoraAppId, agoraToken, agoraChannel, agoraUserId);
    }

    function renderLocalStreamContainer(parentElement) {
        console.log('renderLocalStreamContainer');
        let localStreamContainer = document.createElement('div');
        localStreamContainer.className = 'eachVideoStream localStreamContainer';
        let staticHTML = `
        <div id="local-stream-container" class="fhw">
            <div id="mute-overlay" class="col">
                <i id="mic-icon" class="fas fa-microphone-slash"></i>
            </div>
            <div id="localUserName" class="col userName">
                <span>${agoraUserName}</span>
            </div>
            <div id="no-local-video" class="col text-center">
                <i id="user-icon" class="fas fa-user"></i>
            </div>
            <div id="local-video" class="col p-0"></div>
        </div>`;
        localStreamContainer.innerHTML = staticHTML;
        parentElement.appendChild(localStreamContainer);
    }

    function renderVideoStreamOuter(parentElement) {
        videoStreamOuter = parentElement.__createDiv('videoStreamOuter', 'remote-streams');
        renderLocalStreamContainer(videoStreamOuter);
    }

    function renderCommunicationMenuItems() {
        var containerFluid = communicationMenuUI.__createDiv('videoMenu');
        var mainContainer = containerFluid.__createDiv('main-container fhw', 'main-container');
        var fullScreenVideo = mainContainer.__createDiv('full-screen-video', 'full-screen-video');
        renderVideoStreamOuter(mainContainer);
        renderButtonContainer(mainContainer);
    }

    function renderButtonContainer(parentElement) {
        let buttonsContainer = parentElement.__createDiv('row justify-content-center mt-3 buttons-container', 'buttons-container');
        let staticHTML = `
            <div class="col-md-2 text-center">
                <button id="mic-btn" type="button" class="btn btn-block btn-dark btn-lg">
                    <i id="mic-icon" class="fas fa-microphone"></i>
                </button>
            </div>
            <div class="col-md-2 text-center">
                <button id="video-btn"  type="button" class="btn btn-block btn-dark btn-lg">
                    <i id="video-icon" class="fas fa-video"></i>
                </button>
            </div>
            <div class="col-md-2 text-center">
                <button id="exit-btn"  type="button" class="btn btn-block btn-danger btn-lg">
                    <i id="exit-icon" class="fas fa-phone-slash"></i>
                </button>
            </div>
        </div>`;
        buttonsContainer.innerHTML = staticHTML;
        return buttonsContainer;
    }

    function enableUiControls(localStream) {
        $('#mic-btn').prop('disabled', false);
        $('#video-btn').prop('disabled', false);
        $('#screen-share-btn').prop('disabled', false);
        $('#exit-btn').prop('disabled', false);

        $('#mic-btn').click(function () {
            toggleMic(localStream);
        });

        $('#video-btn').click(function () {
            toggleVideo(localStream);
        });

        $('#exit-btn').click(function () {
            console.log('so sad to see you leave the channel');
            leaveChannel();
        });
    }

    function toggleBtn(btn) {
        btn.toggleClass('btn-dark').toggleClass('btn-danger');
    }

    function toggleScreenShareBtn() {
        $('#screen-share-btn').toggleClass('btn-danger');
        $('#screen-share-icon').toggleClass('fa-share-square').toggleClass('fa-times-circle');
    }

    function toggleVisibility(elementID, visible) {
        if (visible) {
            $(elementID).attr('style', 'display:block');
        } else {
            $(elementID).attr('style', 'display:none');
        }
    }

    function toggleMic(localStream) {
        toggleBtn($('#mic-btn')); // toggle button colors
        $('#mic-icon').toggleClass('fa-microphone').toggleClass('fa-microphone-slash'); // toggle the mic icon
        if ($('#mic-icon').hasClass('fa-microphone')) {
            localStream.unmuteAudio(); // enable the local mic
            toggleVisibility('#mute-overlay', false); // hide the muted mic icon
        } else {
            localStream.muteAudio(); // mute the local mic
            toggleVisibility('#mute-overlay', true); // show the muted mic icon
        }
    }

    function toggleVideo(localStream) {
        toggleBtn($('#video-btn')); // toggle button colors
        $('#video-icon').toggleClass('fa-video').toggleClass('fa-video-slash'); // toggle the video icon
        if ($('#video-icon').hasClass('fa-video')) {
            localStream.unmuteVideo(); // enable the local video
            toggleVisibility('#no-local-video', false); // hide the user icon when video is enabled
        } else {
            localStream.muteVideo(); // disable the local video
            toggleVisibility('#no-local-video', true); // show the user icon when video is disabled
        }
    }

    function addRemoteStreamMiniView(streamId) {
        let videoTagId = makeRemoteStreamVideoView(streamId);
        return videoTagId;
    }

    function makeRemoteStreamVideoView(streamId) {
        let videoTagId = '';
        try {
            let remoteStreamContainer = videoStreamOuter.__createDiv('eachVideoStream', `${streamId}_container`);
            videoTagId = `video${streamId}`;
            let staticHTML = `
                <div id="${streamId}_mute" class="mute-overlay" style="display: block">
                    <i class="fas fa-microphone-slash"></i>
                </div>
                <div id="${streamId}_no-video" class="no-video-overlay text-center">
                    <i class="fas fa-user"></i>
                </div>
                <div id="agora_remote_${streamId}" class="fhw remote-video">
                    <div id="player_${streamId}" class="fhw">
                        <video id=${videoTagId} style="width: 100%; height: 100%; position: absolute; object-fit: cover"
                            autoplay="" muted="" playsinline=""></video>
                        <audio id="audio${streamId}" playsinline=""></audio>
                    </div>
            </div>`;
            remoteStreamContainer.innerHTML = staticHTML;
            return videoTagId;
        } catch (error) {
            console.log(error);
        }
    }

    return {
        render: render,
        toggleVideo: toggleVideo,
        enableUiControls: enableUiControls,
        addRemoteStreamMiniView: addRemoteStreamMiniView
    };
}
