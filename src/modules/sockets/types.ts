export interface IPrivateMessageData {
  message: string,
  sender: {
    id: number,
    username: string
  },
  to: string
}

export interface IGroupMessageData {
  message: string,
  sender: {
    id: number,
    username: string
  },
  groupName: string
}

export interface IMessageObjectRender {
  id: number,
  message: string,
  sender: {
    id: number,
    username: string,
    idAdmin?: boolean,
  },
  isForwarded?: boolean,
}

export interface IMessagesFullObjectEmit {
  messages: IMessageObjectRender[]
}
