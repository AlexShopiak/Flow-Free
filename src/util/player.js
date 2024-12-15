export const Player = {
    preloadAudio: () => preloadAudio(),
    playSound: (type) => playSound(type),
    playSoundLoop: (type) => playSoundLoop(type),
    pauseSound: () => pauseSound(), // Добавляем функцию паузы
};

const sounds = {
    pop_0: "/audio/pop_0.mp3",
    pop_1: "/audio/pop_1.mp3",
    pop_2: "/audio/pop_2.mp3",
    pop_3: "/audio/pop_3.mp3",
    pop_4: "/audio/pop_4.mp3",
    pop_5: "/audio/pop_5.mp3",
    pop_6: "/audio/pop_6.mp3",
    pop_7: "/audio/pop_7.mp3",
    pop_8: "/audio/pop_8.mp3",
    mine_1: "/audio/mine_1.mp3",
    mine_2: "/audio/mine_2.mp3",
    mine_3: "/audio/mine_3.mp3",
    mine_4: "/audio/mine_4.mp3",
    mine_5: "/audio/mine_5.mp3",
    mine_6: "/audio/mine_6.mp3",
    flag_on: "/audio/flag_on.mp3",
    flag_off: "/audio/flag_off.mp3",
    lose: "/audio/lose.mp3",
    win: "/audio/win.mp3",
};

// Ссылка на текущий воспроизводимый звук
let currentAudio = null;

const preloadAudio = () => {
    Object.values(sounds).forEach((soundSrc) => {
        const audio = new Audio(soundSrc);
        audio.load();
    });
};

const playSound = (type) => {
    currentAudio = new Audio(sounds[type]);
    currentAudio.play();
};

const playSoundLoop = (type) => {
    currentAudio = new Audio(sounds[type]);
    currentAudio.loop = true; // Включаем повтор
    currentAudio.play();
};

const pauseSound = () => {
    if (currentAudio) {
        currentAudio.pause(); // Остановить текущий звук
        currentAudio = null; // Очистить ссылку
    }
};
