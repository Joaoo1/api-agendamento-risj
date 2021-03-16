import { format } from 'date-fns';
import Holiday from '../models/Holiday';

class ListHolidayService {
  async run() {
    let holidays = await Holiday.findAll({ order: [['day']] });

    holidays = holidays.map((h) => ({
      id: h.id,
      date: format(h.day, 'dd/MM/yyyy'),
    }));

    return holidays;
  }
}

export default new ListHolidayService();
