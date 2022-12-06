import { Optional } from "sequelize";
import { Model, Column, Table, PrimaryKey, Unique, AutoIncrement, Sequelize, HasMany } from "sequelize-typescript";
import { ActiveRoomSetting } from "./active-room-setting.model";
import { RoomSettingValue } from "./room-setting-value.model";

export interface RoomSettingAttributes {
  id: number;
  name: string;
}

export type RoomSettingCreationAttributes = Optional<RoomSettingAttributes, 'id'>

@Table({ tableName: 'room_settings'})
export class RoomSetting extends Model<RoomSettingAttributes, RoomSettingCreationAttributes> {
  
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

  @HasMany(() => RoomSettingValue, {
    foreignKey: 'room_setting_id',
    sourceKey: 'id'
  })
  declare roomSettingValues: RoomSettingValue[];

  @HasMany(() => ActiveRoomSetting, {
    foreignKey: 'room_setting_id',
    sourceKey: 'id'
  })
  declare activeRoomSettings: ActiveRoomSetting[];
}
