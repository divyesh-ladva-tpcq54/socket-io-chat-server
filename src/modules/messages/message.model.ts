import { Optional } from "sequelize";
import { Model, Column, Table, PrimaryKey, Unique, AutoIncrement, Sequelize, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Room } from "../rooms/room.model";
import { User } from "../users/user.model";

export interface MessageAttributes {
  id: number;
  room_id: number;
  user_id: number;
  message: string;
}

export type MessageCreationAttributes = Optional<MessageAttributes, 'id'>

@Table({ tableName: 'messages' })
export class Message extends Model<MessageAttributes, MessageCreationAttributes> {
  
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  declare id: number;

  @ForeignKey(() => User)
  @Column
  declare user_id: number;

  @ForeignKey(() => Room)
  @Column
  declare room_id: number;

  @Column({
    type: "TIMESTAMP",
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  })
  declare createdAt: string;

  @Column({
    type: "TIMESTAMP",
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    onUpdate : Sequelize.literal("CURRENT_TIMESTAMP") as any,
  })
  declare updatedAt: string;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    targetKey: 'id'
  })
  declare users: User[]

  @BelongsTo(() => Room, {
    foreignKey: 'room_id',
    targetKey: 'id'
  })
  declare rooms: Room[]
}
