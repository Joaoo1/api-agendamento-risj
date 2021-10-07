import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

const getDateAndHourFromDatetime = date => {
  return {
    date: format(date, 'dd/MM', { locale: pt }),
    hour: format(date, 'HH:mm', { locale: pt }),
  };
};

const formatDatetoStringDatetime = date => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: pt });
};

const formatDateToStringDate = date => {
  return format(date, 'dd/MM/yyyy');
};

export {
  getDateAndHourFromDatetime,
  formatDatetoStringDatetime,
  formatDateToStringDate,
};
