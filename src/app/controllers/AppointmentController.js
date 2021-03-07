import * as Yup from 'yup';
import { isBefore, format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import Schedule from '../models/Schedule';

const AppointmentController = {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        cpf: Yup.string()
          .required('Insira um CPF')
          .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido' }),
        name: Yup.string().required('Insira seu nome'),
        phone: Yup.string(),
        email: Yup.string(),
        doc_number: Yup.string(),
        date: Yup.date().required('Selecione um dia e horário'),
      });

      try {
        await schema.validate(req.body, { abortEarly: false });
      } catch (err) {
        if (err.name === 'ValidationError') {
          return res.status(400).json({ errors: err.errors });
        }

        return res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
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
      const isNotAvailable = await Appointment.findOne({
        where: { date: parsedDate, canceledAt: null },
      });
      if (isNotAvailable) {
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

  async index(req, res) {
    const appointments = await Appointment.findAll({
      where: { canceled_at: null },
      order: [['conclude'], ['date', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'phone', 'email'],
        },
      ],
    });

    const formattedAppointmets = appointments.map((a) => {
      let status;
      if (a.canceledAt) {
        status = 'Cancelado';
      } else if (a.conclude) {
        status = 'Concluído';
      } else {
        status = 'Em aberto';
      }

      return {
        id: a.id,
        cpf: a.cpf,
        user: a.user,
        status,
        date: format(a.date, 'dd/MM/yyyy', { locale: pt }),
        hour: format(a.date, 'HH:mm', { locale: pt }),
      };
    });

    return res.json(formattedAppointmets);
  },

  // Conclude the appointment
  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(400).json({ error: 'Agendamento não existe.' });
    }

    if (appointment.conclude) {
      return res
        .status(400)
        .json({ error: 'Este agendamento já foi concluído.' });
    }

    if (appointment.canceledAt) {
      return res
        .status(400)
        .json({ error: 'Este agendamento esta cancelado.' });
    }

    await appointment.update({ conclude: true });

    return res.status(200).json();
  },
};

export default AppointmentController;
