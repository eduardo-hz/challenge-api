const { category } = require('../models');
const { Op } = require('sequelize');
const tokenService = require('../services/token');

module.exports = {
    create: async(req, res) => {
        try {
            if(!req.headers.Authorization) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se detecta el Token en los encabezados.'
                });
            }
            if (!req.body.name) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Nombre es requerido'
                });
            }
            if (!req.body.description) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Descripción es requerido'
                });
            }

            const valid = await tokenService.verifyUser(req.headers.Authorization);
            
            if(valid) {
                return res.status(400).json({
                    ok: false,
                    message: 'Operación no válida. No cuenta con el permiso para ejecutar esta acción'
                });
            }
            
            await category.create({name: req.body.name, description: req.body.description});

            return res.status(200).json({
                ok: true,
                message: 'La categoría se guardó correctamente',
                data: {
                    name: req.body.name,
                    description: req.body.description
                }
            });
        } catch (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al guardar la categoría',
                error: err.errors
            });
        }
    },
    list: async(req, res) => {
        try {
            if(!req.headers.Authorization) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se detecta el Token en los encabezados.'
                });
            }
            
            const valid = await tokenService.verifyUser(req.headers.Authorization);
            
            if(valid) {
                return res.status(400).json({
                    ok: false,
                    message: 'Operación no válida. No cuenta con el permiso para ejecutar esta acción'
                });
            }

            const categories = await category.findAll({attributes: ['category_id', 'name', 'description']});
            
            return res.status(200).json({
                ok: true,
                message: 'Listado de categorías',
                data: categories
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error al consultar las categorías',
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
            
            if (!req.body.category_id) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Id es requerido'
                });
            }

            if (!req.body.name) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Nombre es requerido'
                });
            }
            if (!req.body.description) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Descripción es requerido'
                });
            }

            const valid = await tokenService.verifyUser(req.headers.Authorization);
            
            if(valid) {
                return res.status(400).json({
                    ok: false,
                    message: 'Operación no válida. No cuenta con el permiso para ejecutar esta acción'
                });
            }

            await category.update({name: req.body.name, description: req.body.description}, { where: { category_id: req.body.category_id }});
            
            return res.status(200).json({
                ok: true,
                message: 'Se actualizó la información de la categoría',
                data: {
                    id: req.body.category_id,
                    name: req.body.name,
                    description: req.body.description
                }
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error al actualizar la categoría',
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
            if (!req.body.category_id) {
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

            const cat = await category.findAll({ 
                attributes: ['category_id', 'name', 'description'],
                where: { 
                    category_id: {
                        [Op.eq]: req.body.category_id
                    }
                }
            });

            if(!cat.length){
                return res.status(404).json({
                    ok: false,
                    message: 'Error: La categoría no existe en la base de datos'
                });
            }

            await category.destroy({
                where: {
                    category_id: req.body.category_id
                }
            });

            return res.status(200).json({
                ok: true,
                message: 'Se eliminó el registro correctamente'
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar la categoría',
                error: err.errors
            });
        }
    }
};