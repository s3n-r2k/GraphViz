class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.neighbours = []
    }

    display() {
        // Draw ellipse
        fill(255)
        noStroke()
        ellipse(this.x, this.y, 3)
    }
}


function dijkstra(G, s, e) {
    let Q = []
    let dist = [];
    let prev = [];
}