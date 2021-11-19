import { ChatInterface } from './../../utils/ChatInterface';
import { AVATAR_LIST } from '../../constants';
export default function ChatMenu(applicationConfig) {
    var chatMenuUI;
    var chatInterface;
    this.applicationConfig = applicationConfig;
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
        if (typeof ChatInterface !== 'undefined') {
            chatInterface = new ChatInterface(this);
            registerEvents();
            chatInterface.initInterface();
            applicationConfig.chatInterface = chatInterface;
        } else {
            console.log('chatInterface not found');
        }
        initClientAndJoinChannel();
    }

    function registerEvents() {
        chatInterface.registerEvent('chatReceived', onChatReceived);
    }

    function renderChatMenu() {
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

    function onChatReceived(eventData) {
        console.log('onChatReceived');
        let chatMessage = eventData.data;
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
        //Read the message from input text
        let message = chatMenuUI.querySelector('.sendChatText').value;
        onChatReceived({
            data: {
                id: 0,
                message: message,
                username: 'Admin',
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
            if (e.keyCode === 13 && !e.shiftKey) {
                onChatSend();
            }
        });
    }

    function initClientAndJoinChannel() {
        var agoraAppId = applicationConfig.agoraAppId;
        var agoraToken = applicationConfig.agoraToken;
        var agoraChannel = applicationConfig.agoraChannel;
        let agoraUserName = applicationConfig.agoraUserName;
        let agoraUserId = applicationConfig.agoraUserId;
        chatInterface.initClientAndJoinChannel(agoraAppId, agoraToken, agoraChannel, agoraUserId);

        setTimeout(function () {
            onChatReceived({
                data: {
                    id: 0,
                    message: 'Hi guys Welcome to our Application',
                    username: 'Admin',
                    timestamp: new Date().toLocaleString(),
                    userType: 'local'
                }
            });
        }, 1000);

        setTimeout(function () {
            onChatReceived({
                data: {
                    id: 0,
                    message: 'Thank you all for having me',
                    username: 'Guest',
                    timestamp: new Date().toLocaleString(),
                    userType: 'remote'
                }
            });
        }, 2000);
    }

    return {
        applicationConfig: applicationConfig,
        render: render
    };
}
