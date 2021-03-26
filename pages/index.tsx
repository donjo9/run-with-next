import Head from "next/head";
import styled from "styled-components";
import Link from "next/link";
import tw from "twin.macro";
import SEO from "../component/seo";
import { formatDateTImeString } from "../utils/utils";
import Run from "../component/run";
import { RunsModel } from "../models/run";
import mongoose from "mongoose";

const Runs = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
`;

const RunLink = styled.a`
  text-decoration: none;
  color: #f8f8f8;
  &:hover {
    background-color: var(--shade-color);
  }
`;

export default function Home({ runs }) {
  return (
    <Runs>
      {/* <SEO title="Hjem" /> */}
      {runs
        ?.sort((a, b) => b.start_time - a.start_time)
        .map((x) => {
          const start_tid_string = formatDateTImeString(x.start_time);
          const date = new Date(null);
          date.setSeconds(x.total_elapsed_time); // specify value for SECONDS here
          const timeString = date.toISOString().substr(11, 8);
          const distanceK = Math.floor(x.total_distance / 1000);
          const distanceM = Math.round(x.total_distance % 1000);
          const hastighed = Number(x.enhanced_avg_speed).toFixed(2);
          return (
            <Link href={`/${x.tag}`} key={x._id} passHref>
              <RunLink>
                <Run
                  {...{
                    start_tid_string: x.start_time,
                    timeString,
                    distanceK,
                    distanceM,
                    hastighed,
                    total_calories: x.total_calories,
                  }}
                />
              </RunLink>
            </Link>
          );
        })}
    </Runs>
  );
}

export async function getStaticProps() {
  await mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const runs = await RunsModel.find();
  return { props: { runs: JSON.parse(JSON.stringify(runs)) } };
}
