let cachedPeopleKeys: Promise<string[]> = fetch("/lulsv/data/all").then(response => response.json());
export async function getPeople(): Promise<string[]> {
  return await cachedPeopleKeys;
}

let cachedPeople: Record<string, Promise<string | null>> = {};
export async function getPerson(name: string): Promise<string | null> {
  if (!(name in cachedPeople)) {
    cachedPeople[name] = new Promise<string | null>(r => 
      fetch(`/lulsv/data/${name}`)
        .then(response => response.status === 200 ? response.text() : null)
        .then(r)
        .catch(e => {
          console.error(e);
          r(null);
        })
      );
  }

  return await cachedPeople[name];
}

export const WEEK_ORDINALS = {
  "20240902": 1,
  "20240909": 2,
  "20240916": 3,
  "20240923": 4,
  "20240930": 5,
  "20241007": 6,
  "20241014": 7,
  "20241021": 8,
  "20241028": 9,
  "20241104": 10,
  "20241111": 11,
  "20241118": 12,
  "20241125": 13,
  "20241202": 14,
  "20241209": 15,
  "20241216": 16,
  "20250102": 17,
  "20250106": 18,
  "20250113": 19,
  "20250120": 20,
  "20250203": 1,
  "20250210": 2,
  "20250217": 3,
  "20250224": 4,
  "20250303": 5,
  "20250310": 6,
  "20250317": 7,
  "20250324": 8,
  "20250431": 9,
  "20250407": 10,
  "20250422": 11,
  "20250428": 12,
  "20250505": 13,
  "20250512": 14,
  "20250519": 15,
  "20250526": 16,
  "20250602": 17,
  "20250609": 18,
  "20250616": 19,
  "20250623": 20,
};

export const DAY_LOCALE = {
  Pr: "Pirmdiena",
  O: "Otrdiena",
  T: "Trešdiena",
  C: "Ceturtdiena",
  Pk: "Piektdiena",
};

export const DAY_LOCALE_LOCATIVE = {
  Pr: "Pirmdienās",
  O: "Otrdienās",
  T: "Trešdienās",
  C: "Ceturtdienās",
  Pk: "Piektdienās",
};

export const DAY_LOCALE_SHORT = {
  Pr: "Pr.",
  O: "O.",
  T: "Tr.",
  C: "Ce.",
  Pk: "Pk.",
};

export const TIME_TO_RANGE = {
  "8:30": "08:30 - 10:10",
  "10:30": "10:30 - 12:10",
  "12:30": "12:30 - 14:10",
  "14:30": "14:30 - 16:10",
  "16:30": "16:30 - 18:05",
  "18:15": "18:15 - 19:50",
  "20:00": "20:00 - 21:35",
};

export const LECTION_NAMES = {
  DatZB001: "Tīmekļa tehnoloģijas I",
  DatZB001L: "Tīmekļa tehnoloģijas I (laboratorijas darbs)",
  DatZB009: "Algoritmi un programmēšana",
  DatZB009L: "Algoritmi un programmēšana (laboratorijas darbs)",
  DatZB009P: "Algoritmi un programmēšana (praktiskais darbs)",
  DatZB010: "Diskrētā matemātika datoriķiem",
  DatZB010I: "Izlīdzinošais kurss vidusskolas matemātikā",
  DatZB018: "Operētājsistēmas",
  DatZB066: "Datorsistēmu arhitektūra un datoru inženierijas pamati I",
  DatZB067: "Datoru tīkli I un ieskats nozarē",
  DatZB067L: "Datoru tīkli I un ieskats nozarē (laboratorijas darbs)",
};

export const LECTION_NAMES_SHORT = {
  DatZB001: "Tīmekļa tehn.",
  DatZB001L: "Tīmekļa tehn. (lab.)",
  DatZB009: "Alg. un prog.",
  DatZB009L: "Alg. un prog. (lab.)",
  DatZB009P: "Alg. un prog. (prak.)",
  DatZB010: "Diskrētā mat.",
  DatZB010I: "Izl. kurss mat.",
  DatZB018: "Operētājsist.",
  DatZB066: "Datorsist. un inž. pamati",
  DatZB067: "Datoru tīkli",
  DatZB067L: "Datoru tīkli (lab.)",
};

const LECTION_BASE_LINK = "https://estudijas.lu.lv/course/view.php?id=";
export const LECTION_LINKS = {
  DatZB001: LECTION_BASE_LINK + 17251,
  DatZB001L: LECTION_BASE_LINK + 17251,
  DatZB009: LECTION_BASE_LINK + 17253,
  DatZB009L: LECTION_BASE_LINK + 17253,
  DatZB009P: LECTION_BASE_LINK + 17253,
  DatZB010: LECTION_BASE_LINK + 17071,
  DatZB010I: LECTION_BASE_LINK + 17071,
  DatZB018: LECTION_BASE_LINK + 17073,
  DatZB066: LECTION_BASE_LINK + 17038,
  DatZB067: LECTION_BASE_LINK + 17127,
  DatZB067L: LECTION_BASE_LINK + 17127,
};

export const PROFS = [
  "asoc. prof. Dr. dat. U. Bojārs",
  "asoc. prof. Dr. sc. comp. L. Trukšāns",
  "asoc. prof. Dr. sc. comp. L.Trukšāns",
  "doc. Dr. sc. comp. E. Diebelis",
  "doc. Dr. sc. comp. E. Rencis",
  "p. M. Balode",
  "p. Mg. sc. comp. I. Mizniks",
  "pasn. Dr. D. S. Rikačovs",
  "pasn. Dr. S. Rikačovs",
  "pasn. Mg. M. Ivanovs",
  "pasn. Mg. sc. comp. I. Mizniks",
  "prof. Dr. sc. comp. D. Solodovņikova",
  "prof. Dr. sc. comp. D.Solodovņikova",
  "prof. Dr. sc. comp. G. Arnicāns",
  "prof. Dr. sc. comp. J. Smotrovs",
  "prof. Dr. sc. comp. L. Seļāvo",
  "prof. Dr. sc. comp. U. Straujums, prof. Dr. sc. comp. J. Zuters",
  "prof. Dr. sc. comp. U. Straujums",
];

export const ROOMS = [
  "032. telpa",
  "13. aud.",
  "14. aud.",
  "16. aud.",
  "18. aud.",
  "336. telpa",
  "345. telpa",
  "415. telpa",
];

export const LECTION_ROOMS_PROFS = {
  Pr1030DatZB067: [1, 1],
  Pr1030DatZB001: [11, 7],
  Pr1230DatZB001: [11, 7],
  Pr1230DatZB067: [1, 1],
  Pr1630DatZB001LA: [0, 5],
  Pr1815DatZB001LG: [9, 5],
  Pr2000DatZB001LB: [9, 5],
  Pr2000DatZB001LC: [12, 6],
  O0830DatZB001LH: [12, 6],
  O1030DatZB009: [16, 7],
  O1030DatZB010: [14, 1],
  O1230DatZB010: [14, 1],
  O1230DatZB009: [16, 7],
  O1430DatZB018: [6, 7],
  O1630DatZB010I: [5, 7],
  O1815DatZB010I: [5, 7],
  T0830DatZB066: [15, 7],
  T1030DatZB066: [15, 1],
  T1030DatZB010: [14, 7],
  T1230DatZB010: [14, 7],
  T1230DatZB066: [15, 1],
  T1430DatZB018: [6, 7],
  T1430DatZB009L4b: [17, 5],
  T1630DatZB009L7a: [6, 5],
  T1815DatZB001LD: [12, 5],
  T2000DatZB001LJ: [12, 5],
  C0830DatZB009L1a: [17, 5],
  C0830DatZB009L5a: [8, 6],
  C0830DatZB067L1b: [2, 0],
  C0830DatZB067L5b: [2, 0],
  C1030DatZB009L2a: [17, 5],
  C1030DatZB067L6b: [1, 0],
  C1030DatZB009P1: [4, 2],
  C1030DatZB009P5: [3, 4],
  C1030DatZB009L6a: [7, 6],
  C1230DatZB009L1b: [17, 5],
  C1230DatZB067L1a: [1, 0],
  C1230DatZB067L5a: [1, 0],
  C1230DatZB009P2: [4, 2],
  C1230DatZB009P6: [3, 4],
  C1230DatZB009L5b: [8, 6],
  C1430DatZB009L2b: [17, 5],
  C1430DatZB067L6a: [1, 0],
  C1430DatZB067L2a: [1, 0],
  C1430DatZB009L6b: [8, 6],
  C1630DatZB001LE: [9, 5],
  C1815DatZB001LF: [9, 5],
  C1815DatZB001LM: [0, 6],
  C2000DatZB001LK: [9, 6],
  C2000DatZB001LL: [0, 6],
  Pk0830DatZB009L3a: [17, 5],
  Pk0830DatZB067L7b: [1, 0],
  Pk0830DatZB067L3b: [1, 0],
  Pk1030DatZB009L4a: [17, 5],
  Pk1030DatZB067L8b: [1, 0],
  Pk1030DatZB067L4b: [1, 0],
  Pk1030DatZB009P3: [4, 2],
  Pk1030DatZB009P7: [13, 3],
  Pk1030DatZB009L8a: [10, 6],
  Pk1230DatZB009L3b: [17, 5],
  Pk1230DatZB067L3a: [1, 0],
  Pk1230DatZB067L7a: [1, 0],
  Pk1230DatZB009P4: [4, 2],
  Pk1230DatZB009P8: [13, 3],
  Pk1230DatZB009L7b: [10, 6],
  Pk1430DatZB067L8a: [1, 0],
  Pk1430DatZB067L4a: [1, 0],
  Pk1430DatZB009L8b: [10, 6],
};
