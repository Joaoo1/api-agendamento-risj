import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Sentry from '@sentry/node';

import Mail from '../../lib/Mail';

const SuccessAppointmentMail = {
  key: 'SuccessAppointmentMail',

  handle: async ({ data }) => {
    try {
      const { user, date } = data;
      await Mail.sendMail({
        to: `${user.name} <${user.email}>`,
        subject: 'Agendamento concluído',
        template: 'successAppointment',
        context: {
          user: user.name,
          date: format(parseISO(date), "'dia' dd 'de' MMMM', às' HH:mm'h'", {
            locale: pt,
          }),
        },
      });
    } catch (err) {
      Sentry.captureException(err);
    }
  },
};

export default SuccessAppointmentMail;
