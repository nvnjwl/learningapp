import { ChatInterface } from './../../utils/ChatInterface';
export default function ChatMenu(applicationConfig) {
    var chatMenuUI;
    var chatInterface;
    function render() {
        if (!applicationConfig) {
            console.error('applicationConfig not found');
            return;
        }
        applicationConfig = applicationConfig;
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
			<article class="msg-container msg-remote" id="msg-0">
				<div class="msg-box">
					<img class="user-img" id="user-0" src="//gravatar.com/avatar/00034587632094500000000000000000?d=retro" />
					<div class="flr">
						<div class="messages">
							<p class="msg" id="msg-0">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent varius, neque non tristique tincidunt, mauris nunc efficitur erat, elementum semper justo odio id nisi.
							</p>
						</div>
						<span class="timestamp"><span class="username">Name</span>&bull;<span class="posttime">3 minutes ago</span></span>
					</div>
				</div>
			</article>
			<article class="msg-container msg-self" id="msg-0">
				<div class="msg-box">
					<div class="flr">
						<div class="messages">
							<p class="msg" id="msg-1">
								Lorem ipsum dolor sit amet
							</p>
							<p class="msg" id="msg-2">
								Praesent varius
							</p>
						</div>
						<span class="timestamp"><span class="username">Name</span>&bull;<span class="posttime">2 minutes ago</span></span>
					</div>
					<img class="user-img" id="user-0" src="//gravatar.com/avatar/56234674574535734573000000000001?d=retro" />
				</div>
			</article>
			<article class="msg-container msg-remote" id="msg-0">
				<div class="msg-box">
					<img class="user-img" id="user-0" src="//gravatar.com/avatar/002464562345234523523568978962?d=retro" />
					<div class="flr">
						<div class="messages">
							<p class="msg" id="msg-0">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							</p>
						</div>
						<span class="timestamp"><span class="username">Name</span>&bull;<span class="posttime">1 minute ago</span></span>
					</div>
				</div>
			</article>
			<article class="msg-container msg-remote" id="msg-0">
				<div class="msg-box">
					<img class="user-img" id="user-0" src="//gravatar.com/avatar/00034587632094500000000000000000?d=retro" />
					<div class="flr">
						<div class="messages">
							<p class="msg" id="msg-0">
								Lorem ipsum dolor sit amet.
							</p>
						</div>
						<span class="timestamp"><span class="username">Name</span>&bull;<span class="posttime">Now</span></span>
					</div>
				</div>
			</article>
			<article class="msg-container msg-self" id="msg-0">
				<div class="msg-box">
					<div class="flr">
						<div class="messages">
							<p class="msg" id="msg-1">
								Lorem ipsum
							</p>
						</div>
						<span class="timestamp"><span class="username">Name</span>&bull;<span class="posttime">Now</span></span>
					</div>
					<img class="user-img" id="user-0" src="//gravatar.com/avatar/56234674574535734573000000000001?d=retro" />
				</div>
			</article>
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

    function renderChatMenu_old() {
        let staticHTML = `
						<div class="chatMenu-header">
							<div class="chatMenu-header-title">
							<span class="chatMenu-header-title-text">Chat</span>
					</div>
					<div class="chatMenu-header-close">
					<div class="chatMenu-header-close-icon">
					<i class="fa fa-times" aria-hidden="true"></i>
					</div>
					</div>
					</div>
					<div class="chatMenu-body">
					<div class="chatMenu-body-chat">
					<div class="chatMenu-body-chat-messages">
					<div class="chatMenu-body-chat-messages-list">
						<div class="chatMenu-body-chat-messages-list-item">
						<div class="chatMenu-body-chat-messages-list-item-text">
						<span class="chatMenu-body-chat-messages-list-item-text-text">
								hi Guys
						</span>
					</div>
					</div>
					<div class="chatMenu-body-chat-input">
					<div class="chatMenu-body-chat-input-text">
					<input type="text" class="chatMenu-body-chat-input-text-input" placeholder="Type a message...">
					</div>
					<div class="chatMenu-body-chat-input-send">
					<div class="chatMenu-body-chat-input-send-icon">
					<i class="fa fa-paper-plane" aria-hidden="true"></i>
					</div>
					</div>
					</div>
					<
					</div>
					</div>
				`;
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
					<img class="user-img" id="user-0" src="//gravatar.com/avatar/00034587632094500000000000000000?d=retro" />
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
        render: render
    };
}
