import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = null;
let timerId = null;

const startButton = document.querySelector('[data-start]');
startButton.disabled = true;

const dateInput = document.querySelector('#datetime-picker');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if (selectedDates[0].getTime() <= new Date().getTime()) {
            iziToast.show({
                title: 'Error:',
                message: 'Please choose a date in the future',
                position: 'topRight',
                color: 'red'
            });
            userSelectedDate = null;
            startButton.disabled = true;
        } else {
            userSelectedDate = selectedDates[0];
            startButton.disabled = false;
        }
    }
};

flatpickr("#datetime-picker", options);

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
    daysEl.textContent = addLeadingZero(days); 
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}

startButton.addEventListener("click", () => {
    if (timerId) {
        clearInterval(timerId);
    }

    startButton.disabled = true;
    dateInput.disabled = true;

    timerId = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeLeft = userSelectedDate.getTime() - currentTime;
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            dateInput.disabled = false;
            return;
        }

        const timeComponents = convertMs(timeLeft);
        updateTimerDisplay(timeComponents);
    }, 1000);
});

function convertMs(ms) {

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);

    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
    return { days, hours, minutes, seconds };
}
console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

