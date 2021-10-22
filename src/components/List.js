import {
  Card,
  Col,
  Divider,
  Input,
  List,
  Row,
  Skeleton,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

export const BackofficeList = ({
  title,
  hasSearch,
  buttons,
  defaultParams,
  onRequest,
  dataSourceKey,
  renderItem,
}) => {
  const take = 6;
  const scrollableTarget = `scrollableDiv-${Date.now()}`;
  const [isLoading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState();
  const onSearch = (value) => {
    if (value !== search) setDataSource([]);
    setSearch(value);
  };

  const requestDataSource = () => {
    setLoading(true);
    const params = { take, skip, search };
    onRequest({ params })
      .finally(() => setLoading(false))
      .then(({ data }) => {
        const newDataSource = data[dataSourceKey];
        setDataSource((d) => [...d, ...newDataSource]);
        setTotal(data.total);
      });
  };

  const requestMoreData = () => setSkip(skip + take);
  useEffect(requestDataSource, [
    dataSourceKey,
    defaultParams,
    onRequest,
    search,
    setSkip,
    skip,
    take,
  ]);

  return (
    <Card>
      <Row justify="space-between" gutter={[8, 8]}>
        <Col>
          <Typography.Title level={3}>
            {title}({total || dataSource.length})
          </Typography.Title>
        </Col>
        <Col>
          <Row gutter={[8, 8]} justify="end">
            {hasSearch && (
              <Col>
                <Input.Search
                  placeholder="검색"
                  defaultValue={search}
                  loading={isLoading}
                  onSearch={onSearch}
                  enterButton
                />
              </Col>
            )}
            {buttons && <Col>{buttons}</Col>}
          </Row>
        </Col>
      </Row>
      <div
        id={scrollableTarget}
        style={{
          height: 400,
          overflow: 'auto',
          padding: '8px 24px',
          border: '1px solid #e8e8e8',
          borderRadius: 4,
        }}
      >
        <InfiniteScroll
          dataLength={dataSource.length}
          next={requestMoreData}
          hasMore={!!total && dataSource.length < total}
          loader={<Skeleton active paragraph={{ rows: 1 }} />}
          scrollableTarget={scrollableTarget}
          endMessage={
            dataSource.length > 6 && <Divider plain>더이상 없습니다.</Divider>
          }
        >
          <List
            itemLayout="vertical"
            dataSource={dataSource}
            renderItem={renderItem}
          />
        </InfiniteScroll>
      </div>
    </Card>
  );
};
