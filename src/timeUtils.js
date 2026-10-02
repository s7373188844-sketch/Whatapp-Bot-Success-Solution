const config = require('./config');

function isWithinWorkingHours() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000);

  const day = ist.getDay();
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const currentTime = hours * 60 + minutes;

  if (day === 0) {
    const [openH, openM] = config.workingHours.sunday.open.split(':').map(Number);
    const [closeH, closeM] = config.workingHours.sunday.close.split(':').map(Number);
    return currentTime >= openH * 60 + openM && currentTime < closeH * 60 + closeM;
  }

  const [openH, openM] = config.workingHours.weekday.open.split(':').map(Number);
  const [closeH, closeM] = config.workingHours.weekday.close.split(':').map(Number);
  return currentTime >= openH * 60 + openM && currentTime < closeH * 60 + closeM;
}

module.exports = { isWithinWorkingHours };
