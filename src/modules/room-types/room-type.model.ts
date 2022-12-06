import { Optional } from "sequelize";
import { Model, Column, Table, PrimaryKey, Unique, AutoIncrement, Sequelize, HasMany } from "sequelize-typescript";
import { Room } from "../rooms/room.model";

export interface RoomTypeAttributes {
  id: number;
  name: string;
}

export type RoomTypeCreationAttributes = Optional<RoomTypeAttributes, 'id'>

@Table({ tableName: 'room_types'})
export class RoomType extends Model<RoomTypeAttributes, RoomTypeCreationAttributes> {
  
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  declare id: number;

  @Unique
  @Column
  declare name: string;

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

  @HasMany(() => Room, {
    foreignKey: 'type_id',
    sourceKey: 'id'
  })
  declare rooms: Room[];
}
