import { Card, Col, Input, Row, Table, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import {
  NumberParam,
  StringParam,
  useQueryParam,
  withDefault,
} from 'use-query-params';

export const BackofficeTable = ({
  title,
  hasSearch,
  buttons,
  columns,
  rowKey,
  defaultParams,
  onRequest,
  scroll,
  refresh,
  setRefresh,
  dataSourceKey,
  sidebar,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [take, setTake] = useQueryParam('take', withDefault(NumberParam, 10));
  const [skip, setSkip] = useQueryParam('skip', withDefault(NumberParam, 0));
  const [search, setSearch] = useQueryParam('search', StringParam);
  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip((page - 1) * pageSize);
  };

  const requestDataSource = useCallback(() => {
    if (refresh !== undefined && !refresh) return;
    setLoading(true);
    const params = { take, skip, search, ...defaultParams };
    onRequest({ params })
      .finally(() => setLoading(false))
      .then(({ data }) => {
        const dataSource = data[dataSourceKey];
        if (dataSource.length <= 0 && skip > 0) return setSkip(0);
        setDataSource(data[dataSourceKey]);
        setTotal(data.total);
        if (setRefresh) setRefresh(false);
      });
  }, [
    dataSourceKey,
    defaultParams,
    onRequest,
    refresh,
    search,
    setRefresh,
    setSkip,
    skip,
    take,
  ]);

  useEffect(() => {
    requestDataSource();
  }, [
    requestDataSource,
    dataSourceKey,
    defaultParams,
    onRequest,
    refresh,
    search,
    setRefresh,
    setSkip,
    skip,
    take,
  ]);

  return (
    <Card>
      <Row justify='space-between' gutter={[8, 8]}>
        <Col>
          <Typography.Title level={3}>{title}</Typography.Title>
        </Col>
        <Col>
          <Row gutter={[8, 8]} justify='end'>
            {hasSearch && (
              <Col>
                <Input.Search
                  placeholder='검색'
                  defaultValue={search}
                  loading={isLoading}
                  onSearch={setSearch}
                  enterButton
                />
              </Col>
            )}
            {buttons && <Col>{buttons}</Col>}
          </Row>
        </Col>
      </Row>
      {columns.length > 0 && (
        <Row justify='space-between' gutter={[8, 8]}>
          <Col flex='auto'>
            <Table
              columns={columns}
              dataSource={dataSource}
              rowKey={rowKey || columns[0]?.dataIndex}
              loading={isLoading}
              scroll={scroll}
              pagination={{
                current: skip / take + 1,
                pageSize: take,
                onChange: onPagnationChange,
                onShowSizeChange: setTake,
                total,
              }}
            />
          </Col>
          {sidebar && <Col span={8}>{sidebar}</Col>}
        </Row>
      )}
    </Card>
  );
};
