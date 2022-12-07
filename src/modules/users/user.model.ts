import { Optional } from "sequelize";
import { Model, Column, Table, PrimaryKey, Unique, AutoIncrement, Sequelize, BelongsToMany, HasMany } from "sequelize-typescript";
import { Message } from "../messages/message.model";
import { RoomMember } from "../room-members/room-member.model";
import { Room } from "../rooms/room.model";

export interface UserAttributes {
  id: number;
  username: string;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id'>

@Table({ tableName: 'users' })
export class User extends Model<UserAttributes, UserCreationAttributes> {
  
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  declare id: number;

  @Unique
  @Column
  declare username: string;

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

  @BelongsToMany(() => Room, () => RoomMember, 'user_id')
  declare rooms: Room[]

  @HasMany(() => Message, {
    foreignKey: 'user_id',
    sourceKey: 'id'
  })
  declare messages: Message[]

  @HasMany(() => RoomMember, {
    foreignKey: 'user_id',
    sourceKey: 'id'
  })
  declare roomMembers: RoomMember[];
}
