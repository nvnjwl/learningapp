import { registerDomMethods, __el } from './utils/dom';
import css from './assets/css/main.css';
import ChatAPP from './component/ChatAPP';

export default class AgoraVideoCall {
    constructor(applicationConfig) {
        this.applicationConfig = applicationConfig;
        this.applicationConfig.UI = {};
        this.applicationConfig.OBJ = {};
        this.applicationConfig.OBJ.AgoraVideoCall = this;
        this.registerBodyOnload();
    }
    static get TempBuildVersion() {
        return '__COMMITHASH__';
    }
    static get version() {
        return '1.0.0';
    }
    static get buildInfo() {
        return `Build Creation : 15 November 2021
    Issue Fixes : 
      1. Basic Chat Demo
      2. No UI for Media Permission`;
    }

    registerBodyOnload() {
        console.log('registerBodyOnload');
        if (document.body) {
            this.bodyOnload();
        } else {
            window.addEventListener('DOMContentLoaded', this.bodyOnload.bind(this));
        }
    }

    bodyOnload() {
        registerDomMethods();
        setTimeout(this.startRender.bind(this), 0);
    }

    startRender() {
        console.log('Start Render');
        let applicationDiv = this.applicationConfig.applicationDiv;
        applicationDiv = __el(applicationDiv);
        if (!applicationDiv) {
            console.error('applicationDiv not found');
            alert('applicationDiv not found');
            return;
        }
        this.applicationDiv = applicationDiv;
        this.applicationConfig.UI.applicationDiv = applicationDiv;
        let chatAPPUI = applicationDiv.__createDiv('chatApp', '');
        this.applicationConfig.UI.chatAPPUI = chatAPPUI;
        var chatAPP = new ChatAPP(this.applicationConfig);
        this.chatAPP = chatAPP;
    }
}
console.log('middleware 1657');
window.AgoraVideoCall = AgoraVideoCall;
