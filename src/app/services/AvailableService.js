import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
  isWeekend,
  isSameDay,
} from 'date-fns';

import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import Schedule from '../models/Schedule';

class AvailableService {
  async run({ date }) {
    // Get all appointments for day in date
    const appointments = await Appointment.findAll({
      where: {
        canceledAt: null,
        date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });

    // Get all schedules that user can select
    let schedules = await Schedule.findAll({ order: [['schedule']] });
    schedules = schedules.map((s) => s.schedule);

    // Get all available schedules
    const available = schedules.map((time) => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(setMinutes(setHours(date, hour), minute), 0);

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          // The appointment can't be in the past
          isAfter(value, new Date()) &&
          // and can't be on weekends
          !isWeekend(value) &&
          // Block holiday
          !isSameDay(new Date(2021, 2, 19), value) &&
          // Only 4 appointments is available per schedule
          appointments.reduce(
            (n, val) => n + (format(val.date, 'HH:mm') === time),
            0
          ) < 4,
      };
    });

    return available;
  }
}

export default new AvailableService();
