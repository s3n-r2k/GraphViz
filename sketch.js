let w = window.innerWidth;
let h = window.innerHeight;


let viz = ["delaunay"]


function windowResized() {
    w = window.innerWidth;
    h = window.innerHeight;
}
function setup() {
    createCanvas(w, h);
    d = new Delaunay(50, w / 2, h / 2, 400, 400)


}
function mouseClicked() {
    d.clicked(mouseX, mouseY);
}

function draw() {
    background(0)
    frameRate(5)
    d.animate()
}


