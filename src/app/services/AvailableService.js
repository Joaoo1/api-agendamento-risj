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
import Holiday from '../models/Holiday';
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

    const holidays = await Holiday.findAll();
    const isHoliday = holidays.find((holiday) => isSameDay(holiday.day, date));

    // The appointment can't be on holidays or weekends
    if (isHoliday || isWeekend(date)) {
      return schedules.map((time) => ({
        time,
        available: false,
      }));
    }

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
