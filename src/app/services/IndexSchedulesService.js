import Schedule from '../models/Schedule';

class IndexSchedulesService {
  async run() {
    const schedules = await Schedule.findAll({
      attributes: ['id', 'schedule'],
      order: [['schedule']],
    });

    return schedules;
  }
}

export default new IndexSchedulesService();
