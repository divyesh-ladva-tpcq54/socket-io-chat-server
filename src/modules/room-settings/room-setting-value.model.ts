import { Optional } from "sequelize";
import { Model, Column, Table, PrimaryKey, Unique, AutoIncrement, Sequelize, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { ActiveRoomSetting } from "./active-room-setting.model";
import { RoomSetting } from "./room-setting.model";

export interface RoomSettingValueAttributes {
  id: number;
  room_setting_id: number;
  value: string;
}

export type RoomSettingValueCreationAttributes = Optional<RoomSettingValueAttributes, 'id'>

@Table({ tableName: 'room_setting_values'})
export class RoomSettingValue extends Model<RoomSettingValueAttributes, RoomSettingValueCreationAttributes> {
  
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  declare id: number;

  @Unique
  @Column
  declare value: string;

  @ForeignKey(() => RoomSetting)
  @Column
  declare room_setting_id: number;

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

  @BelongsTo(() => RoomSetting, {
    foreignKey: 'room_setting_id',
    targetKey: 'id'
  })
  declare roomSetting: RoomSetting;

  @HasMany(() => ActiveRoomSetting, {
    foreignKey: 'room_setting_value_id',
    sourceKey: 'id'
  })
  declare activeRoomSettings: ActiveRoomSetting[];
}
