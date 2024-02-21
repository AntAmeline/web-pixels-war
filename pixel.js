const PIXEL_URL = "http://pixels-war.oie-lab.net"
const MAP_ID = "0000"

document.addEventListener("DOMContentLoaded", () => {

    const PREFIX = `${PIXEL_URL}/api/v1/${MAP_ID}`

    fetch(`${PREFIX}/preinit`, {credentials: "include"})
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            //TODO: maintenant que j'ai le json de preinit, je peux initialiser ma grille

            //TODO: maintenant que j'ai le JSON, afficher la grille, et récupérer l'id

            //TODO: maintenant que j'ai l'id, attacher la fonction refresh(id), à compléter, au clic du bouton refresh

            //TODO: attacher au clic de chaque pixel une fonction qui demande au serveur de colorer le pixel sous là forme :
            // http://pixels-war.oie-lab.net/api/v1/0000/set/id/x/y/r/g/b
            // la fonction getPickedColorInRGB ci-dessous peut aider

            //TODO: pourquoi pas rafraichir la grille toutes les 3 sec ?

            //TODO: voire même rafraichir la grille après avoir cliqué sur un pixel ?

            //TODO: pour les avancés: ça pourrait être utile de pouvoir
            // choisir la couleur à partir d'un pixel ?
        })

    //TODO: pour les personnes avancées, comment transformer les deux "then" ci-dessus en "asynch / await" ?

    // À compléter puis à attacher au bouton refresh en passant mon id une fois récupéré
    function refresh(id) {
        fetch(`${PREFIX}/deltas?id=${user_id}`, {credentials: "include"})
            .then((response) => response.json())
            .then((json) => {
                //TODO: maintenant que j'ai le json des deltas, mettre à jour les pixels qui ont changé.
                // "Here be dragons" : comment récupérer le bon div ?

            })
    }

    // Petite fonction facilitatrice pour récupérer la couleur cliquée en RGB
    function getPickedColorInRGB() {
        let colorHexa = document.getElementById("colorpicker").value

        let r = parseInt(colorHexa.substring(1,3),16);
        let g = parseInt(colorHexa.substring(3,5),16);
        let b = parseInt(colorHexa.substring(5,7),16);

        return [r, g, b];
    }

})
