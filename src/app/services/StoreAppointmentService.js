import { isBefore, format, parseISO, startOfDay, endOfDay } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { Op } from 'sequelize';
import Schedule from '../models/Schedule';
import Queue from '../../lib/Queue';
import SuccessAppointmentMail from '../jobs/SuccessAppointmentMail';
import Appointment from '../models/Appointment';
import StoreOrUpdateUserService from './StoreOrUpdateUserService';
import AppError from '../errors/AppError';

class StoreAppointmentService {
  async run({ name, cpf, date, email, phone, docNumber, services }) {
    const parsedDate = parseISO(date);

    await StoreOrUpdateUserService.run({ name, email, phone, cpf });

    const alreadyHaveOpenAppointment = await Appointment.findOne({
      where: {
        date: { [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)] },
        cpf,
        canceledAt: null,
        concludedBy: null,
      },
    });

    if (alreadyHaveOpenAppointment) {
      throw new AppError(
        409,
        'Você já possui um agendamento aberto para esse dia.'
      );
    }

    if (isBefore(parsedDate, new Date())) {
      throw new AppError(403, 'Não é permitido agendar para uma data passada.');
    }

    // Check if hour is valid
    let schedules = await Schedule.findAll();
    schedules = schedules.map(s => s.schedule);

    const hour = format(parsedDate, 'HH:mm', { locale: pt });

    if (!schedules.includes(hour)) {
      throw new AppError(400, 'Horário inválido.');
    }

    /*
     * Check availability
     * Because only four appointments are available per schedule
     */
    const sameTime = await Appointment.findAll({
      where: {
        canceledAt: null,
        date: parsedDate,
      },
    });

    if (sameTime.length > 3) {
      throw new AppError(403, 'Horário indisponível.');
    }

    const appointment = await Appointment.create({
      cpf,
      date: parsedDate,
      docNumber,
      services,
    });

    // Send email to user
    await Queue.add(SuccessAppointmentMail.key, {
      user: { name, email },
      date,
    });

    return appointment.date;
  }
}

export default new StoreAppointmentService();
