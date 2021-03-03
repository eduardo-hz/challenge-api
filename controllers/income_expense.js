const { income_expense, category, user } = require('../models');
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

            if (!req.body.concept) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Concepto es requerido'
                });
            }
            if (!req.body.amount) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Monto es requerido'
                });
            }
            if (!req.body.date) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Fecha es requerido'
                });
            }
            if (!req.body.type) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Tipo es requerido'
                });
            }
            if (!req.body.category_id) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Categoría es requerido'
                });
            }

            const usr = await tokenService.getUserByToken(req.headers.Authorization);
            
            await income_expense.create({
                concept: req.body.concept, 
                amount: req.body.amount,
                date: req.body.date,
                type: req.body.type,
                category_id: req.body.category_id,
                user_id: usr.user_id
            });

            return res.status(200).json({
                ok: true,
                message: 'El registro se guardó correctamente',
                data: {
                    concept: req.body.concept,
                    amount: req.body.amount,
                    date: req.body.date,
                    type: req.body.type,
                    category_id: req.body.category_id,
                    user_id: usr.user_id
                }
            });
        } catch (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al guardar el registro',
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

            const usr = await tokenService.getUserByToken(req.headers.Authorization);
            let income_expenses;

            if (req.body.category_id == 0) {
                income_expenses = await income_expense.findAndCountAll({
                    attributes: [
                        'income_expense_id', 
                        'concept', 
                        'amount', 
                        'date', 
                        'type'
                    ],
                    where: {
                        [Op.and]: [
                            { user_id: usr.user_id },
                            { category_id: req.body.category_id }
                        ]
                    },
                    order: ['date', 'DESC'],
                    include: [
                        { model: category, as: 'category', required: true },
                        { model: user, as: 'user', required: true }
                    ],
                    limit: 10
                });
            } else {
                income_expenses = await income_expense.findAndCountAll({
                    attributes: [
                        'income_expense_id', 
                        'concept', 
                        'amount', 
                        'date', 
                        'type'
                    ],
                    where: {
                        user_id: {
                            [Op.eq]: usr.user_id
                        }
                    },
                    order: ['date', 'DESC'],
                    include: [
                        { model: category, as: 'category', required: true },
                        { model: user, as: 'user', required: true }
                    ],
                    limit: 10
                });
            }
            
            return res.status(200).json({
                ok: true,
                message: 'Listado de últimas operaciones',
                data: income_expenses
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                message: 'Error al consultar los registros',
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
            
            if (!req.body.income_expense_id) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Id es requerido'
                });
            }
            if (!req.body.concept) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Concepto es requerido'
                });
            }
            if (!req.body.amount) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Monto es requerido'
                });
            }
            if (!req.body.date) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Fecha es requerido'
                });
            }
            if (!req.body.type) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Tipo es requerido'
                });
            }
            if (!req.body.category_id) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Categoría es requerido'
                });
            }

            const usr = await tokenService.getUserByToken(req.headers.Authorization);

            await income_expense.update({
                concept: req.body.concept, 
                amount: req.body.amount,
                date: req.body.date,
                type: req.body.type,
                category_id: req.body.category_id,
                user_id: usr.user_id
            }, { 
                where: { 
                    income_expense_id: req.body.income_expense_id 
                }});
            
            return res.status(200).json({
                ok: true,
                message: 'Se actualizó la información del registro',
                data: {
                    income_expense_id: req.body.income_expense_id,
                    concept: req.body.concept, 
                    amount: req.body.amount,
                    date: req.body.date,
                    type: req.body.type,
                    category_id: req.body.category_id,
                    user_id: usr.user_id
                }
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error al actualizar el registro',
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

            if (!req.body.income_expense_id) {
                return res.status(400).json({
                    ok: false,
                    message: 'El parámetro Id es requerido'
                });
            }

            const inc_exp = await income_expense.findAll({ 
                attributes: ['income_expense_id', 'concept', 'amount', 'date', 'type'],
                where: { 
                    income_expense_id: {
                        [Op.eq]: req.body.income_expense_id
                    }
                }
            });

            if(!inc_exp.length){
                return res.status(404).json({
                    ok: false,
                    message: 'Error: El registro no existe en la base de datos'
                });
            }

            const valido = await tokenService.verifyUser(req.headers.Authorization);
            if(!valido){
                return res.status(401).json({
                    ok: false,
                    message: 'Operación no válida. No cuenta con el permiso para ejecutar esta acción'
                });
            }

            await income_expense.destroy({
                where: {
                    income_expense_id: req.body.income_expense_id
                }
            });

            return res.status(200).json({
                ok: true,
                message: 'Se eliminó el registro correctamente'
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar el registro',
                error: err.errors
            });
        }
    }
};