import { AxiosError, AxiosResponse } from 'axios';
import {
  DirectMessageApi,
  DirectMessageListApi,
} from '../../types/responseData';
import { defaultInstance } from '../utils';

const getDirectMessages = async (
  userId: number,
  otherUserId: number,
  count: number,
  maxId: string,
  dmRoomId?: number,
): Promise<DirectMessageApi> => {
  const { data }: AxiosResponse<DirectMessageApi, AxiosError> =
    await defaultInstance.get(
      `/api/dm?userId=${userId}&otherUserId=${otherUserId}&dmRoomId=${dmRoomId}&count=${count}&maxId=${maxId}`,
    );
  return data;
};

const getDirectMessageList = async (
  userId: number,
): Promise<DirectMessageListApi> => {
  const { data }: AxiosResponse<DirectMessageListApi, AxiosError> =
    await defaultInstance.get(`/api/dm?userId=${userId}`);
  return data;
};

export { getDirectMessages, getDirectMessageList };
