import mongodb from 'mongodb'
import Chatfuel from '../api/Chatfuel'
const MongoClient = mongodb.MongoClient;

const ChatfuelAPI = new Chatfuel();

export default (id1, id2) => {
    return new Promise(resolve => {
        MongoClient.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true
        }, (err, db) => {
            if (err) throw err;
            db.db(process.env.MONGODB_NAME || process.env.MONGODB_URI.split("/")[3]).collection('users').updateOne({
                    _id: id1
                }, {
                    "$set": {
                        "status": 2,
                        "timestamp": null,
                        "idCouple": id2
                    }
                },
                (err) => {
                    if (err) throw err;
                    db.db(process.env.MONGODB_NAME || process.env.MONGODB_URI.split("/")[3]).collection('users').updateOne({
                            _id: id2
                        }, {
                            "$set": {
                                "status": 2,
                                "timestamp": null,
                                "idCouple": id1
                            }
                        },
                        (err) => {
                            if (err) throw err;
                            return Promise.all([ChatfuelAPI.sendText(id1, "Đã tìm thấy một người lạ :D hãy chào nhau nào."), ChatfuelAPI.sendText(id2, "Đã tìm thấy một người lạ :D hãy chào nhau nào.")]).then(() => {
                                db.close(null, () => {
                                    resolve(true)
                                })
                            })
                        })
                })
        })
    })
}
