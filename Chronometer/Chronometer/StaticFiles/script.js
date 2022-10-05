var chronometersDictionary = {};


function RefreshChronometerValues(timer, chronometerId) {
    timer.addEventListener('secondTenthsUpdated', () => RefreshingTimerValuesUpdatesUI(timer.getTimeValues(), chronometerId));
}


function UpdateChronometerState(chronometerModel) {

    DecideMainButtonState(chronometerModel.id, chronometerModel.isRunning);
    RefreshingTimerValuesUpdatesUI({ minutes: chronometerModel.timer.minutes, seconds: chronometerModel.timer.seconds, secondTenths: chronometerModel.timer.milliseconds}, chronometerModel.id)
    UpdateChronometerTimerState(chronometerModel);
}


async function UpdateBackendChronometer(StartStopElement) {

    let currentIdNum = StartStopElement.dataset.cid;
    let timer = chronometersDictionary[currentIdNum];
    let running;

    if (StartStopElement.className == 'start-button') {
        running = true;
    } else if (StartStopElement.className == 'stop-button') {
        running = false;
    }

    let chronometerModel = {
        ID: currentIdNum,
        Timer: {
            minutes: timer.getTimeValues().minutes,
            seconds: timer.getTimeValues().seconds,
            milliseconds: timer.getTimeValues().secondTenths
        },
        IsRunning: running
    }

    await fetch(route + '/' + currentIdNum, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(chronometerModel)
    });
}


async function ResetChronometer(ResetChronometerElement) {

    let currentIdNum = ResetChronometerElement.dataset.cid;

    let chronometerModel = {
        ID: currentIdNum,
        Timer: {
            minutes: 0,
            seconds: 0,
            milliseconds: 0
        },
        IsRunning: false
    }

    await fetch(route + '/' + currentIdNum, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(chronometerModel)
    });
}


async function RequestCreateChronometer() {
    await fetch(route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
function AddChronometer(chronometer) {
    AddChronometerUI(chronometer);
    AddChronometerLogic(chronometer);
}


async function RequestRemoveChronometer(RemoveChronometerElement) {
    await fetch(route + '/' + RemoveChronometerElement.dataset.cid, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
function RemoveChronometer(chronometerId) {
    RemoveChronometerLogic(chronometerId);
    RemoveChronometerUI(chronometerId);
}


window.onload = async function GetChronometers() {
    let chronometerData = await fetch(route, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let data = await chronometerData.json();

    data.forEach((x) => {
        AddChronometer(x);
    });
}