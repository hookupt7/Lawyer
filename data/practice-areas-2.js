'use strict';
/**
 * Oakstone Legal Group - Practice Area Registry (Part 2)
 * Areas 7-26. Same schema as practice-areas.js:
 * id, name, group, tagline, summary, icon, urgent, services[]
 * fee.type: 'flat' | 'hourly' | 'contingency' | 'consult' | 'retainer' | 'quote'
 */

module.exports = [
  {
    id: 'immigration',
    name: 'Immigration Law',
    group: 'Immigration',
    tagline: 'Petitions, relief and defense in removal proceedings.',
    summary: 'We handle family-based petitions, employment visas, humanitarian relief and deportation defense before USCIS, the immigration courts and the Board of Immigration Appeals. Deadlines in immigration are jurisdictional, so we file early and calendar every statutory window.',
    icon: 'immigration',
    urgent: true,
    services: [
      { name: 'Family-Based Green Cards', desc: 'I-130 petitions for spouses, parents, children and siblings, including consular processing and adjustment of status.', fee: { type: 'flat', amount: 3500, note: 'Plus USCIS fees.' } },
      { name: 'Citizenship & Naturalization', desc: 'N-400 filing, continuous-residence analysis, civics preparation and interview representation.', fee: { type: 'flat', amount: 1800 } },
      { name: 'Work & Student Visas', desc: 'H-1B, L-1, O-1, TN and F-1 matters, including employer compliance and cap registration.', fee: { type: 'flat', amount: 4000 } },
      { name: 'Asylum & Refugee Status', desc: 'Affirmative filings within the one-year bar, credible-fear interviews and defensive asylum in court.', fee: { type: 'flat', amount: 5000 } },
      { name: 'Deportation & Removal Defense', desc: 'Bond hearings, cancellation of removal, withholding and protection under the Convention Against Torture.', fee: { type: 'retainer', amount: 6500 } },
      { name: 'DACA Renewal', desc: 'Renewal filings, advance parole requests and related work authorization.', fee: { type: 'flat', amount: 1200 } },
      { name: 'VAWA, U-Visa & T-Visa', desc: 'Relief for survivors of domestic violence, crime victims and trafficking survivors, including I-918 and I-914 petitions.', fee: { type: 'flat', amount: 4000 } },
      { name: 'Business & Investor Immigration', desc: 'EB-1 through EB-5 petitions, PERM labor certification and multinational manager transfers.', fee: { type: 'quote' } },
      { name: 'Consular Processing & Waivers', desc: 'I-601 and I-601A unlawful-presence waivers, NVC processing and embassy interview preparation.', fee: { type: 'flat', amount: 4500 } },
      { name: 'TPS & Humanitarian Parole', desc: 'Temporary Protected Status registration and re-registration, plus parole applications.', fee: { type: 'flat', amount: 2000 } }
    ]
  },
  {
    id: 'estate',
    name: 'Estate Planning & Probate',
    group: 'Estate',
    tagline: 'Documents that hold up when they are actually needed.',
    summary: 'We draft wills, trusts and incapacity documents, then administer estates through probate when the time comes. Planning decisions are driven by your state of domicile, your asset types and federal and state transfer-tax thresholds, not by a template.',
    icon: 'estate',
    urgent: false,
    services: [
      { name: 'Wills & Living Trusts', desc: 'Testamentary and revocable inter vivos trusts drafted to avoid probate and reduce administrative cost.', fee: { type: 'flat', amount: 1800 } },
      { name: 'Irrevocable Trusts', desc: 'Irrevocable life insurance, dynasty, and asset-protection trusts, including GST allocation.', fee: { type: 'quote' } },
      { name: 'Powers of Attorney', desc: 'Durable financial powers with asset-specific riders and third-party acceptance guidance.', fee: { type: 'flat', amount: 450 } },
      { name: 'Advance Directives', desc: 'Healthcare proxies, living wills and HIPAA authorizations, plus Physician Orders for Life-Sustaining Treatment.', fee: { type: 'flat', amount: 400 } },
      { name: 'Probate Administration', desc: 'Petition for probate, creditor notice, inventory and accounting through final distribution.', fee: { type: 'hourly', amount: 325 } },
      { name: 'Contested Probate', desc: 'Will contests, undue-influence claims, capacity challenges and fiduciary removal actions.', fee: { type: 'retainer', amount: 7500 } },
      { name: 'Trust Litigation', desc: 'Breach of fiduciary duty claims, trust accounting disputes and modification or reformation petitions.', fee: { type: 'retainer', amount: 7500 } },
      { name: 'Multi-State Estate Administration', desc: 'Ancillary probate in states where a decedent held real property outside the domicile.', fee: { type: 'quote' } },
      { name: 'Asset Protection Planning', desc: 'Domestic asset-protection trusts, entity structuring and fraudulent-transfer exposure review.', fee: { type: 'quote' } },
      { name: 'Medicaid & Long-Term Care Planning', desc: 'Five-year look-back analysis, spend-down strategy and spousal impoverishment planning.', fee: { type: 'hourly', amount: 350 } }
    ]
  },
  {
    id: 'business',
    name: 'Business & Corporate Law',
    group: 'Business',
    tagline: 'Formation, governance and disputes across all fifty states.',
    summary: 'We form entities in any state, paper the relationship between founders, and handle commercial disputes when they arise. Foreign-qualification, registered-agent and franchise-tax requirements are analyzed up front so you do not discover a compliance gap at financing.',
    icon: 'business',
    urgent: false,
    services: [
      { name: 'Entity Formation', desc: 'LLC, C-Corp, S-Corp and PLLC formation, including operating agreements and bylaws in every state.', fee: { type: 'flat', amount: 1200, note: 'Plus state filing fee.' } },
      { name: 'Contracts & Agreements', desc: 'Drafting and review of MSAs, NDAs, licensing and vendor agreements, with risk-allocation analysis.', fee: { type: 'hourly', amount: 350 } },
      { name: 'Mergers & Acquisitions', desc: 'Asset and stock purchases, letters of intent, diligence management and closing documents.', fee: { type: 'quote' } },
      { name: 'Partnership & Shareholder Disputes', desc: 'Oppression claims, buyout valuation and derivative actions in closely held companies.', fee: { type: 'retainer', amount: 8000 } },
      { name: 'Corporate Governance', desc: 'Board resolutions, fiduciary-duty advice, annual minutes and equity-incentive plan documentation.', fee: { type: 'hourly', amount: 350 } },
      { name: 'Startup & Venture Capital', desc: 'SAFEs, convertible notes, priced rounds and cap-table structuring through Series A.', fee: { type: 'flat', amount: 5000 } },
      { name: 'Franchise Law', desc: 'Franchise Disclosure Documents, franchisee and franchisor disputes, and territory issues.', fee: { type: 'quote' } },
      { name: 'Commercial Litigation', desc: 'Breach of contract, tortious interference, trade-secret and unfair-competition claims.', fee: { type: 'retainer', amount: 7500 } },
      { name: 'Nonprofit Formation & Compliance', desc: '501(c)(3) applications, bylaws, conflict-of-interest policies and Form 990 obligations.', fee: { type: 'flat', amount: 2500 } },
      { name: 'Outside General Counsel', desc: 'Ongoing contract, employment, IP and compliance support on a monthly retainer.', fee: { type: 'retainer', amount: 3000, note: 'Monthly, applied against work at $325/hr.' } }
    ]
  },
  {
    id: 'ip',
    name: 'Intellectual Property',
    group: 'Intellectual Property',
    tagline: 'Registration, licensing and enforcement.',
    summary: 'We register and enforce trademarks, copyrights, patents and trade secrets, and we litigate infringement. We also clear marks and freedom-to-operate before you commit to a brand or a product line, which is usually the cheaper point to find a conflict.',
    icon: 'ip',
    urgent: false,
    services: [
      { name: 'Trademark Registration', desc: 'Clearance search, filing with the USPTO, office-action responses and maintenance filings.', fee: { type: 'flat', amount: 1500, note: 'Plus USPTO filing fees per class.' } },
      { name: 'Trademark Enforcement', desc: 'Cease-and-desist, opposition and cancellation proceedings before the TTAB, and infringement suits.', fee: { type: 'retainer', amount: 6000 } },
      { name: 'Copyright', desc: 'Registration, DMCA takedown coordination and infringement claims, including statutory-damage elections.', fee: { type: 'flat', amount: 950 } },
      { name: 'Patent Prosecution', desc: 'Provisional and non-provisional utility and design applications, plus PCT filings.', fee: { type: 'quote' } },
      { name: 'Trade Secrets', desc: 'Confidentiality programs, employee agreements and DTSA claims for misappropriation.', fee: { type: 'retainer', amount: 6500 } },
      { name: 'IP Licensing', desc: 'Licensing, assignment and coexistence agreements, with royalty and audit provisions.', fee: { type: 'hourly', amount: 375 } },
      { name: 'IP Litigation', desc: 'District court and ITC actions for infringement, invalidity and unenforceability.', fee: { type: 'quote' } },
      { name: 'Domain Name Disputes', desc: 'UDRP and ACPA actions to recover cybersquatted domains.', fee: { type: 'flat', amount: 3500 } },
      { name: 'Brand Clearance & Freedom to Operate', desc: 'Pre-launch searches, risk opinions and design-around analysis.', fee: { type: 'flat', amount: 2200 } }
    ]
  },
  {
    id: 'realestate',
    name: 'Real Estate & Property',
    group: 'Real Estate',
    tagline: 'Transactions, landlord-tenant and title disputes.',
    summary: 'We represent buyers, sellers, landlords, tenants and developers across residential, commercial and mixed-use matters. Title defects, zoning restrictions and construction defects are resolved before closing where possible, and litigated after only when necessary.',
    icon: 'realestate',
    urgent: false,
    services: [
      { name: 'Residential Purchase & Sale', desc: 'Contract review, contingency management, title objection letters and closing coordination.', fee: { type: 'flat', amount: 1200 } },
      { name: 'Commercial Real Estate', desc: 'Purchase and sale, letters of intent, due diligence and lease negotiation for retail, office and industrial.', fee: { type: 'hourly', amount: 375 } },
      { name: 'Landlord-Tenant', desc: 'Lease drafting, security-deposit compliance, habitability defense and rent-escalation clauses.', fee: { type: 'hourly', amount: 300 } },
      { name: 'Evictions', desc: 'Notices to quit, unlawful-detainer actions and defense against improper eviction filings.', fee: { type: 'flat', amount: 950, note: 'Per uncontested eviction.' } },
      { name: 'Foreclosure Defense', desc: 'Standing challenges, loss-mitigation negotiation and wrongful-foreclosure claims against servicers.', fee: { type: 'retainer', amount: 3500 } },
      { name: 'Boundary & Title Disputes', desc: 'Quiet-title actions, adverse possession, easement and encroachment litigation.', fee: { type: 'retainer', amount: 5000 } },
      { name: 'Zoning & Land Use', desc: 'Variance applications, conditional-use permits, special exceptions and entitlement appeals.', fee: { type: 'hourly', amount: 350 } },
      { name: 'Construction Law', desc: 'Mechanics liens, delay and defect claims, and contract drafting for owners and contractors.', fee: { type: 'retainer', amount: 6000 } },
      { name: 'HOA & Condominium Disputes', desc: 'Covenant enforcement, assessment challenges, board governance and rule-interpretation matters.', fee: { type: 'hourly', amount: 325 } },
      { name: 'Mortgage & Loan Matters', desc: 'Loan modifications, escrow disputes and RESPA and TILA compliance claims.', fee: { type: 'hourly', amount: 325 } }
    ]
  },
  {
    id: 'bankruptcy',
    name: 'Bankruptcy & Debt Relief',
    group: 'Bankruptcy',
    tagline: 'Chapter 7, 11 and 13, and the defense of abusive collection.',
    summary: 'We file consumer and small-business bankruptcy and defend clients against creditors who violate the law. Means-test analysis, exemption planning and the automatic stay are handled before filing, because where you file and when you file change what you keep.',
    icon: 'bankruptcy',
    urgent: false,
    services: [
      { name: 'Chapter 7 Liquidation', desc: 'Means-test qualification, exemption planning and discharge of unsecured debt within roughly four months.', fee: { type: 'flat', amount: 1800, note: 'Plus filing fee and credit counseling.' } },
      { name: 'Chapter 13 Reorganization', desc: 'Three to five year repayment plans to cure arrears and protect nonexempt assets.', fee: { type: 'flat', amount: 3500 } },
      { name: 'Chapter 11 Reorganization', desc: 'Small-business and Subchapter V reorganization, disclosure statements and plan confirmation.', fee: { type: 'quote' } },
      { name: 'Creditor Harassment (FDCPA)', desc: 'Claims against collectors for violations of the Fair Debt Collection Practices Act, including statutory damages.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Foreclosure Defense', desc: 'Chapter 13 filings to stop sheriff sale, loan modification in bankruptcy and lien-stripping motions.', fee: { type: 'flat', amount: 3000 } },
      { name: 'Student Loan Relief', desc: 'Dischargeability adversary proceedings under the Brunner standard and income-driven repayment analysis.', fee: { type: 'quote' } },
      { name: 'Debt Settlement & Defense', desc: 'Negotiated reductions and defense against debt-buyer collection suits.', fee: { type: 'flat', amount: 1500 } },
      { name: 'Wage Garnishment Defense', desc: 'Garnishment exemptions, head-of-household protections and motions to quash.', fee: { type: 'flat', amount: 850 } },
      { name: 'Repossession Matters', desc: 'Deficiency-judgment defense, redemption and wrongful-repossession claims.', fee: { type: 'hourly', amount: 300 } },
      { name: 'Discharge Violation Claims', desc: 'Actions against creditors that pursue debts discharged in bankruptcy.', fee: { type: 'contingency', amount: 33 } }
    ]
  },
  {
    id: 'tax',
    name: 'Tax Law',
    group: 'Tax',
    tagline: 'Audits, back taxes and criminal exposure.',
    summary: 'We represent taxpayers before the IRS and state revenue departments, negotiate collection alternatives and defend criminal tax cases. Penalty abatement and installment agreements are often available early, before a lien or levy attaches.',
    icon: 'tax',
    urgent: true,
    services: [
      { name: 'IRS Audits', desc: 'Representation at examinations, information-document requests and appeals conferences.', fee: { type: 'hourly', amount: 400 } },
      { name: 'Back Taxes & Payment Plans', desc: 'Installment agreements, partial-payment arrangements and currently-not-collectible status.', fee: { type: 'flat', amount: 1500 } },
      { name: 'Offer in Compromise', desc: 'Doubt-as-to-collectibility, doubt-as-to-liability and effective-tax-administration offers.', fee: { type: 'flat', amount: 3500, note: 'Plus application fee.' } },
      { name: 'Tax Debt Relief', desc: 'Penalty abatement, lien withdrawal, levy release and innocent-spouse relief.', fee: { type: 'hourly', amount: 375 } },
      { name: 'Tax Court Litigation', desc: 'Petitions contesting notices of deficiency, including collection due-process hearings.', fee: { type: 'retainer', amount: 7500 } },
      { name: 'Payroll Tax & Trust Fund Recovery', desc: 'Defense against personal liability for unpaid employment taxes under Section 6672.', fee: { type: 'retainer', amount: 8000 } },
      { name: 'Criminal Tax Defense', desc: 'Representation in IRS Criminal Investigation matters, including voluntary disclosure.', fee: { type: 'retainer', amount: 20000 } },
      { name: 'State & Local Tax', desc: 'Sales-and-use audits, nexus analysis and state residency disputes.', fee: { type: 'hourly', amount: 375 } },
      { name: 'Tax Planning', desc: 'Entity structuring, installment sales and estate transfer planning for individuals and owners.', fee: { type: 'hourly', amount: 400 } }
    ]
  },
  {
    id: 'civilrights',
    name: 'Civil Rights & Constitutional Law',
    group: 'Civil Rights',
    tagline: 'Claims against the state and its officials.',
    summary: 'We bring Section 1983 and Bivens actions, discrimination claims and wrongful-conviction cases. Qualified immunity, notice-of-claim deadlines and short limitation periods make early investigation essential in these matters.',
    icon: 'civilrights',
    urgent: false,
    services: [
      { name: 'Police Misconduct & Excessive Force', desc: 'Section 1983 claims for excessive force, unlawful arrest and failure to intervene, plus Monell claims.', fee: { type: 'contingency', amount: 35 } },
      { name: 'Discrimination', desc: 'Title VII, ADA, ADEA and Section 1981 claims in employment, housing and public accommodation.', fee: { type: 'contingency', amount: 35 } },
      { name: 'Free Speech & Expression', desc: 'First Amendment claims, prior-restraint challenges and speech-retaliation matters.', fee: { type: 'hourly', amount: 350 } },
      { name: 'Voting Rights', desc: 'Section 2 claims, redistricting challenges and access litigation under the Voting Rights Act.', fee: { type: 'quote' } },
      { name: 'Wrongful Conviction', desc: 'Post-conviction investigation, DNA and forensic-integrity claims, and compensation actions.', fee: { type: 'quote' } },
      { name: 'Prisoner Rights', desc: 'Deliberate-indifference to medical need, conditions-of-confinement and PLRA exhaustion.', fee: { type: 'hourly', amount: 300 } },
      { name: 'Unlawful Detention & Search', desc: 'Fourth Amendment suppression and civil claims for unlawful stop, search and seizure.', fee: { type: 'contingency', amount: 35 } },
      { name: 'Government Transparency', desc: 'FOIA and state public-records litigation to compel disclosure.', fee: { type: 'hourly', amount: 325 } }
    ]
  },
  {
    id: 'government',
    name: 'Government & Administrative Law',
    group: 'Government',
    tagline: 'Benefits, licensing and regulatory appeals.',
    summary: 'We represent claimants and licensees before administrative agencies, hearing officers and appeals boards. Most of these matters turn on the record built at the first hearing, so we prepare that record with the appeal in mind.',
    icon: 'government',
    urgent: false,
    services: [
      { name: 'Social Security Disability', desc: 'Initial applications, reconsideration, ALJ hearings and Appeals Council review.', fee: { type: 'contingency', amount: 25, note: 'Fee capped by federal regulation.' } },
      { name: 'VA Disability Benefits', desc: 'Service-connection claims, rating increases, TDIU and Board of Veterans Appeals representation.', fee: { type: 'contingency', amount: 20 } },
      { name: 'Unemployment Appeals', desc: 'Referee hearings and appeal-board representation for denied or disputed claims.', fee: { type: 'flat', amount: 700 } },
      { name: 'Professional Licensing Defense', desc: 'Board investigations, consent orders and disciplinary hearings for licensed professionals.', fee: { type: 'retainer', amount: 5000 } },
      { name: 'FOIA Requests', desc: 'Drafting, narrowing, fee-waiver requests and litigation over improperly withheld records.', fee: { type: 'hourly', amount: 325 } },
      { name: 'Regulatory Compliance', desc: 'Agency rulemaking comments, compliance audits and enforcement-defense planning.', fee: { type: 'hourly', amount: 375 } },
      { name: 'Municipal & Zoning Appeals', desc: 'Board of adjustment, planning commission and city council appeals.', fee: { type: 'hourly', amount: 325 } },
      { name: 'Government Contracts', desc: 'Bid protests before the GAO and Court of Federal Claims, plus FAR compliance.', fee: { type: 'quote' } }
    ]
  },
  {
    id: 'traffic',
    name: 'Traffic & Motor Vehicle',
    group: 'Traffic',
    tagline: 'Tickets, license restoration and CDL protection.',
    summary: 'We contest citations, defend against license suspensions and protect commercial driving privileges. Points, insurance surcharges and CDL disqualification each carry long-term consequences that often exceed the original fine, which is why these matters are worth contesting.',
    icon: 'traffic',
    urgent: false,
    services: [
      { name: 'Traffic Tickets', desc: 'Contesting moving violations, negotiating reductions and pursuing dismissal or deferral programs.', fee: { type: 'flat', amount: 350 } },
      { name: 'Suspended & Revoked License', desc: 'Reinstatement, hardship and restricted licenses, and administrative hearings.', fee: { type: 'flat', amount: 750 } },
      { name: 'Reckless Driving', desc: 'Defense against criminal-traffic charges carrying possible jail and license consequences.', fee: { type: 'flat', amount: 900 } },
      { name: 'Commercial Driver (CDL)', desc: 'Serious-traffic-violation defense, disqualification appeals and clearing of CSA scores.', fee: { type: 'flat', amount: 1500 } },
      { name: 'Vehicle Impound & Forfeiture', desc: 'Contesting impound fees, seeking early release and defending civil forfeiture actions.', fee: { type: 'flat', amount: 800 } },
      { name: 'DUI Administrative Hearings', desc: 'DMV or MVD license hearings separate from the criminal case, with tight statutory filing windows.', fee: { type: 'flat', amount: 750 } },
      { name: 'Ignition Interlock Matters', desc: 'Interlock compliance, early removal petitions and violation hearings.', fee: { type: 'flat', amount: 650 } }
    ]
  },
  {
    id: 'education',
    name: 'Education & Student Defense',
    group: 'Education',
    tagline: 'Discipline, Title IX and special-education rights.',
    summary: 'We represent students and families in disciplinary proceedings, Title IX investigations and special-education disputes. Campus processes are not courts but they create a record that follows a student, so the response to the first notice matters more than anything that happens later.',
    icon: 'education',
    urgent: true,
    services: [
      { name: 'Title IX Defense', desc: 'Representation through investigation, hearing and appeal for students accused of sexual misconduct.', fee: { type: 'flat', amount: 5000 } },
      { name: 'Special Education (IEP & 504)', desc: 'IEP development, eligibility disputes and due-process complaints under the IDEA.', fee: { type: 'hourly', amount: 325 } },
      { name: 'Student Disciplinary Hearings', desc: 'Hearing representation, evidence preparation and appeals of suspension and expulsion.', fee: { type: 'flat', amount: 2500 } },
      { name: 'Bullying & Harassment', desc: 'School-response review, Title VI and Title IX complaints, and OCR filings.', fee: { type: 'hourly', amount: 300 } },
      { name: 'Tuition & Enrollment Disputes', desc: 'Residency classification, refund claims and consumer-protection actions against institutions.', fee: { type: 'hourly', amount: 300 } },
      { name: 'Athletic Eligibility', desc: 'NCAA and NAIA eligibility, transfer-waiver and amateurism matters.', fee: { type: 'quote' } },
      { name: 'Academic Integrity Matters', desc: 'Plagiarism, cheating and research-misconduct proceedings, including graduate and professional programs.', fee: { type: 'flat', amount: 2500 } },
      { name: 'OCR Complaints', desc: 'Drafting and prosecuting Office for Civil Rights complaints against institutions.', fee: { type: 'hourly', amount: 325 } }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Disability Law',
    group: 'Healthcare',
    tagline: 'Claims, denials and provider licensing.',
    summary: 'We represent patients and providers in malpractice, disability-benefit and licensing matters. For long-term disability claims, the administrative record you build before denial usually decides the litigation, so we engage before the appeal deadline, not after.',
    icon: 'healthcare',
    urgent: false,
    services: [
      { name: 'Long-Term Disability Claims', desc: 'ERISA appeals and litigation, including the arbitrary-and-capricious standard and vocational review.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Health Insurance Denials', desc: 'Internal and external appeals, prior-authorization disputes and bad-faith claims.', fee: { type: 'hourly', amount: 325 } },
      { name: 'HIPAA Violations', desc: 'Privacy and security breach claims, OCR complaints and state-law analogues.', fee: { type: 'quote' } },
      { name: 'Provider Licensing', desc: 'Board investigations, peer review, NPDB reporting and credentialing disputes.', fee: { type: 'retainer', amount: 7500 } },
      { name: 'Medical Malpractice Defense', desc: 'Representation of providers in standard-of-care litigation.', fee: { type: 'hourly', amount: 450 } },
      { name: 'Medicare & Medicaid Billing', desc: 'Recoupment audits, RAC and UPIC investigations, and overpayment appeals.', fee: { type: 'retainer', amount: 7500 } },
      { name: 'Physician Employment Contracts', desc: 'Review of compensation, non-compete, call coverage and termination provisions.', fee: { type: 'flat', amount: 1200 } },
      { name: 'Mental Health Parity Claims', desc: 'Claims under the Mental Health Parity and Addiction Equity Act and state analogues.', fee: { type: 'hourly', amount: 325 } }
    ]
  },
  {
    id: 'elder',
    name: 'Elder Law',
    group: 'Elder',
    tagline: 'Protecting older adults and their assets.',
    summary: 'We handle abuse and neglect claims, guardianship and long-term care planning for older adults. Because nursing-home records and resident charts change quickly, we send preservation letters early to prevent the loss of the evidence a case depends on.',
    icon: 'elder',
    urgent: false,
    services: [
      { name: 'Elder Abuse & Neglect', desc: 'Civil claims for physical abuse, neglect and financial exploitation of older adults.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Nursing Home Litigation', desc: 'Understaffing and charting-fraud evidence, and wrongful-death claims against facilities.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Guardianship & Conservatorship', desc: 'Petitions, contested appointments, accountings and removal of fiduciaries.', fee: { type: 'hourly', amount: 325 } },
      { name: 'Medicaid Planning', desc: 'Asset structuring and look-back analysis to preserve eligibility for long-term care.', fee: { type: 'hourly', amount: 350 } },
      { name: 'Medicare Advocacy', desc: 'Coverage denials, skilled-nursing-facility day disputes and appeals.', fee: { type: 'hourly', amount: 300 } },
      { name: 'Estate Administration for Seniors', desc: 'Probate of modest estates, small-estate affidavits and fiduciary guidance.', fee: { type: 'flat', amount: 1500 } },
      { name: 'Financial Exploitation', desc: 'Recovery of assets taken through undue influence, fraud or forged instruments.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Long-Term Care Planning', desc: 'Advance planning for care transitions, caregiver agreements and asset protection.', fee: { type: 'hourly', amount: 325 } }
    ]
  },
  {
    id: 'consumer',
    name: 'Consumer Protection',
    group: 'Consumer',
    tagline: 'Statutory claims against businesses that break the rules.',
    summary: 'We bring claims under the TCPA, FCRA, FDCPA and state consumer-protection statutes, and we pursue class actions where a violation was applied to many people. Many of these statutes award statutory damages and attorney fees, which can make a modest individual claim economically viable.',
    icon: 'consumer',
    urgent: false,
    services: [
      { name: 'Robocall & Text Claims (TCPA)', desc: 'Claims for unconsented automated calls and texts, including statutory damages per violation.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Credit Reporting Errors (FCRA)', desc: 'Reinvestigation failures, mixed-file claims and inaccurate reporting actions against bureaus and furnishers.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Debt Collection Abuse (FDCPA)', desc: 'Harassment, false representations and validation violations by third-party collectors.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Lemon Law', desc: 'Manufacturer repurchase or replacement claims for persistently defective vehicles.', fee: { type: 'contingency', amount: 30 } },
      { name: 'Product Defects', desc: 'Defective-product injury and warranty claims, and Magnuson-Moss actions.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Class Actions', desc: 'Certification, class notice and settlement administration for widespread consumer harm.', fee: { type: 'contingency', amount: 30 } },
      { name: 'Identity Theft', desc: 'Restoration, credit-freeze enforcement and claims against negligent data holders.', fee: { type: 'flat', amount: 1200 } },
      { name: 'Unfair & Deceptive Practices', desc: 'State UDAP claims for deceptive advertising, hidden fees and misrepresentation.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Warranty Claims', desc: 'Breach of express and implied warranties for goods and services.', fee: { type: 'hourly', amount: 300 } }
    ]
  },
  {
    id: 'international',
    name: 'International Law',
    group: 'International',
    tagline: 'Cross-border disputes, contracts and enforcement.',
    summary: 'We advise on cross-border contracts, foreign-judgment enforcement and international family matters. Where a dispute involves parties in two countries, the choice of forum and choice of law clauses frequently determine the outcome before any court is asked to rule.',
    icon: 'international',
    urgent: false,
    services: [
      { name: 'Cross-Border Family', desc: 'Hague Convention return petitions, international custody and foreign divorce recognition.', fee: { type: 'quote' } },
      { name: 'International Contracts', desc: 'Drafting and dispute resolution under CISG, ICC and UNCITRAL rules.', fee: { type: 'hourly', amount: 450 } },
      { name: 'Foreign Judgment Enforcement', desc: 'Recognition and enforcement actions for judgments obtained abroad.', fee: { type: 'retainer', amount: 10000 } },
      { name: 'Treaty & Trade Matters', desc: 'Investor-state disputes, sanctions analysis and export-control compliance.', fee: { type: 'quote' } },
      { name: 'Extradition Defense', desc: 'Representation in extradition proceedings and dual-criminality analysis.', fee: { type: 'quote' } },
      { name: 'International Arbitration', desc: 'Arbitration and enforcement of awards under the New York Convention.', fee: { type: 'quote' } },
      { name: 'Cross-Border Transactions', desc: 'Joint ventures, distributor agreements and foreign-entity formation.', fee: { type: 'hourly', amount: 450 } }
    ]
  },
  {
    id: 'litigation',
    name: 'Civil & Commercial Litigation',
    group: 'Litigation',
    tagline: 'Trial practice in state and federal court.',
    summary: 'We try cases. That includes pre-suit demand and negotiation, discovery and dispositive motions, and trial and appeal. Most matters resolve before a verdict, but we prepare each one as though it will be tried, which changes how the other side values the case.',
    icon: 'litigation',
    urgent: false,
    services: [
      { name: 'Breach of Contract', desc: 'Enforcement and defense, including consequential damages, specific performance and liquidated-damages challenges.', fee: { type: 'retainer', amount: 7500 } },
      { name: 'Business Disputes', desc: 'Partnership, shareholder and fiduciary-duty claims and injunctive relief.', fee: { type: 'retainer', amount: 10000 } },
      { name: 'Tort Claims', desc: 'Negligence, fraud, conversion and tortious interference claims.', fee: { type: 'retainer', amount: 7500 } },
      { name: 'Class Actions & Mass Torts', desc: 'Class certification, multidistrict coordination and aggregate settlement.', fee: { type: 'contingency', amount: 30 } },
      { name: 'Arbitration & Mediation', desc: 'AAA and JAMS arbitration, and court-ordered mediation with settlement-document drafting.', fee: { type: 'hourly', amount: 400 } },
      { name: 'Injunctive Relief', desc: 'Temporary restraining orders and preliminary injunctions on expedited timelines.', fee: { type: 'retainer', amount: 10000 } },
      { name: 'Discovery & Motion Practice', desc: 'Depositions, expert discovery, summary judgment and Daubert challenges.', fee: { type: 'hourly', amount: 375 } },
      { name: 'Judgment Enforcement', desc: 'Post-judgment collection, asset discovery and fraudulent-transfer actions.', fee: { type: 'hourly', amount: 375 } },
      { name: 'Appellate Practice', desc: 'Briefing and argument on interlocutory and final appeals from trial outcomes.', fee: { type: 'quote' } }
    ]
  },
  {
    id: 'appellate',
    name: 'Appeals & Post-Conviction',
    group: 'Appellate',
    tagline: 'Second review, at the state and federal level.',
    summary: 'We brief and argue appeals and pursue post-conviction relief. Appellate work is won or lost on the record developed below, so our first step is always a full transcript review to identify the issues that were preserved and the ones that were not.',
    icon: 'appellate',
    urgent: false,
    services: [
      { name: 'Direct Appeals', desc: 'Notices of appeal, record designation and briefing in state intermediate and supreme courts.', fee: { type: 'retainer', amount: 10000 } },
      { name: 'Post-Conviction Relief', desc: 'Ineffective-assistance-of-counsel claims and newly discovered evidence motions.', fee: { type: 'retainer', amount: 12000 } },
      { name: 'Federal Habeas Corpus', desc: 'Section 2254 and 2255 petitions, exhaustion analysis and AEDPA deference.', fee: { type: 'retainer', amount: 15000 } },
      { name: 'Sentence Reduction', desc: 'Compassionate release, First Step Act motions and guideline-recalculation claims.', fee: { type: 'flat', amount: 4500 } },
      { name: 'Certiorari Petitions', desc: 'Petitions for review to the United States Supreme Court.', fee: { type: 'quote' } },
      { name: 'Civil Appeals', desc: 'Appeals in civil matters, including standards of review and preservation analysis.', fee: { type: 'retainer', amount: 10000 } },
      { name: 'Writs & Mandamus', desc: 'Extraordinary writs to correct jurisdictional and procedural errors.', fee: { type: 'hourly', amount: 400 } },
      { name: 'Bond & Stay Motions', desc: 'Requests to stay execution of judgment or sentence pending appeal.', fee: { type: 'flat', amount: 2500 } }
    ]
  },
  {
    id: 'maritime',
    name: 'Maritime & Aviation Law',
    group: 'Specialty',
    tagline: 'Injuries and disputes on water and in the air.',
    summary: 'We handle Jones Act claims, admiralty matters and aviation accidents. Maritime cases run on rules that differ sharply from land-based tort law, including maintenance and cure, the doctrine of unseaworthiness and the Death on the High Seas Act.',
    icon: 'specialty',
    urgent: false,
    services: [
      { name: 'Jones Act Claims', desc: 'Injury claims by seamen against employers, with negligence-based recovery rather than workers compensation.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Maintenance & Cure', desc: 'Daily maintenance and medical-care claims owed to injured seamen, independent of fault.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Admiralty & Marine Insurance', desc: 'Cargo, hull and protection-and-indemnity coverage disputes.', fee: { type: 'hourly', amount: 400 } },
      { name: 'Aviation Accidents', desc: 'NTSB investigation review, international Montreal Convention claims and wrongful death.', fee: { type: 'quote' } },
      { name: 'Boat & Yacht Accidents', desc: 'Recreational and commercial vessel collision, injury and salvage matters.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Marine Contracts', desc: 'Charters, towage, salvage agreements and vessel financing documents.', fee: { type: 'hourly', amount: 400 } },
      { name: 'Longshore & Harbor Workers', desc: 'Claims under the Longshore and Harbor Workers Compensation Act.', fee: { type: 'contingency', amount: 20 } }
    ]
  },
  {
    id: 'entertainment',
    name: 'Sports, Entertainment & Media Law',
    group: 'Specialty',
    tagline: 'Talent, rights, contracts and defamation.',
    summary: 'We represent talent, producers and media clients on contracts, intellectual property and defamation. Rights disputes often turn on the scope and duration of a grant, so we negotiate ownership and termination terms before a project is completed rather than after it succeeds.',
    icon: 'specialty',
    urgent: false,
    services: [
      { name: 'Talent & Employment Agreements', desc: 'Recording, publishing, endorsement and appearance contracts, including 360 deals.', fee: { type: 'hourly', amount: 400 } },
      { name: 'Rights & Clearances', desc: 'Music synchronization, life-rights and content-clearance review for film and streaming.', fee: { type: 'hourly', amount: 400 } },
      { name: 'Defamation & Libel', desc: 'Claims and defense, including actual-malice analysis for public figures.', fee: { type: 'retainer', amount: 7500 } },
      { name: 'Sports Contracts', desc: 'Athlete representation agreements, NIL deals and eligibility matters.', fee: { type: 'hourly', amount: 400 } },
      { name: 'Media Production', desc: 'Production agreements, distribution deals and chain-of-title documentation.', fee: { type: 'hourly', amount: 400 } },
      { name: 'Royalty & Accounting Claims', desc: 'Audit rights, royalty disputes and profit-participation litigation.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Privacy & Publicity', desc: 'Right-of-publicity claims, misappropriation and likeness disputes.', fee: { type: 'hourly', amount: 400 } }
    ]
  },
  {
    id: 'environmental',
    name: 'Environmental & Energy Law',
    group: 'Specialty',
    tagline: 'Permits, contamination and regulatory enforcement.',
    summary: 'We advise on environmental permitting, remediation and enforcement defense, and we litigate contamination and toxic-exposure claims. Regulatory programs such as CERCLA, the Clean Air Act and the Clean Water Act create strict and joint-and-several liability, so response strategy matters early.',
    icon: 'specialty',
    urgent: false,
    services: [
      { name: 'Regulatory Compliance', desc: 'Clean Air Act, Clean Water Act and RCRA permitting and reporting obligations.', fee: { type: 'hourly', amount: 400 } },
      { name: 'Contamination & Remediation', desc: 'CERCLA liability, cost-recovery and contribution actions, and brownfield redevelopment.', fee: { type: 'retainer', amount: 12000 } },
      { name: 'Toxic Exposure Claims', desc: 'Personal-injury claims for exposure to contaminants, including medical monitoring.', fee: { type: 'contingency', amount: 33 } },
      { name: 'Environmental Enforcement Defense', desc: 'EPA and state agency enforcement actions, consent decrees and penalty negotiation.', fee: { type: 'retainer', amount: 12000 } },
      { name: 'Land Use & Permitting', desc: 'NEPA review, wetlands permits and project-entitlement challenges.', fee: { type: 'hourly', amount: 400 } },
      { name: 'Energy Transactions', desc: 'Power purchase agreements, project finance and renewable-energy siting.', fee: { type: 'quote' } },
      { name: 'Citizen Suits', desc: 'Statutory citizen-suit actions under federal environmental statutes.', fee: { type: 'quote' } }
    ]
  }
];
