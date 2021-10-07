import * as Yup from 'yup';
import { cpfRegex, invalidCPFs } from './utils/cpf';
import { phoneRegex } from './utils/phone';

const servicesRequireDocNumber = [
  'Retirada de exigências',
  'Retorno de exigências',
  'Retirada de guia pronta',
  'Retirada de pedido de certidão concluído',
];

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    cpf: Yup.string()
      .required('Insira um CPF')
      .test('invalid-cpf', 'CPF Inválido', value => {
        // Test if CPF is in the array of invalids CPFs
        return invalidCPFs.findIndex(cpf => cpf === value) === -1;
      })
      .matches(cpfRegex, 'CPF inválido.'),
    name: Yup.string().trim().required('Insira seu nome'),
    phone: Yup.string()
      .trim()
      .required('Insira um telefone para contato')
      .min(10, 'Número de telefone inválido')
      .max(11, 'Número de telefone inválido')
      .matches(phoneRegex, 'Número de telefone inválido'),
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
          element => servicesRequireDocNumber.indexOf(element) > -1
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

  req.body = await schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  return next();
};
