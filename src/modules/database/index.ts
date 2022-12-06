import { Sequelize } from "sequelize-typescript";

import { ActiveMessageSetting } from "../message-settings/active-message-setting.model";
import { MessageSettingValue } from "../message-settings/message-setting-value.model";
import { MessageSetting } from "../message-settings/message-setting.model";
import { Message } from "../messages/message.model";
import { RoomMember } from "../room-members/room-member.model";
import { RoomName } from "../room-names/room-name.model";
import { ActiveRoomSetting } from "../room-settings/active-room-setting.model";
import { RoomSettingValue } from "../room-settings/room-setting-value.model";
import { RoomSetting } from "../room-settings/room-setting.model";
import { RoomType } from "../room-types/room-type.model";
import { Room } from "../rooms/room.model";
import { User } from "../users/user.model";

export let sequelize: Sequelize;

export async function connectDB() {
  sequelize = new Sequelize("chat-app", "postgres", "password", {
    host: 'localhost',
    dialect: 'postgres',
    models: [
      ActiveMessageSetting,
      MessageSettingValue,
      MessageSetting,
      Message,
      ActiveRoomSetting,
      RoomSetting,
      RoomSettingValue,
      RoomMember,
      RoomName,
      RoomType,
      Room,
      User
    ]
  });

  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  console.log('Connection with the Database has been established successfully.');
}
