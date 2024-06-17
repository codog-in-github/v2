import moment from 'moment';

export function formatDatetime(_, __, datetime) {
  if(!datetime) return '';
  return moment(datetime).format('YYYY-MM-DD HH:mm');
}
export function formatDate(_, __, date) {
  if(!date) return '';
  return moment(date).format('YYYY-MM-DD');
}
