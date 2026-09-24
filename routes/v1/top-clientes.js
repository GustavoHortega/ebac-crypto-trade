const express = require('express');

const router = express.Router();

const { TopCliente } = require('../../models');

router.get('/:dia', async (req, res) => {
    const top = await TopCliente.aggregate([
        {
            $match: {
                "dia": { $eq: req.params.dia }
            }
        },
        {
            $facet: {
                "gainers": [
                    { $unwind: { path: "$gainers", preserveNullAndEmptyArrays: true } },
                    { $set: { "nomeEncontrado": { $regexFind: { input: "$gainers.usuario", regex: /nome: '([^']+)'/ } } } },
                    { $project: { "_id": 0, "nome": { $arrayElemAt: ["$nomeEncontrado.captures", 0] }, "variacao": "$gainers.variacao" } },
                    { $sort: { "variacao": -1 } }
                ],
                "loosers": [
                    { $unwind: { path: "$loosers", preserveNullAndEmptyArrays: true } },
                    { $set: { "nomeEncontrado": { $regexFind: { input: "$loosers.usuario", regex: /nome: '([^']+)'/ } } } },
                    { $project: { "_id": 0, "nome": { $arrayElemAt: ["$nomeEncontrado.captures", 0] }, "variacao": "$loosers.variacao" } },
                    { $sort: { "variacao": 1 } }
                ]
            }
        }
    ]);

    res.json({
        sucesso: true,
        dia: req.params.dia,
        top: top
    });
});

module.exports = router