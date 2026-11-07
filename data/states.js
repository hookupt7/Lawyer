'use strict';
/**
 * Oakstone Legal Group - Jurisdictional Registry
 * All 50 states + District of Columbia.
 * admitted = Oakstone has counsel of record in that state.
 * localCounsel = 'Available' | 'On request' (co-counsel routing).
 */

module.exports = [
  {
    "code": "AL",
    "name": "Alabama",
    "capital": "Montgomery",
    "barName": "Alabama State Bar",
    "courts": "Unified Judicial System of Alabama",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Alabama applies an equitable-distribution model in divorce rather than community property, and its wrongful-death statute is punitive rather than compensatory."
  },
  {
    "code": "AK",
    "name": "Alaska",
    "capital": "Juneau",
    "barName": "Alaska Bar Association",
    "courts": "Alaska Court System",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Alaska is a community-property state, so marital property is divided equally in dissolution rather than equitably."
  },
  {
    "code": "NY",
    "name": "Albany",
    "capital": "New York",
    "barName": "New York State Bar Association",
    "courts": "New York Unified Court System",
    "admitted": true,
    "localCounsel": "Available",
    "note": "New York applies equitable distribution under the Domestic Relations Law and generally requires one year of residency to commence divorce."
  },
  {
    "code": "MD",
    "name": "Annapolis",
    "capital": "Maryland",
    "barName": "Maryland State Bar Association",
    "courts": "Maryland Circuit Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Maryland requires proof of grounds for absolute divorce and applies equitable distribution to marital property."
  },
  {
    "code": "AZ",
    "name": "Arizona",
    "capital": "Phoenix",
    "barName": "State Bar of Arizona",
    "courts": "Arizona Superior Court",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Arizona is a community-property jurisdiction and requires dissolution petitioners to complete a parenting-education program where minor children are involved."
  },
  {
    "code": "AR",
    "name": "Arkansas",
    "capital": "Little Rock",
    "barName": "Arkansas Bar Association",
    "courts": "Arkansas Circuit Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Arkansas imposes a short statute of limitations on many tort claims and requires corroboration of certain divorce grounds."
  },
  {
    "code": "ME",
    "name": "Augusta",
    "capital": "Maine",
    "barName": "Maine State Bar Association",
    "courts": "Maine Superior Court",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Maine is an equitable-distribution state and requires a minimum residency period before a divorce action may proceed."
  },
  {
    "code": "TX",
    "name": "Austin",
    "capital": "Texas",
    "barName": "State Bar of Texas",
    "courts": "Texas District Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Texas is a community-property state and requires a sixty-day cooling-off period after filing before a divorce may be granted."
  },
  {
    "code": "LA",
    "name": "Baton Rouge",
    "capital": "Louisiana",
    "barName": "Louisiana State Bar Association",
    "courts": "Louisiana District Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Louisiana is a civil-law state, and its community-property regime differs materially from common-law equitable distribution."
  },
  {
    "code": "ND",
    "name": "Bismarck",
    "capital": "North Dakota",
    "barName": "State Bar Association of North Dakota",
    "courts": "North Dakota District Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "North Dakota is an equitable-distribution state and applies statutory guidelines to child support."
  },
  {
    "code": "MA",
    "name": "Boston",
    "capital": "Massachusetts",
    "barName": "Massachusetts Bar Association",
    "courts": "Massachusetts Superior Court",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Massachusetts uses equitable distribution and courts may consider conduct and contribution when dividing marital assets."
  },
  {
    "code": "CA",
    "name": "California",
    "capital": "Sacramento",
    "barName": "State Bar of California",
    "courts": "California Superior Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "California is a community-property state and requires a six-month residency before a dissolution petition may be filed."
  },
  {
    "code": "NV",
    "name": "Carson City",
    "capital": "Nevada",
    "barName": "State Bar of Nevada",
    "courts": "Nevada District Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Nevada is a community-property state and requires only a short residency period before filing for divorce."
  },
  {
    "code": "WV",
    "name": "Charleston",
    "capital": "West Virginia",
    "barName": "West Virginia State Bar",
    "courts": "West Virginia Circuit Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "West Virginia applies equitable distribution to marital property and permits irreconcilable-differences divorce."
  },
  {
    "code": "WY",
    "name": "Cheyenne",
    "capital": "Wyoming",
    "barName": "Wyoming State Bar",
    "courts": "Wyoming District Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Wyoming applies equitable distribution and permits no-fault dissolution on irreconcilable differences."
  },
  {
    "code": "CO",
    "name": "Colorado",
    "capital": "Denver",
    "barName": "Colorado Bar Association",
    "courts": "Colorado District Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Colorado abolished fault-based dissolution and divides marital property equitably without regard to community-property rules."
  },
  {
    "code": "SC",
    "name": "Columbia",
    "capital": "South Carolina",
    "barName": "South Carolina Bar",
    "courts": "South Carolina Circuit Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "South Carolina requires a one-year separation or proof of statutory fault grounds to obtain a divorce."
  },
  {
    "code": "OH",
    "name": "Columbus",
    "capital": "Ohio",
    "barName": "Ohio State Bar Association",
    "courts": "Ohio Courts of Common Pleas",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Ohio applies equitable distribution and resolves custody under the statutory best-interest factors."
  },
  {
    "code": "NH",
    "name": "Concord",
    "capital": "New Hampshire",
    "barName": "New Hampshire Bar Association",
    "courts": "New Hampshire Superior Court",
    "admitted": false,
    "localCounsel": "On request",
    "note": "New Hampshire applies equitable distribution and permits fault grounds to be pleaded."
  },
  {
    "code": "CT",
    "name": "Connecticut",
    "capital": "Hartford",
    "barName": "Connecticut Bar Association",
    "courts": "Connecticut Superior Court",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Connecticut uses an equitable-distribution framework that expressly considers the length of the marriage and each spouse earning capacity."
  },
  {
    "code": "DE",
    "name": "Delaware",
    "capital": "Dover",
    "barName": "Delaware State Bar Association",
    "courts": "Delaware Superior Court",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Delaware is a favored state of incorporation, and its Court of Chancery hears corporate and fiduciary disputes without a jury."
  },
  {
    "code": "IA",
    "name": "Des Moines",
    "capital": "Iowa",
    "barName": "Iowa State Bar Association",
    "courts": "Iowa District Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Iowa applies equitable distribution and provides a mandatory conciliation process where minor children are involved."
  },
  {
    "code": "FL",
    "name": "Florida",
    "capital": "Tallahassee",
    "barName": "The Florida Bar",
    "courts": "Florida Circuit Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Florida requires dissolution petitioners to show residency of six months and applies equitable distribution to marital assets."
  },
  {
    "code": "KY",
    "name": "Frankfort",
    "capital": "Kentucky",
    "barName": "Kentucky Bar Association",
    "courts": "Kentucky Circuit Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Kentucky requires the parties to live apart for a statutory period before a decree may be entered."
  },
  {
    "code": "GA",
    "name": "Georgia",
    "capital": "Atlanta",
    "barName": "State Bar of Georgia",
    "courts": "Georgia Superior Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Georgia requires a thirty-day waiting period after service in a divorce action and is an equitable-distribution state."
  },
  {
    "code": "PA",
    "name": "Harrisburg",
    "capital": "Pennsylvania",
    "barName": "Pennsylvania Bar Association",
    "courts": "Pennsylvania Courts of Common Pleas",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Pennsylvania applies equitable distribution with no-fault divorce available on the basis of irretrievable breakdown."
  },
  {
    "code": "HI",
    "name": "Hawaii",
    "capital": "Honolulu",
    "barName": "Hawaii State Bar Association",
    "courts": "Hawaii Circuit Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Hawaii applies equitable distribution and recognizes the state as a community-property jurisdiction for certain property questions."
  },
  {
    "code": "MT",
    "name": "Helena",
    "capital": "Montana",
    "barName": "State Bar of Montana",
    "courts": "Montana District Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Montana applies equitable distribution and permits no-fault dissolution on a finding of irreconcilable differences."
  },
  {
    "code": "ID",
    "name": "Idaho",
    "capital": "Boise",
    "barName": "Idaho State Bar",
    "courts": "Idaho District Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Idaho is a community-property state and requires a residency period before a divorce petition may be filed."
  },
  {
    "code": "IL",
    "name": "Illinois",
    "capital": "Springfield",
    "barName": "Illinois State Bar Association",
    "courts": "Illinois Circuit Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Illinois requires grounds for dissolution and applies equitable distribution to marital property."
  },
  {
    "code": "IN",
    "name": "Indianapolis",
    "capital": "Indiana",
    "barName": "Indiana State Bar Association",
    "courts": "Indiana Circuit Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Indiana is an equitable-distribution state and requires sixty days to have elapsed from the filing before a dissolution may be finalized."
  },
  {
    "code": "MS",
    "name": "Jackson",
    "capital": "Mississippi",
    "barName": "The Mississippi Bar",
    "courts": "Mississippi Circuit Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Mississippi retains statutory fault grounds for divorce and requires corroborating evidence in most cases."
  },
  {
    "code": "MO",
    "name": "Jefferson City",
    "capital": "Missouri",
    "barName": "The Missouri Bar",
    "courts": "Missouri Circuit Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Missouri requires a marital-dissolution petition to be on file for thirty days before a decree may be entered."
  },
  {
    "code": "MI",
    "name": "Lansing",
    "capital": "Michigan",
    "barName": "State Bar of Michigan",
    "courts": "Michigan Circuit Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Michigan applies equitable distribution and permits no-fault dissolution where the marriage is irretrievably broken."
  },
  {
    "code": "NE",
    "name": "Lincoln",
    "capital": "Nebraska",
    "barName": "Nebraska State Bar Association",
    "courts": "Nebraska District Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Nebraska applies equitable distribution and has a statutory residency requirement for divorce filings."
  },
  {
    "code": "WI",
    "name": "Madison",
    "capital": "Wisconsin",
    "barName": "State Bar of Wisconsin",
    "courts": "Wisconsin Circuit Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Wisconsin is a community-property state and requires a 120-day waiting period after filing before a divorce may be completed."
  },
  {
    "code": "VT",
    "name": "Montpelier",
    "capital": "Vermont",
    "barName": "Vermont Bar Association",
    "courts": "Vermont Superior Court",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Vermont applies equitable distribution and requires residency before filing for divorce."
  },
  {
    "code": "TN",
    "name": "Nashville",
    "capital": "Tennessee",
    "barName": "Tennessee Bar Association",
    "courts": "Tennessee Circuit Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Tennessee applies equitable division of marital property and recognizes both fault and no-fault grounds."
  },
  {
    "code": "OK",
    "name": "Oklahoma City",
    "capital": "Oklahoma",
    "barName": "Oklahoma Bar Association",
    "courts": "Oklahoma District Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Oklahoma applies an equitable-division approach to jointly acquired property on dissolution."
  },
  {
    "code": "WA",
    "name": "Olympia",
    "capital": "Washington",
    "barName": "Washington State Bar Association",
    "courts": "Washington Superior Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Washington is a community-property state and requires ninety days from filing before a dissolution decree may be entered."
  },
  {
    "code": "SD",
    "name": "Pierre",
    "capital": "South Dakota",
    "barName": "State Bar of South Dakota",
    "courts": "South Dakota Circuit Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "South Dakota applies equitable distribution and permits irreconcilable-differences dissolution."
  },
  {
    "code": "RI",
    "name": "Providence",
    "capital": "Rhode Island",
    "barName": "Rhode Island Bar Association",
    "courts": "Rhode Island Superior Court",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Rhode Island applies equitable distribution and permits no-fault divorce on grounds of irreconcilable differences."
  },
  {
    "code": "NC",
    "name": "Raleigh",
    "capital": "North Carolina",
    "barName": "North Carolina State Bar",
    "courts": "North Carolina Superior Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "North Carolina requires a one-year separation period before an uncontested absolute divorce may be granted."
  },
  {
    "code": "VA",
    "name": "Richmond",
    "capital": "Virginia",
    "barName": "Virginia State Bar",
    "courts": "Virginia Circuit Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Virginia requires a separation period for no-fault divorce, with the length depending on whether minor children exist."
  },
  {
    "code": "MN",
    "name": "Saint Paul",
    "capital": "Minnesota",
    "barName": "Minnesota State Bar Association",
    "courts": "Minnesota District Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Minnesota applies equitable distribution and presumes joint legal custody in most parenting disputes."
  },
  {
    "code": "OR",
    "name": "Salem",
    "capital": "Oregon",
    "barName": "Oregon State Bar",
    "courts": "Oregon Circuit Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Oregon applies a statutory presumption of equal contribution to property acquired during the marriage."
  },
  {
    "code": "UT",
    "name": "Salt Lake City",
    "capital": "Utah",
    "barName": "Utah State Bar",
    "courts": "Utah District Courts",
    "admitted": true,
    "localCounsel": "Available",
    "note": "Utah requires a minimum residency period and applies equitable distribution to marital property."
  },
  {
    "code": "NM",
    "name": "Santa Fe",
    "capital": "New Mexico",
    "barName": "State Bar of New Mexico",
    "courts": "New Mexico District Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "New Mexico is a community-property state and divides community property equally on dissolution."
  },
  {
    "code": "KS",
    "name": "Topeka",
    "capital": "Kansas",
    "barName": "Kansas Bar Association",
    "courts": "Kansas District Courts",
    "admitted": false,
    "localCounsel": "On request",
    "note": "Kansas is an equitable-distribution state and requires residency before filing for divorce."
  },
  {
    "code": "NJ",
    "name": "Trenton",
    "capital": "New Jersey",
    "barName": "New Jersey State Bar Association",
    "courts": "New Jersey Superior Court",
    "admitted": true,
    "localCounsel": "Available",
    "note": "New Jersey uses equitable distribution and requires a one-year residency for most divorce actions."
  },
  {
    "code": "DC",
    "name": "Washington",
    "capital": "Washington",
    "barName": "District of Columbia Bar",
    "courts": "Superior Court of the District of Columbia",
    "admitted": true,
    "localCounsel": "Available",
    "note": "The District of Columbia applies equitable distribution and permits no-fault divorce after six months of separation or one year of marriage residency."
  }
];
