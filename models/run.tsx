import mongoose from "mongoose";

const runSchema = new mongoose.Schema({
  total_distance: Number,
  total_calories: Number,
  enhanced_avg_speed: Number,
  total_elapsed_time: Number,
  start_time: Date,
  timestamp: Date,
  tag: String,
  path: [
    {
      timestamp: Date,
      position_lat: Number,
      position_long: Number,
      distance: Number,
      speed: Number,
      enhanced_speed: Number,
    },
  ],
  laps: [
    {
      timestamp: Date,
      start_time: Date,
      start_position_lat: Number,
      start_position_long: Number,
      end_position_lat: Number,
      end_position_long: Number,
      total_elapsed_time: Number,
      total_distance: Number,
      avg_speed: Number,
      enhanced_avg_speed: Number,
    },
  ],
});

const runsSchema = new mongoose.Schema({
  total_distance: Number,
  total_calories: Number,
  enhanced_avg_speed: Number,
  total_elapsed_time: Number,
  start_time: Date,
  timestamp: Date,
  tag: String,
});

export const RunModel = mongoose.models.Run || mongoose.model("Run", runSchema);

export const RunsModel =
  mongoose.models.Runs || mongoose.model("Runs", runsSchema);
