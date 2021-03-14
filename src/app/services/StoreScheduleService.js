import Schedule from '../models/Schedule';

class StoreScheduleService {
  async run({ schedule }) {
    if (schedule.length > 5) {
      throw new Error('Horário inválido');
    }

    // Check for invalid minutes
    const [, minutes] = schedule.split(':');
    if (parseInt(minutes, 10) > 59) {
      throw new Error('Minutos não pode ser maior que 59');
    }

    const scheduleAlreadyExists = await Schedule.findOne({
      where: { schedule },
    });

    if (scheduleAlreadyExists) {
      throw new Error('Horário já cadastrado');
    }

    await Schedule.create({ schedule });
  }
}

export default new StoreScheduleService();
