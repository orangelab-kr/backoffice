import {
  CameraOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  DislikeOutlined,
  ExclamationCircleOutlined,
  EyeInvisibleOutlined,
  FrownOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SelectOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';

export const MonitoringActionType = {
  OnlySave: <Button icon={<SaveOutlined />}>저장</Button>,
  SendMessage: (
    <Button type="primary" icon={<MessageOutlined />}>
      저장 및 통보
    </Button>
  ),
  AddPayment: (
    <Button type="primary" icon={<CreditCardOutlined />} danger>
      저장 및 결제
    </Button>
  ),
};

export const MonitoringStatus = [
  {
    type: 'BEFORE_CONFIRM',
    action: MonitoringActionType.OnlySave,
    name: '확인이 필요한 킥보드',
    icon: <QuestionCircleOutlined />,
  },
  {
    type: 'CONFIRMED',
    action: MonitoringActionType.OnlySave,
    name: '문제 없는 킥보드',
    icon: <CheckCircleOutlined />,
  },
  {
    type: 'WRONG_PARKING',
    action: MonitoringActionType.SendMessage,
    name: '잘못 주차된 킥보드',
    icon: <ExclamationCircleOutlined />,
  },
  {
    type: 'DANGER_PARKING',
    action: MonitoringActionType.SendMessage,
    name: '위험 주차된 킥보드',
    icon: <WarningOutlined />,
  },
  {
    type: 'IN_COLLECTION_AREA',
    action: MonitoringActionType.SendMessage,
    name: '수거 지역에 반납된 킥보드',
    icon: <SelectOutlined />,
  },
  {
    type: 'WRONG_PICTURE',
    action: MonitoringActionType.SendMessage,
    name: '수거 지역에 반납된 킥보드',
    icon: <CameraOutlined />,
  },
  {
    type: 'NO_PICTURE',
    action: MonitoringActionType.SendMessage,
    name: '미제출된 반납 사진',
    icon: <EyeInvisibleOutlined />,
  },
  {
    type: 'COLLECTED_KICKBOARD',
    action: MonitoringActionType.AddPayment,
    name: '수거된 킥보드',
    icon: <DislikeOutlined />,
  },
  {
    type: 'TOWED_KICKBOARD',
    action: MonitoringActionType.AddPayment,
    name: '견인된 킥보드',
    icon: <FrownOutlined />,
  },
];
