import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form")

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const shouldResolve = form.elements.state.value === 'fulfilled';
    const delay = Number(form.elements.delay.value);
    
    if (delay <= 0) {
        iziToast.warning({
            message: "Please enter a positive delay value",
            position: 'topRight'
        });
        return;
    }
    
    makePromise(delay, shouldResolve)
        .then(delay => {
            iziToast.success({
                message: `✅ Fulfilled promise in ${delay}ms`,
                color: 'green',
                position: 'topRight',
                timeout: 2000
            });
        })
        
        .catch(delay => {
            iziToast.error({
                message: `❌ Rejected promise in ${delay}ms`,
                color: 'red',
                position: 'topRight',
                timeout: 4000
            });
        });
});


const makePromise = (delay, shouldResolve) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldResolve) {
                resolve(delay);
            } else {
                reject(delay);
            }
        },
            delay);
    });
};



