/**
 * Created by Максим on 14.07.2018.
 */

var arrayNumbers = [],
    fieldWidth = 400,
    gameField,
    gameFieldSize,
    counters = 0,
    currentTime = 0,
    timerInterval,
    AIStep;

// основное тело игры
function game(e) {

    checkEmptyCell(e);
    checkWin();

}

// Генерация поля игры
function createField() {

    document.getElementById('counter').innerHTML = counters;
    document.getElementById('timer').innerHTML = currentTime;
    gameField = document.createElement('div');
    gameFieldSize = parseInt(gameSize.value);
    timer();

    let cell,
        cellWidth = fieldWidth/gameFieldSize;

    // создание игровой доски
    gameField.id = 'gameField';
    gameField.style = 'width: '+fieldWidth+'px; height: '+fieldWidth+'px;';
    document.getElementById('wrapper').appendChild(gameField);

    // создаём данные игрового поля
    for (let i = 0; i < Math.pow(gameFieldSize, 2); i++) {
        arrayNumbers.push(i);
    }

    // перемешиваем данные игрового поля
    arrayNumbers.sort(function() {
        return Math.random() - 0.5;
    });

    // заполняем игровую доску
    for (let i = 0;  i < arrayNumbers.length; i++){
        cell = document.createElement('div');
        cell.className = (arrayNumbers[i] == 0) ? 'cell empty' : 'cell';
        cell.setAttribute('data-number', arrayNumbers[i]);
        cell.setAttribute('onclick', 'game(this)');
        cell.style = 'width: '+cellWidth+'px; height: '+cellWidth+'px; line-height: '+cellWidth+'px';
        cell.innerHTML = arrayNumbers[i];
        document.getElementById('gameField').appendChild(cell);
    };

    // проверяем возможность сборки игрового поля
    checkAvailableWin(arrayNumbers);

};

//поиск пустых соседних клеток
function checkEmptyCell(e) {

    if (e.getAttribute('data-number') != 0) {

        let indexOfELement;

        // получаем индекс текущего элемента
        for (let i = 0; i < gameField.childNodes.length; i++) {
            if (gameField.children[i].getAttribute('data-number') == e.getAttribute('data-number')) indexOfELement = i;
        }

        // получаем ссылки на соседние элементы, проверяем чтобы соседние элементы существовали
        let topCell = (indexOfELement-gameFieldSize < 0) ? 1 : indexOfELement - gameFieldSize,
            rightCell = (indexOfELement+1 < Math.pow(gameFieldSize, 2)) ? indexOfELement+1 : false,
            botCell = (indexOfELement+gameFieldSize > Math.pow(gameFieldSize, 2)) ? 1 : indexOfELement + gameFieldSize,
            leftCell = (indexOfELement > 0) ? indexOfELement-1 : 0;

        // ищем пустую ячейку по близости и проверяем корректность свапа (нельзя из крайних ячеек)
        if (gameField.children[leftCell].getAttribute('data-number') == 0 &&
            (leftCell+1)%gameFieldSize != 0) swapCell(leftCell, indexOfELement);

        if (rightCell != false &&
            gameField.children[rightCell].getAttribute('data-number') == 0 &&
            rightCell%gameFieldSize != 0) swapCell(rightCell, indexOfELement);

        if (indexOfELement+gameFieldSize < Math.pow(gameFieldSize, 2) &&
            gameField.children[botCell].getAttribute('data-number') == 0 ) swapCell(botCell, indexOfELement);

        if (gameField.children[topCell].getAttribute('data-number') == 0 &&
            indexOfELement+gameFieldSize >= 0 ) swapCell(topCell, indexOfELement);

    };

};

// меняем местами ячейки
function swapCell(indexEmptyCell, indexCurrentCell) {

    // запоминаем ячейки
    let currentCellData = gameField.children[indexCurrentCell].getAttribute('data-number');

    // меняем местами ячейки
    gameField.children[indexEmptyCell].setAttribute('data-number', currentCellData);
    gameField.children[indexEmptyCell].classList.remove('empty');
    gameField.children[indexEmptyCell].innerHTML = '<span>'+currentCellData+'</span>';
    gameField.children[indexCurrentCell].setAttribute('data-number', 0);
    gameField.children[indexCurrentCell].classList.add('empty');
    gameField.children[indexCurrentCell].innerHTML = '0';
    clickCounter();

};

//проверяем в правильном ли порядке собраны ячейки
function checkWin() {
    
    let currentGame = [],
        sortedGame = [],
        win = false;

    for (let i = 0; i < gameField.childNodes.length; i++) {
        currentGame.push(gameField.children[i].getAttribute('data-number'));
        sortedGame.push(gameField.children[i].getAttribute('data-number'));
    };

    sortedGame.sort(arraySorting);
    sortedGame.splice(0,1);
    sortedGame.push('0');

    // сравниваем массивы для определения победы
    for (let i = 0; i < sortedGame.length; i++) {
        if (sortedGame[i] == currentGame[i]) {
            win = true;
        } else {
            win = false;
            break;
        }
    }

    if (win) {
        console.log('u win!');
    }

}

// сортировка массива чисел
function arraySorting(a, b) {
    return a-b;
}

// ощищение игровой области, для начала новой игры и генерация нового поля
function newGame() {

    document.getElementById('gameField').remove();
    gameField = '';
    arrayNumbers = [];
    counters = 0;
    currentTime = 0;
    clearInterval(timerInterval);
    clearInterval(AIStep);
    createField();

}

// счетчик ходов
function clickCounter() {
    counters++;
    document.getElementById('counter').innerHTML = counters;
}

// счётчик времени
function timer() {
    timerInterval = setInterval(function() {
            currentTime++;
            document.getElementById('timer').innerHTML = currentTime;
        },
        1000
    );

    timerInterval;
}

// проверка возможности сбора данной игры
function checkAvailableWin(checkedArray) {

    let inversions = 0,
        counterEven = 1,
        numOfEmptyRow,
        availableWin;

    // считаем количество инверсий и находим строку с пустым полем
    for (let i = 0; i < checkedArray.length; i++) {

        for (let j = i+1; j < checkedArray.length; j++) {
            if ((checkedArray[i] > checkedArray[j]) && checkedArray[i] != 0 && checkedArray[j] != 0) inversions++;
        }

        // проверяем в какой строке находится пустая ячейка
        // для поля с четной шириной пустая ячейка должна быть в четной строке сверху, или не четной снизу
        if (i%gameFieldSize == 0 && i != 0) counterEven++;
        if (checkedArray[i] == 0) {
            numOfEmptyRow = counterEven;
            availableWin = (numOfEmptyRow%2 == 0) ? true : false;
        }

    }
    
    // проверяем возможно ли разложить данный пазл
    if (((gameFieldSize%2 == 1) && inversions%2 == 0) || ((gameFieldSize%2 == 0) && inversions%2 == 0 && availableWin)) {
        console.log('игра имеет решение');
        console.log(checkedArray);
    } else {
        console.log('игра не имеет решения');
        newGame();
    }

}

createField();

