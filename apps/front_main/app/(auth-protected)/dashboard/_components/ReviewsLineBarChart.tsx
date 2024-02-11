import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer
} from 'recharts';
import styled from 'styled-components';
import { colors } from '@/app/_components/root-layout/styles';

const ChartCard = styled.div`
  background-color: ${colors.white};
  border-radius: 0.5rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1rem;
  height: 30rem;
`;

const ChartTitle = styled.h2`
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: ${colors.gray900};
  margin-left: 1rem;
  margin-bottom: 1.5rem;
`;

export default function ReviewsLineBarChart({
  title,
  data
}: {
  title: string;
  data: any;
}) {
  return (
    <ChartCard>
      <ChartTitle>{title}</ChartTitle>
      <ResponsiveContainer width="99%" height="280px" aspect={2}>
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="platform" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="rating" barSize={20} fill="#413ea0" />
          <Line dataKey="reviews" type="monotone" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
