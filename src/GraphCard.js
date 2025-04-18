import { Bar, BarChart, Label, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styled from "styled-components";

const stroke_gray = 'hsl(210, 5%, 90%)';
const off_black = 'hsl(210, 5%, 15%)';
const darkest_gray = 'hsl(210, 5%, 30%)';
const dark_gray = 'hsl(210, 5%, 45%)';

const barRadius = 16;
const radiusArray = [barRadius, barRadius, 0, 0];

const CardContainer = styled.div`
  box-sizing: border-box;
  background-color: white;
  border: 1px solid ${stroke_gray};
  border-radius: 16px;
  box-shadow: 0px 0px 10px 0px hsla(0, 0%, 0%, 5%);
  font-family: 'Inter', sans-serif;
  padding: 20px;
  margin: 20px;
  height: ${({ height }) => height ? `${height}px` : 'auto'};
  width: ${({ width }) => width ? `${width}px` : 'auto'};
  min-width: ${({ $minWidth }) => $minWidth ? `${$minWidth}px` : 'auto'}; // Use transient props to prevent DOM warning (https://medium.com/@probablyup/introducing-transient-props-f35fd5203e0c)
  max-width: ${({ $maxWidth }) => $maxWidth ? `${$maxWidth}px` : 'auto'};
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

const GraphCard = ({ data, dataStyles, height, width, minWidth, maxWidth, xAxisKey, yAxisLabel, title, subtitle }) => {
  return (
    <CardContainer
      height={height}
      width={width}
      $minWidth={minWidth}
      $maxWidth={maxWidth}
    >
      <CardTitle>{title}</CardTitle>
      <CardSubtitle>{subtitle}</CardSubtitle>
      <ResponsiveContainer
        height='100%'
        width='100%'
      >
        <BarChart
          data={data}
          stackOffset='sign'
          margin={{ left: 13, top: 20, right: 10, bottom: 20 }}
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
          {dataStyles.map((b) =>
            <Bar
              key={b.id}
              dataKey={b.id}
              name={b.displayName}
              fill={b.fillColor}
              stackId={0}
              radius={radiusArray}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </CardContainer>
  );
}

export default GraphCard;