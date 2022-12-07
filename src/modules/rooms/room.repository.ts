import { Model, Op, Transaction } from "sequelize";
import { injectable } from "tsyringe";
import { sequelize } from "../database";
import { DatabaseService } from "../database/database.service";
import { RoomAdmin } from "../room-members/room-admin.model";
import { RoomMember } from "../room-members/room-member.model";
import { RoomName } from "../room-names/room-name.model";
import { RoomTypeIds } from "../room-types/constants";
import { User } from "../users/user.model";
import { Room } from "./room.model";

@injectable()
export class RoomRepository {
  constructor(private databaseService: DatabaseService) { }

  public async findMutualPrivateChatRoom(userId_1: number, userId_2: number): Promise<Room | null> {
    return await Room.findOne({
      where: { 
        type_id: {
          [Op.eq]: RoomTypeIds.privateChat
        }
      },
      include: [
        {
          model: User,
          through: {
            attributes: []
          },
          where: {
            id: {
              [Op.in]: [userId_1, userId_2]
            }
          }
        }
      ]
    });
  }

  public async createPrivateChatRoom(userId_1: number, userId_2: number): Promise<Room | null> {
    const transaction = async (t: Transaction): Promise<any> => {
      let members: RoomMember[] = [];
      const room = await Room.create({
        type_id: 1
      }, { transaction: t});

      if (!room) {
        throw new Error("Cannot create room");
      }

      for (let userId of [userId_1, userId_2]) {
        let user = await RoomMember.create({
          room_id: room.id,
          user_id: userId
        }, { transaction: t });

        members.push(user);
      }

      if (members.length != 2) {
        throw new Error("Cannot add member to room");
      }

      return room;
    }

    return await this.databaseService.runTransaction<Room>(transaction);
  }

  async createGroupChatRoom(userId: number, groupName: string): Promise<Room | null> {
    const transaction = async (t: Transaction) => {
      // create a room
      const newRoom = await Room.create({
        type_id: RoomTypeIds.groupChat
      }, { transaction: t });

      // add a provided group name to the created room
      await RoomName.create({
        name: groupName,
        room_id: newRoom.id
      }, { transaction: t });
      
      // add current user to the room
      const newMember = await RoomMember.create({
        room_id: newRoom.id,
        user_id: userId
      }, { transaction: t });

      // make the current user the admin of the group
      await RoomAdmin.create({
        room_member_id: newMember.id
      }, { transaction: t });

      return newRoom;
    }

    return this.databaseService.runTransaction<Room>(transaction);
  }

  async findGroupByName(name: string): Promise<Room | null> {
    return Room.findOne({
      include: [
        {
          model: RoomName,
          attributes: ["name"],
          where: {
            name
          }
        }
      ]
    })
  }

  async findUserInGroup(userId: number, groupName: string): Promise<Room | null> {    
    return Room.findOne({
      include: [
        {
          model: RoomName,
          attributes: ["name"],
          where: {
            name: {
              [Op.eq]: groupName
            }
          },
        },
        {
          model: User,
          through: {
            attributes: []
          },
          where: {
            id: userId
          }
        }
      ]
    })
  }

  // TODO - GET ADMIN
  async getGroupAdmins(groupName: string): Promise<any> {
    const sql = `select u.id as user_id, u.username as username, case when ra.id is not null then 'Y' else 'N' end as is_admin from (
      (((rooms r inner join room_names rn on rn.name = '${groupName}' and rn.room_id = r.id)
          inner join room_members rm on rm.room_id = r.id) 
          inner join room_admins ra on ra.room_member_id = rm.id) 
          inner join users u on u.id = rm.user_id)`;
    
    const [result, metadata] = await sequelize.query(sql);
    return result;
  }
}
