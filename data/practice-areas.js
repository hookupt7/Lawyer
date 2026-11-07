'use strict';
/**
 * Oakstone Legal Group - Practice Area Registry
 * Source of truth for navigation, landing pages, pricing and booking.
 * Every entry: id, name, group, tagline, summary, icon, urgent, services[]
 * fee.type: 'flat' | 'hourly' | 'contingency' | 'consult' | 'retainer' | 'quote'
 */

module.exports = [
  {
    id: 'family',
    name: 'Family & Matrimonial Law',
    group: 'Family',
    tagline: 'Divorce, custody and support, handled without escalation.',
    summary: 'We represent parents, spouses and partners across all fifty states in dissolution, custody, support and protective matters. Every case is assigned a lead attorney and a paralegal, and you receive a written plan with a projected timeline before we file anything.',
    icon: 'family',
    urgent: false,
    services: [
      { name: 'Divorce (Uncontested)', desc: 'Both parties agree on terms. We draft, file and finalize without court appearances where the state permits.', fee: { type: 'flat', amount: 1500, note: 'Plus filing fees. Varies by state.' } },
      { name: 'Divorce (Contested)', desc: 'Disputed property, debt or parenting terms. Discovery, negotiation and trial representation if required.', fee: { type: 'retainer', amount: 3500, note: 'Applied against hourly work at $325/hr.' } },
      { name: 'High-Net-Worth Divorce', desc: 'Business valuations, executive compensation, trusts and multi-state property division.', fee: { type: 'quote', note: 'Scoped after a confidential asset review.' } },
      { name: 'Child Support', desc: 'Establishment, modification or enforcement of support under your state guideline formula.', fee: { type: 'flat', amount: 850, note: 'Modification and enforcement matters.' } },
      { name: 'Child Custody & Visitation', desc: 'Legal and physical custody, parenting plans, relocation and interstate disputes under the UCCJEA.', fee: { type: 'retainer', amount: 2500, note: 'Applied at $325/hr.' } },
      { name: 'Spousal Support / Alimony', desc: 'Establishment, duration, modification and termination of maintenance.', fee: { type: 'hourly', amount: 325 } },
      { name: 'Prenuptial & Postnuptial Agreements', desc: 'Drafted and negotiated to survive challenge. Includes independent counsel waiver guidance.', fee: { type: 'flat', amount: 1200 } },
      { name: 'Paternity', desc: 'Parentage establishment, genetic testing coordination and associated support and custody orders.', fee: { type: 'flat', amount: 950 } },
      { name: 'Adoption', desc: 'Agency, private, stepparent and second-parent adoptions, including ICPC compliance.', fee: { type: 'flat', amount: 2200, note: 'Plus court and agency costs.' } },
      { name: 'Guardianship', desc: 'Minor and adult guardianship petitions, objections and annual reporting.', fee: { type: 'hourly', amount: 325 } },
      { name: 'Domestic Violence & Protective Orders', desc: 'Emergency and long-term orders, plus defense against improperly filed petitions.', fee: { type: 'flat', amount: 750, note: 'Emergency filings same day.' } },
      { name: 'Post-Decree Modifications & Enforcement', desc: 'Contempt actions, income withholding, license suspension and custody modification.', fee: { type: 'flat', amount: 1100 } },
      { name: 'Same-Sex Family Law', desc: 'Marriage, dissolution, parentage and adoption matters with full interstate recognition analysis.', fee: { type: 'hourly', amount: 325 } },
      { name: 'Military Divorce', desc: 'USFSPA division, military pensions, SBP elections and Servicemembers Civil Relief Act protections.', fee: { type: 'quote' } }
    ]
  },
  {
    id: 'cyber',
    name: 'Cyber Law & Digital Recovery',
    group: 'Cyber',
    tagline: 'If you were hacked, scammed or extorted, start here.',
    summary: 'Our emergency division works the first seventy-two hours, when funds and accounts are still recoverable. We preserve evidence, serve preservation letters on exchanges and custodians, and coordinate directly with federal law enforcement. This is the division clients call at 2 a.m.',
    icon: 'cyber',
    urgent: true,
    services: [
      { name: 'Hacked Account & Email Recovery', desc: 'Account restoration, session and key revocation, mailbox rule reconstruction, forensic preservation.', fee: { type: 'flat', amount: 1500, note: 'Emergency intake answered within one hour.' } },
      { name: 'Cryptocurrency Tracing & Recovery', desc: 'On-chain tracing, mixer and bridge analysis, exchange freeze letters, civil recovery action.', fee: { type: 'quote', note: 'Recovery contingent options available.' } },
      { name: 'Ransomware & Extortion Response', desc: 'Incident command, negotiation strategy, decryption assessment and regulatory notification.', fee: { type: 'quote' } },
      { name: 'Investment, Crypto & Romance Scam Recovery', desc: 'Pig-butchering and fake-platform schemes. Asset tracing, chargeback and civil suit.', fee: { type: 'contingency', amount: 33, note: 'Percentage of recovery. Case-by-case review.' } },
      { name: 'Business Email Compromise (BEC)', desc: 'Wire recall, receiving-bank demands under UCC Article 4A, and litigation against complicit institutions.', fee: { type: 'quote' } },
      { name: 'Identity Theft Restoration', desc: 'Credit freeze enforcement, tradeline disputes, IRS identity PIN, and full restoration service.', fee: { type: 'flat', amount: 1200 } },
      { name: 'Sextortion & Intimate Image Abuse', desc: 'Injunction, takedown, platform escalation under 18 U.S.C. 2258A and criminal referral.', fee: { type: 'flat', amount: 950 } },
      { name: 'Online Defamation & Reputation', desc: 'Defamation and false-light claims, anonymous subpoenas under 47 U.S.C. 230 analysis, removal.', fee: { type: 'hourly', amount: 350 } },
      { name: 'Cyberstalking & Harassment', desc: 'Protective orders, platform subpoenas, evidence-grade documentation and police referral.', fee: { type: 'flat', amount: 1100 } },
      { name: 'Data Breach Claims', desc: 'Business and consumer representation, notification compliance and negligence claims.', fee: { type: 'quote' } },
      { name: 'Federal Agency Liaison', desc: 'We prepare and file an evidence-grade package to the IC3, FBI field office, Secret Service and FinCEN, then follow up on your behalf.', fee: { type: 'flat', amount: 1500, note: 'Coordination with existing law-enforcement case.' } },
      { name: 'Dark Web Monitoring & Reputation Defense', desc: 'Credential exposure monitoring, paste-site sweeps and priority remediation.', fee: { type: 'retainer', amount: 250, note: 'Monthly monitoring retainer.' } }
    ]
  },
  {
    id: 'survivor',
    name: 'Sexual Assault & Survivor Advocacy',
    group: 'Survivor',
    tagline: 'Civil representation for survivors, at your pace.',
    summary: 'We represent survivors of sexual violence, abuse in institutional settings, and harassment in civil claims. You direct the pace of your case and you decide whether it is ever filed. Our team is trauma-informed and every communication channel is confidential by default.',
    icon: 'survivor',
    urgent: false,
    services: [
      { name: 'Civil Sexual Assault Claims', desc: 'Claims against perpetrators and, where applicable, negligent institutions. Pseudonym filing available.', fee: { type: 'contingency', amount: 33, note: 'No fee unless we recover.' } },
      { name: 'Institutional Abuse', desc: 'Clergy, school, athletic program, medical and detention-facility abuse claims, including revival-window filings.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Title IX & Campus Proceedings', desc: 'Representation in university disciplinary process and parallel civil action.', fee: { type: 'hourly', amount: 300 } },
      { name: 'Workplace Sexual Harassment', desc: 'Title VII, state analogues, EEOC charge filing and negotiation of confidential settlement.', fee: { type: 'contingency', amount: 35 } },
      { name: 'Child Abuse Civil Claims', desc: 'Civil action on behalf of minors through a guardian, with extended limitation analysis.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Trafficking Survivor Representation', desc: 'Civil claims, vacatur of convictions arising from trafficking, and immigration relief coordination.', fee: { type: 'quote' } }
    ]
  },
  {
    id: 'injury',
    name: 'Personal Injury & Accidents',
    group: 'Injury',
    tagline: 'You pay nothing unless we recover for you.',
    summary: 'We advance every cost of litigation, from records retrieval to expert witnesses. If there is no recovery, there is no fee and no cost reimbursement. Most cases settle; we prepare every one as if it will be tried.',
    icon: 'injury',
    urgent: false,
    services: [
      { name: 'Car Accidents', desc: 'Fault disputes, uninsured motorist claims, diminished value and medical-bill negotiation.', fee: { type: 'contingency', amount: 33, note: 'No recovery, no fee. Costs advanced.' } },
      { name: 'Truck Accidents', desc: 'Commercial carrier liability, FMCSA log and electronic-recording preservation, corporate-entity claims.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Motorcycle Accidents', desc: 'Bias mitigation, comparative-fault defense and helmet-argument rebuttal.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Pedestrian & Rideshare Accidents', desc: 'Including app-driver coverage disputes and multi-policy stacking.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Slip, Trip & Fall', desc: 'Premises liability, notice requirements and hazard-documentation timelines.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Medical Malpractice', desc: 'Standard-of-care review, expert affidavit requirements and birth-injury claims.', fee: { type: 'contingency', amount: 35, note: 'Certificate of merit costs advanced.' } },
      { name: 'Nursing Home Abuse & Neglect', desc: 'Understaffing evidence, charting-fraud discovery and wrongful-death claims.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Product Liability', desc: 'Design defect, manufacturing defect and failure-to-warn claims against manufacturers.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Wrongful Death', desc: 'Survival and wrongful-death claims, estate appointment and statutory-beneficiary distribution.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Dog Bite & Animal Attack', desc: 'Strict-liability and one-bite-state analysis, homeowner and renters coverage claims.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Workplace Injury', desc: 'Third-party claims beyond workers compensation, including construction-site liability chains.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Traumatic Brain & Spinal Cord Injury', desc: 'Life-care planning, future-earnings modeling and neuropsychological evaluation.', fee: { type: 'contingency', amount: 35 } }
    ]
  },
  {
    id: 'criminal',
    name: 'Criminal Defense',
    group: 'Criminal',
    tagline: 'Available before you are charged.',
    summary: 'We take state and federal matters at every stage: pre-charge investigation, arraignment, trial and appeal. If you are under investigation but not yet charged, the most valuable work we do happens before an indictment is returned.',
    icon: 'criminal',
    urgent: true,
    services: [
      { name: 'DUI / DWI', desc: 'Suppression of unlawful stops, breath and blood-test challenge, DMV hearing defense.', fee: { type: 'flat', amount: 2500, note: 'First offense, pre-trial resolution.' } },
      { name: 'Drug Offenses', desc: 'Possession through trafficking, diversion programs, suppression and sentencing mitigation.', fee: { type: 'retainer', amount: 3500 } },
      { name: 'Assault & Violent Crimes', desc: 'Self-defense and identity defenses, bond advocacy and investigation of the accusing witness.', fee: { type: 'retainer', amount: 5000 } },
      { name: 'Theft, Burglary & Fraud', desc: 'Restitution negotiation, diversion and record-sealing strategy.', fee: { type: 'retainer', amount: 3500 } },
      { name: 'Weapons Charges', desc: 'Constitutional challenges, prohibitor-status disputes and carry-permit appeals.', fee: { type: 'retainer', amount: 4000 } },
      { name: 'Sex Offense Defense', desc: 'Forensic-evidence review, false-accusation investigation and registration defense.', fee: { type: 'retainer', amount: 8500 } },
      { name: 'Domestic Assault Defense', desc: 'Cross-complaints, recantation evidence and protection-order hearings.', fee: { type: 'flat', amount: 3000 } },
      { name: 'Juvenile Offenses', desc: 'Diversion, detention hearings, record confidentiality and transfer-defense.', fee: { type: 'flat', amount: 2000 } },
      { name: 'Federal Crimes', desc: 'Federal indictment defense, sentencing-guideline litigation under 3553(a) and plea strategy.', fee: { type: 'retainer', amount: 15000 } },
      { name: 'White-Collar Crimes', desc: 'Wire fraud, money laundering, healthcare fraud and internal-investigation response.', fee: { type: 'retainer', amount: 20000 } },
      { name: 'Appeals & Post-Conviction', desc: 'Direct appeal, PCR and habeas petitions, innocence claims.', fee: { type: 'hourly', amount: 375 } },
      { name: 'Record Expungement & Sealing', desc: 'Eligibility review, petition drafting and hearing representation.', fee: { type: 'flat', amount: 1200 } }
    ]
  },
  {
    id: 'employment',
    name: 'Employment & Labor',
    group: 'Employment',
    tagline: 'Workplace claims, on both sides of the table.',
    summary: 'We represent employees and employers in discrimination, wage, retaliation and trade-secret matters. Federal deadlines are short and administrative exhaustion is usually mandatory, so the initial review matters.',
    icon: 'employment',
    urgent: false,
    services: [
      { name: 'Wrongful Termination', desc: 'Pretext analysis, comparator evidence and negotiation of an enhanced severance package.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Discrimination', desc: 'Race, sex, pregnancy, age, disability, religion and national origin claims under Title VII, ADEA and ADA.', fee: { type: 'contingency', amount: 35 } },
      { name: 'Harassment', desc: 'Hostile-environment and quid pro quo claims, internal-reporting analysis.', fee: { type: 'contingency', amount: 35 } },
      { name: 'Wage & Hour / Overtime', desc: 'Misclassification, off-the-clock work, tips and collective-action exposure under the FLSA.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Retaliation', desc: 'Whistleblower and protected-activity retaliation claims.', fee: { type: 'contingency', amount: 33 } },
      { name: 'FMLA Violations', desc: 'Interference and retaliation in medical and family leave matters.', fee: { type: 'hourly', amount: 300 } },
      { name: 'Workers Compensation', desc: 'Claim filing, disputed-injury hearings and permanent-disability ratings.', fee: { type: 'contingency', amount: 20, note: 'Statutory fee schedule in most states.' } },
      { name: 'Whistleblower Claims', desc: 'False Claims Act, Dodd-Frank and state whistleblower statutes, including qui tam.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Severance Negotiation', desc: 'Review, negotiation and release analysis, including non-monetary terms.', fee: { type: 'flat', amount: 950 } },
      { name: 'Non-Compete & Trade Secrets', desc: 'Enforcement and defense, injunctive relief and DTSA claims.', fee: { type: 'retainer', amount: 5000 } },
      { name: 'Unemployment Appeals', desc: 'Hearing representation and benefit-denial appeals.', fee: { type: 'flat', amount: 700 } }
    ]
  }
];
