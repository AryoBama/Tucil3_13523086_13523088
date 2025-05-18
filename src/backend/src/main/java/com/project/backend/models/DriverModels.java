package com.project.backend.models;


public class DriverModels {
    public static void main(String[] args) {
        // Board board = new Board(6, 6, 2, 5);

        // System.out.println("=== Menambahkan mobil utama ===");
        // Car carP = new Car('P', 2, 0, 2, "horizontal");
        // board.addCar(carP, 2, 0);
        // board.displayBoard();

        // System.out.println("=== Menambahkan mobil vertikal yang menabrak ===");
        // Car carA = new Car('A', 0, 0, 3, "vertical");
        // board.addCar(carA, 0, 0); // Tabrakan dengan mobil P di (2, 0)
        // board.displayBoard(); // Tidak akan ditambahkan jika tabrakan dicegah

        // System.out.println("=== Menambahkan mobil vertikal valid ===");
        // Car carB = new Car('B', 0, 1, 3, "vertical");
        // board.addCar(carB, 0, 1);
        // board.displayBoard();

        // System.out.println("=== Menggerakkan mobil utama 1 langkah ke kanan ===");
        // if (board.move('P', 1)) {
        //     System.out.println("Berhasil digerakkan.");
        // } else {
        //     System.out.println("Gagal digerakkan.");
        // }
        // board.displayBoard();

        // System.out.println("=== Menggerakkan mobil utama ke kiri ke luar batas ===");
        // if (board.move('P', -10)) {
        //     System.out.println("Berhasil digerakkan.");
        // } else {
        //     System.out.println("Gagal digerakkan.");
        // }
        // board.displayBoard();

        // System.out.println("=== Menghapus mobil B ===");
        // if (board.removeCar('B')) {
        //     System.out.println("Mobil berhasil dihapus");
        // } else {
        //     System.out.println("Mobil tidak ditemukan");
        // }
        // board.displayBoard();

        // System.out.println("=== Clone board ===");
        // Board cloned = new Board(board);
        // cloned.displayBoard();

        // System.out.println("=== Coba gerakkan mobil utama di board hasil clone ===");
        // cloned.move('P', 1);
        // System.out.println("Board asli:");
        // board.displayBoard();
        // System.out.println("Board clone:");
        // cloned.displayBoard();

        // System.out.println("=== Menambahkan mobil horizontal mepet dinding kanan ===");
        // Car carC = new Car('C', 0, 4, 2, "horizontal");
        // board.addCar(carC, 0, 4);
        // board.displayBoard();

        // System.out.println("=== Coba gerakkan mobil C ke kanan (keluar batas) ===");
        // if (board.move('C', 1)) {
        //     System.out.println("Berhasil digerakkan.");
        // } else {
        //     System.out.println("Gagal digerakkan (keluar batas).");
        // }
        // board.displayBoard();

        // System.out.println("=== Coba gerakkan mobil C ke kiri 2 langkah ===");
        // if (board.move('C', -2)) {
        //     System.out.println("Berhasil digerakkan.");
        // } else {
        //     System.out.println("Gagal digerakkan.");
        // }
        // board.displayBoard();

        // System.out.println("=== Tambah mobil vertikal yang mepet bawah ===");
        // Car carD = new Car('D', 4, 3, 2, "vertical");
        // board.addCar(carD, 4, 3);
        // board.displayBoard();

        // System.out.println("=== Coba gerakkan mobil D ke bawah (keluar batas) ===");
        // if (board.move('D', 1)) {
        //     System.out.println("Berhasil digerakkan.");
        // } else {
        //     System.out.println("Gagal digerakkan (keluar batas).");
        // }
        // board.displayBoard();

        // System.out.println("=== Tambah mobil horizontal yang terhalang mobil lain ===");
        // Car carE = new Car('E', 2, 3, 2, "horizontal");
        // board.addCar(carE, 2, 3);
        // board.displayBoard();

        // System.out.println("=== Coba hapus mobil yang tidak ada ===");
        // boolean result = board.removeCar('Z');
        // if (result) {
        //     System.out.println("Mobil Z dihapus (tidak seharusnya).");
        // } else {
        //     System.out.println("Mobil Z tidak ditemukan.");
        // }

        // System.out.println("=== Cek getCarAt(x, y) ===");
        // System.out.println("Posisi (2, 1): " + board.getCarAt(1, 2));
        // System.out.println("Posisi (5, 5): " + board.getCarAt(5, 5));

        // System.out.println("=== Coba clone lagi dan pindahkan mobil lain ===");
        // Board clone2 = new Board(board);
        // if (clone2.move('C', -1)) {
        //     System.out.println("Mobil C di clone berhasil digerakkan.");
        // }
        // System.out.println("Board asli:");
        // board.displayBoard();
        // System.out.println("Board clone:");
        // clone2.displayBoard();

                // Buat papan 6x6 dengan exit di (2,5)
    //     Board board = new Board(6, 6, 2, 5);

    //     // Tambahkan mobil-mobil
    //     Car redCar = new Car('P', 2, "horizontal"); // mobil tujuan
    //     Car carA = new Car('A', 3, "vertical");
    //     Car carB = new Car('B', 2, "horizontal");

    //     // Tempatkan mobil di papan
    //     board.addCar(redCar, 2, 0);
    //     board.addCar(carA, 3, 0);
    //     board.addCar(carB, 0, 3);

    //     // Tampilkan papan awal
    //     System.out.println("=== Papan Awal ===");
    //     board.displayBoard();

    //     // Buat node root (awal)
    //     BoardState rootState = new BoardState(board, 0, 'P');
    //     BoardNode rootNode = new BoardNode(rootState, 0, 0, null);

    //     // Buat node anak pertama: gerakkan mobil B ke kanan sejauh 1
    //     Board board1 = new Board(board); // duplikat papan
    //     board1.move('P',1);
    //     if (board1.move('B', 1)) {
    //         BoardState state1 = new BoardState(board1, 1, 'B');
    //         BoardNode node1 = new BoardNode(state1, 0, 1, rootNode);
    //         System.out.println("=== Node Anak 1: B ke kanan ===");
    //         node1.getState().displayState();
    //     }

        

    //     // Buat node anak kedua: gerakkan mobil A ke bawah sejauh 1
    //     Board board2 = new Board(board1); // duplikat papan
    //     if (board2.move('A', -1)) {
    //         BoardState state2 = new BoardState(board2, -1, 'A');
    //         BoardNode node2 = new BoardNode(state2, 0, 1, rootNode);
    //         System.out.println("=== Node Anak 2: A ke bawah ===");
    //         node2.getState().displayState();
    //         board.move('A', 1);
    //         node2.getState().displayState();
    //     }else{
    //         System.out.println("Kontol");
    //     }


    //     // Buat node anak ketiga: gerakkan mobil X (redCar) ke kanan sejauh 1
    //     Board board3 = new Board(board2);
    //     if (board3.move('P', 1)) {
    //         BoardState state3 = new BoardState(board3, 1, 'P');
    //         BoardNode node3 = new BoardNode(state3, 0, 1, rootNode);
    //         System.out.println("=== Node Anak 3: X ke kanan ===");
    //         node3.getState().displayState();
    //     }
    }

}
