
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class BoardPost {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Board, (board) => board.id)
    @Column('board_id')
    @JoinColumn({ name: 'board_id' })
    boardId: number;

    @Column()
    title: string;

    @Column()
    contents: string;

    @Column()
    writer: string;

    @Column()
    passwd: string;

    @Column()
    registDate: string;
}