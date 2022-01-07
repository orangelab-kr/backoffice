import {
  CameraOutlined,
  CheckCircleOutlined,
  DislikeOutlined,
  ExclamationCircleOutlined,
  EyeInvisibleOutlined,
  FrownOutlined,
  QuestionCircleOutlined,
  SelectOutlined,
  WarningOutlined,
} from '@ant-design/icons';

export const MonitoringActionType = {
  OnlySave: 'OnlySave',
  SendMessage: 'SendMessage',
  AddPayment: 'AddPayment',
};

export const MonitoringLogType = [
  {
    type: 'INFO',
    text: '일반',
    color: 'black',
  },
  {
    type: 'CHANGED',
    text: '-----------',
    color: 'gray',
  },
  {
    type: 'SEND_MESSAGE',
    text: '통보',
    color: 'coral',
  },
  {
    type: 'ADD_PAYMENT',
    text: '결제',
    color: 'red',
  },
];

export const MonitoringStatus = [
  {
    type: 'BEFORE_CONFIRM',
    action: MonitoringActionType.OnlySave,
    name: '확인이 필요한 킥보드',
    icon: <QuestionCircleOutlined />,
    color: 'black',
  },
  {
    type: 'CONFIRMED',
    action: MonitoringActionType.OnlySave,
    name: '문제 없는 킥보드',
    icon: <CheckCircleOutlined />,
    color: 'green',
  },
  {
    type: 'WRONG_PARKING',
    action: MonitoringActionType.SendMessage,
    name: '잘못 주차된 킥보드',
    icon: <ExclamationCircleOutlined />,
    color: 'coral',
  },
  {
    type: 'DANGER_PARKING',
    action: MonitoringActionType.SendMessage,
    name: '위험 주차된 킥보드',
    icon: <WarningOutlined />,
    color: 'coral',
  },
  {
    type: 'IN_COLLECTION_AREA',
    action: MonitoringActionType.SendMessage,
    name: '수거 지역에 반납된 킥보드',
    icon: <SelectOutlined />,
    color: 'coral',
  },
  {
    type: 'WRONG_PICTURE',
    action: MonitoringActionType.SendMessage,
    name: '잘못된 반납 사진',
    icon: <CameraOutlined />,
    color: 'coral',
  },
  {
    type: 'NO_PICTURE',
    action: MonitoringActionType.SendMessage,
    name: '미제출된 반납 사진',
    icon: <EyeInvisibleOutlined />,
    color: 'coral',
  },
  {
    type: 'COLLECTED_KICKBOARD',
    action: MonitoringActionType.AddPayment,
    name: '수거된 킥보드',
    icon: <DislikeOutlined />,
    color: 'red',
  },
  {
    type: 'TOWED_KICKBOARD',
    action: MonitoringActionType.AddPayment,
    name: '견인된 킥보드',
    icon: <FrownOutlined />,
    color: 'red',
  },
];
