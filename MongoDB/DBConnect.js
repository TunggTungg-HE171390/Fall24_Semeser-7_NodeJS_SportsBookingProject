'use strict'

import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectString = "mongodb+srv://hoangbdhe176159:PmVDqIjYkxvlyiqG@sdn.zi13k.mongodb.net/SDN_DB?retryWrites=true&w=majority&appName=SDN";

// Lấy tên database từ chuỗi kết nối
const dbName = connectString.split('/').pop().split('?')[0];

class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        mongoose.connect(connectString, { maxPoolSize: 50 })
            .then(() => {
                console.log("Connected Mongodb Success")
                console.log(`Connected to MongoDB Database: ${dbName}`);
            })
            .catch(err => {
                console.log("Error Connect: ", err)
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongoDb = Database.getInstance()

export default instanceMongoDb;