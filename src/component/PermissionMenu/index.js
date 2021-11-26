import CommunicationMenu from '../CommunicationMenu';
import { initializeAgoraInterface } from './../../utils/agoraInterface';

export default class PermissionMenu {
    constructor(applicationConfig) {
        if (!applicationConfig) {
            console.error('applicationConfig not found');
            return;
        }
        this.applicationConfig = applicationConfig;
        this.applicationConfig.OBJ.permissionMenu = this;
        let permissionMenuUI = this.applicationConfig.UI.permissionMenuUI;
        this.permissionMenuUI = permissionMenuUI;
        if (!permissionMenuUI) {
            console.error('permissionMenuUI not found');
            return;
        }
        this.renderPermissionMenu();
    }

    renderPermissionMenu() {
        console.log('renderPermissionMenu');
        let permissionMenuTitle = this.permissionMenuUI.__createDiv('permissionMenuTitle positionCenterTop', 'permissionMenuTitle', 'Agora Chat Application');
        let permissionMenuPopup = this.permissionMenuUI.__createDiv('permissionMenuPopup', '');
        // let permissionMenuButton = this.permissionMenuUI.__createDiv('permissionMenuButton', '');
        this.renderPermissionMenuItems(permissionMenuPopup);
        // permissionMenuButton.innerHTML = '<div class="permission-menu-button">Permission Menu</div>';
        // permissionMenuButton.addEventListener('click', this.onPermissionMenuClick.bind(this));
        this.renderInstructions();
    }

    renderInstructions() {
        //Render instructions
        let instructionsUI = this.permissionMenuUI.__createDiv('instructions', '');
        let instructions = `
        Instructions
        <pre>
          1) You need to Create Your own Agora AppId.
          2) You need to Create Your own Token.
          3) You need to Create Your own ChannelName , Use the Same Channel Name accross Other instances.
          4) Set  your Name.
          5) Set your Id (Optional) Id is getting generated on ramdom basis.
          6) Here i have used my  Agora appId and Agora token , Agora Channel Name.
          7) Token gets expired after 24 hours
        </pre>
          <a href="https://console.agora.io/">Jump to Agora Console </a>`;

        instructionsUI.innerHTML = instructions;
    }

    onPermissionMenuClick(event) {
        console.log('onPermissionMenuClick');
        this.renderPermissionMenuItems();
    }

    renderPermissionMenuItems(permissionMenuPopup) {
        var agoraAppId = this.applicationConfig.agoraAppId;
        var agoraToken = this.applicationConfig.agoraToken;
        var agoraChannel = this.applicationConfig.agoraChannel;
        let agoraUserName = this.applicationConfig.agoraUserName;
        let agoraUserId = this.applicationConfig.agoraUserId;
        if (!agoraUserName) {
            agoraUserName = 'user' + Math.floor(Math.random() * 100);
        }

        console.log('renderPermissionMenuItems');
        var staticHTML = `
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header text-center">
                <h4 class="modal-title w-100 font-weight-bold">Join Channel</h4>
              </div>
              <div class="modal-body mx-3">
                <div class="md-form mb-4">
                  <input type="text" id="form-appid" class="form-control" value="${agoraAppId}" placeholder="Enter Agora AppId" >
                  <label for="form-appid">Agora AppId</label>
                </div>
                <div class="md-form mb-4">
                  <input type="text" id="form-token" class="form-control" value="${agoraToken}" placeholder="Enter Agora Token"/>
                  <label for="form-token">Agora Token</label>
                </div>
                <div class="md-form mb-4">
                  <input type="text" id="form-channel" class="form-control" value="${agoraChannel}" placeholder="Enter Agora Channel"/>
                  <label for="form-channel">Channel</label>
                </div>
                <div class="md-form mb-4">
                  <input type="text" id="form-uname" class="form-control" value="${agoraUserName}" placeholder="Enter  User name"/>
                  <label for="form-uname">User Name</label>
                </div>
               <div class="md-form mb-4">
                  <input type="text" id="form-uid" class="form-control" value="${agoraUserId}" placeholder="Enter User IDd"/>
                  <label for="form-uname">User Id</label>
                </div>
              </div>
              <div class="modal-footer d-flex justify-content-center">
                <button id="join-channel" class="btn btn-default">Join Channel</button>
              </div>
            </div>
        </div>`;
        permissionMenuPopup.innerHTML = staticHTML;
        this.attachEventListener();
    }

    attachEventListener() {
        $('#join-channel').click(this.onJoinChannelClick.bind(this));
    }

    onJoinChannelClick() {
        console.log('onJoinChannelClick');
        var agoraAppId = $('#form-appid').val();
        var agoraToken = $('#form-token').val();
        var agoraChannel = $('#form-channel').val();
        let agoraUserName = $('#form-uname').val();
        let agoraUserId = $('#form-uid').val();
        if (!agoraAppId) {
            alert('Please enter App Id , Use your App Id');
            return;
        }
        if (!agoraToken) {
            alert('Please enter Agora Token, Generate a Token from Agora Console');
            return;
        }
        if (!agoraChannel) {
            alert('Please enter Channel Name');
            return;
        }
        if (!agoraUserName) {
            alert('Please enter UserName');
            return;
        }
        if (!agoraUserId) {
            alert('Please enter User ID');
            return;
        }
        if (agoraAppId) {
            this.applicationConfig.agoraAppId = agoraAppId;
        }
        if (agoraToken) {
            this.applicationConfig.agoraToken = agoraToken;
        }
        if (agoraChannel) {
            this.applicationConfig.agoraChannel = agoraChannel;
        }
        if (agoraUserName) {
            this.applicationConfig.agoraUserName = agoraUserName;
        }
        if (agoraUserId) {
            this.applicationConfig.agoraUserId = agoraUserId;
        }
        this.makeCommunicationUI();
    }

    makeCommunicationUI() {
        let chatAPPUI = this.applicationConfig.UI.chatAPPUI;
        let communicationMenuUI = chatAPPUI.__createDiv('communicationMenu', '');
        this.applicationConfig.UI.communicationMenuUI = communicationMenuUI;
        this.permissionMenuUI.__hide();
        let communicationMenu = new CommunicationMenu(this.applicationConfig);
        this.communicationMenu = communicationMenu;
        this.communicationMenu.render();
    }
}
