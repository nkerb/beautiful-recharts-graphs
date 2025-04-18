import { Bar, BarChart, Label, Legend, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import styled from "styled-components";

const stroke_gray = 'hsl(210, 5%, 90%)';
const off_black = 'hsl(210, 5%, 15%)';
const darkest_gray = 'hsl(210, 5%, 30%)';
const dark_gray = 'hsl(210, 5%, 45%)';

const exportFill = 'hsl(205, 90%, 30%)';
const importFill = 'hsl(155, 90%, 25%)';
const barRadius = 16;
const radiusArray = [barRadius, barRadius, 0, 0];

const CardContainer = styled.div`
  background-color: white;
  border: 1px solid ${stroke_gray};
  box-sizing: border-box;
  padding: 20px;
  margin: 20px;
  box-shadow: 0px 0px 10px 0px hsla(0, 0%, 0%, 5%);
  border-radius: 16px;
  width: min-content;
  font-family: 'Inter', sans-serif;
`;

const CardTitle = styled.span`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${off_black};
  &:after {
    content: ' '; // Easy way to ensure consistent spacing between title and subtitle when viewed with custom browser font sizes
  }
`;

const CardSubtitle = styled.span`
  font-size: 1.25rem;
  font-weight: 400;
  color: ${darkest_gray};
`;

const GraphCard = ({ data, height, width, minWidth, maxWidth, xAxisKey, yAxisLabel, title, subtitle }) => {
  return (
    <CardContainer
      $minWidth={minWidth}
      $maxWidth={maxWidth}
    >
      <CardTitle>{title}</CardTitle>
      <CardSubtitle>{subtitle}</CardSubtitle>
      <BarChart
        data={data}
        stackOffset='sign'
        width={width}
        height={height}
        margin={{ left: 13, top: 20, right: 10 }}
      >
        <XAxis dataKey={xAxisKey} />
        <YAxis type='number'>
          <Label
            angle={-90}
            position='left'
            style={{ textAnchor: 'middle' }}
          >
            {yAxisLabel}
          </Label>
        </YAxis>
        <Tooltip />
        <Legend />
        <ReferenceLine y={0} stroke={dark_gray} />
        <Bar
          dataKey='exports'
          name='Exports'
          fill={exportFill}
          stackId={0}
          radius={radiusArray}
        />
        <Bar
          dataKey='imports'
          name='Imports'
          fill={importFill}
          stackId={0}
          radius={radiusArray}
        />
      </BarChart>
    </CardContainer>
  );
}

export default GraphCard;