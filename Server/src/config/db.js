const mongoose = require('mongoose')

async function main(){
    await mongoose.connect(process.env.DB_CONNECT_SRTING);
}

module.exports = main


