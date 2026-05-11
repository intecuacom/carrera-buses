let raceInterval = null;
let countdownInterval = null;

let selectedDistance = 100;
const finishLinePercent = 78;

function randomStep() {
    let speed = Math.random() * 5 + 2;

    if (Math.random() < 0.18) {
        speed += Math.random() * 4;
    }

    return speed;
}

function setWinner(message, cssClass, winnerElement, startBtn) {
    winnerElement.className = 'winner-board';
    winnerElement.classList.add(cssClass);
    winnerElement.textContent = message;

    if (startBtn) {
        startBtn.disabled = false;
    }

    setDistanceButtonsDisabled(false);
}

function getRaceWinner(start1, step1, start2, step2, goal) {
    const t1 = (goal - start1) / step1;
    const t2 = (goal - start2) / step2;

    if (Math.abs(t1 - t2) < 1e-9) {
        return Math.random() < 0.5 ? 'barcelona' : 'madrid';
    }

    return t1 < t2 ? 'barcelona' : 'madrid';
}

function updateMeters(bus1Meters, bus2Meters) {
    const meterBus1 = document.getElementById('meterBus1');
    const meterBus2 = document.getElementById('meterBus2');

    if (meterBus1) {
        meterBus1.textContent = `${Math.round(bus1Meters)} m`;
    }

    if (meterBus2) {
        meterBus2.textContent = `${Math.round(bus2Meters)} m`;
    }
}

function updateBusPosition(busElement, metersTravelled) {
    const progress = (metersTravelled / selectedDistance) * finishLinePercent;
    busElement.style.left = `${Math.min(progress, finishLinePercent)}%`;
}

function updateDistanceMarks() {
    const quarter = document.getElementById('markQuarter');
    const half = document.getElementById('markHalf');
    const threeQuarter = document.getElementById('markThreeQuarter');
    const finish = document.getElementById('markFinish');
    const distanceLabel = document.getElementById('distanceLabel');

    if (quarter) {
        quarter.textContent = `${Math.round(selectedDistance * 0.25)} m`;
    }

    if (half) {
        half.textContent = `${Math.round(selectedDistance * 0.5)} m`;
    }

    if (threeQuarter) {
        threeQuarter.textContent = `${Math.round(selectedDistance * 0.75)} m`;
    }

    if (finish) {
        finish.textContent = `${selectedDistance} m`;
    }

    if (distanceLabel) {
        distanceLabel.textContent = `Distancia actual: ${selectedDistance} m`;
    }
}

function setDistanceButtonsDisabled(disabled) {
    document.querySelectorAll('.distance-btn').forEach(function (button) {
        button.disabled = disabled;
    });
}

function bindDistanceButtons() {
    const buttons = document.querySelectorAll('.distance-btn');

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            selectedDistance = Number(button.dataset.distance);

            buttons.forEach(function (item) {
                item.classList.remove('active');
            });

            button.classList.add('active');
            updateDistanceMarks();
            updateMeters(0, 0);

            const bus1 = document.getElementById('bus1');
            const bus2 = document.getElementById('bus2');

            if (bus1 && bus2) {
                updateBusPosition(bus1, 0);
                updateBusPosition(bus2, 0);
            }
        });
    });
}

function startRace() {
    const bus1 = document.getElementById('bus1');
    const bus2 = document.getElementById('bus2');
    const startBtn = document.getElementById('startBtn');
    const winner = document.getElementById('winner');

    if (!bus1 || !bus2 || !winner) {
        return;
    }

    let bus1Meters = 0;
    let bus2Meters = 0;

    clearInterval(raceInterval);
    clearInterval(countdownInterval);

    updateBusPosition(bus1, 0);
    updateBusPosition(bus2, 0);
    winner.className = 'winner-board';
    winner.textContent = '3';
    updateMeters(0, 0);

    if (startBtn) {
        startBtn.disabled = true;
    }

    setDistanceButtonsDisabled(true);

    let count = 3;

    countdownInterval = setInterval(function () {
        count -= 1;

        if (count > 0) {
            winner.textContent = String(count);
            return;
        }

        if (count === 0) {
            winner.textContent = 'YA';
            return;
        }

        clearInterval(countdownInterval);

        raceInterval = setInterval(function () {
            const current1 = bus1Meters;
            const current2 = bus2Meters;
            const step1 = randomStep();
            const step2 = randomStep();
            const next1 = current1 + step1;
            const next2 = current2 + step2;
            const bus1Finished = next1 >= selectedDistance;
            const bus2Finished = next2 >= selectedDistance;

            bus1Meters = Math.min(next1, selectedDistance);
            bus2Meters = Math.min(next2, selectedDistance);

            updateBusPosition(bus1, bus1Meters);
            updateBusPosition(bus2, bus2Meters);
            updateMeters(bus1Meters, bus2Meters);

            if (!bus1Finished && !bus2Finished) {
                return;
            }

            clearInterval(raceInterval);

            let winnerId;

            if (bus1Finished && bus2Finished) {
                winnerId = getRaceWinner(current1, step1, current2, step2, selectedDistance);
            } else if (bus1Finished) {
                winnerId = 'barcelona';
            } else {
                winnerId = 'madrid';
            }

            if (winnerId === 'barcelona') {
                setWinner(`Gano el Bus del Barcelona en ${selectedDistance} m`, 'winner-barcelona', winner, startBtn);
            } else {
                setWinner(`Gano el Bus del Real Madrid en ${selectedDistance} m`, 'winner-madrid', winner, startBtn);
            }
        }, 100);
    }, 850);
}

bindDistanceButtons();
updateDistanceMarks();
updateMeters(0, 0);
