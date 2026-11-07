'use strict';
/**
 * Oakstone Legal Group - Site Content
 * Copy authored to pass the "company-name swap" test: swap the firm name for a
 * competitor and these statements should no longer hold. Anything that would
 * still read fine for any firm was rewritten.
 *
 * ETHICS NOTE: stats and testimonials are illustrative placeholders. Before
 * launch they must be replaced with verifiable figures. Prior-result claims and
 * testimonials are regulated under ABA Model Rule 7.1 and equivalent state
 * rules, and several states impose additional requirements. See /disclaimer.
 */

module.exports = {
  stats: [
    { value: '$412M', label: 'Recovered for clients since 2009' },
    { value: '27', label: 'States with counsel of record' },
    { value: '94', label: 'Attorneys, paralegals and analysts' },
    { value: '11', label: 'Consecutive Super Lawyers selections' }
  ],

  process: [
    { step: 1, title: 'Confidential review', desc: 'You describe the matter through the intake form or by phone. An attorney, not a salesperson, reads it and identifies the deadline that governs.' },
    { step: 2, title: 'Written assessment', desc: 'Within one business day you receive a written scope: the claims or defenses available, the projected timeline, the fee structure and what we need from you.' },
    { step: 3, title: 'Engagement', desc: 'We countersign a fee agreement that states exactly what is included. No work begins and no fee is earned until you have that document in hand.' },
    { step: 4, title: 'Representation', desc: 'A lead attorney and a paralegal are assigned. You get direct numbers for both, a calendar of every deadline, and status updates on a defined schedule.' }
  ],

  testimonials: [
    { quote: 'The wire left my account on a Friday. They sent the recall demand to the receiving bank the same afternoon and had a freeze letter out before Monday. We got most of it back.', author: 'R.M.', matter: 'Business email compromise, Illinois', rating: 5 },
    { quote: 'I had already interviewed three firms for my custody case. This was the first one that told me what I probably could not get, and then got me more than that anyway.', author: 'D.T.', matter: 'Contested custody, Ohio', rating: 5 },
    { quote: 'My mother was in that facility for eleven months. They read the charting records with me line by line and showed me where it had been altered. That document decided the case.', author: 'K.A.', matter: 'Nursing home neglect, Pennsylvania', rating: 5 },
    { quote: 'They took my crypto scam case when two other firms said the money was gone. The tracing report went to the FBI field office and it actually moved the investigation forward.', author: 'J.L.', matter: 'Investment fraud recovery, Texas', rating: 5 },
    { quote: 'The IRS had filed a lien and was preparing to levy. I had the installment agreement in hand five weeks later and the levy never happened.', author: 'P.O.', matter: 'Back taxes and levy, Georgia', rating: 5 },
    { quote: 'Reading the appeal brief was the first time in three years I understood what had actually gone wrong in my son case. They found two issues the trial lawyer had missed entirely.', author: 'S.B.', matter: 'Post-conviction relief, Michigan', rating: 5 },
    { quote: 'I called the emergency line on a Sunday because my email and bank accounts had been taken over. A real attorney answered and walked me through freezing everything before we even discussed fees.', author: 'A.N.', matter: 'Account takeover, California', rating: 5 },
    { quote: 'They handled the whole trademark opposition without me having to appear once. The other side withdrew after the discovery responses went out.', author: 'M.G.', matter: 'Trademark opposition, New York', rating: 5 },
    { quote: 'What mattered was that someone explained the process in plain language and then stuck to the timeline they gave me. No surprises on the bill either.', author: 'C.W.', matter: 'Uncontested divorce, Florida', rating: 5 }
  ],

  faqs: [
    { q: 'Do I need to meet with an attorney before you will tell me anything?', a: 'No. The confidential case review is free and does not require an engagement. An attorney reads your intake and responds with a written assessment of the issues and deadlines. You decide afterward whether to retain us. Nothing you submit creates an attorney-client relationship until we both sign a fee agreement.' },
    { q: 'How does the firm work in all fifty states if it is not licensed everywhere?', a: 'We hold counsel of record in 27 states directly. In the remaining states we act through admitted local counsel working under our case strategy, which is a standard arrangement for multi-state matters. You deal with our team and one point of contact regardless of where your case is filed.' },
    { q: 'What does the free case review actually cover?', a: 'It covers a review of the facts you submit, identification of the claims or defenses that appear available, the deadlines that apply, and the fee structure we would propose. It does not include legal research opinions, document drafting, or advice you can rely on for a decision, since we have not been retained and may not have the full record.' },
    { q: 'How are fees structured?', a: 'Four ways. Flat fees for defined work such as entity formation, an uncontested divorce or a trademark filing. Hourly fees at published rates for matters that cannot be scoped in advance. Retainers applied against hourly work. And contingency fees for personal injury, recovery and most plaintiff-side claims, where you pay nothing unless we recover.' },
    { q: 'Is a contingency arrangement really no fee if I lose?', a: 'Yes, for cases we accept on contingency. We advance filing fees, records costs and expert expenses, and we are reimbursed those costs only out of a recovery. If there is no recovery, we are not paid and you do not repay the advanced costs. We only offer contingency where we believe the claim has merit, which is why not every case is accepted on those terms.' },
    { q: 'How quickly will someone respond after I submit the form?', a: 'During business hours, within four hours. Matters submitted through the emergency intake for cyber incidents are answered within one hour around the clock, because in those cases funds or accounts are usually still recoverable in the first seventy-two hours.' },
    { q: 'Will I speak to a lawyer or to someone in a call center?', a: 'You speak to an attorney or a supervised paralegal who is working on your matter, and you are given direct contact details for both after engagement. We do not route client calls through an intake vendor.' },
    { q: 'What information should I have ready for the review?', a: 'Any contract, court filing, notice or letter you have received, the dates of the events, and a list of the parties involved. For cyber matters, bank or exchange statements showing the transfer, and screenshots of any communication with the other side. Do not send passwords or private keys through the form.' },
    { q: 'I was scammed online. Is recovery realistic?', a: 'Sometimes, and never guaranteed. Funds that moved to a regulated exchange can sometimes be frozen, and tracing can identify where they went. But most scam funds move within hours and pass through jurisdictions where enforcement is difficult. What we can do is preserve evidence correctly, engage law enforcement early, and pursue civil recovery where an identifiable defendant exists. Anyone promising you a guaranteed recovery is not telling you the truth.' },
    { q: 'Can you get my account back after a hack?', a: 'In many cases, yes. We send platform preservation and restoration requests, work through the account-recovery process with the provider, and document the intrusion so that what was taken or altered can be reconstructed. The sooner the account is locked down, the higher the odds that sessions and recovery contacts have not been changed beyond reach.' },
    { q: 'Do you work with the FBI and other agencies?', a: 'Yes. We prepare evidence packages in the format the Internet Crime Complaint Center accepts, coordinate with the assigned field office or agent where a case exists, and follow up on your behalf. We cannot direct an agency investigation, and no attorney can promise that charges will be brought or that federal resources will be assigned.' },
    { q: 'Are our conversations confidential?', a: 'Communications with our attorneys are protected by the attorney-client privilege to the extent the law provides, and we treat all intake information as confidential even before engagement. There are narrow exceptions, such as where a client is about to commit a crime, that apply to every law firm. We do not sell or share intake data.' },
    { q: 'What happens if the other side has more money than I do?', a: 'That is a real disadvantage and we tell clients so. It is often addressed by narrowing the dispute to the issues that decide the case, by fee-shifting statutes that make the losing side pay where they apply, and by using contingency or capped-fee structures. Some matters we decline because the economics do not work for the client, and we say that rather than take a case we cannot fund.' },
    { q: 'Can you take my case if I am already represented?', a: 'We do not solicit clients who are represented and we will not interfere with an existing engagement. If you are unhappy with current counsel, you are free to change attorneys, and we can review your matter once you have formally discharged the prior firm or have its agreement to a second opinion.' },
    { q: 'How long will my case take?', a: 'It depends entirely on the forum and whether the other side contests. An uncontested divorce or an entity formation can finish in weeks. A contested custody matter or a commercial claim typically runs twelve to twenty-four months through trial. Federal criminal and appellate work often runs longer. We give you a realistic range in the written assessment, not a best-case number.' },
    { q: 'Do you handle both sides, or only plaintiffs?', a: 'Both, but never in the same matter. We represent plaintiffs and defendants across practice areas and we handle defense-side work in litigation, criminal, employment and malpractice matters. Conflicts are cleared before we accept any representation, which is why we ask for the identity of the other parties at intake.' },
    { q: 'What if I cannot afford a lawyer at all?', a: 'Tell us that at intake. For some matters we offer reduced-fee or pro bono representation, and where we cannot take a case we will point you to legal aid, law-school clinics or a bar referral service in your state. We would rather route you correctly than take a fee you cannot carry.' },
    { q: 'Will my case be handled by the attorney I speak with?', a: 'The attorney who assesses your matter may not be the one who leads it, but you will know who does. Staffing depends on the practice group and complexity. You are told the name and credentials of your lead attorney before you sign, and you can request a change if the fit is wrong.' }
  ],

  trustBadges: [
    'AV Preeminent Rated',
    'Super Lawyers 2025',
    'Board Certified, Family Law',
    'Former Federal Prosecutors',
    'AVVO 10.0 Rated',
    'Multi-State Counsel Network'
  ],

  cyber: {
    emergencySteps: [
      'Do not send more money. Stop all further payment and do not agree to a second fee, tax, or release demanded to recover the first.',
      'Preserve everything now. Photograph the transaction records, save the emails and messages, and copy the wallet or account addresses before anything is closed or deleted.',
      'Revoke access. Change passwords from a clean device, end all active sessions, and remove unknown recovery emails and phone numbers on the compromised accounts.',
      'Freeze and flag. Contact your bank or the exchange to request a recall or freeze, and place a fraud alert or freeze with the credit bureaus if personal data was exposed.',
      'Report it in parallel. File with the FBI Internet Crime Complaint Center and the FTC, then bring us the complaint numbers. Speed here is what makes freezing possible.'
    ],
    liaison: [
      { agency: 'FBI Internet Crime Complaint Center (IC3)', role: 'The IC3 is the federal intake point for cyber-enabled financial crime. We file a complete, evidence-structured complaint rather than the standard form, and we follow up on the assigned complaint number, which is often what converts a report into an actual investigative referral.' },
      { agency: 'U.S. Secret Service', role: 'The Secret Service has statutory authority over financial and cyber crimes and runs regional task forces that can act on a live case. Where funds are traceable to a specific account, a referral here can produce a seizure or a freeze far faster than a civil action alone.' },
      { agency: 'FinCEN', role: 'The Financial Crimes Enforcement Network receives suspicious activity reports from banks and exchanges. We work with your financial institution to ensure an accurate report is filed, since missing or incorrect reports are a common reason lawful transfers avoid scrutiny.' },
      { agency: 'Federal Trade Commission', role: 'The FTC collects identity-theft and consumer-fraud reports and maintains the IdentityTheft.gov recovery framework. We use it to establish the official record of the fraud, which supports credit disputes and later civil claims.' }
    ],
    recoveryFacts: [
      'Recovery is never guaranteed. Any firm or service that promises you a fixed percentage back before tracing is done is telling you something untrue.',
      'Time is the decisive factor. Most stolen funds are moved through multiple wallets within hours, so the difference between a same-day request and a request filed next week is often the difference between a freeze and a loss.',
      'Tracing can prove where funds went even when they cannot be recovered, and a tracing report has independent value: it supports law-enforcement action, exchange freezes, and civil claims against any party that received and kept the funds.',
      'Civil recovery depends on finding a reachable defendant. Where funds landed at a regulated exchange or with a person subject to U.S. jurisdiction, recovery actions are often viable. Where they landed in an uncooperative foreign jurisdiction, remedies are limited and we will tell you so.'
    ]
  }
};
