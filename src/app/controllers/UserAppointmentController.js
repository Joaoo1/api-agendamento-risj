import * as Yup from 'yup';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';

const UserAppointmentController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      cpf: Yup.string()
        .required('Insira um CPF;')
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido;' }),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const appointments = await Appointment.findAll({
      where: { cpf: req.params.cpf },
      order: [
        ['canceled_at', 'DESC'],
        ['date', 'DESC'],
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

      const { id, cpf, date } = a;

      return {
        id,
        cpf,
        status,
        date: format(date, 'dd/MM/yyyy', { locale: pt }),
        hour: format(date, 'HH:mm', { locale: pt }),
      };
    });

    return res.json(formattedAppointmets);
  },

  // Cancel the appointmnent
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

    if (appointment.canceledAt) {
      return res
        .status(400)
        .json({ error: 'Este agendamento já foi cancelado.' });
    }

    if (appointment.conclude) {
      return res
        .status(400)
        .json({ error: 'Este agendamento já foi concluído.' });
    }

    await appointment.update({ canceledAt: Date() });

    return res.status(200).json();
  },
};

export default UserAppointmentController;
