import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

const ConcludedppointmentCountController = {
  async show(_, res) {
    const count = await Appointment.count({
      where: { concluded_by: { [Op.not]: null } },
    });

    return res.json({ count, pages: Math.ceil(count / 40) });
  },
};

export default ConcludedppointmentCountController;
