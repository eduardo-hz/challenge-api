const jwt = require('jsonwebtoken');
const user = require('../models');

async function checkToken(token) {
    let _id = null;
    try {
        const { usr_id } = await jwt.decode(token);
        _id = usr_id;
    } catch (err) {
        return false;
    }

    const usr = await user.findOne({ 
        properties: ['user_id', 'username', 'last_name', 'email'],
        where: { user_id: _id } 
    });
    if (usr) {
        const token = jwt.sign({ user_id: _id}, 'clavesecretaparagenerartoken', { expiresIn: '1d' });
        return { token, user };
    } else {
        return false;
    }
}

module.exports = {
    encode: async(_id) => {
        const token = jwt.sign({ user_id: _id}, 'clavesecretaparagenerartoken', { expiresIn: '1d' });
        return token;
    },
    getUserByToken: async(token) => {
        try {
            const { usr_id } = await jwt.verify(token, 'clavesecretaparagenerartoken');
            const usr = await user.findOne({ 
                properties: ['user_id', 'username', 'last_name', 'email'],
                where: { user_id: usr_id } 
            });
            if (usr.length != 0) {
                return usr;
            } else {
                return false;
            }
        } catch (e) {
            const newToken = await checkToken(token);
            return newToken;
        }
    },
    verifyUser: async(token) => {
        try {
            const { usr_id } = await jwt.verify(token, 'clavesecretaparagenerartoken');
            const usr = await user.findOne({ 
                properties: ['user_id', 'username', 'last_name', 'email'],
                where: { user_id: usr_id } 
            });
            if (usr.length != 0) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
};