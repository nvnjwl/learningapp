import { ChatInterface } from './../../utils/ChatInterface';
import { AVATAR_LIST } from '../../constants';
import { TokenBuilder } from './../../utils/token';
import { __el } from '../../utils/dom';

export default function ChatMenu(applicationConfig) {
    var chatMenuUI;
    var chatInterface;
    this.applicationConfig = applicationConfig;
    let agoraUserName = applicationConfig.agoraUserName;
    let agoraUserId = applicationConfig.agoraUserId;
    applicationConfig.accountName = agoraUserName;

    function render() {
        if (!applicationConfig) {
            console.error('applicationConfig not found');
            return;
        }
        applicationConfig.OBJ.ChatMenu = this;
        chatMenuUI = applicationConfig.UI.chatMenuUI;
        if (!chatMenuUI) {
            console.error('chatMenuUI not found');
            return;
        }
        renderChatMenu();
        applyEventListener();
        handleTokenBuilder();
        if (typeof ChatInterface !== 'undefined') {
            chatInterface = new ChatInterface(this);
            registerEvents();
            chatInterface.initInterface();
            applicationConfig.chatInterface = chatInterface;
            initClientAndJoinChannel();
            handleDummyChat();
        } else {
            console.log('chatInterface not found');
        }
    }

    //handle Token Builder interface
    function handleTokenBuilder() {
        let tokenBuiler = new TokenBuilder(applicationConfig);
        tokenBuiler.initInterface();
        let RTMToken = tokenBuiler.generateRTMTokenFromAccount();
        applicationConfig.RTMToken = RTMToken;
    }

    function registerEvents() {
        //Register events for chat menu
        chatInterface.registerEvent('onChatReceived', onChatReceived);
    }

    function renderChatMenu() {
        // Render chat menu with default UI
        let staticHTML = `
				<section class="chatbox">
					<section class="chat-window">
						
					</section>
					<form class="chat-input" onsubmit="return false;">
						<input type="text" autocomplete="on" class="sendChatText" placeholder="Type a message" />
						<button class="sendChatButton">
													<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="rgba(0,0,0,.38)" d="M17,12L12,17V14H8V10H12V7L17,12M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L5,8.09V15.91L12,19.85L19,15.91V8.09L12,4.15Z" /></svg>
											</button>
					</form>
				</section>`;
        chatMenuUI.innerHTML = staticHTML;
    }

    // function appendStreamName(streamId, userName) {
    //     console.log('appendStreamName', streamId, userName);
    //     let remoteContainer = __el(`remoteStreamContainer${streamId}`);
    //     if (!remoteContainer) {
    //         return;
    //     }
    //     let spanClassList = remoteContainer.getElementsByClassName('userNameSpan');
    //     if (spanClassList && spanClassList.length > 0) {
    //         spanClassList[0].innerHTML = `Remote:${userName}:${streamId}`;
    //     }
    // }

    function onChatReceived(eventData) {
        //handle chat received event amd render chat
        console.log('onChatReceived', eventData);
        let chatMessage = eventData.data;
        let chatMessageString = chatMessage.message;
        // if (chatMessageString && chatMessageString.indexOf('INFO') !== -1 && chatMessageString.split(':').length > 1) {
        //     let userName = chatMessageString.split(':')[1];
        //     let streamId = chatMessageString.split(':')[2];
        //     appendStreamName(streamId, userName);
        //     return;
        // }
        let chatMessageUI = document.createElement('article');
        chatMessageUI.classList.add('msg-container');
        if (chatMessage.userType == 'local') {
            chatMessageUI.classList.add('msg-self');
        } else {
            chatMessageUI.classList.add('msg-remote');
        }
        chatMessageUI.setAttribute('id', 'msg-' + chatMessage.id);
        chatMessageUI.innerHTML = `
				<div class="msg-box">
					<img class="user-img" id="user-0" src="${AVATAR_LIST.default}" />
					<div class="flr">
						<div class="messages">
							<p class="msg" id="msg-0">
								${chatMessage.message}
							</p>
						</div>
						<span class="timestamp"><span class="username">${chatMessage.username}</span>&bull;<span class="posttime">${chatMessage.timestamp}</span></span>
					</div>
				</div>
			`;
        chatMenuUI.querySelector('.chat-window').appendChild(chatMessageUI);
        chatMenuUI.querySelector('.chat-window').scrollTop = chatMenuUI.querySelector('.chat-window').scrollHeight;
    }

    //send chat on enter
    function onChatSend() {
        //Read the message from input text and send it to chat interface
        let message = chatMenuUI.querySelector('.sendChatText').value;
        onChatReceived({
            data: {
                id: 0,
                message: message,
                username: agoraUserName,
                timestamp: new Date().toLocaleString(),
                userType: 'local'
            }
        });
        chatMenuUI.querySelector('.sendChatText').value = '';
        chatInterface.sendChannelMessage(message);
    }

    //apply event listener on chat menu
    function applyEventListener() {
        console.log('applyEventListener');
        chatMenuUI.querySelector('.sendChatButton').addEventListener('click', onChatSend);
        chatMenuUI.querySelector('.sendChatText').addEventListener('keyup', function (e) {
            e.stopPropagation();
            e.preventDefault();
            let message = chatMenuUI.querySelector('.sendChatText').value;
            if (e.keyCode === 13 && !e.shiftKey && message) {
                onChatSend();
            }
        });
    }

    function handleDummyChat() {
        setTimeout(function () {
            let firstMessage = `INFO:${agoraUserName}:${agoraUserId}`;
            chatInterface.sendChannelMessage(firstMessage);
        }, 2000);
    }

    function initClientAndJoinChannel() {
        var agoraAppId = applicationConfig.agoraAppId;
        var agoraToken = applicationConfig.agoraToken;
        var agoraChannel = applicationConfig.agoraChannel;
        let agoraUserName = applicationConfig.agoraUserName;
        let agoraUserId = applicationConfig.agoraUserId;
        chatInterface.initClientAndJoinChannel(agoraAppId, agoraToken, agoraChannel, agoraUserId);
    }

    return {
        applicationConfig: applicationConfig,
        render: render
    };
}
