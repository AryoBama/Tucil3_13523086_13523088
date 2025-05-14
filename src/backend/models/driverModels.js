import { Board } from "./Board.js";
import { Car } from "./Car.js";

function testBoard() {
    const board = new Board(6, 6, 2, 5); // Buat papan 6x6

    console.log("=== Menambahkan mobil utama ===");
    const carP = new Car('P', 2, 0, 2, 'horizontal');
    board.addCar(carP, 2, 0);
    board.displayBoard();

    console.log("=== Menambahkan mobil vertikal yang menabrak ===");
    const carA = new Car('A', 0, 0, 3, 'vertical');
    board.addCar(carA, 0, 0); // Tabrakan dengan mobil P di (2, 0)
    board.displayBoard(); // Tidak akan ditambahkan

    console.log("=== Menambahkan mobil vertikal valid ===");
    const carB = new Car('B', 0, 1, 3, 'vertical');
    board.addCar(carB, 0, 1);
    board.displayBoard();

    console.log("=== Menggerakkan mobil utama 1 langkah ke kanan ===");
    if (board.move('P', 1)) {
        console.log("Berhasil digerakkan.");
    } else {
        console.log("Gagal digerakkan.");
    }
    board.displayBoard();

    console.log("=== Menggerakkan mobil utama ke kiri ke luar batas ===");
    if (board.move('P', -10)) {
        console.log("Berhasil digerakkan.");
    } else {
        console.log("Gagal digerakkan.");
    }
    board.displayBoard();

    console.log("=== Menghapus mobil B ===");
    if (board.removeCar('B')){
        console.log("Mobil berhasil dihapus")
    }else{
        console.log("Mobil tidak ditemukan")
    }
    board.displayBoard();

    console.log("=== Clone board ===");
    const cloned = board.clone();
    cloned.displayBoard();

    console.log("=== Coba gerakkan mobil utama di board hasil clone ===");
    cloned.move('P', 1);
    console.log("Board asli:");
    board.displayBoard();
    console.log("Board clone:");
    cloned.displayBoard();

        console.log("=== Menambahkan mobil horizontal mepet dinding kanan ===");
    const carC = new Car('C', 0, 4, 2, 'horizontal');
    board.addCar(carC, 0, 4); // Ujung kanan grid
    board.displayBoard();

    console.log("=== Coba gerakkan mobil C ke kanan (keluar batas) ===");
    if (board.move('C', 1)) {
        console.log("Berhasil digerakkan.");
    } else {
        console.log("Gagal digerakkan (keluar batas).");
    }
    board.displayBoard();

    console.log("=== Coba gerakkan mobil C ke kiri 2 langkah ===");
    if (board.move('C', -2)) {
        console.log("Berhasil digerakkan.");
    } else {
        console.log("Gagal digerakkan.");
    }
    board.displayBoard();

    console.log("=== Tambah mobil vertikal yang mepet bawah ===");
    const carD = new Car('D', 4, 3, 2, 'vertical');
    board.addCar(carD, 4, 3); // Pas mepet bawah
    board.displayBoard();

    console.log("=== Coba gerakkan mobil D ke bawah (keluar batas) ===");
    if (board.move('D', 1)) {
        console.log("Berhasil digerakkan.");
    } else {
        console.log("Gagal digerakkan (keluar batas).");
    }
    board.displayBoard();

    console.log("=== Tambah mobil horizontal yang terhalang mobil lain ===");
    const carE = new Car('E', 2, 3, 2, 'horizontal');
    board.addCar(carE, 2, 3); // Akan tabrakan dengan mobil P jika P belum pindah
    board.displayBoard();

    console.log("=== Coba hapus mobil yang tidak ada ===");
    const result = board.removeCar('Z'); // Tidak ada ID Z
    if (result) {
        console.log("Mobil Z dihapus (tidak seharusnya).");
    } else {
        console.log("Mobil Z tidak ditemukan.");
    }

    console.log("=== Cek getVehicleAt(x, y) ===");
    console.log(`Posisi (2, 1):`, board.getVehicleAt(1, 2)); // P atau null
    console.log(`Posisi (5, 5):`, board.getVehicleAt(5, 5)); // null jika kosong

    console.log("=== Coba clone lagi dan pindahkan mobil lain ===");
    const clone2 = board.clone();
    if (clone2.move('C', -1)) {
        console.log("Mobil C di clone berhasil digerakkan.");
    }
    console.log("Board asli:");
    board.displayBoard();
    console.log("Board clone:");
    clone2.displayBoard();

}

testBoard();
