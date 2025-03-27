const catchAsync = require('../utils/catchAsync');

exports.getTalhoes = catchAsync(async (req, res, next) => {
  const talhoes = [
    {
      code: 'A7X5B',
      fields: [
        {
          name: 'Área',
          value: 55,
        },
        {
          name: 'Clone',
          value: 'Sou o clone',
        },
        {
          name: 'Regional',
          value: 'Sul de Minas',
        },
        {
          name: 'Data de plantio',
          value: Date.now(),
        },
        {
          name: 'Idade real',
          value: 22,
        },
        {
          name: 'Rotação',
          value: 'espiral',
        },
        {
          name: 'Uper Destino',
          value: 'Perdizes',
        },
        {
          name: 'Volume da madeira',
          value: 332,
        },
        {
          name: 'Idade',
          value: 25,
        },
      ],
    },
    {
      code: 'A7X5C',
      fields: [
        {
          name: 'Área',
          value: 55,
        },
        {
          name: 'Clone',
          value: 'Sou o clone',
        },
        {
          name: 'Regional',
          value: 'Sul de Minas',
        },
        {
          name: 'Data de plantio',
          value: Date.now(),
        },
        {
          name: 'Idade real',
          value: 22,
        },
        {
          name: 'Rotação',
          value: 'espiral',
        },
        {
          name: 'Uper Destino',
          value: 'Perdizes',
        },
        {
          name: 'Volume da madeira',
          value: 332,
        },
        {
          name: 'Idade',
          value: 25,
        },
      ],
    },
    {
      code: 'A7X5D',
      fields: [
        {
          name: 'Área',
          value: 55,
        },
        {
          name: 'Clone',
          value: 'Sou o clone',
        },
        {
          name: 'Regional',
          value: 'Sul de Minas',
        },
        {
          name: 'Data de plantio',
          value: Date.now(),
        },
        {
          name: 'Idade real',
          value: 22,
        },
        {
          name: 'Rotação',
          value: 'espiral',
        },
        {
          name: 'Uper Destino',
          value: 'Perdizes',
        },
        {
          name: 'Volume da madeira',
          value: 332,
        },
        {
          name: 'Idade',
          value: 25,
        },
      ],
    },
    {
      code: 'A7X5E',
      fields: [
        {
          name: 'Área',
          value: 55,
        },
        {
          name: 'Clone',
          value: 'Sou o clone',
        },
        {
          name: 'Regional',
          value: 'Sul de Minas',
        },
        {
          name: 'Data de plantio',
          value: Date.now(),
        },
        {
          name: 'Idade real',
          value: 22,
        },
        {
          name: 'Rotação',
          value: 'espiral',
        },
        {
          name: 'Uper Destino',
          value: 'Perdizes',
        },
        {
          name: 'Volume da madeira',
          value: 332,
        },
        {
          name: 'Idade',
          value: 25,
        },
      ],
    },
  ];

  res.status(200).json({
    status: 'success',
    data: {
      talhoes,
    },
  });
});
