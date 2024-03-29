import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Sentry from '@sentry/node';

import Mail from '../../lib/Mail';

const CanceledAppointmentMail = {
  key: 'CanceledAppointmentMail',

  handle: async ({ data }) => {
    try {
      const { appointment } = data;
      await Mail.sendMail({
        to: `${appointment.user.name} <${appointment.user.email}>`,
        subject: 'Agendamento cancelado',
        template: 'canceledAppointment',
        context: {
          user: appointment.user.name,
          date: format(
            parseISO(appointment.date),
            "'dia' dd 'de' MMMM', às' HH:mm'h'",
            {
              locale: pt,
            }
          ),
        },
      });
    } catch (err) {
      Sentry.captureException(err);
    }
  },
};

export default CanceledAppointmentMail;
