const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:12XZHI1011@ds261377.mlab.com:61377/instaflights', { useNewUrlParser: true });
const UsersSchema = new mongoose.Schema({
    email: String, url: String, price: Number, date: String
});
const Users = mongoose.model('Users', UsersSchema);

module.exports.mongooseDB = mongoose;
module.exports.mongooseUsersModel = Users;