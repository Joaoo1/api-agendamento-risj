import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

const CanceledppointmentCountController = {
  async show(_, res) {
    const count = await Appointment.count({
      where: { canceledAt: { [Op.not]: null } },
    });

    return res.json({ count, pages: Math.ceil(count / 40) });
  },
};

export default CanceledppointmentCountController;
