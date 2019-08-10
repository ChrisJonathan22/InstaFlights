const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:12XZHI1011@ds261377.mlab.com:61377/instaflights', { useNewUrlParser: true });
const Users = mongoose.model('Users', { email: String, url: String, price: Number });

// const user001 = new Users({ email: 'christophereko@hotmail.fr', price: 500 });
// user001.save().then(() => console.log('User details saved.'));

module.exports.mongooseDB = mongoose;
module.exports.mongooseUsersModel = Users;