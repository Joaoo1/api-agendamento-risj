import Schedule from '../models/Schedule';
import AppError from '../errors/AppError';

class DestroyScheduleService {
  async run({ scheduleId }) {
    console.log(scheduleId);
    const schedule = await Schedule.findByPk(scheduleId);

    if (!schedule) {
      throw new AppError(404, 'Horário não encontrado');
    }

    await schedule.destroy();
  }
}

export default new DestroyScheduleService();
