import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

export default function StackedChart({
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
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="followExternal"
            name="переходов на внешние ресурсы"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
          />
          <Area
            type="monotone"
            dataKey="submitBadForm"
            name="перехваченных отзывов"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
