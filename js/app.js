
// Sélection du bouton de menu par son ID
const menuBtn = document.getElementById('menu-btn');

// Ajout d'un événement de clic au bouton de menu
menuBtn.addEventListener('click', () => {
    // Sélection de l'élément 'body' de la page
    document.querySelector('body').classList.toggle('show_menu');
    // Ajoute ou supprime la classe CSS 'show_menu' pour afficher ou masquer le menu
});

// Sélection de l'élément audio de la page
const AUDIOPLAYER = document.querySelector('audio');



AUDIOPLAYER.addEventListener('play', () => {
    // Création du contexte audio
    const contextAudio = new AudioContext();
    // Création de la source audio à partir de l'élément AUDIOPLAYER
    const audioSource = contextAudio.createMediaElementSource(AUDIOPLAYER);
    // Création de l'analyseur audio
    const audioAnalyser = contextAudio.createAnalyser();

    // Connexion de la source audio à l'analyseur audio
    audioSource.connect(audioAnalyser);
    // Connexion de l'analyseur audio à la destination audio
    audioAnalyser.connect(contextAudio.destination)
    // Configuration de la taille de la FFT (transformée de Fourier rapide)
    audioAnalyser.fftSize = 1024;

    // Obtention du nombre de fréquences à partir de l'analyseur audio
    const audioFrequencies = audioAnalyser.frequencyBinCount;
    // Création d'un tableau de fréquences
    const arrayOfFrequencies = new Uint8Array(audioFrequencies);

    // Récupération de l'élément canvas avec l'ID 'canvas'
    const canvas = document.getElementById('canvas');
    // Définition de la largeur et de la hauteur du canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Récupération du contexte 2D du canvas
    const ctx = canvas.getContext('2d');

    // Constantes pour la largeur et la hauteur du canvas
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    // Calcul de la largeur des barres de visualisation
    const barWidth = (WIDTH / arrayOfFrequencies.length) + 2;
    let barHeight;
    let x;

    // Sélection du style de visualisation (par défaut 'style1')
    let style = "style1";
    // Récupération des éléments d'entrée (input) avec le nom 'style'
    const inputsForStyle = document.querySelectorAll('input[name=style]');
    inputsForStyle.forEach(input => {
        // Ajout d'un événement de changement à chaque élément d'entrée
        input.addEventListener('change', () => {
            // Mise à jour du style sélectionné
            style = document.querySelector('input[name=style]:checked').getAttribute('id');
        })
    }) 

    // Sélection de la couleur (par défaut [0, 89, 200])
    let colorRGB = [0,89,200];
    // Récupération des éléments d'entrée (input) avec le nom 'color'
    const inputsForColor = document.querySelectorAll('input[name=color]');
    inputsForColor.forEach(input => {
        // Ajout d'un événement de changement à chaque élément d'entrée
        input.addEventListener('change', () => {
            // Mise à jour de la couleur sélectionnée
            let colorValue = document.querySelector('input[name=color]:checked').getAttribute('data-rgb');
            colorRGB = colorValue.split(';');
        })
    }) 

    let reqAnim;

    function visualize() {
        // Appel récursif pour l'animation
        reqAnim = window.requestAnimationFrame(visualize);
        
        x = 0;

        // Obtention des données de fréquence à partir de l'analyseur audio
        audioAnalyser.getByteFrequencyData(arrayOfFrequencies);

        // Effacement du canvas
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        // Définition de la couleur de fond
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Dessin des barres de visualisation
        for(let i = 0; i < audioFrequencies; i++) {
            barHeight = arrayOfFrequencies[i];

            // Calcul des composantes RVB en fonction de la fréquence
            const RED = colorRGB[0] + i;
            const GREEN = colorRGB[1];
            const BLUE = colorRGB[2] + (i/2);
            
            // Style de visualisation 1 : barres verticales
            if(style === "style1") {
                ctx.fillStyle = `rgb(${RED}, ${GREEN}, ${BLUE})`;
                ctx.fillRect(x, HEIGHT, barWidth, -barHeight);
            }
            // Style de visualisation 2 : cercles
            else if(style === "style2") {
                ctx.beginPath()
                ctx.fillStyle = `rgb(${RED}, ${GREEN}, ${BLUE})`;
                ctx.arc(x, HEIGHT- barHeight, barWidth, 0, Math.PI * 2, false)
                ctx.fill()
            }
            // Style de visualisation 3 : barres horizontales
            else if(style === "style3") {
                ctx.fillStyle = `rgb(${RED}, ${GREEN}, ${BLUE})`;
                ctx.fillRect(x, HEIGHT-barHeight, barWidth, 5);
            }

            x += barWidth + 1;
        } 
    }

    // Appel initial de la fonction de visualisation
    visualize();
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