import IndexHolidaysService from '../services/IndexHolidaysService';
import StoreHolidayService from '../services/StoreHolidayService';
import DestroyHolidayService from '../services/DestroyHolidayService';

const HolidayController = {
  async index(req, res) {
    const holidays = await IndexHolidaysService.run();
    return res.status(200).json(holidays);
  },

  async store(req, res) {
    await StoreHolidayService.run({ date: req.body.date });
    return res.status(201).json();
  },

  async destroy(req, res) {
    await DestroyHolidayService.run({ holidayId: req.params.holidayId });
    return res.status(204).json();
  },
};

export default HolidayController;
