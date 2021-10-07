import Holiday from '../models/Holiday';
import { formatDateToStringDate } from '../utils/date';

class IndexHolidaysService {
  async run() {
    const holidays = await Holiday.findAll({
      attributes: ['id', 'day'],
      order: [['day']],
    });

    holidays.forEach(holiday => {
      const date = formatDateToStringDate(holiday.day);

      holiday.setDataValue('date', date);
      holiday.setDataValue('day', undefined);
    });

    return holidays;
  }
}

export default new IndexHolidaysService();
