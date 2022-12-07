export interface IPrivateMessageData {
  message: string,
  to: string
}

export interface IGroupMessageData {
  message: string,
  groupName: string
}

export interface IGroupCreateData {
  groupName: string
}

export interface IGroupMemberAddData {
  username: string;
  groupName: string;
}

export interface IMessageObjectRender {
  id: number,
  message: string,
  sender: {
    id: number,
    username: string,
    isAdmin?: boolean,
  },
  group?: {
    id: number, 
    name: string,
  }
  isForwarded?: boolean,
}

export interface IMessagesFullObjectEmit {
  messages: IMessageObjectRender[]
}
