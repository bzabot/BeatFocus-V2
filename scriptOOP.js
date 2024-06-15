// Selecting elements
const focusTimeEl = document.getElementById("focusTime");
const pauseTimeEl = document.getElementById("pauseTime");
const btnPlayPause = document.querySelector(".btn-play-pause");
const timerValue = document.querySelector(".timer-txt");
const audioPlayer = document.getElementById("audioPlayer");
const btnSetTime = document.querySelector(".btn-primary");
const studyTotalTimeEl = document.querySelector(".total-time");
const selectSoundEl = document.getElementById("soundType");
audioPlayer.volume = 0.5;

// Focus sounds
const lofiFolder = "lofi/";
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
const binauralFolder = "binaural/";
const binauralArray = ["binaural.mp3"];
const classicalFolder = "classical/";
const classicalArray = [
  "classical1.mp3",
  "classical10.mp3",
  "classical11.mp3",
  "classical12.mp3",
  "classical13.mp3",
  "classical14.mp3",
  "classical15.mp3",
  "classical16.mp3",
  "classical17.mp3",
  "classical18.mp3",
  "classical19.mp3",
  "classical2.mp3",
  "classical20.mp3",
  "classical21.mp3",
  "classical22.mp3",
  "classical3.mp3",
  "classical4.mp3",
  "classical5.mp3",
  "classical6.mp3",
  "classical7.mp3",
  "classical8.mp3",
  "classical9.mp3",
];

class App {
  constructor() {
    // Default settings after page load
    this.isPaused = true;
    this.isWorkTime = true;
    this.focusTime = 25 * 60;
    this.pauseTime = 5 * 60;
    this.countdown = null;
    this.totalSeconds = this.focusTime;
    this.countdown = null;
    this.totalTimeStudied = 0;
    this.selectSound();

    // Helper classes
    this.audioHandler = new AudioHandler();
    this.timerHandler = new TimerHandler();
    this.volSlider = new VolumeSlider(this);

    // Event handlers
    btnPlayPause.addEventListener("click", this.togglePlayPausenBtn.bind(this));

    btnSetTime.addEventListener("click", () => this.changeTime());

    selectSoundEl.addEventListener("change", () => this.selectSound());

    audioPlayer.addEventListener("ended", () =>
      this.audioHandler.playFocusAudio(
        this.focusSoundFolder,
        this.focusSoundArray
      )
    );
  }

  // Functions
  togglePlayPausenBtn() {
    btnPlayPause.classList.toggle("active");
    if (this.isPaused) {
      this.startFocusTime();
    } else {
      this.pauseTimer();
    }
  }

  startFocusTime() {
    if (this.isWorkTime) {
      this.audioHandler.playFocusAudio(
        this.focusSoundFolder,
        this.focusSoundArray
      );
    }
    this.isPaused = false;
    this.changePageTitle("Focus Time");
    this.timerHandler.countdown(this);
  }

  pauseTimer() {
    this.audioHandler.stopFocusAudio();
    clearInterval(this.countdown);
    this.changeTotalTimeStudied();
    this.isPaused = true;
  }

  switchModes() {
    this.isWorkTime = !this.isWorkTime;
    if (this.isWorkTime) {
      this.audioHandler.playAlarm();
      setTimeout(
        () =>
          this.audioHandler.playFocusAudio(
            this.focusSoundFolder,
            this.focusSoundArray
          ),
        2700
      ); // wait the alarm ends to start the focus audio again
      this.changePageTitle("Focus Time");
      this.timerHandler.countdown(this);
    }
    if (!this.isWorkTime) {
      this.audioHandler.stopFocusAudio();
      this.changeTotalTimeStudied();
      this.audioHandler.playAlarm();
      this.changePageTitle("Break Time");
      this.timerHandler.countdown(this);
    }
  }

  // Function to edit the parameters
  changeTime() {
    const focusTimeValue = +focusTimeEl.value;
    const pauseTimeValue = +pauseTimeEl.value;
    if (focusTimeValue > 0) {
      this.focusTime = focusTimeValue * 60;
    }
    if (pauseTimeValue > 0) {
      this.pauseTime = pauseTimeValue * 60;
    }
    this.isWorkTime
      ? this.timerHandler.updateTimer(this.focusTime)
      : updateTimer(this.pauseTime);
    this.totalSeconds = this.isWorkTime ? this.focusTime : this.pauseTime;
  }

  selectSound() {
    switch (selectSoundEl.value) {
      case "Lofi":
        this.focusSoundFolder = lofiFolder;
        this.focusSoundArray = lofiArray;
        break;
      case "Classical":
        this.focusSoundFolder = classicalFolder;
        this.focusSoundArray = classicalArray;
        break;
      case "Binaural":
        this.focusSoundFolder = binauralFolder;
        this.focusSoundArray = binauralArray;
        break;
      case "No-Sound":
        this.focusSoundFolder = null;
        this.focusSoundArray = null;
    }
  }

  changeTotalTimeStudied() {
    studyTotalTimeEl.textContent = `Study total time: ${Math.round(
      this.totalTimeStudied / 60
    )} min.`;
  }

  changePageTitle(mode) {
    document.title = `BeatFocus | ${mode}`;
  }
}

class AudioHandler {
  constructor() {
    this.alarm = new Audio("/sounds/alarm.wav");
    this.alarm.volume = 0.15;
  }

  playFocusAudio(folder, array) {
    if (!folder || !array) return;

    const randomIndex = Math.floor(Math.random() * array.length);
    const randomSong = "sounds/" + folder + array[randomIndex];
    audioPlayer.src = randomSong;
    audioPlayer.play();
  }

  stopFocusAudio() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }

  changeVolume(volume) {
    audioPlayer.volume = volume;
  }

  playAlarm() {
    this.alarm.play();
  }
}

class TimerHandler {
  constructor() {}

  countdown(app) {
    app.countdown = setInterval(() => {
      app.totalSeconds--;
      if (app.isWorkTime) {
        app.totalTimeStudied++;
      }
      this.updateTimer(app.totalSeconds);
      if (app.totalSeconds <= 0) {
        clearInterval(app.countdown);
        app.countdown = null;
        app.totalSeconds = app.isWorkTime ? app.pauseTime : app.focusTime;
        app.switchModes();
      }
    }, 1000);
  }

  updateTimer(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerValue.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
}

class VolumeSlider {
  constructor(app) {
    this.container = document.querySelector(".slider-box");
    this.btn = document.querySelector(".slider-btn");
    this.tooltip = document.querySelector(".slider-tooltip");
    this.color = document.querySelector(".slider-color");
    this.app = app;
    this.dragElement(this.container, this.btn);
  }

  dragElement = (target, btn) => {
    const onMouseMove = (e) => {
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
      this.color.style.width = percentPosition + "%";

      // move the tooltip when button moves, and show the tooltip
      this.tooltip.style.left = btn.x - 5 + "px";
      this.tooltip.style.opacity = 1;

      // show the percentage in the tooltip
      this.tooltip.textContent = Math.round(percentPosition) + "%";

      this.app.audioHandler.changeVolume(Math.round(percentPosition) / 100);
    };

    const onMouseUp = (e) => {
      window.removeEventListener("mousemove", onMouseMove);
      this.tooltip.style.opacity = 0;

      btn.addEventListener("mouseover", () => {
        this.tooltip.style.opacity = 1;
      });

      btn.addEventListener("mouseout", () => {
        this.tooltip.style.opacity = 0;
      });
    };

    target.addEventListener("mousedown", (e) => {
      onMouseMove(e);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });
  };
}

const app = new App();
