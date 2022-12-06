import { Optional } from "sequelize";
import { Model, Column, Table, PrimaryKey, Unique, AutoIncrement, Sequelize, HasOne, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Room } from "../rooms/room.model";

export interface RoomNameAttributes {
  id: number;
  room_id: number;
  name: string;
}

export type RoomNameCreationAttributes = Optional<RoomNameAttributes, 'id'>

@Table({ tableName: 'room_names'})
export class RoomName extends Model<RoomNameAttributes, RoomNameCreationAttributes> {
  
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  declare id: number;

  @Unique
  @Column
  declare name: string;

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

  @BelongsTo(() => Room, {
    foreignKey: 'room_id',
    targetKey: 'id'
  })
  declare room: Room;
}
