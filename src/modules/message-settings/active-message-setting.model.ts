import { Optional } from "sequelize";
import { Model, Column, Table, PrimaryKey, Unique, AutoIncrement, Sequelize, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Message } from "../messages/message.model";
import { MessageSettingValue } from "./message-setting-value.model";
import { MessageSetting } from "./message-setting.model";

export interface ActiveMessageSettingAttributes {
  id: number;
  message_id: number;
  message_setting_id: number;
  message_setting_value_id: number;
}

export type ActiveMessageSettingCreationAttributes = Optional<ActiveMessageSettingAttributes, 'id'>

@Table({ tableName: 'active_message_settings'})
export class ActiveMessageSetting extends Model<ActiveMessageSettingAttributes, ActiveMessageSettingCreationAttributes> {
  
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  declare id: number;

  @ForeignKey(() => Message)
  @Column
  declare message_id: number;

  @ForeignKey(() => MessageSetting)
  @Column
  declare message_setting_id: number;

  @ForeignKey(() => MessageSettingValue)
  @Column
  declare message_setting_value_id: number;

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

  @BelongsTo(() => Message, {
    foreignKey: 'message_id',
    targetKey: 'id'
  })
  declare message: Message;

  @BelongsTo(() => MessageSetting, {
    foreignKey: 'message_setting_id',
    targetKey: 'id'
  })
  declare messageSetting: MessageSetting;

  @BelongsTo(() => MessageSettingValue, {
    foreignKey: 'message_setting_value_id',
    targetKey: 'id'
  })
  declare messageSettingValue: MessageSettingValue;
}
