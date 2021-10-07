import { Card, Col, Input, Row, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { NumberParam, StringParam, useQueryParam } from 'use-query-params';

export const BackofficeTable = ({
  title,
  hasSearch,
  buttons,
  columns,
  rowKey,
  defaultParams,
  onRequest,
  scroll,
  dataSourceKey,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [take, setTake] = useQueryParam('take', NumberParam);
  const [skip, setSkip] = useQueryParam('skip', NumberParam);
  const [search, setSearch] = useQueryParam('search', StringParam);
  const onSearch = (search) => {
    setSearch(search);
    requestDataSource();
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestDataSource();
  };

  const requestDataSource = () => {
    setLoading(true);
    const params = { take, skip, search, ...defaultParams };

    onRequest({ params })
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setDataSource(data[dataSourceKey]);
        setTotal(data.total - params.take);
      });
  };

  useEffect(requestDataSource, [
    dataSourceKey,
    defaultParams,
    onRequest,
    search,
    skip,
    take,
  ]);

  return (
    <Card>
      <Row justify="space-between" gutter={[8, 8]}>
        <Col>
          <Typography.Title level={3}>{title}</Typography.Title>
        </Col>
        {hasSearch && (
          <Col>
            <Row gutter={[8, 8]} justify="center">
              <Col>
                <Input.Search
                  placeholder="검색"
                  loading={isLoading}
                  onSearch={onSearch}
                  enterButton
                />
              </Col>
            </Row>
          </Col>
        )}
        {buttons && <Col flex="auto">{buttons}</Col>}
      </Row>
      {columns.length > 0 && (
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={rowKey || columns[0]?.key}
          loading={isLoading}
          scroll={scroll}
          pagination={{
            onChange: onPagnationChange,
            onShowSizeChange: setTake,
            total,
          }}
        />
      )}
    </Card>
  );
};
