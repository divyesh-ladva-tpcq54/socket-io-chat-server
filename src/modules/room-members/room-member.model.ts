import { Optional } from "sequelize";
import { Model, Column, Table, PrimaryKey, Unique, AutoIncrement, Sequelize, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Room } from "../rooms/room.model";
import { User } from "../users/user.model";

export interface RoomMemberAttributes {
  id: number;
  room_id: number;
  user_id: number;
}

export type RoomMemberCreationAttributes = Optional<RoomMemberAttributes, 'id'>

@Table({ tableName: 'room_members'})
export class RoomMember extends Model<RoomMemberAttributes, RoomMemberCreationAttributes> {
  
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

  @BelongsTo(() => User, 'user_id')
  declare user: User[]

  @BelongsTo(() => Room, 'room_id')
  declare room: Room[]
}
