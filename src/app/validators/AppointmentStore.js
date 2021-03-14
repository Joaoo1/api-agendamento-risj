import * as Yup from 'yup';

const invalidCPFs = [
  '000.000.000-00',
  '111.111.111-11',
  '222.222.222-22',
  '333.333.333-33',
  '444.444.444-44',
  '555.555.555-55',
  '666.666.666-66',
  '777.777.777-77',
  '888.888.888-88',
  '999.999.999-99',
];

const servicesRequireDocNumber = [
  'Retirada de exigências',
  'Retorno de exigências',
  'Retirada de guia pronta',
  'Retirada de pedido de certidão concluído',
];

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      cpf: Yup.string()
        .required('Insira um CPF')
        // eslint-disable-next-line func-names
        .test('invalid-cpf', 'CPF Inválido', function (value) {
          // Test if CPF is in the array of invalids CPFs
          return invalidCPFs.findIndex((cpf) => cpf === value) === -1;
        })
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido' }),
      name: Yup.string().trim().required('Insira seu nome'),
      phone: Yup.string()
        .trim()
        .required('Insira um telefone para contato')
        .min(10, 'Número de telefone inválido')
        .max(11, 'Número de telefone inválido')
        // Test if phone is all the same digit
        .matches(/^([0-9])(?!\1+$)/, 'Número de telefone inválido'),
      email: Yup.string()
        .required('Insira um email')
        .email('Insira um email válido'),
      date: Yup.date().required('Selecione um dia e horário'),
      services: Yup.array().required(
        'Selecione pelo menos um tipo de atendimento'
      ),
      docNumber: Yup.string().when('services', (services, field) => {
        // Check if one of the selected services requires docNumber
        if (services) {
          const isRequired = services.find(
            (element) => servicesRequireDocNumber.indexOf(element) > -1
          );
          if (isRequired) {
            return field
              .trim()
              .required(
                'É necessário informar o número da guia/pedido de certidão'
              );
          }
        }

        return field;
      }),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    if (err.name === 'ValidationError') {
      // Filter error list to show just one error for each field
      const errorsPath = [];
      const errorList = err.inner.filter((e) => {
        const idx = errorsPath.findIndex((v) => v === e.path);
        if (idx === -1) {
          errorsPath.push(e.path);
          return true;
        }

        return false;
      });
      const errors = errorList.map((e1) => e1.errors[0]);
      return res.status(400).json({ errors });
    }

    return res.status(500).json({ error: err.message });
  }
};
