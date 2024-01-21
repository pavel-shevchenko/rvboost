'use client';

import { ReviewInterceptionHydration } from '@/services/typing';
import { Space } from 'antd';

export default function ClientSideForm({
  data
}: {
  data: ReviewInterceptionHydration;
}) {
  return (
    <>
      <Space style={{ height: '100px' }}>&nbsp;</Space>
      {data.logo && (
        <Space
          style={{
            width: '100%',
            paddingBottom: '10px',
            justifyContent: 'center'
          }}
        >
          <img width={50} src={data.logo} />
        </Space>
      )}
    </>
  );
}
