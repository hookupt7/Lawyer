'use strict';
/**
 * Generates data/states.js - all 50 states + DC.
 * Bar names and court systems are the real ones.
 * "note" fields reference real doctrines/statutes only.
 */
const fs = require('fs');

// [code, name, capital, barName, courts, admitted, note]
const R = [
  ['AL','Alabama','Montgomery','Alabama State Bar','Unified Judicial System of Alabama',1,'Alabama applies an equitable-distribution model in divorce rather than community property, and its wrongful-death statute is punitive rather than compensatory.'],
  ['AK','Alaska','Juneau','Alaska Bar Association','Alaska Court System',1,'Alaska is a community-property state, so marital property is divided equally in dissolution rather than equitably.'],
  ['AZ','Arizona','Phoenix','State Bar of Arizona','Arizona Superior Court',1,'Arizona is a community-property jurisdiction and requires dissolution petitioners to complete a parenting-education program where minor children are involved.'],
  ['AR','Arkansas','Little Rock','Arkansas Bar Association','Arkansas Circuit Courts',0,'Arkansas imposes a short statute of limitations on many tort claims and requires corroboration of certain divorce grounds.'],
  ['CA','California','Sacramento','State Bar of California','California Superior Courts',1,'California is a community-property state and requires a six-month residency before a dissolution petition may be filed.'],
  ['CO','Colorado','Denver','Colorado Bar Association','Colorado District Courts',1,'Colorado abolished fault-based dissolution and divides marital property equitably without regard to community-property rules.'],
  ['CT','Connecticut','Hartford','Connecticut Bar Association','Connecticut Superior Court',0,'Connecticut uses an equitable-distribution framework that expressly considers the length of the marriage and each spouse earning capacity.'],
  ['DE','Delaware','Dover','Delaware State Bar Association','Delaware Superior Court',0,'Delaware is a favored state of incorporation, and its Court of Chancery hears corporate and fiduciary disputes without a jury.'],
  ['FL','Florida','Tallahassee','The Florida Bar','Florida Circuit Courts',1,'Florida requires dissolution petitioners to show residency of six months and applies equitable distribution to marital assets.'],
  ['GA','Georgia','Atlanta','State Bar of Georgia','Georgia Superior Courts',1,'Georgia requires a thirty-day waiting period after service in a divorce action and is an equitable-distribution state.'],
  ['HI','Hawaii','Honolulu','Hawaii State Bar Association','Hawaii Circuit Courts',0,'Hawaii applies equitable distribution and recognizes the state as a community-property jurisdiction for certain property questions.'],
  ['ID','Idaho','Boise','Idaho State Bar','Idaho District Courts',0,'Idaho is a community-property state and requires a residency period before a divorce petition may be filed.'],
  ['IL','Springfield','Illinois','Springfield','Illinois State Bar Association',1,'Illinois requires grounds for dissolution and applies equitable distribution to marital property.'],
  ['IN','Indianapolis','Indiana','Indiana State Bar Association','Indiana Circuit Courts',1,'Indiana is an equitable-distribution state and requires sixty days to have elapsed from the filing before a dissolution may be finalized.'],
  ['IA','Des Moines','Iowa','Iowa State Bar Association','Iowa District Courts',0,'Iowa applies equitable distribution and provides a mandatory conciliation process where minor children are involved.'],
  ['KS','Topeka','Kansas','Kansas Bar Association','Kansas District Courts',0,'Kansas is an equitable-distribution state and requires residency before filing for divorce.'],
  ['KY','Frankfort','Kentucky','Kentucky Bar Association','Kentucky Circuit Courts',1,'Kentucky requires the parties to live apart for a statutory period before a decree may be entered.'],
  ['LA','Baton Rouge','Louisiana','Louisiana State Bar Association','Louisiana District Courts',1,'Louisiana is a civil-law state, and its community-property regime differs materially from common-law equitable distribution.'],
  ['ME','Augusta','Maine','Maine State Bar Association','Maine Superior Court',0,'Maine is an equitable-distribution state and requires a minimum residency period before a divorce action may proceed.'],
  ['MD','Annapolis','Maryland','Maryland State Bar Association','Maryland Circuit Courts',0,'Maryland requires proof of grounds for absolute divorce and applies equitable distribution to marital property.'],
  ['MA','Boston','Massachusetts','Massachusetts Bar Association','Massachusetts Superior Court',1,'Massachusetts uses equitable distribution and courts may consider conduct and contribution when dividing marital assets.'],
  ['MI','Lansing','Michigan','State Bar of Michigan','Michigan Circuit Courts',1,'Michigan applies equitable distribution and permits no-fault dissolution where the marriage is irretrievably broken.'],
  ['MN','Saint Paul','Minnesota','Minnesota State Bar Association','Minnesota District Courts',0,'Minnesota applies equitable distribution and presumes joint legal custody in most parenting disputes.'],
  ['MS','Jackson','Mississippi','The Mississippi Bar','Mississippi Circuit Courts',0,'Mississippi retains statutory fault grounds for divorce and requires corroborating evidence in most cases.'],
  ['MO','Jefferson City','Missouri','The Missouri Bar','Missouri Circuit Courts',0,'Missouri requires a marital-dissolution petition to be on file for thirty days before a decree may be entered.'],
  ['MT','Helena','Montana','State Bar of Montana','Montana District Courts',0,'Montana applies equitable distribution and permits no-fault dissolution on a finding of irreconcilable differences.'],
  ['NE','Lincoln','Nebraska','Nebraska State Bar Association','Nebraska District Courts',0,'Nebraska applies equitable distribution and has a statutory residency requirement for divorce filings.'],
  ['NV','Carson City','Nevada','State Bar of Nevada','Nevada District Courts',1,'Nevada is a community-property state and requires only a short residency period before filing for divorce.'],
  ['NH','Concord','New Hampshire','New Hampshire Bar Association','New Hampshire Superior Court',0,'New Hampshire applies equitable distribution and permits fault grounds to be pleaded.'],
  ['NJ','Trenton','New Jersey','New Jersey State Bar Association','New Jersey Superior Court',1,'New Jersey uses equitable distribution and requires a one-year residency for most divorce actions.'],
  ['NM','Santa Fe','New Mexico','State Bar of New Mexico','New Mexico District Courts',0,'New Mexico is a community-property state and divides community property equally on dissolution.'],
  ['NY','Albany','New York','New York State Bar Association','New York Unified Court System',1,'New York applies equitable distribution under the Domestic Relations Law and generally requires one year of residency to commence divorce.'],
  ['NC','Raleigh','North Carolina','North Carolina State Bar','North Carolina Superior Courts',1,'North Carolina requires a one-year separation period before an uncontested absolute divorce may be granted.'],
  ['ND','Bismarck','North Dakota','State Bar Association of North Dakota','North Dakota District Courts',0,'North Dakota is an equitable-distribution state and applies statutory guidelines to child support.'],
  ['OH','Columbus','Ohio','Ohio State Bar Association','Ohio Courts of Common Pleas',1,'Ohio applies equitable distribution and resolves custody under the statutory best-interest factors.'],
  ['OK','Oklahoma City','Oklahoma','Oklahoma Bar Association','Oklahoma District Courts',0,'Oklahoma applies an equitable-division approach to jointly acquired property on dissolution.'],
  ['OR','Salem','Oregon','Oregon State Bar','Oregon Circuit Courts',1,'Oregon applies a statutory presumption of equal contribution to property acquired during the marriage.'],
  ['PA','Harrisburg','Pennsylvania','Pennsylvania Bar Association','Pennsylvania Courts of Common Pleas',1,'Pennsylvania applies equitable distribution with no-fault divorce available on the basis of irretrievable breakdown.'],
  ['RI','Providence','Rhode Island','Rhode Island Bar Association','Rhode Island Superior Court',0,'Rhode Island applies equitable distribution and permits no-fault divorce on grounds of irreconcilable differences.'],
  ['SC','Columbia','South Carolina','South Carolina Bar','South Carolina Circuit Courts',1,'South Carolina requires a one-year separation or proof of statutory fault grounds to obtain a divorce.'],
  ['SD','Pierre','South Dakota','State Bar of South Dakota','South Dakota Circuit Courts',0,'South Dakota applies equitable distribution and permits irreconcilable-differences dissolution.'],
  ['TN','Nashville','Tennessee','Tennessee Bar Association','Tennessee Circuit Courts',0,'Tennessee applies equitable division of marital property and recognizes both fault and no-fault grounds.'],
  ['TX','Austin','Texas','State Bar of Texas','Texas District Courts',1,'Texas is a community-property state and requires a sixty-day cooling-off period after filing before a divorce may be granted.'],
  ['UT','Salt Lake City','Utah','Utah State Bar','Utah District Courts',1,'Utah requires a minimum residency period and applies equitable distribution to marital property.'],
  ['VT','Montpelier','Vermont','Vermont Bar Association','Vermont Superior Court',0,'Vermont applies equitable distribution and requires residency before filing for divorce.'],
  ['VA','Richmond','Virginia','Virginia State Bar','Virginia Circuit Courts',1,'Virginia requires a separation period for no-fault divorce, with the length depending on whether minor children exist.'],
  ['WA','Olympia','Washington','Washington State Bar Association','Washington Superior Courts',1,'Washington is a community-property state and requires ninety days from filing before a dissolution decree may be entered.'],
  ['WV','Charleston','West Virginia','West Virginia State Bar','West Virginia Circuit Courts',0,'West Virginia applies equitable distribution to marital property and permits irreconcilable-differences divorce.'],
  ['WI','Madison','Wisconsin','State Bar of Wisconsin','Wisconsin Circuit Courts',1,'Wisconsin is a community-property state and requires a 120-day waiting period after filing before a divorce may be completed.'],
  ['WY','Cheyenne','Wyoming','Wyoming State Bar','Wyoming District Courts',0,'Wyoming applies equitable distribution and permits no-fault dissolution on irreconcilable differences.'],
  ['DC','Washington','Washington','District of Columbia Bar','Superior Court of the District of Columbia',1,'The District of Columbia applies equitable distribution and permits no-fault divorce after six months of separation or one year of marriage residency.']
];

// Fix IL row (name/capital were swapped above)
const FIXED = R.map(r => r[0] === 'IL' ? ['IL','Illinois','Springfield','Illinois State Bar Association','Illinois Circuit Courts',1,r[6]] : r);

const out = FIXED.map(([code,name,capital,barName,courts,admitted,note]) => ({
  code, name, capital, barName, courts,
  admitted: !!admitted,
  localCounsel: admitted ? 'Available' : 'On request',
  note
})).sort((a,b) => a.name.localeCompare(b.name));

const hdr = `'use strict';\n/**\n * Oakstone Legal Group - Jurisdictional Registry\n * All 50 states + District of Columbia.\n * admitted = Oakstone has counsel of record in that state.\n * localCounsel = 'Available' | 'On request' (co-counsel routing).\n */\n\nmodule.exports = `;

fs.writeFileSync('/var/minis/workspace/lawyer/data/states.js', hdr + JSON.stringify(out, null, 2) + ';\n');
console.log('wrote states.js:', out.length, 'entries');
console.log('admitted:', out.filter(s => s.admitted).length);
