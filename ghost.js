class Ghost {
    constructor(
        x,
        y,
        width,
        height,
        speed,
        imageX,
        imageY,
        imageWidth,
        imageHeight,
        range
    ) {
        // Inisialisasi properti ghost
        this.x = x; // Koordinat x
        this.y = y; // Koordinat y
        this.width = width; // Lebar
        this.height = height; // Tinggi
        this.speed = speed; // Kecepatan
        this.direction = DIRECTION_RIGHT; // Arah awal
        this.imageX = imageX; // Koordinat x pada sprite gambar
        this.imageY = imageY; // Koordinat y pada sprite gambar
        this.imageHeight = imageHeight; // Tinggi sprite gambar
        this.imageWidth = imageWidth; // Lebar sprite gambar
        this.range = range; // Jarak pandang ghost
        this.randomTargetIndex = parseInt(Math.random() * 4); // Index target acak
        this.target = randomTargetsForGhosts[this.randomTargetIndex]; // Target awal
        setInterval(() => {
            this.changeRandomDirection();
        }, 10000); // Setiap 10 detik, ubah arah acak
    }

    isInRange() {
        // Cek apakah ghost berada dalam jarak pandang dengan pacman
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        if (
            Math.sqrt(xDistance * xDistance + yDistance * yDistance) <=
            this.range
        ) {
            return true; // Jika dalam jarak pandang
        }
        return false; // Jika tidak dalam jarak pandang
    }

    changeRandomDirection() {
        // Mengubah arah acak setiap interval waktu tertentu
        let addition = 1;
        this.randomTargetIndex += addition;
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }

    moveProcess() {
        // Proses pergerakan ghost
        if (this.isInRange()) {
            this.target = pacman; // Jika dalam jarak pandang, bergerak menuju pacman
        } else {
            this.target = randomTargetsForGhosts[this.randomTargetIndex]; // Jika tidak dalam jarak pandang, bergerak menuju target acak
        }
        this.changeDirectionIfPossible(); // Mengubah arah jika mungkin
        this.moveForwards(); // Bergerak ke depan
        if (this.checkCollisions()) {
            this.moveBackwards(); // Jika terjadi tabrakan, mundur
            return;
        }
    }

    moveBackwards() {
        // Bergerak mundur sesuai dengan arah ghost
        switch (this.direction) {
            case 4: // Kanan
                this.x -= this.speed;
                break;
            case 3: // Atas
                this.y += this.speed;
                break;
            case 2: // Kiri
                this.x += this.speed;
                break;
            case 1: // Bawah
                this.y -= this.speed;
                break;
        }
    }

    moveForwards() {
        // Bergerak ke depan sesuai dengan arah ghost
        switch (this.direction) {
            case 4: // Kanan
                this.x += this.speed;
                break;
            case 3: // Atas
                this.y -= this.speed;
                break;
            case 2: // Kiri
                this.x -= this.speed;
                break;
            case 1: // Bawah
                this.y += this.speed;
                break;
        }
    }

    checkCollisions() {
        // Memeriksa tabrakan dengan dinding pada peta
        let isCollided = false;
        if (
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1
        ) {
            isCollided = true; // Terjadi tabrakan
        }
        return isCollided;
    }

    changeDirectionIfPossible() {
        // Mengubah arah ghost jika mungkin
        let tempDirection = this.direction;
        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize)
        );
        if (typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }
        if (
            this.getMapY() != this.getMapYRightSide() &&
            (this.direction == DIRECTION_LEFT ||
                this.direction == DIRECTION_RIGHT)
        ) {
            this.direction = DIRECTION_UP;
        }
        if (
            this.getMapX() != this.getMapXRightSide() &&
            this.direction == DIRECTION_UP
        ) {
            this.direction = DIRECTION_LEFT;
        }
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
        console.log(this.direction);
    }

    calculateNewDirection(map, destX, destY) {
        // Menghitung arah baru menggunakan algoritma pencarian jalur
        let mp = [];
        for (let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }

        let queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                rightX: this.getMapXRightSide(),
                rightY: this.getMapYRightSide(),
                moves: [],
            },
        ];
        while (queue.length > 0) {
            let popped = queue.shift();
            if (popped.x == destX && popped.y == destY) {
                return popped.moves[0]; // Mengembalikan arah pertama pada jalur
            } else {
                mp[popped.y][popped.x] = 1; // Menandai node sebagai sudah dikunjungi
                let neighborList = this.addNeighbors(popped, mp);
                for (let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }

        return 1; // Arah default jika tidak ditemukan jalur
    }

    addNeighbors(popped, mp) {
        // Menambahkan tetangga yang valid ke dalam antrian
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if (
            popped.x - 1 >= 0 &&
            popped.x - 1 < numOfRows &&
            mp[popped.y][popped.x - 1] != 1
        ) {
            let tempMoves = popped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({ x: popped.x - 1, y: popped.y, moves: tempMoves });
        }
        if (
            popped.x + 1 >= 0 &&
            popped.x + 1 < numOfRows &&
            mp[popped.y][popped.x + 1] != 1
        ) {
            let tempMoves = popped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({ x: popped.x + 1, y: popped.y, moves: tempMoves });
        }
        if (
            popped.y - 1 >= 0 &&
            popped.y - 1 < numOfColumns &&
            mp[popped.y - 1][popped.x] != 1
        ) {
            let tempMoves = popped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({ x: popped.x, y: popped.y - 1, moves: tempMoves });
        }
        if (
            popped.y + 1 >= 0 &&
            popped.y + 1 < numOfColumns &&
            mp[popped.y + 1][popped.x] != 1
        ) {
            let tempMoves = popped.moves.slice();
            tempMoves.push(DIRECTION_BOTTOM);
            queue.push({ x: popped.x, y: popped.y + 1, moves: tempMoves });
        }
        return queue;
    }

    getMapX() {
        // Mendapatkan koordinat x pada peta
        let mapX = parseInt(this.x / oneBlockSize);
        return mapX;
    }

    getMapY() {
        // Mendapatkan koordinat y pada peta
        let mapY = parseInt(this.y / oneBlockSize);
        return mapY;
    }

    getMapXRightSide() {
        // Mendapatkan koordinat x pada sisi kanan objek
        let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;
    }

    getMapYRightSide() {
        // Mendapatkan koordinat y pada sisi bawah objek
        let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    }

    changeAnimation() {
        // Mengubah frame animasi (tidak terlihat frameCount)
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    draw() {
        // Menggambar ghost pada canvas
        canvasContext.save();
        canvasContext.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
        canvasContext.restore();
        canvasContext.beginPath();
        canvasContext.strokeStyle = "red";
        canvasContext.arc(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2,
            this.range * oneBlockSize,
            0,
            2 * Math.PI
        );
        canvasContext.stroke();
    }
}

// Fungsi untuk memperbarui pergerakan semua ghost
let updateGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }
};

// Fungsi untuk menggambar semua ghost pada canvas
let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
};
