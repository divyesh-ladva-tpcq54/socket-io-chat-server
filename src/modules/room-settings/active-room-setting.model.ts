import { Optional } from "sequelize";
import { Model, Column, Table, PrimaryKey, Unique, AutoIncrement, Sequelize, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Room } from "../rooms/room.model";
import { RoomSettingValue } from "./room-setting-value.model";
import { RoomSetting } from "./room-setting.model";

export interface ActiveRoomSettingAttributes {
  id: number;
  room_id: number;
  room_setting_id: number;
  room_setting_value_id: number;
}

export type ActiveRoomSettingCreationAttributes = Optional<ActiveRoomSettingAttributes, 'id'>

@Table({ tableName: 'active_room_settings'})
export class ActiveRoomSetting extends Model<ActiveRoomSettingAttributes, ActiveRoomSettingCreationAttributes> {
  
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  declare id: number;

  @ForeignKey(() => Room)
  @Column
  declare room_id: number;

  @ForeignKey(() => RoomSetting)
  @Column
  declare room_setting_id: number;

  @ForeignKey(() => RoomSettingValue)
  @Column
  declare room_setting_value_id: number;

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

  @BelongsTo(() => RoomSetting, {
    foreignKey: 'room_setting_id',
    targetKey: 'id'
  })
  declare roomSetting: RoomSetting;

  @BelongsTo(() => RoomSettingValue, {
    foreignKey: 'room_setting_value_id',
    targetKey: 'id'
  })
  declare roomSettingValue: RoomSettingValue;
}
