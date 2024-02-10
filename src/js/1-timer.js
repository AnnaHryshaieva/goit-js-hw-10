import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const selector = document.querySelector('input[type="text"]');
const button = document.querySelector('button');
const daysData = document.querySelector('[data-days]');
const hoursData = document.querySelector('[data-hours]');
const minutesData = document.querySelector('[data-minutes]');
const secondsData = document.querySelector('[data-seconds]');

button.disabled = true;

let userSelectedDate;

const options = {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      button.disabled = true;
      iziToast.show({
        position: 'topRight',
        color: 'red',
        message: 'Please choose a date in the future',
      });
      return;
    }
    userSelectedDate = selectedDates[0];
    button.disabled = false;
  },
};

flatpickr(selector, options);

button.addEventListener('click', () => {
  timer.start();
});

class Timer {
  constructor(tick) {
    this.tick = tick;
    this.intervalId = null;
  }
  start() {
    this.intervalId = setInterval(() => {
      const diff = userSelectedDate - Date.now();

      if (Math.floor(diff / 1000) === 0) {
        this.stop();
      }
      const time = convertMs(diff);
      this.tick(time);
    }, 1000);
    button.disabled = true;
    selector.disabled = true;
  }
  stop() {
    clearInterval(this.intervalId);
  }
}

const timer = new Timer(OnTick);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function formatTime({ days, hours, minutes, seconds }) {
  days = days.toString().padStart(2, '0');
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');
  seconds = seconds.toString().padStart(2, '0');
  return { days, hours, minutes, seconds };
}

function OnTick(time) {
  const { days, hours, minutes, seconds } = formatTime(time);
  daysData.textContent = days;
  hoursData.textContent = hours;
  minutesData.textContent = minutes;
  secondsData.textContent = seconds;
}
