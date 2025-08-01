import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity("users")
export class TypeOrmUserModel {
    @PrimaryGeneratedColumn("uuid")
    id?: string

    @Column({ length: 100, nullable: false })
    username: string

    @Column({ length: 100, nullable: false })
    password: string

    @CreateDateColumn({ name: 'created_at', type: "timestamp" })
    createdAt?: Date

    @UpdateDateColumn({ name: 'updated_at', type: "timestamp" })
    updatedAt?: Date
}