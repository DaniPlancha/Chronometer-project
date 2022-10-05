function RefreshingTimerValuesUpdatesUI(timerValues, chronometerId) {

    let minutesElement = document.querySelector(`#minutes${chronometerId}`);
    let secondsElement = document.querySelector(`#seconds${chronometerId}`);
    let milisecondsElement = document.querySelector(`#miliseconds${chronometerId}`);

    minutesElement.innerText = String(timerValues.minutes).padStart(2, '0');
    secondsElement.innerText = String(timerValues.seconds).padStart(2, '0');
    milisecondsElement.innerText = String(timerValues.secondTenths);
}

function DecideMainButtonState(chronometerId, isRunning) {

    let startStopButton = document.querySelector(`#main-button-id${chronometerId}`);

    if (isRunning) {
        startStopButton.classList.remove('start-button');
        startStopButton.classList.add('stop-button');
    } else {
        startStopButton.classList.remove('stop-button');
        startStopButton.classList.add('start-button');
    }
}

function AddChronometerUI(chronometer) {
    var div = document.createElement('div');
    div.setAttribute('id', `wrap${chronometer.id}`);
    div.setAttribute('class', `all-timer-info-wrap`);

    div.innerHTML = `<p id="timer-info-paragraph${chronometer.id}">
                <span id="minutes${chronometer.id}">${String(chronometer.timer.minutes).padStart(2, '0')}</span> :
                <span id="seconds${chronometer.id}">${String(chronometer.timer.seconds).padStart(2, '0')}</span> :
                <span id="miliseconds${chronometer.id}">${String(chronometer.timer.milliseconds)}</span>
            </p>
            <button id="main-button-id${chronometer.id}" data-cid=${chronometer.id} class="start-button" onclick="UpdateBackendChronometer(this)"></button>
            <button id="reset-button-id${chronometer.id}" data-cid=${chronometer.id} class="reset-button" onclick="ResetChronometer(this)">Reset</button>
            <button id="remove-button-id${chronometer.id}" data-cid=${chronometer.id} class="remove-button" onclick="RequestRemoveChronometer(this)">Remove</button>
        `;

    document.querySelector('.mega-wrap').appendChild(div);
}

function AddChronometerLogic(chronometer) {
    var eTimer = new easytimer.Timer({
        startValues: {
            minutes: chronometer.timer.minutes,
            seconds: chronometer.timer.seconds,
            secondTenths: chronometer.timer.milliseconds
        }
    });

    chronometersDictionary[chronometer.id] = eTimer;

    RefreshChronometerValues(chronometersDictionary[chronometer.id], chronometer.id);

    if (chronometer.isRunning) {
        chronometersDictionary[chronometer.id].start({
            precision: 'secondTenths'
        });
        let element = document.querySelector(`#main-button-id${chronometer.id}`);
        element.classList.remove('start-button');
        element.classList.add('stop-button');
    }
}

function RemoveChronometerUI(id) {
    document.querySelector(`#remove-button-id${id}`).parentNode.remove();
}

function RemoveChronometerLogic(id) {
    chronometersDictionary[id].stop();
    delete chronometersDictionary[id];
}


function UpdateChronometerTimerState(chronometerModel) {
    let timer = chronometersDictionary[chronometerModel.id];
    if (chronometerModel.isRunning) {

        timer.start({
            precision: 'secondTenths',
            startValues: {
                minutes: chronometerModel.timer.minutes,
                seconds: chronometerModel.timer.seconds,
                secondTenths: chronometerModel.timer.milliseconds
            }
        });

    } else {

        if (chronometerModel.timer.minutes == 0 && chronometerModel.timer.seconds == 0 && chronometerModel.timer.milliseconds == 0) {

            timer.reset();
            timer.stop();
        } else {
            timer.pause();
        }
    }
}