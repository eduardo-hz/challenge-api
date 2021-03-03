const { user } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const tokenService = require('../services/token');

module.exports = {
    create: async(req, res) => {
        try {
            if (!req.body.username) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Nombre es requerido'
                });
            }
            if (!req.body.lastname) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Apellidos es requerido'
                });
            }
            if (!req.body.email) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Email es requerido'
                });
            }
            if (!req.body.password) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Contraseña es requerido'
                });
            }

            req.body.password = bcrypt.hashSync(req.body.password, 10);

            await user.create({
                username: req.body.username, 
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password
            });

            return res.status(200).json({
                ok: true,
                message: 'El usuario se guardó correctamente',
                data: {
                    username: req.body.username, 
                    lastname: req.body.lastname,
                    email: req.body.email
                }
            });
        } catch (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al guardar al usuario',
                error: err.errors
            });
        }
    },
    getUserInfo: async(req, res) => {
        try {
            if(!req.headers.Authorization) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se detecta el Token en los encabezados.'
                });
            }

            const usr = await tokenService.getUserByToken(req.headers.Authorization);

            return res.status(200).json({
                ok: true,
                message: 'Información del usuario',
                data: usr
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error al consultar la información del usuario',
                error: err.errors
            });
        }
    },
    update: async(req, res) => {
        try {
            if(!req.headers.Authorization) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se detecta el Token en los encabezados.'
                });
            }
            if (!req.body.user_id) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Id es requerido'
                });
            }
            if (!req.body.username) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Nombre es requerido'
                });
            }
            if (!req.body.lastname) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Apellidos es requerido'
                });
            }
            if (!req.body.email) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Email es requerido'
                });
            }
            if (!req.body.password) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Contraseña es requerido'
                });
            }

            const valid = await tokenService.verifyUser(req.headers.Authorization);
            
            if(valid) {
                return res.status(400).json({
                    ok: false,
                    message: 'Operación no válida. No cuenta con el permiso para ejecutar esta acción'
                });
            }
            
            const oldUser = await user.findAll({ where: { user_id: { [Op.eq]: req.body.user_id } } });

            if(req.body.password != oldUser.password) {
                req.body.password = bcrypt.hashSync(req.body.password, 10);
            }

            await user.update({
                username: req.body.username, 
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password
            }, { 
                where: { 
                    user_id: req.body.user_id
                }
            });
            
            return res.status(200).json({
                ok: true,
                message: 'Se actualizó la información del usuario',
                data: {
                    id: req.body.user_id,
                    username: req.body.username,
                    lastname: req.body.lastname,
                    email: req.body.email
                }
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error al actualizar al usuario',
                error: err.errors
            });
        }
    },
    delete: async(req, res) => {
        try {
            if(!req.headers.Authorization) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se detecta el Token en los encabezados.'
                });
            }
            if (!req.body.user_id) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Id es requerido'
                });
            }
            const valid = await tokenService.verifyUser(req.headers.Authorization);
            
            if(valid) {
                return res.status(400).json({
                    ok: false,
                    message: 'Operación no válida. No cuenta con el permiso para ejecutar esta acción'
                });
            }
            
            const usr = await tokenService.getUserByToken(req.headers.Authorization);

            if(!usr.length){
                return res.status(404).json({
                    ok: false,
                    message: 'Error: El usuario no existe en la base de datos'
                });
            }

            await user.destroy({
                where: {
                    user_id: req.body.user_id
                }
            });

            return res.status(200).json({
                ok: true,
                message: 'Se eliminó el registro correctamente'
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar al usuario',
                error: err.errors
            });
        }
    },
    login: async(req, res) => {
        try {
            if(!req.body.email){
                return res.status(400).json({
                    ok: false,
                    message: 'El campo de Correo es obligatorio'
                });
            }
            if(!req.body.password){
                return res.status(400).json({
                    ok: false,
                    message: 'El campo de Contraseña es obligatorio'
                });
            }

            const usr = await user.findOne({ 
                properties: ['user_id', 'username', 'last_name', 'email', 'password'],
                where: { email: req.body.email } 
            });

            if(usr) {
                const match = await bcrypt.compare(req.body.password, usr.password);
                if (match) {
                    const _token = await tokenService.encode(usr.user_id);
                    return res.status(200).json({
                        ok: true,
                        message: 'Solicitud procesada correctamente',
                        user: {
                            user_id: usr.user_id,
                            username: usr.username,
                            lastname: usr.lastname,
                            email: usr.email
                        },
                        token: _token
                    });
                } else {
                    return res.status(400).json({
                        ok: false,
                        message: 'La contraseña ingresada es incorrecta.'
                    });
                }
            } else {
                return res.status(400).json({
                    ok: false,
                    message: `No existe ningún usuario registrado con el Correo ${req.body.email}.`
                });
            }
        } catch (err) {
            return res.status(500).json({
                ok: true,
                message: 'Ocurrió un error al realizar la petición',
                error: err
            });
        }
    }
};