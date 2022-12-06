import { Optional } from "sequelize";
import { Model, Column, Table, PrimaryKey, Unique, AutoIncrement, Sequelize, BelongsToMany, HasMany, ForeignKey, HasOne, BelongsTo } from "sequelize-typescript";
import { Message } from "../messages/message.model";
import { RoomMember } from "../room-members/room-member.model";
import { RoomName } from "../room-names/room-name.model";
import { ActiveRoomSetting } from "../room-settings/active-room-setting.model";
import { RoomType } from "../room-types/room-type.model";
import { User } from "../users/user.model";

export interface RoomAttributes {
  id: number;
  type_id: number;
}

export type RoomCreationAttributes = Optional<RoomAttributes, 'id'>

@Table({ tableName: 'rooms' })
export class Room extends Model<RoomAttributes, RoomCreationAttributes> {
  
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  declare id: number;

  @ForeignKey(() => RoomType)
  @Column
  declare type_id: number;

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

  @BelongsToMany(() => User, () => RoomMember, 'room_id')
  declare users: User[]

  @HasMany(() => Message, {
    foreignKey: 'room_id',
    sourceKey: 'id'
  })
  declare messages: Message[]

  @BelongsTo(() => RoomType, {
    foreignKey: 'type_id',
    targetKey: 'id'
  })
  declare roomType: RoomType;

  @HasOne(() => RoomName, {
    foreignKey: 'room_id',
    sourceKey: 'id'
  })
  declare name: RoomName;

  @HasMany(() => ActiveRoomSetting, {
    foreignKey: 'room_id',
    sourceKey: 'id'
  })
  declare activeSettings: ActiveRoomSetting[];
}
