// pour l'instant on ne peut pas y toucher depuis l'interface
// il faut recharger la page pour changer de carte
const PIXEL_URL = "https://pixels-war.oie-lab.net"

// c'est sans doute habile de commencer avec la carte de test
// const MAP_ID = "0000"
const MAP_ID = "TEST"

document.addEventListener("DOMContentLoaded", () => {

    const PREFIX = `${PIXEL_URL}/api/v1/${MAP_ID}`;

    // pour savoir à quel serveur / carte on s'adresse
    // on les affiche en dur
    // pour l'instant on ne peut pas y toucher depuis l'interface
    // il faut recharger la page pour changer de carte
    document.getElementById("baseurl").value = PIXEL_URL;
    document.getElementById("mapid").value = MAP_ID;
    document.getElementById("baseurl").readOnly = true;
    document.getElementById("mapid").readOnly = true;

    fetch(`${PREFIX}/preinit`, {credentials: "include"})
        .then((response) => response.json())
         
        //TODO: maintenant que j'ai le json de preinit, je peux initialiser ma grille
        .then((json) => {
            console.log(json);
            const key = json.key;
            return fetch(`${PREFIX}/init?key=${key}`, {credentials: "include"});
        })
    
        .then((response) => response.json())
        
        //TODO: maintenant que j'ai le JSON, afficher la grille, et récupérer l'id
        .then((json) => {
                    console.log(json);
                    const {id, nx, ny, data} = json;
                    const grid = document.getElementById("grid");
                    grid.style.gridTemplateColumns = `repeat(${nx}, 4px)`;
                    grid.style.gridTemplateRows = `repeat(${ny}, 4px)`;

                    for (let y = 0; y < ny ; y++) {
                        for (let x =0; x < ny; x++) {
                            const [r, g, b] = data[y][x];
                            const tile = document.createElement("div");
                            tile.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                            tile.dataset.x = x;
                            tile.dataset.y = y;
                            grid.appendChild(tile);
                        }
                    }

                    return id;
                });
        //TODO: maintenant que j'ai l'id, attacher la fonction refresh(id), à compléter, au clic du bouton refresh
        
        .then((id) => {
            const refreshButton = document.getElementById("refresh");
            refreshButton.addEventListener("click", () => {
                refresh(id);
            });
            return id
        });

            
        //TODO: attacher au clic de chaque pixel une fonction qui demande au serveur de colorer le pixel sous là forme :
        // http://pixels-war.oie-lab.net/api/v1/0000/set/id/x/y/r/g/b
        // la fonction getPickedColorInRGB ci-dessous peut aider

        .then((id) => {
            const grid = document.getElementById("grid");
            for (const pix of grid.children) {
                pix.addEventListener("click", () => {
                    const [r, g, b] = getPickedColorInRGB();
                    const x = pix.dataset.x;
                    const y = pix.dataset.y;
                    fetch(`${PREFIX}/set?id=${id}&x=${x}&y=${y}&r=${r}&g=${g}&b=${b}`, {credentials: "include"})
                        .then((response) => response.json())
                        .then((json) => {
                            console.log(json);
                            if (json === 0  ){
                                const cooldownDiv = document.getElementById("cooldown-info");
                                
                                if (window.cooldownInterval) {
                                clearInterval(window.cooldownInterval);
                                }

                                let secondsRemaining = 10;

                                cooldownDiv.textContent =  `${secondsRemaining}`;

                                window.cooldownInterval = setInterval(() => {
                                secondsRemaining--;

                                if (secondsRemaining > 0) {
                                    cooldownDiv.textContent = ` ${secondsRemaining}`;
                                } else {
                                    cooldownDiv.textContent = "";
                                    clearInterval(window.cooldownInterval);
                                    window.cooldownInterval = null;
                                }
                                }, 1000);

                                refresh(id);
                              }
                              ;
                            });
                        });
                };
                return id
            });

        //TODO: pourquoi pas rafraichir la grille toutes les 3 sec ?

        .then ((id) => {
            setInterval(() => {
                refresh(id);
            }, 3000);
            return id
        })
        // voire même rafraichir la grille après avoir cliqué sur un pixel ?
        // Déjà fait
        // cosmétique / commodité / bonus:
        
        // TODO: pour être efficace, il serait utile d'afficher quelque part
        // les coordonnées du pixel survolé par la souris
        // Ajouter un event listener sur chaque pixel
        .then((id) => {
            const grid = document.getElementById("grid");
            for (const pix of grid.children) {
                pix.addEventListener("mouseover", () => {
                    const x = pix.dataset.x;
                    const y = pix.dataset.y;
                    const coordDiv = document.getElementById("cursor-coords");
                    coordDiv.textContent = `(${x}, ${y})`;
                });
                pix.addEventListener("mouseout", () => {
                    const coordDiv = document.getElementById("cursor-coords");
                    coordDiv.textContent = "";
                });
            }
        });
    
        //TODO: pour les rapides: afficher quelque part combien de temps
        // il faut attendre avant de pouvoir poster à nouveau

        //TODO: pour les avancés: ça pourrait être utile de pouvoir
        // choisir la couleur à partir d'un pixel ?
        

    //TODO: pour les élèves avancés, comment transformer les "then" ci-dessus en "async / await" ?
    //TODO: pour les élèves avancés, faire en sorte qu'on puisse changer de carte
    //      voir le bouton Connect dans le HTML
        
    // À compléter puis à attacher au bouton refresh en passant mon id une fois récupéré
    function refresh(user_id) {
        fetch(`${PREFIX}/deltas?id=${user_id}`, {credentials: "include"})
            .then((response) => response.json())
            .then((json) => {
                const {deltas} = json["deltas"]
                deltas.forEach(([x, y, r, g, b]) => {
                    const tile = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
                    if (tile) {
                        tile.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
                    }
                });
            });
        }

                //TODO: maintenant que j'ai le json des deltas, mettre à jour les pixels qui ont changé.
                // "Here be dragons" : comment récupérer le bon div ?

            
    

    // Petite fonction facilitatrice pour récupérer la couleur cliquée en RGB
    function getPickedColorInRGB() {
        const colorHexa = document.getElementById("colorpicker").value

        const r = parseInt(colorHexa.substring(1, 3), 16)
        const g = parseInt(colorHexa.substring(3, 5), 16)
        const b = parseInt(colorHexa.substring(5, 7), 16)

        return [r, g, b]
    }

    // dans l'autre sens, pour mettre la couleur d'un pixel dans le color picker
    // (le color picker insiste pour avoir une couleur en hexadécimal...)
    function pickColorFrom(div) {
        // plutôt que de prendre div.style.backgroundColor
        // dont on ne connait pas forcément le format
        // on utilise ceci qui retourne un 'rbg(r, g, b)'
        const bg = window.getComputedStyle(div).backgroundColor
        // on garde les 3 nombres dans un tableau de chaines
        const [r, g, b] = bg.match(/\d+/g)
        // on les convertit en hexadécimal
        const rh = parseInt(r).toString(16).padStart(2, '0')
        const gh = parseInt(g).toString(16).padStart(2, '0')
        const bh = parseInt(b).toString(16).padStart(2, '0')
        const hex = `#${rh}${gh}${bh}`
        // on met la couleur dans le color picker
        document.getElementById("colorpicker").value = hex
    }

})
