import { Optional } from "sequelize";
import { Model, Column, Table, PrimaryKey, Unique, AutoIncrement, Sequelize, HasMany } from "sequelize-typescript";
import { ActiveMessageSetting } from "./active-message-setting.model";
import { MessageSettingValue } from "./message-setting-value.model";

export interface MessageSettingAttributes {
  id: number;
  name: string;
}

export type MessageSettingCreationAttributes = Optional<MessageSettingAttributes, 'id'>

@Table({ tableName: 'message_settings'})
export class MessageSetting extends Model<MessageSettingAttributes, MessageSettingCreationAttributes> {
  
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

  @HasMany(() => MessageSettingValue, {
    foreignKey: 'message_setting_id',
    sourceKey: 'id'
  })
  declare messageSettingValues: MessageSettingValue[];

  @HasMany(() => ActiveMessageSetting, {
    foreignKey: 'message_setting_id',
    sourceKey: 'id'
  })
  declare activeMessageSettings: ActiveMessageSetting[];
}
