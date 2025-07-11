$(document).ready(function() {
    let gameData = [
        { id: 1, value: "😀", type: "emoji" },
        { id: 2, value: "Happy Face", type: "text" },
        { id: 3, value: "🐶", type: "emoji" },
        { id: 4, value: "Dog", type: "text" },
        { id: 5, value: "🍕", type: "emoji" },
        { id: 6, value: "Pizza", type: "text" }
    ];
    let shuffledData = [];
    let firstCard = null;
    let matches = 0;
    let timerInterval;
    let startTime;
    let topTimes = [];

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function renderBoard() {
        $('#gameBoard').empty();
        shuffledData = shuffle([...gameData]);
        shuffledData.forEach((item) => {
            $('#gameBoard').append(`<div class='card' data-id='${item.id}' data-type='${item.type}' data-value='${item.value}'>?</div>`);
        });
    }

    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            $('#timer').text("Time: " + elapsed + "s");
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        topTimes.push(totalTime);
        topTimes.sort((a, b) => a - b);
        topTimes = topTimes.slice(0, 5);
        $('#topTimes').html("Top Times:<br>" + topTimes.map((t, i) => (i + 1) + ". " + t + "s").join("<br>"));
    }

    function resetGame() {
        matches = 0;
        firstCard = null;
        $('#timer').text("Time: 0s");
        renderBoard();
        clearInterval(timerInterval);
        startTimer();
    }

    $('#startBtn').click(function() {
        const name = $('#username').val();
        if (name) {
            $('#welcome').text("Welcome, " + name + "!");
            resetGame();
        }
    });

    $('#resetBtn').click(function() {
        resetGame();
    });

    $('#gameBoard').on('click', '.card', function() {
        if ($(this).text() !== "?") return;

        $(this).text($(this).data('value'));
        if (!firstCard) {
            firstCard = $(this);
        } else {
            const secondCard = $(this);
            if (firstCard.data('id') !== secondCard.data('id') &&
                ((firstCard.data('type') === 'emoji' && secondCard.data('type') === 'text') ||
                (firstCard.data('type') === 'text' && secondCard.data('type') === 'emoji')) &&
                ((firstCard.data('value') === "😀" && secondCard.data('value') === "Happy Face") ||
                 (firstCard.data('value') === "Happy Face" && secondCard.data('value') === "😀") ||
                 (firstCard.data('value') === "🐶" && secondCard.data('value') === "Dog") ||
                 (firstCard.data('value') === "Dog" && secondCard.data('value') === "🐶") ||
                 (firstCard.data('value') === "🍕" && secondCard.data('value') === "Pizza") ||
                 (firstCard.data('value') === "Pizza" && secondCard.data('value') === "🍕"))) {

                matches += 1;
                firstCard = null;
                if (matches === 3) {
                    stopTimer();
                }
            } else {
                setTimeout(() => {
                    firstCard.text("?");
                    secondCard.text("?");
                    firstCard = null;
                }, 1000);
            }
        }
    });
});
