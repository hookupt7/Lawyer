'use strict';
/**
 * Oakstone — tailored client intake questions, one set per practice area.
 *
 * The engine in lib/practiceflow.js renders ONE question per page, in order,
 * then appends the state question and the urgency question unless the set
 * already supplies them. So a set here only has to hold the questions that
 * are genuinely specific to that area of law.
 *
 * Question types the renderer understands:
 *   choice  — options rendered as large tappable cards
 *   money   — size-of-matter bands, rendered like choice
 *   state   — the 51-jurisdiction picker, supplied by the engine
 *   number  — one numeric field, `unit` is the suffix after it
 *   text    — one free-text field, `placeholder` is the hint
 *
 * `fee` on an option is a plain string the client reads at the point of
 * choosing. It must stay consistent with the fees in the practice-area data.
 */
module.exports = {

  /* ================= FAMILY ================= */
  'family': {
    intro: "Family matters are decided on facts and on what you can prove. These questions tell us which court, which deadlines and which fee structure apply.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What kind of family matter is this?',
        sub: 'Pick the closest match. If more than one applies, pick the most urgent.',
        options: [
          { value: 'divorce', label: 'Divorce or separation', desc: 'Ending a marriage or a long-term relationship.', fee: 'Flat fee from $1,500' },
          { value: 'custody', label: 'Custody or parenting time', desc: 'Where the children live and how time is divided.', fee: 'Flat fee from $2,000' },
          { value: 'support', label: 'Child or spousal support', desc: 'Setting, changing or enforcing support.', fee: 'Flat fee from $1,200' },
          { value: 'modification', label: 'Changing an existing order', desc: 'A prior order no longer fits the facts.', fee: 'Flat fee from $1,200' },
          { value: 'adoption', label: 'Adoption or guardianship', desc: 'Adding or formalising a parental relationship.', fee: 'Flat fee from $2,500' },
          { value: 'protective', label: 'Protective order', desc: 'Immediate safety and a no-contact order.', fee: 'Flat fee from $1,000' }
        ]
      },
      {
        key: 'contested', type: 'choice',
        title: 'Is the other side likely to agree, or fight?',
        sub: 'This is the single biggest driver of cost. Nobody knows for certain at the start, so give your honest read.',
        options: [
          { value: 'uncontested', label: 'We agree on the main points', desc: 'We need the paperwork done properly and filed.', fee: 'Uncontested flat fee' },
          { value: 'mixed', label: 'Some agreement, some dispute', desc: 'Mostly agreed, but one or two things are in issue.', fee: 'Flat fee plus hourly' },
          { value: 'contested', label: 'We disagree and it may go to a hearing', desc: 'Positions are apart and a judge may have to decide.', fee: 'Retainer from $5,000' },
          { value: 'unknown', label: 'I do not know what they will do', desc: 'Nothing has been raised yet.', fee: 'Fee quoted after review' }
        ]
      },
      {
        key: 'children', type: 'choice',
        title: 'Are children involved?',
        sub: 'Children change the timetable, the orders that are made, and what a court will want to see.',
        options: [
          { value: 'yes_minor', label: 'Yes, children under 18', desc: 'A parenting plan or support order is likely needed.' },
          { value: 'yes_adult', label: 'Yes, but they are adults', desc: 'No custody issue, though support arrears may remain.' },
          { value: 'no', label: 'No children', desc: 'The matter is between the two adults only.' }
        ]
      },
      {
        key: 'othercounsel', type: 'choice',
        title: 'Does the other side already have a lawyer?',
        sub: 'If they do, we know the pace they will set and we plan around it.',
        options: [
          { value: 'yes', label: 'Yes, they have counsel' },
          { value: 'no', label: 'No, they do not' },
          { value: 'unknown', label: 'I am not sure' }
        ]
      }
    ]
  },

  /* ================= CYBER ================= */
  'cyber': {
    intro: "The first seventy-two hours decide how much can be recovered. Answer these and we triage you immediately.",
    questions: [
      {
        key: 'incident', type: 'choice',
        title: 'What happened?',
        sub: 'Pick the closest match. You can explain the detail on the last page.',
        options: [
          { value: 'account', label: 'Account or email taken over', desc: 'Locked out, and someone is acting as you inside it.', fee: 'Flat fee from $950' },
          { value: 'cryptofraud', label: 'Crypto or wire fraud', desc: 'Funds sent to a wallet or account that turned out to be a fraud.', fee: 'Contingency, 25 to 33 percent' },
          { value: 'ransom', label: 'Ransomware or extortion', desc: 'Systems encrypted or data held for a demand.', fee: 'Retainer from $2,500' },
          { value: 'bec', label: 'Business email compromise', desc: 'A payment was redirected by a fake invoice or impersonation.', fee: 'Contingency, 25 to 33 percent' },
          { value: 'sextort', label: 'Sextortion or blackmail', desc: 'Threats to publish images or private material.', fee: 'Flat fee from $950' },
          { value: 'identity', label: 'Identity theft or data breach', desc: 'Your data is being used, or was exposed by a company.', fee: 'Flat fee from $750' }
        ]
      },
      {
        key: 'hours', type: 'number', unit: 'hours ago',
        title: 'How long ago did it start?',
        sub: 'Funds and accounts are recoverable far more often in the first hours. Put the closest number in hours.',
        placeholder: 'e.g. 6'
      },
      {
        key: 'moving', type: 'choice',
        title: 'Is money still moving?',
        sub: 'This decides whether we go straight to emergency tracing.',
        options: [
          { value: 'yes', label: 'Yes, probably today', desc: 'A transfer or withdrawal may still be in flight.', fee: 'Emergency intake, no charge to triage' },
          { value: 'maybe', label: 'Possibly, but I am not sure' },
          { value: 'no', label: 'No, it has stopped' }
        ]
      },
      {
        key: 'reported', type: 'choice',
        title: 'Who have you told so far?',
        sub: 'Tick everything that applies — it changes what evidence still exists.',
        options: [
          { value: 'nothing', label: 'Nobody yet' },
          { value: 'bank', label: 'My bank, card issuer or exchange' },
          { value: 'police', label: 'Police or IC3 / FBI' },
          { value: 'platform', label: 'The platform, such as the email or social provider' }
        ]
      }
    ]
  },

  /* ================= SURVIVOR ================= */
  'survivor': {
    intro: "You are not on trial here. These questions exist so an attorney can tell you honestly whether a claim is still open to you, and what it would take. Answer only what you are able to answer.",
    questions: [
      {
        key: 'age', type: 'number', unit: 'years old',
        title: 'How old were you when it happened?',
        sub: 'If it happened more than once, give the age at the first time. Age matters because child-abuse claims are often given longer, and sometimes revived, deadlines.',
        placeholder: 'e.g. 14'
      },
      {
        key: 'relationship', type: 'choice',
        title: 'Who was responsible?',
        sub: 'This shapes who can be sued — often an institution as well as the person.',
        options: [
          { value: 'family', label: 'A family member' },
          { value: 'authority', label: 'A person in authority', desc: 'A teacher, coach, doctor, clergy member, or similar.' },
          { value: 'care', label: 'In a care setting', desc: 'Foster care, a group home, a detention or treatment facility.' },
          { value: 'workplace', label: 'At work, or by an employer' },
          { value: 'stranger', label: 'Someone I did not know' },
          { value: 'other', label: 'Someone else, or I would rather say later' }
        ]
      },
      {
        key: 'reported', type: 'choice',
        title: 'Was it ever reported?',
        sub: 'A report is not required to bring a civil claim, and lack of one is not held against you.',
        options: [
          { value: 'yes', label: 'Yes, to police or an agency', desc: 'There may be a record we can obtain.' },
          { value: 'institution', label: 'Yes, but only to the school, church or employer' },
          { value: 'no', label: 'No, never reported' },
          { value: 'unsure', label: 'I am not sure whether anyone reported it' }
        ]
      },
      {
        key: 'outcome', type: 'choice',
        title: 'What would help you most right now?',
        sub: 'There is no wrong answer, and choosing one does not lock you in.',
        options: [
          { value: 'civil', label: 'A civil claim for damages', desc: 'Compensation for harm, therapy, lost earnings and pain.' },
          { value: 'order', label: 'A protective order', desc: 'A court order keeping someone away from you.' },
          { value: 'both', label: 'Both' },
          { value: 'advice', label: 'I do not know yet — I want advice first' }
        ]
      },
      {
        key: 'attorneypref', type: 'choice',
        title: 'Would you prefer to speak with a particular attorney?',
        sub: 'We will match you with whoever you are most comfortable speaking to.',
        options: [
          { value: 'female', label: 'A female attorney' },
          { value: 'no_pref', label: 'No preference' },
          { value: 'not_sure', label: 'I would rather not say' }
        ]
      }
    ]
  },

  /* ================= INJURY ================= */
  'injury': {
    intro: "Injury claims turn on treatment records, deadlines and who was at fault. These questions tell us what we are working with.",
    questions: [
      {
        key: 'kind', type: 'choice',
        title: 'What kind of injury is this?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'car', label: 'Car, truck or motorcycle crash', desc: 'Including rideshare and pedestrian collisions.', fee: 'No fee unless we recover' },
          { value: 'work', label: 'Injury at work', desc: 'Workers compensation, or a claim against a third party.', fee: 'No fee unless we recover' },
          { value: 'slip', label: 'Slip, trip or fall', desc: 'On someone else premises.', fee: 'No fee unless we recover' },
          { value: 'dog', label: 'Dog bite or animal attack', fee: 'No fee unless we recover' },
          { value: 'medical', label: 'Medical negligence', desc: 'A diagnosis missed, or treatment that caused harm.', fee: 'No fee unless we recover' },
          { value: 'death', label: 'A death in the family', desc: 'A wrongful death claim.', fee: 'No fee unless we recover' }
        ]
      },
      {
        key: 'treatment', type: 'choice',
        title: 'Have you been seen by a doctor?',
        sub: 'Insurers argue that a gap in treatment means you were not badly hurt.',
        options: [
          { value: 'er', label: 'Yes, hospital or emergency room' },
          { value: 'ongoing', label: 'Yes, and I am still in treatment' },
          { value: 'once', label: 'Yes, once' },
          { value: 'no', label: 'Not yet' }
        ]
      },
      {
        key: 'insurer', type: 'choice',
        title: 'Has an insurer already contacted you?',
        sub: 'Do not give a recorded statement before you have advice. Anything you say can be used to reduce the claim.',
        options: [
          { value: 'recorded', label: 'Yes, and they asked for a recorded statement' },
          { value: 'offer', label: 'Yes, and they made an offer', desc: 'An early offer is usually well below the claim value.', fee: 'Free review before you accept' },
          { value: 'contact', label: 'They called but I have not spoken to them' },
          { value: 'no', label: 'No, nobody has contacted me' }
        ]
      },
      {
        key: 'months', type: 'number', unit: 'months ago',
        title: 'How long ago did the injury happen?',
        sub: 'Personal-injury deadlines are usually two to three years, but shorter for public bodies and some claims. Give the closest number of months.',
        placeholder: 'e.g. 4'
      }
    ]
  },

  /* ================= CRIMINAL ================= */
  'criminal': {
    intro: "What happens in the next few days decides most of this. Answer quickly and we will tell you what to do before you speak to anyone else.",
    questions: [
      {
        key: 'charge', type: 'choice',
        title: 'What is the charge or the allegation?',
        sub: 'If you have papers, keep them — the exact wording matters.',
        options: [
          { value: 'felony', label: 'A felony', desc: 'A serious charge carrying more than a year.', fee: 'Retainer from $7,500' },
          { value: 'misdemeanor', label: 'A misdemeanour', fee: 'Flat fee from $2,500' },
          { value: 'dui', label: 'DUI or DWI', desc: 'Driving under the influence.', fee: 'Flat fee from $3,500' },
          { value: 'drug', label: 'A drug offence', fee: 'Retainer from $5,000' },
          { value: 'assault', label: 'Assault or a violent allegation', fee: 'Retainer from $7,500' },
          { value: 'investigation', label: 'No charge yet — I am under investigation', desc: 'Police have questioned you or executed a warrant.', fee: 'Pre-charge representation, hourly' }
        ]
      },
      {
        key: 'custody', type: 'choice',
        title: 'Is anyone in custody right now?',
        sub: 'If someone is in custody, say so and call us. The first appearance is a deadline.',
        options: [
          { value: 'yes', label: 'Yes, right now', fee: 'Emergency bail representation' },
          { value: 'released', label: 'No, released on bail or a promise to appear' },
          { value: 'no', label: 'Nobody was arrested' }
        ]
      },
      {
        key: 'courtdate', type: 'choice',
        title: 'Is there a court date?',
        sub: 'Missing a first appearance can mean a warrant is issued.',
        options: [
          { value: 'soon', label: 'Yes, within two weeks' },
          { value: 'later', label: 'Yes, but further out' },
          { value: 'none', label: 'No date given yet' },
          { value: 'unknown', label: 'I am not sure' }
        ]
      },
      {
        key: 'spoken', type: 'choice',
        title: 'Have you spoken to police about this?',
        sub: 'Be honest. It changes the advice, and it is not a judgement.',
        options: [
          { value: 'interview', label: 'Yes, I gave a statement or sat for an interview' },
          { value: 'brief', label: 'Yes, briefly, at the scene' },
          { value: 'requested', label: 'They have asked, and I have not agreed' },
          { value: 'never', label: 'No, I have not spoken to them' }
        ]
      },
      {
        key: 'record', type: 'choice',
        title: 'Do you have a prior record?',
        sub: 'Prior convictions change the offer the prosecutor will make.',
        options: [
          { value: 'none', label: 'No priors' },
          { value: 'minor', label: 'Yes, minor offences' },
          { value: 'serious', label: 'Yes, a serious or similar offence' }
        ]
      }
    ]
  },

  /* ================= EMPLOYMENT ================= */
  'employment': {
    intro: "Employment claims are won or lost on timing and on documents, and several of them have very short deadlines. These questions establish yours.",
    questions: [
      {
        key: 'issue', type: 'choice',
        title: 'What happened at work?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'termination', label: 'I was fired', desc: 'Including a forced resignation or a sudden dismissal.', fee: 'Contingency, 33 percent' },
          { value: 'discrimination', label: 'Discrimination', desc: 'Because of race, sex, age, religion, disability or national origin.', fee: 'Contingency, 33 percent' },
          { value: 'harassment', label: 'Harassment', desc: 'Conduct that created a hostile working environment.', fee: 'Contingency, 33 percent' },
          { value: 'retaliation', label: 'Retaliation', desc: 'Punished after reporting something.', fee: 'Contingency, 33 percent' },
          { value: 'wages', label: 'Unpaid wages or overtime', desc: 'Hours worked but not paid, or tips withheld.', fee: 'Contingency, or fee-shifting' },
          { value: 'severance', label: 'A severance or non-compete agreement', desc: 'A document you have been asked to sign.', fee: 'Flat fee from $750' }
        ]
      },
      {
        key: 'adminfiled', type: 'choice',
        title: 'Have you filed with the EEOC or a state agency?',
        sub: 'Most discrimination claims must be filed with an agency first, and the window is often as short as 180 to 300 days. This is the most urgent question here.',
        options: [
          { value: 'yes_date', label: 'Yes, and I have the date', desc: 'Bring the charge number if you have it.' },
          { value: 'yes_unknown', label: 'Yes, but I am not sure when' },
          { value: 'no', label: 'No, not yet', desc: 'We can file it for you if the window is still open.', fee: 'No charge to assess the deadline' },
          { value: 'unsure', label: 'I do not know if I need to' }
        ]
      },
      {
        key: 'employer_size', type: 'choice',
        title: 'How many people does the employer have?',
        sub: 'Federal discrimination law usually needs 15 or more employees; some state laws cover far fewer.',
        options: [
          { value: 'large', label: 'More than 100' },
          { value: 'medium', label: '15 to 100' },
          { value: 'small', label: 'Fewer than 15' },
          { value: 'unknown', label: 'I am not sure' }
        ]
      },
      {
        key: 'still_there', type: 'choice',
        title: 'Do you still work there?',
        sub: 'This affects what we advise about internal complaints and about retaliation.',
        options: [
          { value: 'yes', label: 'Yes, still employed' },
          { value: 'leave', label: 'On leave' },
          { value: 'no', label: 'No, I have left' }
        ]
      },
      {
        key: 'writing', type: 'choice',
        title: 'Do you have anything in writing?',
        sub: 'Emails, texts, a performance review, a write-up. Documents decide these cases.',
        options: [
          { value: 'yes', label: 'Yes, I have documents or messages' },
          { value: 'witness', label: 'No documents, but there were witnesses' },
          { value: 'no', label: 'Nothing in writing' }
        ]
      }
    ]
  },

  /* ================= IMMIGRATION ================= */
  'immigration': {
    intro: "In immigration, a single date on a notice can decide everything. Tell us exactly what you have received and when.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What do you need help with?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'family', label: 'Bringing or joining family', desc: 'A petition for a spouse, child or parent.', fee: 'Flat fee from $2,000' },
          { value: 'asylum', label: 'Asylum or protection', desc: 'Fear of harm if returned.', fee: 'Flat fee from $3,500' },
          { value: 'removal', label: 'Deportation or removal defence', desc: 'A case already in immigration court.', fee: 'Retainer from $5,000' },
          { value: 'visa', label: 'A work or student visa', fee: 'Flat fee from $2,500' },
          { value: 'citizenship', label: 'Citizenship or naturalisation', fee: 'Flat fee from $1,200' },
          { value: 'victim', label: 'A visa for a crime victim', desc: 'U visa, T visa or VAWA.', fee: 'Flat fee from $3,000' }
        ]
      },
      {
        key: 'notice', type: 'choice',
        title: 'Have you received a notice to appear in court?',
        sub: 'A notice to appear starts a removal case and has a hard deadline. Missing it means an order in absentia, which is very hard to undo.',
        options: [
          { value: 'noid', label: 'Yes, and I have the document', desc: 'We will read the date and the hearing type.', fee: 'Urgent review, no charge' },
          { value: 'noid_lost', label: 'Yes, but I do not have it with me' },
          { value: 'none', label: 'No notice' },
          { value: 'unsure', label: 'I am not sure what I received' }
        ]
      },
      {
        key: 'detained', type: 'choice',
        title: 'Is anyone in immigration detention?',
        sub: 'Detention changes the timeline completely. Bond hearings happen fast.',
        options: [
          { value: 'yes', label: 'Yes, right now', fee: 'Emergency representation' },
          { value: 'released', label: 'They were detained but have been released' },
          { value: 'no', label: 'Nobody is detained' }
        ]
      },
      {
        key: 'status', type: 'choice',
        title: 'What is the current status?',
        sub: 'This decides which options exist, so be as accurate as you can.',
        options: [
          { value: 'citizen', label: 'Citizen of another country, in the US lawfully' },
          { value: 'undocumented', label: 'In the US without status' },
          { value: 'pending', label: 'An application is already pending' },
          { value: 'other', label: 'Something else' }
        ]
      },
      {
        key: 'deadline', type: 'choice',
        title: 'Is anything due soon?',
        sub: 'Filing deadlines in immigration are strict and rarely extended.',
        options: [
          { value: 'week', label: 'Yes, within a week' },
          { value: 'month', label: 'Yes, within a month' },
          { value: 'none', label: 'Nothing due right now' },
          { value: 'unknown', label: 'I do not know' }
        ]
      }
    ]
  },

  /* ================= ESTATE ================= */
  'estate': {
    intro: "Estate work is about getting the paperwork right first time, and about challenging it when someone else did not.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What do you need?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'will', label: 'A will or a trust', desc: 'Planning while you are able to.', fee: 'Flat fee from $1,200' },
          { value: 'probate', label: 'Probate an estate', desc: 'Administering someone estate after death.', fee: 'Flat fee from $2,500' },
          { value: 'contest', label: 'Contesting a will or trust', desc: 'Undue influence, capacity, or a document that looks wrong.', fee: 'Retainer from $5,000' },
          { value: 'trustee', label: 'A trustee or executor dispute', desc: 'Mismanagement or failure to account.', fee: 'Retainer from $4,000' },
          { value: 'poa', label: 'Power of attorney or healthcare directive', fee: 'Flat fee from $650' },
          { value: 'elder', label: 'Financial abuse of an older person', fee: 'Contingency, or hourly' }
        ]
      },
      {
        key: 'deceased', type: 'choice',
        title: 'Has the person died?',
        sub: 'This decides whether we are planning or administering.',
        options: [
          { value: 'yes_recent', label: 'Yes, within the last year' },
          { value: 'yes_old', label: 'Yes, more than a year ago' },
          { value: 'no', label: 'No, this is planning ahead' }
        ]
      },
      {
        key: 'size', type: 'money',
        title: 'Roughly what is the estate worth?',
        sub: 'An estimate is fine. The size decides which procedure applies and whether tax is in play.',
        options: [
          { value: 'under_250', label: 'Under $250,000', desc: 'Often a simplified or small-estate procedure.', fee: 'Lower flat fee' },
          { value: 'to_1m', label: '$250,000 to $1 million', fee: 'Standard flat fee' },
          { value: 'to_5m', label: '$1 million to $5 million' },
          { value: 'over_5m', label: 'Over $5 million', desc: 'Federal estate tax and planning become relevant.' },
          { value: 'unknown', label: 'I am not sure' }
        ]
      },
      {
        key: 'document', type: 'choice',
        title: 'Is there a written will or trust?',
        sub: 'Bring whatever exists, even if it is a draft or a copy.',
        options: [
          { value: 'yes_original', label: 'Yes, and I have the original' },
          { value: 'yes_copy', label: 'Yes, but only a copy' },
          { value: 'none', label: 'No document exists' },
          { value: 'unknown', label: 'I do not know' }
        ]
      }
    ]
  },

  /* ================= BUSINESS ================= */
  'business': {
    intro: "Business disputes are usually settled or won on the contract and on how clean the records are.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What kind of business matter is this?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'formation', label: 'Starting or restructuring a business', desc: 'Choosing an entity and getting the documents right.', fee: 'Flat fee from $1,500' },
          { value: 'contract', label: 'A contract dispute', desc: 'Someone did not perform, or is claiming you did not.', fee: 'Hourly from $325, or retainer' },
          { value: 'partners', label: 'A partner or shareholder dispute', desc: 'Deadlock, breach of duty, or a forced buyout.', fee: 'Retainer from $7,500' },
          { value: 'lease', label: 'A commercial lease problem', fee: 'Hourly from $325' },
          { value: 'transaction', label: 'Buying or selling a business', fee: 'Flat fee from $4,000' },
          { value: 'collections', label: 'Unpaid invoices or collections', fee: 'Contingency, or hourly' }
        ]
      },
      {
        key: 'written', type: 'choice',
        title: 'Is there a written agreement?',
        sub: 'Including an email chain or an accepted quote. These often count.',
        options: [
          { value: 'signed', label: 'Yes, a signed contract' },
          { value: 'informal', label: 'Only emails, texts or an accepted quote' },
          { value: 'verbal', label: 'Only a verbal agreement' },
          { value: 'none', label: 'Nothing in writing at all' }
        ]
      },
      {
        key: 'amount', type: 'money',
        title: 'Roughly how much is in dispute?',
        sub: 'This decides whether litigation is economic, and whether a demand letter is the better move.',
        options: [
          { value: 'under_25', label: 'Under $25,000', desc: 'Often resolved by demand and negotiation.', fee: 'Flat-fee demand letter from $500' },
          { value: 'to_100', label: '$25,000 to $100,000' },
          { value: 'to_500', label: '$100,000 to $500,000' },
          { value: 'over_500', label: 'Over $500,000' },
          { value: 'unknown', label: 'Not determined yet' }
        ]
      },
      {
        key: 'otherside', type: 'choice',
        title: 'Who is on the other side?',
        sub: 'A large company changes the strategy and the pace.',
        options: [
          { value: 'individual', label: 'An individual' },
          { value: 'smallbiz', label: 'A small or local business' },
          { value: 'corporate', label: 'A large company with its own lawyers' },
          { value: 'unknown', label: 'I am not sure yet' }
        ]
      }
    ]
  },

  /* ================= INTELLECTUAL PROPERTY ================= */
  'ip': {
    intro: "Intellectual-property matters move quickly because the harm is often still happening while you decide.",
    questions: [
      {
        key: 'kind', type: 'choice',
        title: 'What kind of work or right is involved?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'copyright', label: 'Copyright', desc: 'Writing, music, film, photographs, artwork or software.', fee: 'Hourly from $325' },
          { value: 'trademark', label: 'Trademark or brand name', desc: 'A name, logo or slogan.', fee: 'Flat fee from $1,500 for a filing' },
          { value: 'patent', label: 'Patent or invention', fee: 'Quoted per application' },
          { value: 'trade_secret', label: 'Trade secret or confidential information', fee: 'Retainer from $5,000' }
        ]
      },
      {
        key: 'position', type: 'choice',
        title: 'Which side are you on?',
        sub: 'This decides everything about how we open the matter.',
        options: [
          { value: 'owner', label: 'Someone is using my work without permission', desc: 'You are the rights holder.' },
          { value: 'accused', label: 'I have been accused of infringing', desc: 'You received a letter or a takedown.' },
          { value: 'register', label: 'I want to register or protect something', desc: 'Nothing has gone wrong yet.' },
          { value: 'contract', label: 'A licence or ownership dispute with a partner or client' }
        ]
      },
      {
        key: 'registered', type: 'choice',
        title: 'Is it registered?',
        sub: 'Registration changes what can be recovered, especially for copyright.',
        options: [
          { value: 'yes', label: 'Yes, registered' },
          { value: 'pending', label: 'An application is pending' },
          { value: 'no', label: 'No registration' },
          { value: 'unsure', label: 'I am not sure' }
        ]
      },
      {
        key: 'notice_sent', type: 'choice',
        title: 'Has anything been sent yet?',
        sub: 'A cease-and-desist letter starts a clock, so do not ignore one.',
        options: [
          { value: 'sent_reply', label: 'Yes, and I received a reply' },
          { value: 'sent', label: 'Yes, but no reply yet' },
          { value: 'received', label: 'I received one, and have not responded' },
          { value: 'none', label: 'Nothing has been sent' }
        ]
      },
      {
        key: 'ongoing', type: 'choice',
        title: 'Is the problem still happening?',
        sub: 'If it is, we may move straight to an injunction.',
        options: [
          { value: 'yes_now', label: 'Yes, right now', desc: 'Sales, downloads or publication are ongoing.', fee: 'Emergency injunction application' },
          { value: 'recent', label: 'It happened recently and may not be over' },
          { value: 'stopped', label: 'It has stopped' }
        ]
      }
    ]
  },

  /* ================= REAL ESTATE ================= */
  'realestate': {
    intro: "Property matters turn on title, on dates, and on what the written documents actually say.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What kind of property matter is this?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'purchase', label: 'Buying or selling property', desc: 'Contract, closing and title work.', fee: 'Flat fee, quoted by price' },
          { value: 'title', label: 'A title or boundary dispute', desc: 'Someone else claims part of your land, or an easement.', fee: 'Hourly from $325' },
          { value: 'landlord', label: 'Landlord and tenant', desc: 'Eviction, repairs, deposit or a lease dispute.', fee: 'Flat fee from $650, or hourly' },
          { value: 'defect', label: 'Construction defect or contractor problem', fee: 'Retainer from $4,000' },
          { value: 'foreclosure', label: 'Foreclosure or a loan default', fee: 'Hourly from $325' },
          { value: 'hoa', label: 'An HOA or condominium dispute', fee: 'Hourly from $325' }
        ]
      },
      {
        key: 'escrow', type: 'choice',
        title: 'Is money currently in escrow or with a third party?',
        sub: 'Money held by a broker or an escrow agent can sometimes still be protected.',
        options: [
          { value: 'yes', label: 'Yes, a deposit or funds are held' },
          { value: 'no', label: 'No money is being held' },
          { value: 'unknown', label: 'I am not sure' }
        ]
      },
      {
        key: 'deadline', type: 'choice',
        title: 'Is a date approaching?',
        sub: 'In property matters a missed date can end the whole transaction.',
        options: [
          { value: 'week', label: 'Yes, within a week', desc: 'A closing, a notice deadline or a court date.', fee: 'Expedited handling available' },
          { value: 'month', label: 'Yes, within a month' },
          { value: 'none', label: 'Nothing imminent' }
        ]
      },
      {
        key: 'written', type: 'choice',
        title: 'What is in writing?',
        sub: 'Bring the contract, the deed, the lease and any notices.',
        options: [
          { value: 'contract', label: 'A signed contract or lease' },
          { value: 'some', label: 'Emails or an offer, but nothing signed' },
          { value: 'deed', label: 'A deed or title document' },
          { value: 'none', label: 'Nothing in writing' }
        ]
      }
    ]
  },

  /* ================= BANKRUPTCY ================= */
  'bankruptcy': {
    intro: "Bankruptcy is decided by your income, your debts and what you need to keep. These questions work that out.",
    questions: [
      {
        key: 'goal', type: 'choice',
        title: 'What are you hoping to achieve?',
        sub: 'Be plainly honest here. This is what decides the right chapter.',
        options: [
          { value: 'wipe', label: 'Get rid of debts I cannot pay', desc: 'A fresh start.', fee: 'Chapter 7 from $1,800' },
          { value: 'keep', label: 'Stop a foreclosure or repossession and keep the property', desc: 'Catching up over time.', fee: 'Chapter 13 from $3,500' },
          { value: 'stop', label: 'Stop wage garnishment or a bank levy' },
          { value: 'advice', label: 'I am not sure — I want advice first' }
        ]
      },
      {
        key: 'debt', type: 'money',
        title: 'Roughly how much do you owe in total?',
        sub: 'All of it together: cards, loans, medical, arrears. An estimate is fine.',
        options: [
          { value: 'under_25', label: 'Under $25,000' },
          { value: 'to_100', label: '$25,000 to $100,000' },
          { value: 'to_250', label: '$100,000 to $250,000' },
          { value: 'over_250', label: 'Over $250,000' }
        ]
      },
      {
        key: 'income', type: 'money',
        title: 'What is your household income per year?',
        sub: 'A means test compares this to your state median. It decides which chapter is open to you, and a lawyer makes that call, not a website.',
        options: [
          { value: 'under_40', label: 'Under $40,000' },
          { value: 'to_70', label: '$40,000 to $70,000' },
          { value: 'to_110', label: '$70,000 to $110,000' },
          { value: 'over_110', label: 'Over $110,000' }
        ]
      },
      {
        key: 'home', type: 'choice',
        title: 'Do you own a home?',
        sub: 'If you do, we plan around protecting the equity.',
        options: [
          { value: 'yes_paying', label: 'Yes, and I am current on the mortgage' },
          { value: 'yes_behind', label: 'Yes, and I am behind' },
          { value: 'no', label: 'No, I rent' }
        ]
      },
      {
        key: 'filed_before', type: 'choice',
        title: 'Have you filed bankruptcy before?',
        sub: 'A prior filing imposes waiting periods between cases.',
        options: [
          { value: 'no', label: 'No, never' },
          { value: 'yes_old', label: 'Yes, more than eight years ago' },
          { value: 'yes_recent', label: 'Yes, within the last eight years' }
        ]
      }
    ]
  },

  /* ================= TAX ================= */
  'tax': {
    intro: "Tax problems get worse on a schedule. Levies, liens and deadlines all move without asking you first.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What is the tax problem?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'audit', label: 'An audit or examination', desc: 'The IRS or a state is reviewing a return.', fee: 'Hourly from $350' },
          { value: 'notice', label: 'A notice or letter I do not understand', fee: 'Flat fee from $450 to review' },
          { value: 'unfiled', label: 'Returns I never filed', desc: 'Back years, or years with missing forms.', fee: 'Flat fee from $600 per year' },
          { value: 'payroll', label: 'Payroll or trust-fund tax', desc: 'Money withheld from employees and not remitted.', fee: 'Retainer from $5,000' },
          { value: 'levy', label: 'A levy, lien or garnishment', desc: 'Money is already being taken.', fee: 'Emergency relief available' },
          { value: 'state', label: 'A state tax issue' }
        ]
      },
      {
        key: 'owed', type: 'money',
        title: 'Roughly how much is owed?',
        sub: 'An estimate is fine. It decides whether an offer in compromise is realistic.',
        options: [
          { value: 'under_10', label: 'Under $10,000' },
          { value: 'to_50', label: '$10,000 to $50,000' },
          { value: 'to_250', label: '$50,000 to $250,000' },
          { value: 'over_250', label: 'Over $250,000' },
          { value: 'unknown', label: 'I do not know' }
        ]
      },
      {
        key: 'collecting', type: 'choice',
        title: 'Are they collecting right now?',
        sub: 'Active collection is a different emergency from a letter.',
        options: [
          { value: 'active', label: 'Yes, money is being taken or an account frozen', fee: 'Urgent — levy release is time-critical' },
          { value: 'threat', label: 'They have threatened to and set a date' },
          { value: 'no', label: 'No collection action yet' }
        ]
      },
      {
        key: 'contacted', type: 'choice',
        title: 'Have you already spoken to the agency?',
        sub: 'What you said matters, so tell us honestly.',
        options: [
          { value: 'no', label: 'No, I have not responded' },
          { value: 'yes', label: 'Yes, I spoke to them or sent something' },
          { value: 'pro', label: 'Someone else represented me before' }
        ]
      }
    ]
  },

  /* ================= CIVIL RIGHTS ================= */
  'civilrights': {
    intro: "Civil-rights claims have some of the shortest filing windows in the law. The dates matter more than anything else you tell us.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What was violated?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'police', label: 'Police conduct', desc: 'Excessive force, unlawful search or arrest, or misconduct in custody.', fee: 'Contingency, 33 percent' },
          { value: 'employment', label: 'Discrimination at work', fee: 'Contingency, 33 percent' },
          { value: 'housing', label: 'Housing discrimination', desc: 'Refused, evicted or harassed because of who you are.', fee: 'Contingency, or fee-shifting' },
          { value: 'voting', label: 'Voting rights', fee: 'Fee-shifting — often no cost to you' },
          { value: 'prison', label: 'Conditions or medical care in custody', desc: 'Note that this requires exhausting internal remedies first.', fee: 'Contingency, 33 percent' },
          { value: 'speech', label: 'Free speech or assembly' }
        ]
      },
      {
        key: 'govdefendant', type: 'choice',
        title: 'Who is the defendant?',
        sub: 'When a government body is the defendant, a separate notice deadline can apply, sometimes as short as six months.',
        options: [
          { value: 'city', label: 'A city, county or police department', desc: 'A notice of claim may be required within months.' },
          { value: 'state', label: 'A state agency' },
          { value: 'federal', label: 'A federal agency or officer' },
          { value: 'private', label: 'A private employer or landlord' }
        ]
      },
      {
        key: 'chargefiled', type: 'choice',
        title: 'Have you filed an administrative charge?',
        sub: 'Employment and housing claims usually must be filed with an agency first — often within 180 to 300 days of the harm.',
        options: [
          { value: 'yes', label: 'Yes, and I know the date' },
          { value: 'no', label: 'No, not yet' },
          { value: 'na', label: 'Not applicable to my situation' },
          { value: 'unsure', label: 'I am not sure' }
        ]
      },
      {
        key: 'when', type: 'choice',
        title: 'When did it happen?',
        sub: 'Answer as precisely as you can. Deadlines are strict and rarely excused.',
        options: [
          { value: 'month', label: 'Within the last month' },
          { value: 'year', label: 'Within the last year' },
          { value: 'few', label: 'One to three years ago' },
          { value: 'old', label: 'More than three years ago' }
        ]
      },
      {
        key: 'evidence', type: 'choice',
        title: 'What evidence exists?',
        sub: 'Video can disappear, so tell us now if it exists.',
        options: [
          { value: 'video', label: 'Body camera, CCTV or phone video', desc: 'We can send a preservation demand immediately.', fee: 'Preservation demand sent at no charge' },
          { value: 'witness', label: 'Witnesses' },
          { value: 'medical', label: 'Medical records or photographs of injury' },
          { value: 'none', label: 'Nothing yet' }
        ]
      }
    ]
  },

  /* ================= GOVERNMENT ================= */
  'government': {
    intro: "Dealing with an agency is mostly a paperwork and deadline problem. Both are fixable if we know the dates.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What is the government matter?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'records', label: 'A public-records or FOIA request', desc: 'Denied, ignored or heavily redacted.', fee: 'Hourly from $300' },
          { value: 'license', label: 'A licence, permit or certification', desc: 'Refused, suspended or revoked.', fee: 'Flat fee from $1,500' },
          { value: 'benefits', label: 'A benefits denial', desc: 'Disability, housing, food assistance.', fee: 'Flat fee from $900' },
          { value: 'citation', label: 'A municipal citation or code violation', fee: 'Flat fee from $500' },
          { value: 'regulatory', label: 'A regulatory or enforcement action', fee: 'Retainer from $5,000' },
          { value: 'contract', label: 'A government contract or bid dispute' }
        ]
      },
      {
        key: 'decision', type: 'choice',
        title: 'Has the agency issued a written decision?',
        sub: 'A written decision usually starts a short clock to appeal.',
        options: [
          { value: 'yes_date', label: 'Yes, and I know the date', desc: 'This is the date that matters most.' },
          { value: 'yes_nodate', label: 'Yes, but I do not have it with me' },
          { value: 'no', label: 'No decision yet' },
          { value: 'verbal', label: 'Only something said verbally' }
        ]
      },
      {
        key: 'appeal_window', type: 'choice',
        title: 'Is an appeal deadline near?',
        sub: 'Agency appeal windows are often 30 days or fewer, and missing one usually ends the matter.',
        options: [
          { value: 'week', label: 'Yes, within a week', fee: 'Urgent filing available' },
          { value: 'month', label: 'Yes, within a month' },
          { value: 'passed', label: 'It may have already passed' },
          { value: 'none', label: 'No deadline is running' }
        ]
      },
      {
        key: 'agency', type: 'choice',
        title: 'Which level of government?',
        sub: 'Different bodies have different rules and different notice periods.',
        options: [
          { value: 'local', label: 'City, county or school district' },
          { value: 'state', label: 'State agency' },
          { value: 'federal', label: 'Federal agency' },
          { value: 'unknown', label: 'I am not sure which one' }
        ]
      }
    ]
  },

  /* ================= TRAFFIC ================= */
  'traffic': {
    intro: "Traffic looks small until it costs you a licence or an insurance rate. Two minutes now can save years of that.",
    questions: [
      {
        key: 'citation', type: 'choice',
        title: 'What are you facing?',
        sub: 'Be accurate here — a criminal charge is handled very differently from a ticket.',
        options: [
          { value: 'speeding', label: 'Speeding or a moving violation', fee: 'Flat fee from $250' },
          { value: 'dui', label: 'DUI or DWI', desc: 'This is a criminal charge, not a ticket. There are usually two deadlines at once.', fee: 'Flat fee from $2,500' },
          { value: 'reckless', label: 'Reckless driving or racing', fee: 'Flat fee from $1,200' },
          { value: 'suspended', label: 'Driving on a suspended licence', fee: 'Flat fee from $750' },
          { value: 'cdl', label: 'A CDL holder facing a disqualification', desc: 'Your livelihood is directly at stake, so we move faster.', fee: 'Flat fee from $1,500' },
          { value: 'other', label: 'Something else' }
        ]
      },
      {
        key: 'courtdate', type: 'choice',
        title: 'Is a court date set?',
        sub: 'Missing a traffic date can itself trigger a licence suspension.',
        options: [
          { value: 'week', label: 'Yes, within a week', fee: 'Expedited appearance' },
          { value: 'month', label: 'Yes, within a month' },
          { value: 'later', label: 'Yes, later than a month away' },
          { value: 'none', label: 'No date has been set' },
          { value: 'missed', label: 'I may have already missed one' }
        ]
      },
      {
        key: 'points', type: 'choice',
        title: 'How close are you to losing your licence?',
        sub: 'Points accumulate, and a suspension threshold is often 12 in a year.',
        options: [
          { value: 'first', label: 'This is my first in years' },
          { value: 'few', label: 'I have a few points already' },
          { value: 'close', label: 'I am close to the limit', fee: 'Priority handling' },
          { value: 'unknown', label: 'I do not know my points' }
        ]
      },
      {
        key: 'outofstate', type: 'choice',
        title: 'Where are you licensed versus where it happened?',
        sub: 'An out-of-state ticket can follow you home through an interstate compact.',
        options: [
          { value: 'same', label: 'Same state' },
          { value: 'different', label: 'Different state' },
          { value: 'no_licence', label: 'I do not have a licence' }
        ]
      }
    ]
  },

  /* ================= EDUCATION ================= */
  'education': {
    intro: "Schools are required to follow written procedures. When they do not, that failure is often the case.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What is the school problem?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'iep', label: 'Special education — an IEP or 504 plan', desc: 'A plan that is missing, wrong or not being followed.', fee: 'Hourly from $300, or flat fee' },
          { value: 'discipline', label: 'A suspension, expulsion or manifestation review', fee: 'Flat fee from $1,500' },
          { value: 'denial', label: 'Services or an evaluation were refused', fee: 'Flat fee from $1,200' },
          { value: 'titleix', label: 'A Title IX matter', desc: 'Discrimination, harassment or a school investigation.', fee: 'Retainer from $4,000' },
          { value: 'bullying', label: 'Bullying the school did not address', fee: 'Hourly from $300' },
          { value: 'tuition', label: 'Tuition, fees or residency' }
        ]
      },
      {
        key: 'child_age', type: 'number',
        title: 'How old is the student?',
        unit: 'years old',
        sub: 'Age decides which rights attach and which procedure the district must follow.'
      },
      {
        key: 'written', type: 'choice',
        title: 'Has the district issued anything in writing?',
        sub: 'A written decision starts the clock on your appeal rights.',
        options: [
          { value: 'yes_date', label: 'Yes, and I know the date' },
          { value: 'yes_nodate', label: 'Yes, but I do not have it with me' },
          { value: 'no', label: 'Nothing in writing' },
          { value: 'meeting', label: 'Only a verbal decision at a meeting' }
        ]
      },
      {
        key: 'hearing', type: 'choice',
        title: 'Is a hearing or meeting scheduled?',
        sub: 'Due-process hearings and manifestation reviews both need preparation, not attendance alone.',
        options: [
          { value: 'week', label: 'Yes, within a week', fee: 'Emergency preparation' },
          { value: 'month', label: 'Yes, within a month' },
          { value: 'none', label: 'Nothing is scheduled' },
          { value: 'passed', label: 'One already happened' }
        ]
      }
    ]
  },

  /* ================= HEALTHCARE ================= */
  'healthcare': {
    intro: "Health matters involve two clocks at once: the clinical one and the appeal deadline. We track both.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What kind of healthcare matter is this?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'denial', label: 'An insurance denial', desc: 'Treatment refused or a claim rejected.', fee: 'Hourly from $300' },
          { value: 'billing', label: 'Hospital or medical billing', desc: 'A bill that is wrong, duplicated or inflated.', fee: 'Flat fee from $750, or hourly' },
          { value: 'neglect', label: 'Neglect or poor care', desc: 'In a nursing home, hospital or facility.', fee: 'Contingency, 33 percent' },
          { value: 'records', label: 'Access to my medical records', desc: 'Refused, delayed or overcharged.', fee: 'Flat fee from $400' },
          { value: 'licensing', label: 'A licence or credentialing action', desc: 'Against a clinician or a facility.', fee: 'Hourly from $350' },
          { value: 'privacy', label: 'A privacy or HIPAA breach' }
        ]
      },
      {
        key: 'writing', type: 'choice',
        title: 'Do you have the denial or the decision in writing?',
        sub: 'An insurer denial almost always carries an internal-appeal deadline.',
        options: [
          { value: 'yes', label: 'Yes, I have the letter' },
          { value: 'no', label: 'No, only something said on the phone' },
          { value: 'pending', label: 'I am waiting for a written decision' }
        ]
      },
      {
        key: 'deadline', type: 'choice',
        title: 'Is an appeal deadline running?',
        sub: 'Internal appeals are often 60 to 180 days and are strict.',
        options: [
          { value: 'week', label: 'Yes, within a week', fee: 'Expedited appeal filing' },
          { value: 'soon', label: 'Yes, within the next month or two' },
          { value: 'no', label: 'No deadline that I know of' },
          { value: 'unsure', label: 'I do not know' }
        ]
      },
      {
        key: 'treating', type: 'choice',
        title: 'Is the provider still treating you?',
        sub: 'Where the relationship is ongoing, we may resolve it without a fight.',
        options: [
          { value: 'yes', label: 'Yes, still under their care' },
          { value: 'no', label: 'No, I have moved on' },
          { value: 'never', label: 'It was a one-off event' }
        ]
      }
    ]
  },

  /* ================= ELDER ================= */
  'elder': {
    intro: "Older clients are entitled to dignity and to representation that moves quickly. Tell us what is happening.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What is happening?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'nursing', label: 'Neglect or abuse in a care facility', desc: 'Bedsores, falls, medication errors, or worse.', fee: 'Contingency, 33 percent' },
          { value: 'financial', label: 'Financial exploitation', desc: 'Money or property taken by someone trusted.', fee: 'Contingency, or hourly' },
          { value: 'guardianship', label: 'A guardianship or conservatorship', desc: 'Establishing one, or contesting one.', fee: 'Hourly from $325' },
          { value: 'benefits', label: 'Medicare, Medicaid or benefits', fee: 'Flat fee from $900' },
          { value: 'planning', label: 'Estate or incapacity planning', fee: 'Flat fee from $1,200' },
          { value: 'housing', label: 'Housing, eviction or a care contract' }
        ]
      },
      {
        key: 'age', type: 'number',
        title: 'How old is the person concerned?',
        unit: 'years old',
        sub: 'Age determines which protections and reporting duties apply.'
      },
      {
        key: 'capacity', type: 'choice',
        title: 'Can the person still make their own decisions?',
        sub: 'This decides whether we act for them or for the family.',
        options: [
          { value: 'yes', label: 'Yes, fully' },
          { value: 'some', label: 'Partially — some days are better' },
          { value: 'no', label: 'No, they cannot' },
          { value: 'unsure', label: 'I am not sure' }
        ]
      },
      {
        key: 'aps', type: 'choice',
        title: 'Has Adult Protective Services been contacted?',
        sub: 'A report sometimes helps and sometimes complicates. Tell us either way.',
        options: [
          { value: 'yes', label: 'Yes, a report was made' },
          { value: 'no', label: 'No, nothing has been reported' },
          { value: 'unsure', label: 'I do not know' }
        ]
      },
      {
        key: 'family_involved', type: 'choice',
        title: 'Is a family member or a caregiver involved?',
        sub: 'Most exploitation is by someone the person trusts. Say so plainly.',
        options: [
          { value: 'family', label: 'Yes, a family member' },
          { value: 'caregiver', label: 'Yes, a paid caregiver or facility staff' },
          { value: 'outsider', label: 'Yes, someone outside the family' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },

  /* ================= CONSUMER ================= */
  'consumer': {
    intro: "Consumer statutes often award statutory damages and attorney fees, which can make a small claim worth pursuing.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What happened?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'debt', label: 'Debt-collector harassment', desc: 'Calls at all hours, threats, or contacting people you know.', fee: 'Fee-shifting — often no cost to you' },
          { value: 'credit', label: 'Credit-report errors', desc: 'Something wrong that they will not fix.', fee: 'Fee-shifting — often no cost to you' },
          { value: 'calls', label: 'Robocalls or unwanted texts', fee: 'Fee-shifting — often no cost to you' },
          { value: 'scam', label: 'A deceptive sale or a scam', fee: 'Contingency, or hourly' },
          { value: 'product', label: 'A defective product', fee: 'Contingency, 33 percent' },
          { value: 'identity', label: 'Identity theft or fraud' }
        ]
      },
      {
        key: 'disputed', type: 'choice',
        title: 'Have you already disputed it in writing?',
        sub: 'A written dispute is a legal step, and what happened after it matters.',
        options: [
          { value: 'yes_reply', label: 'Yes, and they replied' },
          { value: 'yes_no', label: 'Yes, and they ignored me' },
          { value: 'phone', label: 'Only by phone' },
          { value: 'no', label: 'No, I have not disputed anything yet' }
        ]
      },
      {
        key: 'loss', type: 'money',
        title: 'Roughly what did this cost you?',
        sub: 'Statutory damages can apply even when the number is small, so do not skip answering.',
        options: [
          { value: 'under_1', label: 'Under $1,000' },
          { value: 'to_10', label: '$1,000 to $10,000' },
          { value: 'to_50', label: '$10,000 to $50,000' },
          { value: 'over_50', label: 'Over $50,000' },
          { value: 'none', label: 'No money — it is the conduct itself' }
        ]
      },
      {
        key: 'repeated', type: 'choice',
        title: 'Is it still happening?',
        sub: 'Ongoing conduct is usually a stronger case and easier to prove.',
        options: [
          { value: 'yes', label: 'Yes, still happening now' },
          { value: 'stopped', label: 'It has stopped' },
          { value: 'once', label: 'It happened once' }
        ]
      }
    ]
  },

  /* ================= INTERNATIONAL ================= */
  'international': {
    intro: "Cross-border matters turn on which country law applies and on where the other side can actually be sued.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What is the cross-border matter?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'contract', label: 'A contract with a foreign company', fee: 'Hourly from $375' },
          { value: 'dispute', label: 'A dispute with a foreign party', fee: 'Retainer from $7,500' },
          { value: 'judgment', label: 'Enforcing a foreign judgment', desc: 'Collecting abroad on a judgment you already have.', fee: 'Quoted per matter' },
          { value: 'trade', label: 'Import, export or a customs issue', fee: 'Hourly from $350' },
          { value: 'arbitration', label: 'International arbitration', fee: 'Retainer from $10,000' },
          { value: 'business', label: 'Setting up or structuring a foreign business' }
        ]
      },
      {
        key: 'countries', type: 'text',
        title: 'Which countries are involved?',
        placeholder: 'For example: the United States and the United Kingdom',
        sub: 'Include where the other party is based and where the assets are.'
      },
      {
        key: 'clause', type: 'choice',
        title: 'Does the contract name a governing law or an arbitration clause?',
        sub: 'This clause usually decides where the case is heard, so bring the document.',
        options: [
          { value: 'law_arb', label: 'Yes, an arbitration clause' },
          { value: 'law_only', label: 'Yes, a choice of law' },
          { value: 'none', label: 'It is silent on this' },
          { value: 'unknown', label: 'I do not have the document' }
        ]
      },
      {
        key: 'assets', type: 'choice',
        title: 'Does the other side have assets in the United States?',
        sub: 'Where the money is decides whether a judgment can actually be collected.',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No, only abroad' },
          { value: 'unknown', label: 'I do not know' }
        ]
      }
    ]
  },

  /* ================= LITIGATION ================= */
  'litigation': {
    intro: "A filed lawsuit runs on strict deadlines. Missing one can hand the other side the case.",
    questions: [
      {
        key: 'stage', type: 'choice',
        title: 'Where does the dispute stand?',
        sub: 'This is the single most important question, and the answer decides the urgency.',
        options: [
          { value: 'filed', label: 'A lawsuit has been filed against me', desc: 'A response deadline is running.', fee: 'Urgent — answer deadlines are strict' },
          { value: 'filing', label: 'I want to file a lawsuit', fee: 'Retainer from $5,000' },
          { value: 'demand', label: 'A demand letter or a threat to sue', fee: 'Flat-fee response from $750' },
          { value: 'pretrial', label: 'It is already in the discovery phase' },
          { value: 'judgment', label: 'A judgment exists and collection has started' }
        ]
      },
      {
        key: 'served', type: 'choice',
        title: 'Have you been formally served?',
        sub: 'Service starts the clock. Tell us the date you were served if you know it.',
        options: [
          { value: 'yes_date', label: 'Yes, and I know the date', fee: 'Expedited response' },
          { value: 'yes_nodate', label: 'Yes, but I do not have the papers' },
          { value: 'no', label: 'No, nothing has been served' },
          { value: 'unsure', label: 'I am not sure' }
        ]
      },
      {
        key: 'subject', type: 'choice',
        title: 'What is the dispute about?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'contract', label: 'A contract' },
          { value: 'business', label: 'A business or partnership dispute' },
          { value: 'property', label: 'Property or real estate' },
          { value: 'tort', label: 'An injury or damage claim' },
          { value: 'other', label: 'Something else' }
        ]
      },
      {
        key: 'amount', type: 'money',
        title: 'Roughly how much is at stake?',
        sub: 'This decides whether the fight is economic.',
        options: [
          { value: 'under_25', label: 'Under $25,000' },
          { value: 'to_100', label: '$25,000 to $100,000' },
          { value: 'to_500', label: '$100,000 to $500,000' },
          { value: 'over_500', label: 'Over $500,000' },
          { value: 'unknown', label: 'Not determined' }
        ]
      },
      {
        key: 'otherside_counsel', type: 'choice',
        title: 'Does the other side have a lawyer?',
        sub: 'It changes the pace and the tone of everything that follows.',
        options: [
          { value: 'yes', label: 'Yes, they are represented' },
          { value: 'no', label: 'No, they are representing themselves' },
          { value: 'unknown', label: 'I do not know' }
        ]
      }
    ]
  },

  /* ================= APPELLATE ================= */
  'appellate': {
    intro: "Appellate deadlines are the shortest in the law and are almost never extended. Tell us the date of the decision.",
    questions: [
      {
        key: 'decision', type: 'choice',
        title: 'What are you appealing?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'civil', label: 'A civil judgment or order', fee: 'Hourly from $375' },
          { value: 'criminal', label: 'A criminal conviction or sentence', fee: 'Flat fee, quoted per record' },
          { value: 'agency', label: 'A government agency decision' },
          { value: 'interlocutory', label: 'An interim ruling during a case' },
          { value: 'post', label: 'A post-conviction or habeas matter' }
        ]
      },
      {
        key: 'decision_date', type: 'text',
        title: 'What was the date of the decision?',
        placeholder: 'For example: 14 October 2026',
        sub: 'Appeal deadlines commonly run 30 days from the judgment or from the notice of its entry. If you are close to that, say so and we will move immediately.'
      },
      {
        key: 'notice_filed', type: 'choice',
        title: 'Has a notice of appeal been filed?',
        sub: 'Without a notice of appeal, the higher court has no power to hear the case at all.',
        options: [
          { value: 'yes', label: 'Yes, it has been filed' },
          { value: 'no', label: 'No, not yet', fee: 'Urgent filing' },
          { value: 'unsure', label: 'I do not know' }
        ]
      },
      {
        key: 'lower_court', type: 'choice',
        title: 'Which court decided it?',
        sub: 'Different courts sit in different places and follow different rules.',
        options: [
          { value: 'state_trial', label: 'A state trial court' },
          { value: 'state_appeals', label: 'A state appellate court' },
          { value: 'federal_district', label: 'A federal district court' },
          { value: 'agency', label: 'An agency' },
          { value: 'unknown', label: 'I am not sure' }
        ]
      },
      {
        key: 'record', type: 'choice',
        title: 'What is in the record?',
        sub: 'Appeals are decided on the record below, not on new evidence.',
        options: [
          { value: 'transcript', label: 'A full transcript exists' },
          { value: 'partial', label: 'Only partial records or exhibits' },
          { value: 'none', label: 'Nothing has been ordered yet' },
          { value: 'unknown', label: 'I do not know' }
        ]
      }
    ]
  },

  /* ================= MARITIME (Specialty) ================= */
  'maritime': {
    intro: "Maritime claims run on their own rules and on very short notice periods. Crew and passengers are treated differently.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What is the maritime matter?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'injury', label: 'An injury or death at sea or on a vessel', fee: 'Contingency, 33 percent' },
          { value: 'cargo', label: 'Cargo loss or damage', fee: 'Hourly from $350' },
          { value: 'arrest', label: 'A vessel arrest or a maritime lien' },
          { value: 'salvage', label: 'Salvage or towage' },
          { value: 'insurance', label: 'A marine insurance dispute' },
          { value: 'contract', label: 'A charter or shipping contract' }
        ]
      },
      {
        key: 'role', type: 'choice',
        title: 'What was your role?',
        sub: 'Crew have additional rights that passengers do not, so this matters a great deal.',
        options: [
          { value: 'crew', label: 'Crew member', desc: 'Entitled to maintenance and cure, and possibly more.', fee: 'Contingency, 33 percent' },
          { value: 'passenger', label: 'Passenger' },
          { value: 'shore', label: 'Longshore or dock worker' },
          { value: 'owner', label: 'Vessel or cargo owner' },
          { value: 'other', label: 'Something else' }
        ]
      },
      {
        key: 'where', type: 'choice',
        title: 'Where did it happen?',
        sub: 'Jurisdiction decides which law and which court applies.',
        options: [
          { value: 'high', label: 'On the open water' },
          { value: 'coastal', label: 'Coastal or territorial waters' },
          { value: 'port', label: 'In port or on a dock' },
          { value: 'inland', label: 'On an inland waterway or river' }
        ]
      },
      {
        key: 'maint', type: 'choice',
        title: 'Has maintenance and cure been paid?',
        sub: 'If you are crew, this is owed regardless of who was at fault, and non-payment is itself actionable.',
        options: [
          { value: 'yes', label: 'Yes, it is being paid' },
          { value: 'stopped', label: 'It was paid and then stopped', fee: 'Additional claim available' },
          { value: 'no', label: 'No, nothing has been paid' },
          { value: 'na', label: 'Not applicable to me' }
        ]
      }
    ]
  },

  /* ================= ENTERTAINMENT (Specialty) ================= */
  'entertainment': {
    intro: "Creative work is often the whole of someone's livelihood, so these matters are handled with the seriousness they deserve.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What kind of matter is this?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'contract', label: 'A contract or deal', desc: 'A label, studio, publisher or platform deal.', fee: 'Hourly from $325' },
          { value: 'royalty', label: 'Unpaid royalties or accounting', fee: 'Contingency, or hourly' },
          { value: 'rights', label: 'Copyright, trademark or ownership', fee: 'Retainer from $4,000' },
          { value: 'likeness', label: 'Name, image or likeness', desc: 'Your voice or face used without permission.', fee: 'Hourly from $325' },
          { value: 'defamation', label: 'Defamation or reputational harm', fee: 'Retainer from $5,000' },
          { value: 'talent', label: 'A talent or management agreement', fee: 'Flat fee from $1,200 to review' }
        ]
      },
      {
        key: 'work', type: 'choice',
        title: 'What kind of work is involved?',
        sub: 'Different industries have very different standard terms.',
        options: [
          { value: 'music', label: 'Music or audio' },
          { value: 'film', label: 'Film, television or video' },
          { value: 'book', label: 'Books or publishing' },
          { value: 'content', label: 'Online content or streaming' },
          { value: 'software', label: 'Software or games' },
          { value: 'art', label: 'Visual art or photography' }
        ]
      },
      {
        key: 'agreement', type: 'choice',
        title: 'Is there a signed agreement?',
        sub: 'Bring it even if you signed it years ago and no longer have a copy — we can request one.',
        options: [
          { value: 'yes', label: 'Yes, signed and I have it' },
          { value: 'yes_no_copy', label: 'Yes, but I do not have a copy' },
          { value: 'handshake', label: 'Only a verbal agreement' },
          { value: 'none', label: 'Nothing was agreed' }
        ]
      },
      {
        key: 'otherside', type: 'choice',
        title: 'Who is the other side?',
        sub: 'A major label or platform has its own legal team and a different pace.',
        options: [
          { value: 'major', label: 'A major label, studio or platform' },
          { value: 'independent', label: 'An independent company' },
          { value: 'individual', label: 'An individual' },
          { value: 'unknown', label: 'I am not sure' }
        ]
      },
      {
        key: 'live', type: 'choice',
        title: 'Is the work still being used or sold?',
        sub: 'If it is, an injunction may be available.',
        options: [
          { value: 'yes', label: 'Yes, it is still out there', fee: 'Injunction considered' },
          { value: 'stopped', label: 'It has been taken down' },
          { value: 'never', label: 'It was never released' }
        ]
      }
    ]
  },

  /* ================= ENVIRONMENTAL (Specialty) ================= */
  'environmental': {
    intro: "Environmental cases are won on testing and on the record. Tell us what has been documented.",
    questions: [
      {
        key: 'matter', type: 'choice',
        title: 'What is the environmental matter?',
        sub: 'Pick the closest match.',
        options: [
          { value: 'contamination', label: 'Contaminated land or water', fee: 'Retainer from $7,500' },
          { value: 'pollution', label: 'Ongoing pollution from a facility', fee: 'Hourly from $350' },
          { value: 'exposure', label: 'Toxic exposure harming people', fee: 'Contingency, 33 percent' },
          { value: 'enforcement', label: 'A regulatory enforcement action', fee: 'Retainer from $7,500' },
          { value: 'citizen', label: 'A citizen suit', desc: 'Where a statute allows private enforcement.', fee: 'Fee-shifting, often no cost to you' },
          { value: 'permits', label: 'A permit or a compliance issue' }
        ]
      },
      {
        key: 'documented', type: 'choice',
        title: 'Is there a test result or a document?',
        sub: 'Laboratory analysis, an agency report or a consultant finding all count.',
        options: [
          { value: 'lab', label: 'Yes, laboratory testing exists' },
          { value: 'agency', label: 'Yes, an agency report or violation notice' },
          { value: 'suspicion', label: 'No testing, but the harm is obvious' },
          { value: 'none', label: 'Nothing documented yet' }
        ]
      },
      {
        key: 'health', type: 'choice',
        title: 'Has anyone been made ill?',
        sub: 'A medical link between the exposure and a diagnosis is central to these cases.',
        options: [
          { value: 'yes_dx', label: 'Yes, with a medical diagnosis', fee: 'Priority review' },
          { value: 'yes_symptoms', label: 'Yes, but no diagnosis yet' },
          { value: 'no', label: 'No illness, but damage to property' },
          { value: 'unknown', label: 'I am not sure' }
        ]
      },
      {
        key: 'agency', type: 'choice',
        title: 'Has a government agency been involved?',
        sub: 'Agency involvement can help or hurt, and it changes the strategy.',
        options: [
          { value: 'state', label: 'A state environmental agency' },
          { value: 'federal', label: 'A federal agency such as the EPA' },
          { value: 'local', label: 'A local authority' },
          { value: 'none', label: 'No agency is involved' }
        ]
      }
    ]
  }
};
