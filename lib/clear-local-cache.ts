export function clearLocalCache() {
  const keys = [
    "atlas_trip_result",
    "atlas_trip_input",
    "atlas_trip_saved",
    "atlas_trip_id",
    "atlas_planner_state",
    "wayfarer_theme",
  ];
  keys.forEach((key) => sessionStorage.removeItem(key));
  localStorage.removeItem("wayfarer_theme");
}