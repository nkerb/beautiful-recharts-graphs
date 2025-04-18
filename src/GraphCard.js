import { darken } from 'polished';
import { useEffect, useRef, useState } from 'react';
import { Bar, BarChart, Cell, Label, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styled from "styled-components";

const stroke_gray = 'hsl(210, 5%, 90%)';
const off_black = 'hsl(210, 5%, 15%)';
const darkest_gray = 'hsl(210, 5%, 30%)';
const dark_gray = 'hsl(210, 5%, 45%)';

const barRadius = 16;
const radiusArray = [barRadius, barRadius, 0, 0];
const labelFontSize = 14;

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
  .recharts-default-legend {
    li:last-child {
      margin-right: 0px !important; // Remove margin from the last legend item to ensure legend is centered in container
    }
    .recharts-legend-item {
      cursor: pointer; // Apply pointer to only individual legend items
      .recharts-symbols { // Add color transitions to legend items when toggling display of datasets
        transition: fill 0.2s ease;
      }
      .recharts-legend-item-text {
        transition: color 0.2s ease;
      }
    }
  }
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

const HoverContainer = styled.div`
  padding: 10px;
  border-radius: 8px;
  background-color: hsla(0, 100%, 100%, 80%);
  box-shadow: 0px 0px 10px 0px hsla(0, 0%, 0%, 15%);
  backdrop-filter: blur(6px);
  transition: opacity 0.2s ease;
`;

const HoverTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: ${off_black};
`;

const HoverContent = styled.div`
  font-size: 1.0rem;
  font-weight: 400;
  color: ${({ color }) => color || dark_gray};
  margin-top: 2px;
`;

const formatMonthLabelLong = (dateString) => {
  const date = new Date(dateString); // Create a JS Date object from the provided string
  const options = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString('en-US', options); // Output example: "July 2022"
}

const formatMonthLabelShort = (dateString) => {
  const date = new Date(dateString); // Create a JS Date object from the provided string
  const options = { year: '2-digit', month: '2-digit' };
  return date.toLocaleDateString('en-US', options); // Output example: "07/22"
}

const formatValueInMillionDollars = (value) => {
  return `$${Math.abs(value).toLocaleString()}M`; // Use absolute value here since we don't want to actually display negative values for imports
}

const checkVisibleDataIsBilateral = (data, xAxisKey, shownDatasets) => {
  let hasPositive = false;
  let hasNegative = false;

  for (const item of data) {
    for (const key in item) {
      if (key !== xAxisKey) { // Exclude the non-numeric x-axis key
        if (item[key] > 0 && shownDatasets[key]) hasPositive = true; // Check if there is a positive value *in a dataset is currently visible*
        if (item[key] < 0 && shownDatasets[key]) hasNegative = true; // Check if there is a negative value *in a dataset is currently visible*
        if (hasPositive && hasNegative) return true; // Exit early if data is bilateral
      }
    }
  }

  return hasPositive && hasNegative;
};

const CustomTooltip = ({ payload, label }) => {
  return (
    <HoverContainer>
      <HoverTitle>
        {formatMonthLabelLong(label)}
      </HoverTitle>

      {payload.map((b) => {
        return (
          <HoverContent
            key={b.dataKey}
            color={b.fill}
          >
            {b.name}: {formatValueInMillionDollars(b.value)}
          </HoverContent>
        );
      })}
    </HoverContainer>
  )
}

const GraphCard = ({ data, dataStyles, height, width, minWidth, maxWidth, xAxisKey, yAxisLabel, title, subtitle }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [tooltipActive, setTooltipActive] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [legendHover, setLegendHover] = useState(null);
  const [shownDatasets, setShownDatasets] = useState( // Create a list of booleans to track visibility of each dataset
    dataStyles.reduce((obj, item) => {
      obj[item.id] = true;
      return obj;
    }, {})
  );
  const [hasBilateralData, setHasBilateralData] = useState(checkVisibleDataIsBilateral(data, xAxisKey, shownDatasets));

  const timeoutRef = useRef(null);

  const handleBarMouseEnter = () => {
    clearTimeout(timeoutRef.current); // Clear any pending timeouts
    setTooltipActive(true); // Set active to true so tooltip is created in the DOM
    setTooltipVisible(true); // Set visible to true so tooltip is displayed
  };

  const handleBarMouseLeave = () => {
    setTooltipVisible(false); // Immediately hide the tooltip, start the fade transition
    timeoutRef.current = setTimeout(() => {
      setTooltipActive(false); // After fade transition ends, set active to false to remove the tooltip from the DOM
    }, 200);
  }

  const handleLegendItemClick = (id) => {
    setLegendHover(null); // Turn off the hover fade if the user has just toggled the visibility of the legend item
    const newShownDatasets = {
      ...shownDatasets,
      [id]: !shownDatasets[id]
    };
    setShownDatasets(newShownDatasets);
    setHasBilateralData(checkVisibleDataIsBilateral(data, xAxisKey, newShownDatasets));
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current); // Clear timeout on unmount
  });

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
          stackOffset='sign' // Allow both positive and negative values to be shown on the graph
          margin={{ left: 13, top: 20, right: 10, bottom: 50 }}
        >
          <XAxis
            dataKey={xAxisKey}
            tickFormatter={(value) => formatMonthLabelShort(value)} // Use human-friendly date format
            angle={-60}
            dy={18}
            dx={-6}
            axisLine={false}
            tickLine={false}
            fontSize={labelFontSize}
          />
          <YAxis
            type='number'
            tickFormatter={(value) => value.toLocaleString()} // Add commas
            axisLine={false}
            tickLine={false}
            fontSize={labelFontSize}
          >
            <Label
              angle={-90}
              position='left'
              style={{ textAnchor: 'middle' }}
              fontSize={labelFontSize}
            >
              {yAxisLabel}
            </Label>
          </YAxis>
          <Tooltip
            cursor={false}
            content={CustomTooltip}
            active={tooltipActive} // Force the tooltip to rely on our custom state management, to allow for smooth fade in/fade out
            wrapperStyle={{
              opacity: tooltipVisible ? 1 : 0, // Initially hidden
              transition: `opacity 0.2s ease, transform 0.4s ease-in-out` // Add opacity transition for fade in/out effect. transform is default for the tooltip's movement, but it's easier to just declare it again than try to pull in existing wrapper styling
            }}
          />
          {hasBilateralData && <ReferenceLine y={0} stroke={dark_gray} />}
          {dataStyles.map((b) =>
            <Bar
              key={b.id}
              dataKey={b.id}
              name={b.displayName}
              hide={!shownDatasets[b.id]} // Don't display the dataset if hidden via legend click
              fill={b.fillColor}
              opacity={(legendHover === null || b.id === legendHover) ? 1 : 0.8} // Reduce opacity if another dataset is hovered in legend
              stackId={0}
              radius={hasBilateralData ? radiusArray : barRadius} // Apply radius to all 4 corners if only showing one dataset, otherwise only round top/bottom corners
              style={{
                cursor: 'pointer',
                transition: 'fill 0.2s ease, opacity 0.2s ease' // Smooth transition for bar hover (fill) and dataset legend hover (opacity)
              }}
              onMouseEnter={handleBarMouseEnter}
              onMouseLeave={handleBarMouseLeave}
            >
              {data.map((index) => {
                const barKey = `${b.id}-${index}`; // completely unique key to each bar for the mapping
                const hoverKey = index; // index-based key to each x-axis segment for hover functionality
                return (
                  <Cell
                    key={barKey}
                    fill={hoveredBar === hoverKey ? darken(0.05, b.fillColor) : b.fillColor} // Darken color if bar is hovered
                    onMouseEnter={() => setHoveredBar(hoverKey)}
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                );
              })}
            </Bar>
          )}
          <Legend
            wrapperStyle={{
              marginBottom: -30
            }}
            iconType='circle'
            iconSize={12}
            onMouseEnter={(payload) => shownDatasets[payload.dataKey] && setLegendHover(payload.dataKey)} // apply hover effect if dataset is visible
            onMouseLeave={(payload) => shownDatasets[payload.dataKey] && setLegendHover(null)} // Reset hover effect if dataset is visible (the check isn't technically necessary, but it's one less function call)
            onClick={(payload) => handleLegendItemClick(payload.dataKey)}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContainer>
  );
}

export default GraphCard;