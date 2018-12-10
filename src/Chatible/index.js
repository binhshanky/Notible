import findUser from './findUser'
import insertUser from './insertUser'
import userRequest from './userRequest'
import findPair from './findPair'
import bye, {
    byeOne
} from './bye'
import handleMessage from './handleMessage';

import Chatfuel from '../api/Chatfuel'

import cache from 'memory-cache';

const ChatfuelAPI = new Chatfuel();

export default async (user) => {
    const idCouple = cache.get(user.senderId)
    if (idCouple) {
        if (user.msg.toLowerCase() === "end") return await bye(user.senderId, idCouple)
        return handleMessage(idCouple, user.msg);
    }
    const userDb = await findUser(user.senderId);
    if (!userDb) {
        insertUser(user).then(() => {
            return Promise.all([findPair(), ChatfuelAPI.sendText(user.senderId, "Đang tìm kiếm đối tượng")]).then(() => {})
        })
    } else if (userDb.status == 0) {
        userRequest(user.senderId).then(() => {
            return Promise.all([findPair(), ChatfuelAPI.sendText(user.senderId, "Đang tìm kiếm đối tượng")]).then(() => {})
        })
    } else if (userDb.status === 1) {
        if (user.msg.toLowerCase() === "end") return await byeOne(user.senderId)
        return await ChatfuelAPI.sendText(user.senderId, "Chờ chút. Yêu cầu của bạn chắc bây giờ không có ai cả :(. Thử huỷ đi chọn lại hoặc chờ đợi nhé")
    } else if (userDb.idCouple) {
        if (user.msg.toLowerCase() === "end") return await bye(user.senderId, userDb.idCouple)
        cache.put(user.senderId, userDb.idCouple)
        return handleMessage(userDb.idCouple, user.msg);
    }
}
