//Button to show Menu
const menuBtn = document.getElementById('menu-btn');

//Show Menu
menuBtn.addEventListener('click', () => {
    document.querySelector('body').classList.toggle('show_menu');
})

const AUDIOPLAYER = document.querySelector('audio');


AUDIOPLAYER.addEventListener('play', () => {
    const contextAudio = new AudioContext();
    const audioSource = contextAudio.createMediaElementSource(AUDIOPLAYER);
    const audioAnalyser = contextAudio.createAnalyser();

    audioSource.connect(audioAnalyser);
    audioAnalyser.connect(contextAudio.destination)
    audioAnalyser.fftSize = 1024;

    const audioFrequencies = audioAnalyser.frequencyBinCount;
    const arrayOfFrequencies = new Uint8Array(audioFrequencies);

    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');


    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const barWidth = (WIDTH / arrayOfFrequencies.length) + 2;
    let barHeight;
    let x;

    function visualize() {
        requestAnimationFrame(visualize);

        x = 0;

        audioAnalyser.getByteFrequencyData(arrayOfFrequencies);

        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for(let i = 0; i < audioFrequencies; i++) {
            barHeight = arrayOfFrequencies[i];

            const RED = 0;
            const GREEN = 57 + i;
            const BLUE = 103 + (i / 2);

            ctx.fillStyle = `rgb(${RED}, ${GREEN}, ${BLUE})`;
            ctx.fillRect(x, HEIGHT, barWidth, -barHeight);

            x += barWidth + 1;
        }

    }

    visualize()


})

const songInputs = document.querySelectorAll('input[name=sound]');

songInputs.forEach(input => {
    input.addEventListener('change', (e) => {
        selectSong(e)
        console.log(AUDIOPLAYER.getAttribute('src'))
    })
})

function selectSong(e) {
    AUDIOPLAYER.pause()
    AUDIOPLAYER.src = `./sounds/${e.target.getAttribute('id')}.mp3`
    AUDIOPLAYER.play();
}