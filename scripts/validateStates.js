import { ALL_STATES_CROPS } from "../src/data/index.js";
import stateDistrictPairs from "../src/data/state_district_pairs.json" assert { type: "json" };

const statesFromPairs = [...new Set(stateDistrictPairs.map(s => s.state))];
const statesFromIndex = Object.keys(ALL_STATES_CROPS);

const missingInIndex = statesFromPairs.filter(s => !statesFromIndex.includes(s));
const missingInPairs = statesFromIndex.filter(s => !statesFromPairs.includes(s));

console.log("Missing in index.js:", missingInIndex);
console.log("Missing in state_district_pairs.json:", missingInPairs);
