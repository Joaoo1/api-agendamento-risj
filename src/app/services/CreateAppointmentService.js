import { isBefore, format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Schedule from '../models/Schedule';
import User from '../models/User';
import Queue from '../../lib/Queue';
import SuccessAppointmentMail from '../jobs/SuccessAppointmentMail';
import Appointment from '../models/Appointment';

class CreateAppointmentService {
  async run({ name, cpf, date, email, phone, docNumber, services }) {
    const parsedDate = parseISO(date);

    const user = await User.findOne({ where: { cpf } });

    // Create if user not exists
    if (!user) {
      User.create({ name, email, phone, cpf });
    } else {
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
    }

    // Check if is past date
    if (isBefore(parsedDate, new Date())) {
      throw new Error('Não é permitido agendar para uma data passada.');
    }

    // Check if hour is valid
    let schedules = await Schedule.findAll();
    schedules = schedules.map((s) => s.schedule);

    const hour = format(parsedDate, 'HH:mm', { locale: pt });

    if (!schedules.includes(hour)) {
      throw new Error('Horário inválido.');
    }

    /*
     * Check availability
     * Because only four appointments are available per hour
     */
    const sameTime = await Appointment.findAll({
      where: {
        canceledAt: null,
        date: parsedDate,
      },
    });

    if (sameTime.length > 3) {
      throw new Error('Horário indisponível.');
    }

    const appointment = await Appointment.create({
      cpf,
      date: parsedDate,
      docNumber,
      services,
    });

    // Send email to user
    await Queue.add(SuccessAppointmentMail.key, {
      user,
      date,
    });

    return appointment.date;
  }
}

export default new CreateAppointmentService();
