// Definisi kelas Pacman dengan konstruktor dan propertinya
class Pacman {
    constructor(x, y, width, height, speed) {
        this.x = x;  // Koordinat x
        this.y = y;  // Koordinat y
        this.width = width;  // Lebar objek
        this.height = height;  // Tinggi objek
        this.speed = speed;  // Kecepatan pergerakan
        this.direction = 4;  // Arah awal (4 merepresentasikan kanan)
        this.nextDirection = 4;  // Arah berikutnya yang diinginkan
        this.frameCount = 7;  // Jumlah frame animasi
        this.currentFrame = 1;  // Frame animasi saat ini
        // Mengatur interval untuk mengganti animasi setiap 100 milidetik
        setInterval(() => {
            this.changeAnimation();
        }, 100);
    }

    // Fungsi untuk memproses pergerakan pacman
    moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            return;
        }
    }

    // Fungsi untuk menangani saat pacman makan makanan
    eat() {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (
                    map[i][j] == 2 &&
                    this.getMapX() == j &&
                    this.getMapY() == i
                ) {
                    map[i][j] = 3;  // Mengubah status makanan menjadi dimakan
                    score++;  // Menambah skor
                }
            }
        }
    }

    // Fungsi untuk memindahkan pacman ke belakang
    moveBackwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // Kanan
                this.x -= this.speed;
                break;
            case DIRECTION_UP: // Atas
                this.y += this.speed;
                break;
            case DIRECTION_LEFT: // Kiri
                this.x += this.speed;
                break;
            case DIRECTION_BOTTOM: // Bawah
                this.y -= this.speed;
                break;
        }
    }

    // Fungsi untuk memindahkan pacman ke depan
    moveForwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // Kanan
                this.x += this.speed;
                break;
            case DIRECTION_UP: // Atas
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT: // Kiri
                this.x -= this.speed;
                break;
            case DIRECTION_BOTTOM: // Bawah
                this.y += this.speed;
                break;
        }
    }

    // Fungsi untuk memeriksa tabrakan pacman dengan dinding
    checkCollisions() {
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
            isCollided = true;
        }
        return isCollided;
    }

    // Fungsi untuk memeriksa tabrakan pacman dengan hantu
    checkGhostCollision(ghosts) {
        for (let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];
            if (
                ghost.getMapX() == this.getMapX() &&
                ghost.getMapY() == this.getMapY()
            ) {
                return true;
            }
        }
        return false;
    }

    // Fungsi untuk mengubah arah pacman jika memungkinkan
    changeDirectionIfPossible() {
        if (this.direction == this.nextDirection) return;
        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }

    // Fungsi untuk mendapatkan koordinat x pada peta
    getMapX() {
        let mapX = parseInt(this.x / oneBlockSize);
        return mapX;
    }

    // Fungsi untuk mendapatkan koordinat y pada peta
    getMapY() {
        let mapY = parseInt(this.y / oneBlockSize);
        return mapY;
    }

    // Fungsi untuk mendapatkan koordinat x pada sisi kanan objek
    getMapXRightSide() {
        let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;
    }

    // Fungsi untuk mendapatkan koordinat y pada sisi bawah objek
    getMapYRightSide() {
        let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    }

    // Fungsi untuk mengubah animasi pacman
    changeAnimation() {
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    // Fungsi untuk menggambar pacman pada canvas dengan mempertimbangkan rotasi
    draw() {
        canvasContext.save();
        canvasContext.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        );
        canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
        canvasContext.translate(
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2
        );
        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame - 1) * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            this.x,
            this.y,
            this.width,
            this.height
        );
        canvasContext.restore();
    }
}
