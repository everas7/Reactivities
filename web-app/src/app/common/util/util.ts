export const combineDateAndTime = (date: Date, time: Date) => {
  const dateString = date.toISOString().split('T')[0];
  const timeString = date.toISOString().split('T')[1];
  return new Date(dateString + 'T' + timeString);
};