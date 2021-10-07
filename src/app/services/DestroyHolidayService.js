import AppError from '../errors/AppError';
import Holiday from '../models/Holiday';

class DestroyHolidayService {
  async run({ holidayId }) {
    const holiday = await Holiday.findByPk(holidayId);

    if (!holiday) {
      throw new AppError(404, 'Feriado não encontrado');
    }

    await holiday.destroy();
  }
}

export default new DestroyHolidayService();
