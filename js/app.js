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

    //Selection of style
    let style = "style1"; // style1 by default
    const inputsForStyle = document.querySelectorAll('input[name=style]');
    inputsForStyle.forEach(input => {
        input.addEventListener('change', () => {
            style = document.querySelector('input[name=style]:checked').getAttribute('id');
        })
    }) 
    
    //Selection of color
    let colorRGB = [0,89,200]; // style1 by default
    const inputsForColor = document.querySelectorAll('input[name=color]');
    inputsForColor.forEach(input => {
        input.addEventListener('change', () => {
            let colorValue = document.querySelector('input[name=color]:checked').getAttribute('data-rgb');
            colorRGB = colorValue.split(';');
        })
    }) 
    


    function visualize() {
        requestAnimationFrame(visualize);
        
        x = 0;

        audioAnalyser.getByteFrequencyData(arrayOfFrequencies);

        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        
        for(let i = 0; i < audioFrequencies; i++) {
            barHeight = arrayOfFrequencies[i];

            const RED = colorRGB[0] + i;
            const GREEN = colorRGB[1];
            const BLUE = colorRGB[2] + (i/2);
            
            if(style === "style1") {
                ctx.fillStyle = `rgb(${RED}, ${GREEN}, ${BLUE})`;
                ctx.fillRect(x, HEIGHT, barWidth, -barHeight);
            }
            else if(style === "style2") {
                ctx.beginPath()
                ctx.fillStyle = `rgb(${RED}, ${GREEN}, ${BLUE})`;
                ctx.arc(x, HEIGHT- barHeight, barWidth, 0, Math.PI * 2, false)
                ctx.fill()
            }
            else if(style === "style3") {
                ctx.fillStyle = `rgb(${RED}, ${GREEN}, ${BLUE})`;
                ctx.fillRect(x, HEIGHT-barHeight, barWidth, 5);
            }

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