import AppError from '../errors/AppError';
import Schedule from '../models/Schedule';

class StoreScheduleService {
  async run({ schedule }) {
    // Check for invalid minutes
    const [, minutes] = schedule.split(':');
    if (parseInt(minutes, 10) > 59) {
      throw new AppError(400, 'Minutos não pode ser maior que 59');
    }

    const scheduleAlreadyExists = await Schedule.findOne({
      where: { schedule },
    });

    if (scheduleAlreadyExists) {
      throw new AppError(409, 'Horário já cadastrado');
    }

    await Schedule.create({ schedule });
  }
}

export default new StoreScheduleService();
