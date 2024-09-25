function startRace() {
    let bus1 = document.getElementById('bus1');
    let bus2 = document.getElementById('bus2');

    let bus1Position = 0;
    let bus2Position = 0;

    let bus1Speed =  1 * 2; // Velocidad aleatoria para el bus del Barcelona
    let bus2Speed =  1 * 2; // Velocidad aleatoria para el bus del Real Madrid

    let raceInterval = setInterval(function() {
        // Mover los buses
        if (bus1Position < 80 && bus2Position < 80) {
            bus1Position += bus1Speed;
            bus2Position += bus2Speed;

            bus1.style.left = bus1Position + '%';
            bus2.style.left = bus2Position + '%';
        } else {
            clearInterval(raceInterval);
            declareWinner(bus1Position, bus2Position);
        }
    }, 100);
}

function declareWinner(pos1, pos2) {
    if (pos1 > pos2) {
        alert('¡El Bus del Barcelona ha ganado!');
    } else if (pos2 > pos1) {
        alert('¡El Bus del Real Madrid ha ganado!');
    } else {
        alert('¡Es un empate!');
    }
}
