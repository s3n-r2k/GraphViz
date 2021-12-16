const DARK = '#264653'
const LIGHTDARK = '#2a9d8f'
const DARKLIDHT = '#f4a261'
const LIGHT = '#e9c46a'
const REDISH = '#e76f51'

class Delaunay {
    constructor(n, x, y, w, h) {
        this.size = n;
        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.points = [-sqrt(2) / 2, -sqrt(2) / 2];
        // Dijkstra variabls
        this.dist = [];
        this.prev = [];
        this.Q = [];
        this.current = undefined;
        this.SP = []
        this.hist = []

        while (this.points.length < this.size * 2 - 2) {
            let _x = random(-1, 1);
            let _y = random(-1, 1);
            if (_x ** 2 + _y ** 2 < 1) {
                this.points.push(_x)
                this.points.push(_y)
            }
        }
        this.points.push(sqrt(2) / 2)
        this.points.push(sqrt(2) / 2)

        for (var k = 0; k < n; k++) {
            this.dist.push(Infinity)
            this.prev.push(undefined)
            this.Q.push(k)
        }
        this.dist[0] = 0;

        this.getAdjList()
    }
    dijkstra() {
        this.current = this.min_dist()
        this.hist.push([this.current, []])
        if (this.current !== undefined) {
            for (var n = 0; n < this.adjList[this.current].length; n++) {
                let neighbour = this.adjList[this.current][n]
                if (this.Q.indexOf(neighbour) >= 0) {
                    this.hist[this.hist.length - 1][1].push(neighbour)
                    let len = this.distance(this.current, neighbour)
                    let alt = this.dist[this.current] + len
                    if (alt < this.dist[neighbour]) {
                        this.dist[neighbour] = alt
                        this.prev[neighbour] = this.current
                    }
                }
            }
        }
        let index = this.Q.indexOf(this.current)
        this.Q.splice(index, 1)
    }
    min_dist() {
        let min_dist = this.h * this.w;
        let index = undefined
        for (var i = 0; i < this.Q.length; i++) {
            if (this.dist[this.Q[i]] <= min_dist) {
                min_dist = this.dist[this.Q[i]]
                index = this.Q[i]
            }
        }
        return index
    }
    distance(i, j) {
        let p1 = this.idx2cords(i)
        let p2 = this.idx2cords(j)
        return sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
    }
    getAdjList() {
        let actPoints = []
        for (var i = 0; i < this.points.length; i++) {
            if (i % 2 == 0) {
                actPoints.push(this.points[i] * this.w)
            } else {
                actPoints.push(this.points[i] * this.h)
            }
        }
        let delaunay = new Delaunator(actPoints);
        let adjList = []
        let N = delaunay.triangles.length

        this.triangles = []

        // Initialize adjacency list
        for (var k = 0; k < this.size; k++) {
            adjList.push([])
        }
        for (var i = 0; i < N; i += 3) {
            for (var j = 0; j < 3; j++) {
                let parent = delaunay.triangles[i + j]
                let neighbour = delaunay.triangles[i + (j + 1) % 3]
                if (adjList[parent].indexOf(neighbour) < 0) {
                    adjList[parent].push(neighbour)
                }
                if (adjList[neighbour].indexOf(parent) < 0) {
                    adjList[neighbour].push(parent)
                }
            }
            let p0 = this.idx2cords(delaunay.triangles[i])
            let p1 = this.idx2cords(delaunay.triangles[i + 1])
            let p2 = this.idx2cords(delaunay.triangles[i + 2])
            this.triangles.push(new Triangle(p0, p1, p2))
        }
        this.adjList = adjList;

    }
    shortest_path() {
        let S = [];
        let u = this.size - 1;

        if (this.prev[u] !== undefined || u == 0) {
            while (u !== undefined) {
                S.push(u)
                u = this.prev[u]
            }
        }
        this.SP = S.reverse()
    }
    display() {
        fill(DARK)
        ellipse(this.x, this.y, 2 * this.w, 2 * this.h)
        // display triangles
        for (var t = 0; t < this.triangles.length; t++) {
            this.triangles[t].display()
        }
        // display current spanning tree
        for (var k = 0; k < this.prev.length; k++) {
            if (typeof this.prev[k] !== 'undefined') {
                let p1 = this.idx2cords(k)
                let p2 = this.idx2cords(this.prev[k])
                stroke(LIGHTDARK)
                strokeWeight(3)
                line(p1.x, p1.y, p2.x, p2.y)
            }
        }
        // display shortest path
        for (var m = 0; m < this.SP.length - 1; m++) {
            let p1 = this.idx2cords(this.SP[m])
            let p2 = this.idx2cords(this.SP[m + 1])
            stroke(REDISH)
            strokeWeight(3)
            line(p1.x, p1.y, p2.x, p2.y)
        }
        // display nodes
        for (var i = 0; i < this.size; i++) {
            noStroke();
            if (this.Q.indexOf(i) >= 0) {
                fill(LIGHT)
            } else {
                fill(DARKLIDHT)
            }
            let p = this.idx2cords(i)
            ellipse(p.x, p.y, 10)
        }
        // display current node
        let p = this.idx2cords(this.current)
        fill('#f94144')
        ellipse(p.x, p.y, 20)
    }
    animate() {
        if (this.Q.length > 0) {
            this.dijkstra()
        }
        if (this.Q.length == 0 && this.SP.length == 0) {
            this.shortest_path()
        }
        this.display()
    }
    idx2cords(i) {
        let _x = this.points[i * 2] * this.w + this.x;
        let _y = this.points[i * 2 + 1] * this.h + this.y;
        return { x: _x, y: _y }
    }


    clicked(x, y) {
        for (var t = 0; t < this.triangles.length; t++) {
            this.triangles[t].isInside(x, y)
        }
    }

}

class Triangle {
    constructor(p0, p1, p2) {
        this.p0 = p0
        this.p1 = p1
        this.p2 = p2
        this.clicked = false
        this.cc = circumcenter(p0, p1, p2)
        this.radius = sqrt((p0.x - this.cc.x) ** 2 + (p0.y - this.cc.y) ** 2)
    }

    display() {
        if (this.clicked) {
            noStroke()
            fill(255, 50)
        } else {
            noFill()
            stroke(255, 100)
            strokeWeight(2)
        }
        beginShape();
        vertex(this.p0.x, this.p0.y);
        vertex(this.p1.x, this.p1.y);
        vertex(this.p2.x, this.p2.y);
        endShape(CLOSE);
        if (this.clicked) {
            stroke(255)
            ellipse(this.cc.x, this.cc.y, 2 * this.radius)
        }
    }

    isInside(x, y) {
        var dX = x - this.p2.x
        var dY = y - this.p2.y
        var dX21 = this.p2.x - this.p1.x;
        var dY12 = this.p1.y - this.p2.y;
        var D = dY12 * (this.p0.x - this.p2.x) + dX21 * (this.p0.y - this.p2.y);
        var s = dY12 * dX + dX21 * dY;
        var t = (this.p2.y - this.p0.y) * dX + (this.p0.x - this.p2.x) * dY;
        if (D < 0) {
            this.clicked = s <= 0 && t <= 0 && s + t >= D;
        } else {
            this.clicked = s >= 0 && t >= 0 && s + t <= D;
        }
    }
}

function circumcenter(A, B, C) {
    // Calculates the circumcenter of a triangle given
    // the coordinate (x,y) for the three points A, B, C
    // making up the triangle.
    var D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y))
    var Ux = (
        (A.x ** 2 + A.y ** 2) * (B.y - C.y) +
        (B.x ** 2 + B.y ** 2) * (C.y - A.y) +
        (C.x ** 2 + C.y ** 2) * (A.y - B.y)
    ) / D
    var Uy = (
        (A.x ** 2 + A.y ** 2) * (C.x - B.x) +
        (B.x ** 2 + B.y ** 2) * (A.x - C.x) +
        (C.x ** 2 + C.y ** 2) * (B.x - A.x)
    ) / D
    return { x: Ux, y: Uy }
}