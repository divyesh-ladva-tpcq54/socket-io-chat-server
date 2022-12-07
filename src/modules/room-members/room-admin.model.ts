import { Optional } from "sequelize";
import { Model, Column, Table, PrimaryKey, Unique, AutoIncrement, Sequelize, ForeignKey, BelongsTo } from "sequelize-typescript";
import { RoomMember } from "./room-member.model";

export interface RoomAdminAttributes {
  id: number;
  room_member_id: number;
}

export type RoomAdminCreationAttributes = Optional<RoomAdminAttributes, 'id'>

@Table({ tableName: 'room_admins'})
export class RoomAdmin extends Model<RoomAdminAttributes, RoomAdminCreationAttributes> {
  
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  declare id: number;

  @ForeignKey(() => RoomMember)
  @Column
  declare room_member_id: number;

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

  @BelongsTo(() => RoomMember, {
    foreignKey: 'room_member_id',
    targetKey: 'id'
  })
  declare room_member: RoomMember
}
