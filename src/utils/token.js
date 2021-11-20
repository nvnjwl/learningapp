import { RtmTokenBuilder, RtmRole, Priviledges } from 'agora-access-token';

export function TokenBuilder(applicationConfig) {
    var appID = applicationConfig.agoraAppId;
    var appCertificate = applicationConfig.appCertificate;
    var account = applicationConfig.accountName;

    function initInterface() {
        console.log('TokenBuilder: initInterface');
    }

    function generateRTMTokenFromAccount() {
        const expirationTimeInSeconds = 3600;
        const currentTimestamp = Math.floor(Date.now() / 1000);

        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

        const token = RtmTokenBuilder.buildToken(appID, appCertificate, account, RtmRole, privilegeExpiredTs);
        console.log('Rtm Token: ' + token);
        return token;
    }

    return {
        initInterface: initInterface,
        generateRTMTokenFromAccount: generateRTMTokenFromAccount
    };
}
