import * as Yup from 'yup';
import { isBefore, format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import Schedule from '../models/Schedule';

const AppointmentController = {
  async store(req, res) {
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

      try {
        await schema.validate(req.body, { abortEarly: false });
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

      const { name, cpf, date, email, phone } = req.body;

      const parsedDate = parseISO(date);

      const user = await User.findOne({ where: { cpf } });

      // Create if user not exists
      if (!user) {
        User.create(req.body);
      }

      // Check if user needs to update
      if (user && user.name !== name) {
        user.update({ name });
      }
      if (user && user.phone !== phone) {
        user.update({ phone });
      }
      if (user && user.email !== email) {
        user.update({ email });
      }

      // Check if is past date
      if (isBefore(parsedDate, new Date())) {
        return res
          .status(400)
          .json({ error: 'Não é permitido agendar para uma data passada.' });
      }

      // Check if hour is valid
      let schedules = await Schedule.findAll();
      schedules = schedules.map((s) => s.schedule);

      const hour = format(parsedDate, 'HH:mm', { locale: pt });

      if (!schedules.includes(hour)) {
        return res.status(400).json({ error: 'Horário inválido.' });
      }

      // Check availability
      const sameTime = await Appointment.findAll({
        where: { date: parsedDate, canceledAt: null },
      });
      // Only four appointments are available per hour
      if (sameTime > 3) {
        return res.status(400).json({ error: 'Horário indisponível.' });
      }

      await Appointment.create(req.body);

      return res
        .status(201)
        .json({ date: format(parsedDate, 'dd/MM', { locale: pt }), hour });
    } catch (err) {
      return res.status(500).json({
        error: 'Ocorreu um erro, aguarde um momento e tente novamente.',
      });
    }
  },

  async index(_, res) {
    const appointments = await Appointment.findAll({
      where: { canceled_at: null, concluded_by: null },
      order: ['date'],
      attributes: ['id', 'cpf', 'services', 'docNumber', 'date'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'phone', 'email'],
        },
      ],
    });

    const formattedAppointmets = appointments.map((a) => {
      return {
        ...a.dataValues,
        date: format(a.date, 'dd/MM/yyyy', { locale: pt }),
        hour: format(a.date, 'HH:mm', { locale: pt }),
      };
    });

    return res.json(formattedAppointmets);
  },
};

export default AppointmentController;
