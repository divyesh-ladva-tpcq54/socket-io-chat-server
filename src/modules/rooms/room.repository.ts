import { Op, Transaction } from "sequelize";
import { injectable } from "tsyringe";
import { sequelize } from "../database";
import { DatabaseService } from "../database/database.service";
import { RoomMember } from "../room-members/room-member.model";
import { RoomName } from "../room-names/room-name.model";
import { User } from "../users/user.model";
import { Room } from "./room.model";

@injectable()
export class RoomRepository {
  constructor(private databaseService: DatabaseService) { }

  public async findMutualPrivateChatRoom(userId_1: number, userId_2: number): Promise<Room | null> {
    return await Room.findOne({
      where: { 
        type_id: {
          [Op.eq]: 1
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

  async findUserGroupsByName(userId: number, groupName: string): Promise<Room[]> {
    return Room.findAll({
      include: [
        {
          model: User,
          attributes: [],
          where: {
            id: {
              [Op.eq]: userId
            }
          }
        },
        {
          model: RoomName,
          attributes: ["name"],
          where: {
            name: {
              [Op.eq]: groupName
            }
          }
        }
      ]
    })
  }
}
