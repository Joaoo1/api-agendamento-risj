import Holiday from '../models/Holiday';
import ListHolidaysService from '../services/ListHolidaysService';
import StoreHolidayService from '../services/StoreHolidayService';

const HolidayController = {
  async index(_, res) {
    const holidays = await ListHolidaysService.run();

    return res.json(holidays);
  },

  async store(req, res) {
    try {
      await StoreHolidayService.run({ date: req.body.date });
      return res.status(201).json({});
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await (await Holiday.findByPk(req.params.id)).destroy();

      return res.status(204).json();
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Ocorreu um erro ao excluir a data' });
    }
  },
};

export default HolidayController;
