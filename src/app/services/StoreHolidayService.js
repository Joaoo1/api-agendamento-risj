import { endOfDay, startOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Holiday from '../models/Holiday';

class StoreHolidayService {
  async run({ date }) {
    const [day, month, year] = date.split('/');
    const parsedDate = new Date(year, month - 1, day);

    const holidayAlreadyExists = await Holiday.findOne({
      where: {
        day: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });

    if (holidayAlreadyExists) {
      throw new Error('Esta data já está cadastrada');
    }

    await Holiday.create({ day: parsedDate });
  }
}

export default new StoreHolidayService();
