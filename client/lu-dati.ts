let cachedPeople: Promise<Record<string, string>> = fetch("/tools/lu-dati/PEOPLE.json").then((response) => response.json());
export async function getPeople(): Promise<Record<string, string>> {
  return await cachedPeople;
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
  "Pr": "Pirmdiena",
  "O": "Otrdiena",
  "T": "Trešdiena",
  "C": "Ceturtdiena",
  "Pk": "Piektdiena"
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
  "DatZB001": "Tīmekļa tehnoloģijas I",
  "DatZB001L": "Tīmekļa tehnoloģijas I (laboratorijas darbs)",
  "DatZB009": "Algoritmi un programmēšana",
  "DatZB009L": "Algoritmi un programmēšana (laboratorijas darbs)",
  "DatZB009P": "Algoritmi un programmēšana (praktiskais darbs)",
  "DatZB010": "Diskrētā matemātika datoriķiem",
  "DatZB010I": "Izlīdzinošais kurss vidusskolas matemātikā",
  "DatZB018": "Operētājsistēmas",
  "DatZB066": "Datorsistēmu arhitektūra un datoru inženierijas pamati I",
  "DatZB067": "Datoru tīkli I un ieskats nozarē",
  "DatZB067L": "Datoru tīkli I un ieskats nozarē (laboratorijas darbs)",
};

export const LECTION_LINKS = {
  "DatZB001": "https://estudijas.lu.lv/course/view.php?id=17251",
  "DatZB001L": "https://estudijas.lu.lv/course/view.php?id=17251",
  "DatZB009": "https://estudijas.lu.lv/course/view.php?id=17253",
  "DatZB009L": "https://estudijas.lu.lv/course/view.php?id=17253",
  "DatZB009P": "https://estudijas.lu.lv/course/view.php?id=17253",
  "DatZB010": "https://estudijas.lu.lv/course/view.php?id=17071",
  "DatZB010I": "https://estudijas.lu.lv/course/view.php?id=17071",
  "DatZB018": "https://estudijas.lu.lv/course/view.php?id=17073",
  "DatZB066": "https://estudijas.lu.lv/course/view.php?id=17038",
  "DatZB067": "https://estudijas.lu.lv/course/view.php?id=17127",
  "DatZB067L": "https://estudijas.lu.lv/course/view.php?id=17127",
};
