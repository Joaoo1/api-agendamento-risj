import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
  isWeekend,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import Schedule from '../models/Schedule';

const AvailableController = {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Data inválida.' });
    }

    // Get all appointments for the day in req.params.date
    const searchDate = Number(date);
    const appointments = await Appointment.findAll({
      where: {
        canceledAt: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    let schedules = await Schedule.findAll({ order: [['schedule']] });
    schedules = schedules.map((s) => s.schedule);

    // Get all available schedules
    const available = schedules.map((time) => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          // The appointment can't be in the past
          isAfter(value, new Date()) &&
          // and can't be on weekends
          !isWeekend(value) &&
          // Only 4 appointments is available per schedule
          appointments.reduce(
            (n, val) => n + (format(val.date, 'HH:mm') === time),
            0
          ) < 4,
      };
    });

    return res.json(available);
  },
};

export default AvailableController;
