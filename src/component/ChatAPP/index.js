import PermissionMenu from './../PermissionMenu';
export default class ChatAPP {
    constructor(applicationConfig) {
        if (!applicationConfig) {
            console.error('applicationConfig not found');
            return;
        }
        this.applicationConfig = applicationConfig;
        this.applicationConfig.OBJ.ChatAPP = this;
        this.chatAPPUI = this.applicationConfig.UI.chatAPPUI;
        if (!this.chatAPPUI) {
            console.error('chatAPPUI not found');
            return;
        }
        this.createHTMLSkeleton();
    }

    createHTMLSkeleton() {
        let permissionMenuUI = this.chatAPPUI.__createDiv('permissionMenu', '');
        this.applicationConfig.UI.permissionMenuUI = permissionMenuUI;
        let permissionMenu = new PermissionMenu(this.applicationConfig);
        this.permissionMenu = permissionMenu;
    }
}
