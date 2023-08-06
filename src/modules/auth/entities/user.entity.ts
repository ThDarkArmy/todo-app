import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "users"})
export class UserEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", length: 100})
    name: string;

    @Column({type: "varchar",  length: 100})
    email: string;

    @Column({type: "varchar",  length: 100})
    password: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}