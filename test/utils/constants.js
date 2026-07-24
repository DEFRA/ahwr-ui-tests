export const APPLY_REVIEW_CLAIM_SBI = "107167406";
export const SHEEP_ENDEMIC_CLAIM_SBI = "106208072";
export const BEEF_ENDEMIC_CLAIM_SBI = "107085418";
export const BACK_OFFICE_APPROVE_SBI = "106825898";
export const BACK_OFFICE_REJECT_SBI = "106215898";
export const BACK_OFFICE_ON_HOLD_SBI = "104215119";
export const DASHBOARD_SBI = "107019440";
export const JOHNES_DISEASE = "johnes";
// Each livestock species has its own business + agreement so the beef/dairy/
// pigs/sheep specs can run as independent parallel workers (see the matching
// IAHW-KH2H-WNA1/8/9/10 agreements seeded in fixtures/init-mongo.js).
export const BEEF_MULTIPLE_HERD_SBI = "123454321";
export const DAIRY_MULTIPLE_HERD_SBI = "123454322";
export const PIGS_MULTIPLE_HERD_SBI = "123454323";
export const SHEEP_MULTIPLE_HERD_SBI = "123454324";
export const LIVESTOCK_SBI = "106613836";

export const POULTRY_SBI = "120810710";
export const BACK_OFFICE_POULTRY_APPROVE_SBI = "111862019";
export const BACK_OFFICE_POULTRY_REJECT_SBI = "106476011";

export const CLAIM_JOURNEY_SBI = "107346087";
export const AGREEMENT_REF = "IAHW-KH2H-WNA7";

export const ON_HOLD_AGREEMENT_REF = "IAHW-SCV6-E55L";
export const ON_HOLD_CLAIM_REF = "REPI-UG9L-I1XP";
export const ON_HOLD_SBI = "104215119";
export const ON_HOLD_STATUS = "AGREED";
export const ON_HOLD_COMPANY = "Mr A Test Farmer";
export const ON_HOLD_CLAIM_TYPE = "REVIEW";

export const SEARCH_AGREEMENT_REF = "IAHW-SCV6-E55L";
export const SEARCH_CLAIM_REF = "REPI-UG9L-I2XR";
export const SEARCH_FOLLOW_UP_CLAIM_REF = "FUBC-UG9L-I3XS";
export const SEARCH_SBI = "104215119";
export const SEARCH_STATUS = "AGREED";
export const SEARCH_COMPANY = "Mr A Test Farmer";
export const SEARCH_AGREEMENT_DATE = "26/03/2025";
export const SEARCH_CLAIM_STATUS = "Paid";
export const SEARCH_CLAIM_TYPE = "REVIEW";
export const SEARCH_CLAIM_DATE = "26/03/2025";
export const SEARCH_HERD_TYPE = "Beef cattle";

// Advanced search filters agreements by type. The backend translates each type
// into the set of reference prefixes it covers.
export const IAHW_REFERENCE_PREFIXES = ["IAHW-", "AHWR-"];
export const PBR_REFERENCE_PREFIXES = ["POUL-"];

export const POULTRY_CLAIM_REF = "PORE-D7AB-E2UU";

export const BEEF_MULTIPLE_HERD_AGREEMENT_REF = "IAHW-KH2H-WNA1";
export const DAIRY_MULTIPLE_HERD_AGREEMENT_REF = "IAHW-KH2H-WNA8";
export const PIGS_MULTIPLE_HERD_AGREEMENT_REF = "IAHW-KH2H-WNA9";
export const SHEEP_MULTIPLE_HERD_AGREEMENT_REF = "IAHW-KH2H-WNB1";

export const PRE_MULTIPLE_HERD_SBI = "114262075";
export const PRE_MULTIPLE_HERD_AGREEMENT_REF = "IAHW-KH1H-BBA4";

export const PRE_POST_MULTIPLE_HERD_SBI = "106817865";
export const PRE__POST_MULTIPLE_HERD_AGREEMENT_REF = "IAHW-KH3H-BBA5";

export const PRE_MH_REVIEWS_HERD_SBI = "106817866";
export const PRE_MH_REVIEWS_AGREEMENT_REF = "IAHW-AC1H-BBA4";

export const POULTRY_MULTIPLE_SITE_SBI = "106299766";

export const POULTRY_FLAG_SBI = "114214441";
export const POULTRY_FLAG_AGREEMENT_REF = "POUL-D7AB-E2UZ";

export const LIVESTOCK_FLAG_SBI = "113372577";
export const LIVESTOCK_FLAG_AGREEMENT_REF = "IAHW-SQP6-E2XM";
