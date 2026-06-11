const timeFormat = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const minutesRemainder = minutes % 60;
  return `${hours}hr ${minutesRemainder}min`;
};

export default timeFormat;
