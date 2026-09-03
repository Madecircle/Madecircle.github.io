const e_piano = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 2.01,
    modulationIndex: 7,

    oscillator: {
        type: "sine"
    },

    modulation: {
        type: "sine"
    },

    envelope: {
        attack: 0.008,
        decay: 1.4,
        sustain: 0.35,
        release: 3.5
    },

    modulationEnvelope: {
        attack: 0.002,
        decay: 0.55,
        sustain: 0.08,
        release: 1
    },

    volume: -6
});

const chorus = new Tone.Chorus({
    frequency: 0.6,
    delayTime: 4.5,
    depth: 0.45,
    spread: 90,
    wet: 0.35
}).start();

const eq = new Tone.EQ3({
    low: 2,
    mid: 1.5,
    high: -2,
    lowFrequency: 250,
    highFrequency: 2800
});

const compressor = new Tone.Compressor({
    threshold: -20,
    ratio: 3,
    attack: 0.02,
    release: 0.25
});

const reverb = new Tone.Reverb({
    decay: 2.8,
    preDelay: 0.02,
    wet: 0.38
});

e_piano.chain(
    eq,
    compressor,
    chorus,
    reverb,
    Tone.Destination
);

const body = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
        type: "triangle"
    },
    envelope: {
        attack: 0.015,
        decay: 1.2,
        sustain: 0.18,
        release: 3
    },
    volume: -15
});

body.chain(
    eq,
    compressor,
    chorus,
    reverb,
    Tone.Destination
);

Tone.Transport.swing = 0.3;
Tone.Transport.swingSubdivision = "8n";

// A single scheduling callback shared by every song part.
function playPhrase(time, value) {
    e_piano.triggerAttackRelease(value.note, value.dur, time, value.velocity);
    body.triggerAttackRelease(value.note, value.dur, time, value.velocity * 0.65);
}

const lick = new Tone.Part(playPhrase, [
    { time: "0:0:0", note: "D5", dur: "8n", velocity: 0.8 },
    { time: "0:0:2", note: "E5", dur: "8n", velocity: 0.8 },
    { time: "0:1:0", note: "F5", dur: "8n", velocity: 0.8 },
    { time: "0:1:2", note: "G5", dur: "8n", velocity: 0.8 },
    { time: "0:2:0", note: "E5", dur: "4n", velocity: 0.8 },
    { time: "0:3:0", note: "C5", dur: "8n", velocity: 0.8 },
    { time: "0:3:2", note: "D5", dur: "2n", velocity: 0.8 },
]);

const porgy = new Tone.Part(playPhrase, [
    { time: "0:0:2", note: "E4", dur: "8n", velocity: 0.8 },
    { time: "0:1:0", note: "G#4", dur: "8n", velocity: 0.8 },
    { time: "0:1:2", note: "B4", dur: "8n", velocity: 0.8 },
    { time: "0:2:0", note: "D#5", dur: "8n", velocity: 0.8 },
    { time: "0:2:2", note: "F#5", dur: "4n", velocity: 0.8 },
]);

// Each song: which Part to play and the tempo it should play at.
const songs = {
    lick: { part: lick, bpm: 120 },
    porgy: { part: porgy, bpm: 60 },
};

function playSong(name) {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    lick.stop();
    porgy.stop();

    const song = songs[name];
    if (!song) return;

    Tone.Transport.bpm.value = song.bpm;
    song.part.start(0);
    Tone.Transport.start();
}

// Slide the piano drawer in/out on mobile.
function menuToggle() {
    document.querySelector(".sidebar").classList.toggle("open");
}

// The HTML is the single source of truth for the mapping:
// every key carries data-note, song keys carry data-action="song:<name>",
// and nav keys carry data-target="#section". Order in the DOM no longer matters.
const keys = document.querySelectorAll("[data-note]");

keys.forEach((key) => {
    key.addEventListener("click", async () => {
        await Tone.start();

        // 1. Make the sound.
        const action = key.dataset.action;
        if (action && action.startsWith("song:")) {
            playSong(action.split(":")[1]);
        } else {
            e_piano.triggerAttackRelease(key.dataset.note, "4n");
        }

        // 2. If this is a nav key, scroll to its section and close the drawer.
        const target = key.dataset.target;
        if (target) {
            document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
            document.querySelector(".sidebar").classList.remove("open");
        }
    });
});
