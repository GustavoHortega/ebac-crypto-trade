const express = require('express');

const router = express.Router();

const { buscaTopClientes } = require('../../services');

router.get('/:dia', async (req, res) => {
    const dia = req.params.dia;
    const top = await buscaTopClientes(dia);

    res.json({
        sucesso: true,
        dia: dia,
        top: top
    });
});

module.exports = router;