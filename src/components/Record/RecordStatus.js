import { Divider, Popover, Tag, Typography } from 'antd';

import moment from 'moment';

export const RecordStatus = ({ record }) => {
  const isProcessed = !!record.processedAt;
  if (record.refundedAt) {
    return (
      <Popover
        content={
          <div style={{ padding: '0.3em' }}>
            <div style={{ fontWeight: 600 }}>최초 결제시도 일자</div>
            <div>{moment(record.createdAt).format('LTS')}</div>
            <Divider style={{ margin: '10px 0' }} />
            <div style={{ fontWeight: 600 }}>환불일시 일자</div>
            <div>{moment(record.refundedAt).format('LTS')}</div>
            {record.tid && (
              <>
                <Divider style={{ margin: '10px 0' }} />
                <div style={{ fontWeight: 600 }}>결제 ID</div>
                <Typography.Text copyable>{record.tid}</Typography.Text>
              </>
            )}
          </div>
        }
      >
        {(record.tid ? isProcessed : true) ? (
          <Tag color="warning">{record.tid ? 'PG' : '미수금'} 환불됨</Tag>
        ) : (
          <Tag color="processing">환불 대기</Tag>
        )}
      </Popover>
    );
  }

  if (isProcessed) {
    return (
      <Popover
        content={
          <div style={{ padding: '0.3em' }}>
            <div style={{ fontWeight: 600 }}>최초 결제시도 일자</div>
            <div>{moment(record.createdAt).format('LTS')}</div>
            <Divider style={{ margin: '10px 0' }} />
            <div style={{ fontWeight: 600 }}>결제성공 일자</div>
            <div>{moment(record.processedAt).format('LTS')}</div>
            <Divider style={{ margin: '10px 0' }} />
            <div style={{ fontWeight: 600 }}>결제 ID</div>
            <Typography.Text copyable>{record.tid}</Typography.Text>
          </div>
        }
      >
        <Tag color="success">결제됨</Tag>
      </Popover>
    );
  }

  return (
    <Popover
      content={
        <div style={{ padding: '0.3em' }}>
          <div style={{ fontWeight: 600 }}>최초 결제시도 일자</div>
          <div>{moment(record.createdAt).format('LTS')}</div>
          <Divider style={{ margin: '10px 0' }} />
          <div style={{ fontWeight: 600 }}>마지막 결제시도 일자</div>
          <div>{moment(record.createdAt).format('LTS')}</div>
          <Divider style={{ margin: '10px 0' }} />
          <div style={{ fontWeight: 600 }} level={5}>
            마지막 독촉 일자
          </div>
          <div>{moment(record.dunnedAt).format('LTS')}</div>
        </div>
      }
    >
      <Tag color="error">미결제</Tag>
    </Popover>
  );
};
