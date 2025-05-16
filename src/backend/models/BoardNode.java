package backend.models;

public class BoardNode {

    private Board board;
    private BoardState state;
    private int h;
    private int g;
    private BoardNode parent;

    public BoardNode(Board board, int g, BoardNode parent, int step, Character carId){
        this.board = board;
        this.state = new BoardState(board, step, carId);
        this.h = 0;
        this.g = g;
        this.parent = parent;
    }

    public BoardNode(Board board, BoardState state, int h, int g, BoardNode parent, int step, Character carId){
        this.board = board;
        this.state = new BoardState(board, step, carId);
        this.h = h;
        this.g = g;
        this.parent = parent;
    }

    public BoardState getState(){
        return this.state;
    }

    public int getH(){
        return this.h;
    }

    public int getG(){
        return this.g;
    }

    public BoardNode getParent(){
        return this.parent;
    }

    public Board getBoard(){
        return this.board;
    }
}
