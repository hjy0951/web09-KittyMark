import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate, useParams } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';
import { AxiosError } from 'axios';
import { useInView } from 'react-intersection-observer';
// recoil
import user from '../../store/userAtom';
// style
import S from './DirectMessagePageStyles';
// component
import TopBar from '../../components/TopBar/TopBar';
import NavBar from '../../components/NavBar/NavBar';
import MessageForm from '../../components/MessageBox/MessageForm';
import DirectMessage from '../../components/DirectMessage/DirectMessage';
import { Api, DirectMessageData } from '../../types/responseData';
import { getDirectMessages } from '../../apis/api/dmApi';

/*
  구현할 내용
  1. DM 상대 userName과 프로필  
    - 프로필 클릭시 해당 유저의 페이지로 이동
  2. 메시지를 보여줄때 내 메시지는 오른쪽, 상대 메시지는 왼쪽에 붙여 표시
  3. Optimistic Update를 이용하여 메시지 전송 업데이트
    - 서버에서 정상적으로 메시지를 수신하기 전까지 회색의 메시지로 보여줌
    - 서버에서 정상적으로 메시지를 수신했다는 응답이 오면 검은색으로 진하게 표시
    - 만약 서버에서 에러가 발생하는 경우, 재전송 버튼을 함께 달아줌
  4. 채팅방에 들어오거나 새로고침시 항상 가장 아래(최신) 메시지를 볼 수 있도록 useRef 이용
*/

const testMessage = [
  { isReceived: true, message: 'test1', profileUrl: '' },
  { isReceived: true, message: 'test2', profileUrl: '' },
  { isReceived: true, message: 'test3', profileUrl: '' },
  { isReceived: false, message: 'test4', profileUrl: '' },
  { isReceived: false, message: 'test5', profileUrl: '' },
  { isReceived: false, message: 'asdasdasdsadsadsadasdasdas', profileUrl: '' },
  {
    isReceived: false,
    message:
      'asdasdasdsadsadsadasdasdasasdasdsadasdsadasdsadsadasdasdasdsadsaasdsasassadsadasds',
    profileUrl: '',
  },
];

const makeDmComponent = (
  messages: { isReceived: boolean; message: string; profileUrl: string }[],
) => {
  return messages.map((message) => {
    return DirectMessage(message);
  });
};

// const makeDmComponentTest = (messages: DirectMessageData[]) => {
//   return messages.map((message) => {

//   });
// };

const DirectMessagePage = () => {
  const { senderName } = useParams();
  const setUserData = useSetRecoilState(user);
  const { userId, userProfileUrl } = useRecoilValue(user);
  const navigation = useNavigate();
  const { inView } = useInView();
  const [message, setMessage] = useState<string>('');
  const requestCount = 10;

  const fetchDirectMessages = async ({ pageParam = -1 }) => {
    const response = await getDirectMessages(
      userId,
      2,
      requestCount,
      String(pageParam),
    );
    const result = response.data;
    const nextPage = result.nextMaxId;
    return {
      result: result.messages,
      nextPage,
      isLast: nextPage < 1,
    };
  };

  const infiniteQuery = useInfiniteQuery<
    { result: DirectMessageData[]; nextPage: number; isLast: boolean },
    AxiosError<Api>
  >('messageList', fetchDirectMessages, {
    getNextPageParam: (lastPage) => {
      if (!lastPage.isLast) return lastPage.nextPage;
      return undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 1,
    onError: (error) => {
      if (
        error.response &&
        error.response.data.statusCode === 401 &&
        error.response.data.error === 'Unauthorized'
      ) {
        setUserData({ userId: -1, userName: '', userProfileUrl: '' });
        navigation('/');
      }
    },
  });

  const onClickSendMessage = () => {
    // TODO: Socket 서버에 메시지 전달
    setMessage('');
  };

  // TODO: 올바르지 않은 유저 이름일 경우 예외 처리 필요
  if (!senderName) return null;

  useEffect(() => {
    if (inView && infiniteQuery.hasNextPage) {
      infiniteQuery.fetchNextPage();
    }
  }, [inView, infiniteQuery.data]);

  return (
    <>
      <TopBar
        isBack
        title={senderName}
        isCheck={false}
        backFunc={() => navigation(-1)}
      />
      <S.Body>
        <S.MessageWrapper>
          <S.Container>{makeDmComponent(testMessage)}</S.Container>
          {/* <S.Container>{makeDmComponent(messages)}</S.Container> */}
        </S.MessageWrapper>
        <MessageForm
          targetId={userId}
          userProfile={userProfileUrl}
          data={message}
          onClickSendBtn={onClickSendMessage}
          setFunc={setMessage}
        />
      </S.Body>

      <NavBar />
    </>
  );
};

export default DirectMessagePage;
