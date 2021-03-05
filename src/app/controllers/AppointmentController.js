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
};

export default AppointmentController;
