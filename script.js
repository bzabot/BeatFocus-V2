// Selecting elements
const focusTimeEl = document.getElementById("focusTime");
const pauseTimeEl = document.getElementById("focusTime");
const sliderEl = document.querySelector(".slider-tooltip");
const btnPlayPause = document.querySelector(".btn-play-pause");
const timerValue = document.querySelector(".timer-txt");
const audioPlayer = document.getElementById("audioPlayer");
const pageTitle = document.querySelector("title");

// Variables
const lofiFolder = "sounds/lofi/";
const lofiArray = [
  "Above The Quiet City.mp3",
  "Abysses.mp3",
  "Affection.mp3",
  "As Days Go By.mp3",
  "be.mp3",
  "Bitterness And Secrecy.mp3",
  "Bluegrass.mp3",
  "Bright Lights.mp3",
  "Charms.mp3",
  "Coming Home.mp3",
  "Down The Port.mp3",
  "Feathers.mp3",
  "Flow.mp3",
  "Isolation.mp3",
  "Koshi.mp3",
  "late summit.mp3",
  "Life's Short.mp3",
  "Lockdown.mp3",
  "New Light.mp3",
  "Noctilucent.mp3",
  "Nocturnal.mp3",
  "Notes of an Evening.mp3",
  "Old Friend.mp3",
  "Sky Above.mp3",
  "Solstice.mp3",
  "Straying.mp3",
  "Sun Will Rise Again.mp3",
  "Sunrise.mp3",
  "There's Still Time.mp3",
  "Towards The Mountains.mp3",
  "Under A Wishing Sky.mp3",
  "Ventura.mp3",
  "when i close my eyes.mp3",
  "yourcolors.mp3",
];

const colorRedLight = "#ff6b6b";
const colorRed = "#e52020";
const colorRedDark = "#b92525";

const colorGreenLight = "#51cf66";
const colorGreen = "#2b8a3e";
const colorGreenDark = "#1e5f2b";

let focusTime = 25 * 60;
let pauseTime = 5 * 60;
let totalSeconds = focusTime;
let isWorkTime = true; //initial state
let countdown = null;
let isPaused = true;

btnPlayPause.addEventListener("click", function () {
  btnPlayPause.classList.toggle("active");
  if (isPaused) {
    startFocusTime();
  } else {
    pauseTimer();
  }
});

const startFocusTime = function () {
  if (isWorkTime) {
    playFocusAudio(lofiFolder, lofiArray);
    changePageTitle("Focus Time");
  }
  timerHandler();
  isPaused = false;
};

const pauseTimer = function () {
  stopFocusAudio();
  clearInterval(countdown);
  isPaused = true;
};

const switchModes = function () {
  isWorkTime = !isWorkTime; // inverts the work time value
  if (isWorkTime) {
    // Se isWorkTime == true
    // Focus time settings
    playFocusAudio(lofiFolder, lofiArray);
    changePageTitle("Focus Time");
    timerHandler();
  } else {
    // Break time settings
    stopFocusAudio();
    changePageTitle("Break Time");
    timerHandler();
  }
};

const timerHandler = function () {
  countdown = setInterval(() => {
    totalSeconds -= 1;
    updateTimer(totalSeconds);
    if (totalSeconds <= 0) {
      clearInterval(countdown);
      countdown = null;
      totalSeconds = isWorkTime ? pauseTime : focusTime; // Se for work time, passa o tempo de pausa, se não, passa o tempo de foco
      switchModes();
    }
  }, 1000);
};

// Update the text times 25:00...
const updateTimer = function (totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timerValue.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// Play the focus audio chosen
const playFocusAudio = function (folder, array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  const randomSong = folder + array[randomIndex];
  audioPlayer.src = randomSong;
  audioPlayer.play();
};

// Pause the current sound
const stopFocusAudio = function () {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
};

// Play another sound when the sound finishes
audioPlayer.addEventListener("ended", playFocusAudio);

const changePageTitle = function (mode) {
  pageTitle.textContent = `BeatFocus | ${mode}`;
};

const checkPauseTimer = function () {
  if (btnPlayPause.classList.contains("active")) {
    // Se tiver a classe 'active'
    audioPlayer.pause();
    clearInterval(countdown);
  }
};

// Slider visual
const container = document.querySelector(".slider-box");
const btn = document.querySelector(".slider-btn");
const color = document.querySelector(".slider-color");
const tooltip = document.querySelector(".slider-tooltip");

dragElement = (target, btn) => {
  target.addEventListener("mousedown", (e) => {
    onMouseMove(e);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  });

  onMouseMove = (e) => {
    e.preventDefault();
    let targetRect = target.getBoundingClientRect();
    let x = e.pageX - targetRect.left + 10;
    if (x > targetRect.width) {
      x = targetRect.width;
    }
    if (x < 0) {
      x = 0;
    }
    btn.x = x - 10;
    btn.style.left = btn.x + "px";

    // get the position of the button inside the container (%)
    let percentPosition = ((btn.x + 10) / targetRect.width) * 100;

    // color width = position of button (%)
    color.style.width = percentPosition + "%";

    // move the tooltip when button moves, and show the tooltip
    tooltip.style.left = btn.x - 5 + "px";
    tooltip.style.opacity = 1;

    // show the percentage in the tooltip
    tooltip.textContent = Math.round(percentPosition) + "%";
  };

  onMouseUp = (e) => {
    window.removeEventListener("mousemove", onMouseMove);
    tooltip.style.opacity = 0;

    btn.addEventListener("mouseover", function () {
      tooltip.style.opacity = 1;
    });

    btn.addEventListener("mouseout", function () {
      tooltip.style.opacity = 0;
    });
  };
};

dragElement(container, btn);
