import { AxiosError, AxiosResponse } from 'axios';
import {
  DirectMessageDataApi,
  DirectMessageListApi,
  Api,
} from '../../types/responseData';
import { defaultInstance } from '../utils';

const getDirectMessages = async (
  userId: number,
  otherUserId: number,
  count: number,
  maxId: string,
  dmRoomId: number,
): Promise<DirectMessageDataApi> => {
  const { data }: AxiosResponse<DirectMessageDataApi, AxiosError> =
    await defaultInstance.get(
      dmRoomId > -1
        ? `/api/dm?userId=${userId}&otherUserId=${otherUserId}&dmRoomId=${dmRoomId}&count=${count}&maxId=${maxId}`
        : `/api/dm?userId=${userId}&otherUserId=${otherUserId}&count=${count}&maxId=${maxId}`,
    );
  return data;
};

const getDirectMessageList = async (
  userId: number,
): Promise<DirectMessageListApi> => {
  const { data }: AxiosResponse<DirectMessageListApi, AxiosError> =
    await defaultInstance.get(`/api/dm/${userId}`); // Query String말고 Url Parameter로 보내야 함. (수정 완)
  return data;
};

const patchLastSeenDm = async (
  dmRoomId: number,
  userId: number,
  messageId?: string,
): Promise<Api> => {
  const sendData: { dmRoomId: number; userId: number; messageId?: string } = {
    dmRoomId,
    userId,
  };
  if (messageId) sendData.messageId = messageId;
  const { data }: AxiosResponse<Api, AxiosError> = await defaultInstance.patch(
    `/api/dm/lastSeenDM`,
    sendData,
  );
  return data;
};

export { getDirectMessages, getDirectMessageList, patchLastSeenDm };
