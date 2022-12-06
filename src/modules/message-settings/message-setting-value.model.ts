import { Optional } from "sequelize";
import { Model, Column, Table, PrimaryKey, Unique, AutoIncrement, Sequelize, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { ActiveMessageSetting } from "./active-message-setting.model";
import { MessageSetting } from "./message-setting.model";

export interface MessageSettingValueAttributes {
  id: number;
  message_setting_id: number;
  value: string;
}

export type MessageSettingValueCreationAttributes = Optional<MessageSettingValueAttributes, 'id'>

@Table({ tableName: 'message_setting_values'})
export class MessageSettingValue extends Model<MessageSettingValueAttributes, MessageSettingValueCreationAttributes> {
  
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  declare id: number;

  @Unique
  @Column
  declare value: string;

  @ForeignKey(() => MessageSetting)
  @Column
  declare message_setting_id: number;

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

  @BelongsTo(() => MessageSetting, {
    foreignKey: 'message_setting_id',
    targetKey: 'id'
  })
  declare messageSetting: MessageSetting;

  @HasMany(() => ActiveMessageSetting, {
    foreignKey: 'message_setting_value_id',
    sourceKey: 'id'
  })
  declare activeMessageSettings: ActiveMessageSetting[];
}
