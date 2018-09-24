import url from 'url';
import Chatfuel from '../api/Chatfuel'

const ChatfuelAPI = new Chatfuel();

function isImage(msg) {
    const urlparse = url.parse(msg);
    if (urlparse.protocol !== 'https:') return false;
    if (urlparse.hostname.includes("fbcdn.net") && (urlparse.pathname.endsWith(".png") || urlparse.pathname.endsWith(".jpg") || urlparse.pathname.endsWith(".jpeg") || urlparse.pathname.endsWith(".gif"))) return true
    return false;
}

function isVoice(msg) {
    const urlparse = url.parse(msg);
    if (urlparse.protocol !== 'https:') return false;
    if (urlparse.hostname.includes("fbcdn.net") && (urlparse.pathname.endsWith(".mp4") || urlparse.pathname.endsWith(".acc"))) return true
    return false;
}

export default async (senderId, msg) => {
    if (isImage(msg)) {
        msg.split(" ").forEach(async (v) => {
            return await ChatfuelAPI.sendImage(senderId, v)
        })
    } else {
        return await ChatfuelAPI.sendText(senderId, msg);
    }
}
