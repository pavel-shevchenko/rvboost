import React from 'react';
import styled from 'styled-components';
import ClicksStackedChart from './ClicksStackedChart';
import { breakpoints, colors } from '@/app/_components/root-layout/styles';
import ReviewsLineBarChart from '@/app/(auth-protected)/dashboard/_components/ReviewsLineBarChart';

const Title = styled.h1`
  font-weight: 600;
  color: ${colors.gray900};
  font-size: 1.5rem;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media (max-width: ${breakpoints.large}) {
    grid-template-columns: 1fr;
    align-items: center;
  }
  grid-auto-flow: row;
  grid-row-gap: 2rem;
  grid-column-gap: 2rem;
  margin-top: 2rem;
`;

const StatWrapper = styled.div`
  height: 100%;
  padding: 1.25rem 1rem;
  @media (min-width: ${breakpoints.small}) {
    padding: 1.5rem;
  }
`;

const Dl = styled.dl`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Dt = styled.dt`
  color: ${colors.gray900};
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5rem;
`;

const Dd = styled.dd`
  margin-top: 0.25rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  @media (min-width: ${breakpoints.medium}) {
    display: block;
  }
  @media (min-width: ${breakpoints.large}) {
    display: flex;
  }
`;

const Number = styled.div`
  display: flex;
  align-items: baseline;
  color: ${colors.indigo600};
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 2rem;
`;

const StatTitle = styled.h2`
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: ${colors.gray900};
`;

const StatsCard = styled.div`
  background-color: ${colors.white};
  overflow: hidden;
  border-radius: 0.5rem;
  margin-top: 1.25rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  @media (min-width: ${breakpoints.medium}) {
    grid-template-columns: ${({ columnsCnt }: { columnsCnt: number }) =>
      `repeat(${columnsCnt}, minmax(0, 1fr))`};
  }
`;

const BorderDiv = styled.div`
  @media (min-width: ${breakpoints.medium}) {
    border-top: ${({ hasNotBorder }: { hasNotBorder: boolean }) =>
      hasNotBorder ? 'none' : `1px solid ${colors.gray200}`};
  }
  @media (min-width: ${breakpoints.medium}) {
    border-left: ${({ hasNotBorder }: { hasNotBorder: boolean }) =>
      hasNotBorder ? 'none' : `1px solid ${colors.gray200}`};
  }
`;

const Stat = ({
  title,
  value,
  hasNotBorder
}: {
  title: string;
  value: any;
  hasNotBorder: boolean;
}) => {
  return (
    <BorderDiv {...{ hasNotBorder }}>
      <StatWrapper>
        <Dl>
          <Dt>{title}</Dt>
          <Dd>
            <Number>{value}</Number>
          </Dd>
        </Dl>
      </StatWrapper>
    </BorderDiv>
  );
};

const CommonDashboard = ({
  title,
  stats,
  reviewsLineBarChart,
  clicksStackedChart
}: {
  title: string;
  stats: Array<{ title: string; value: any }>;
  reviewsLineBarChart?: { title: string; data: any };
  clicksStackedChart?: { title: string; data: any };
}) => {
  return (
    <>
      <Title>{title}</Title>

      <StatTitle>Основные показатели</StatTitle>
      <StatsCard columnsCnt={stats.length}>
        {stats.map((stat, idx) => (
          <Stat {...stat} hasNotBorder={idx === 0} />
        ))}
      </StatsCard>

      <ChartsContainer>
        {reviewsLineBarChart && (
          <ReviewsLineBarChart
            title={reviewsLineBarChart.title}
            data={reviewsLineBarChart.data}
          />
        )}
        {clicksStackedChart && (
          <ClicksStackedChart
            title={clicksStackedChart.title}
            data={clicksStackedChart.data}
          />
        )}
      </ChartsContainer>
    </>
  );
};
export default CommonDashboard;
