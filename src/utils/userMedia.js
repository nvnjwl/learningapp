import { DEFAULT_MEDIA_CONSTRAINTS } from '../constants';

export default class UserMedia {
    constructor(mediaType) {
        this.__mediaType = mediaType;
        this.__defaultMediaConstraints = DEFAULT_MEDIA_CONSTRAINTS;
    }

    static async getMediaDevices() {
        let mediaDevices = {};
        try {
            let allDevices = await navigator.mediaDevices.enumerateDevices();
            mediaDevices = {};
            allDevices.forEach((device) => {
                const kind = device.kind;
                mediaDevices[kind] = mediaDevices[kind] ? mediaDevices[kind] : [];
                mediaDevices[kind].push(device);
            });
            return mediaDevices;
        } catch (e) {
            console.log('Error in getting devices ', e);
            return null;
        }
    }

    async get(mediaConstraints) {
        try {
            mediaConstraints = mediaConstraints ? mediaConstraints : this.__defaultMediaConstraints[this.__mediaType];
            if (this.__mediaType === 'screen') {
                this.__stream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
            } else {
                this.__stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
            }
            return this.__stream;
        } catch (e) {
            return null;
        }
    }

    enable() {
        this.__stream.getTracks().forEach((track) => (track.enabled = true));
    }
    disable() {
        this.__stream.getTracks().forEach((track) => (track.enabled = false));
    }
    free() {
        this.__stream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    setDevicesAndConstraints(audioInput, videoInput) {
        try {
            this.__defaultMediaConstraints.camera.video = Object.assign(this.__defaultMediaConstraints.camera.video, {
                device: { exact: videoInput.deviceId }
            });
            this.__defaultMediaConstraints.audio = Object.assign(this.__defaultMediaConstraints.audio, {
                device: { exact: audioInput.deviceId }
            });

            const stream = this.get();
            return stream;
        } catch (e) {
            console.log('Error in applying constraints ', e);
            return null;
        }
    }
}
