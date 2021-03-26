import * as React from "react";
import styled from "styled-components";
import Run from "../component/run";
import SEO from "../component/seo";
import { formatDateTImeString } from "../utils/utils";
import { Line } from "react-chartjs-2";
import { connect } from "mongoose";
import { RunsModel } from "../models/run";

const Lap = styled.div`
  padding: 0.25rem 0.6rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(min-content, max-content)) 1fr;
  border: 1px solid var(--shade-color);
  margin: 0px;
`;
const LapData = styled.div`
  padding: 0.25rem 0.6rem;
  &:nth-child(8n + 1),
  &:nth-child(8n + 2),
  &:nth-child(8n + 3),
  &:nth-child(8n + 4) {
    background-color: var(--shade-color);
  }
`;

const TooltipContainer = styled.div`
  background-color: rgba(52, 49, 61, 0.75);
  padding: 5px;
`;
const defaultTheme = {
  background: "transparent",
  fontFamily: "sans-serif",
  fontSize: 11,
  textColor: "#fff",
  axis: {
    domain: {
      line: {
        stroke: "transparent",
        strokeWidth: 1,
      },
    },
    ticks: {
      line: {
        stroke: "#777777",
        strokeWidth: 1,
      },
      text: {},
    },
    legend: {
      text: {
        fontSize: 12,
      },
    },
  },
  grid: {
    line: {
      stroke: "var(--shade-color)",
      strokeWidth: 1,
    },
  },
  legends: {
    text: {
      fill: "#333333",
    },
  },
  labels: {
    text: {},
  },
  markers: {
    lineColor: "white",
    lineStrokeWidth: 1,
    text: {},
  },
  dots: {
    text: {},
  },
  tooltip: {
    container: {
      background: "white",
      color: "inherit",
      fontSize: "inherit",
      borderRadius: "2px",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)",
      padding: "5px 9px",
    },
    basic: {
      whiteSpace: "pre",
      display: "flex",
      alignItems: "center",
    },
    chip: {
      marginRight: 7,
    },
    table: {},
    tableCell: {
      padding: "3px 5px",
    },
  },
  crosshair: {
    line: {
      stroke: "#f5f5f5",
      strokeWidth: 1,
      strokeOpacity: 0.75,
      strokeDasharray: "6 6",
    },
  },
  annotations: {
    text: {
      fontSize: 13,
      outlineWidth: 2,
      outlineColor: "#ffffff",
    },
    link: {
      stroke: "#000000",
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: "#ffffff",
    },
    outline: {
      fill: "none",
      stroke: "#000000",
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: "#ffffff",
    },
    symbol: {
      fill: "#000000",
      outlineWidth: 2,
      outlineColor: "#ffffff",
    },
  },
};

const commonProperties = {
  width: 900,
  height: 400,
  margin: { top: 20, right: 20, bottom: 60, left: 80 },
  animate: true,
  enableSlices: "x",
};

const RunDetails = ({ data }) => {
  const laps = data?.laps.map((x, count) => {
    const date = new Date(null);
    date.setSeconds(x.total_elapsed_time); // specify value for SECONDS here
    const timeString = date.toISOString().substr(14, 5);
    return (
      <React.Fragment key={x.timestamp}>
        <LapData>{count + 1}</LapData>
        <LapData>{timeString}</LapData>
        <LapData>
          {Math.floor(x.total_distance / 1000)}km{" "}
          {Math.round(x.total_distance % 1000)}m
        </LapData>
        <LapData>{Number(x.enhanced_avg_speed).toFixed(2)} km/t</LapData>
      </React.Fragment>
    );
  });

  const reductionFactor = Math.ceil(data?.path.length / 800);

  const rechartdata = [
    {
      id: "japan",
      color: "hsl(127, 70%, 50%)",
      data: data?.path
        .filter((x, i) => {
          if (i % reductionFactor !== 0) {
            return false;
          }
          return true;
        })
        .map((x, i) => {
          const speed = Math.floor(x.enhanced_speed * 100) / 100;
          const distance = Math.floor(x.distance * 100) / 100;
          return { x: distance, y: speed };
        }),
    },
  ];
  //
  const start_tid_string = formatDateTImeString(data?.start_time);
  const date = new Date(null);
  date.setSeconds(data?.total_elapsed_time); // specify value for SECONDS here
  const timeString = date.toISOString().substr(11, 8);
  const distanceK = Math.floor(data?.total_distance / 1000);
  const distanceM = Math.round(data?.total_distance % 1000);
  const hastighed = Number(data?.enhanced_avg_speed).toFixed(2);
  //

  let xticks = [];
  for (let i = 0; i <= distanceK; i++) {
    xticks.push(i);
  }
  console.log(xticks);
  const datachart = (canvas) => {
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 100, 0);

    return {
      backgroundColor: gradient,
    };
  };
  return (
    <React.Fragment>
      {/* <SEO
        title={`Løb: ${start_tid_string}`}
        description={`Tid: ${timeString} - Dist. ${distanceK}km ${distanceM}m - Hastighed: ${hastighed}`}
      /> */}

      <Run
        start_tid_string={start_tid_string}
        timeString={timeString}
        distanceK={distanceK}
        distanceM={distanceM}
        total_calories={data?.total_calories}
        hastighed={hastighed}
      />

      <Lap>
        <LapData>Lap</LapData>
        <LapData>Tid</LapData>
        <LapData>Dist.</LapData>
        <LapData>Hast.</LapData>
        {laps}
      </Lap>
      <div style={{ width: "100vw", maxWidth: "800px", height: "400px" }}>
        <Line data={datachart} />
        {/* <ResponsiveLine
          colors="#685f82"
          theme={defaultTheme}
          enablePoints={false}
          margin={{ top: 50, right: 110, bottom: 100, left: 80 }}
          data={rechartdata}
          enableGridY={true}
          enableGridX={true}
          gridXValues={xticks}
          gridYValues={[0]}
          enableSlices="x"
          isInteractive={true}
          sliceTooltip={({ slice }) => {
            return (
              <TooltipContainer>
                <div>
                  {`Dist.: ${slice.points[0].data.xFormatted.toFixed(2)} `}km
                </div>
                <div>
                  {`Hast.: ${slice.points[0].data.yFormatted.toFixed(2)} `}km/t
                </div>
              </TooltipContainer>
            );
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: (value) => `${value} km/t`,
            legend: "Hastighed",
            legendOffset: -60,
            legendPosition: "middle",
          }}
          axisBottom={{
            scale: "linaer",
            tickValues: xticks,
            format: (value) => `${value} km`,
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Distance",
            legendOffset: 36,
            legendPosition: "middle",
          }}
        /> */}
      </div>
    </React.Fragment>
  );
};

export default RunDetails;

export async function getStaticPaths() {
  await connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const runs = await RunsModel.find();
  const paths = runs.map((r) => {
    return { params: { id: "" + r.tag } };
  });

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  console.log(params);
  await connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const run = await RunsModel.findOne({ tag: params.id });
  return { props: { data: JSON.parse(JSON.stringify(run)) } };
}
