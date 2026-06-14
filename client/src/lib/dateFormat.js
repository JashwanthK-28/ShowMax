const dateFormat = (dateTime) => {
  return new Date(dateTime).toLocaleString("en-US", {
    weekday: "short",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
  });
};

export default dateFormat;
