import ical, { ICalCalendarMethod } from "ical-generator";
import { _createElement } from "simple-jsx-handler";
import { Calendar } from "../components/Calendar";
import { downloadFile } from "../util";
import { COURSE_NAMES, COURSE_NAMES_SHORT, MONTH_LOCALE_SHORT, TIME_TO_RANGE } from "./lu-dati";
import { type Groups } from "./table-gen";

export const ExportICSDialog = (attribs: Record<string, unknown>) => {
  const calendar = new Calendar(new Date());
  const getData = attribs.getData as () => Groups | null;
  if (!getData) {
    throw new Error("getData is not defined!");
  }
  let rangeStart: Date | null = null;
  let rangeEnd: Date | null = null;

  calendar.element.style.display = "none";
  calendar.element.classList.add("export-ics-dialog");

  // const exportButton = (
  //   <button
  //     class="btn btn-primary disabled mb-1 p-centered"
  //     style="width: 90%"
  //     on:click={() => {
  //       const cal = ical({
  //         name: "LU Lekciju saraksts",
  //         description: `LU Lekciju saraksts no ${rangeStart!.getDate()}. ${MONTH_LOCALE_SHORT[rangeStart!.getMonth()]} līdz ${rangeEnd!.getDate()}. ${MONTH_LOCALE_SHORT[rangeEnd!.getMonth()]}`,
  //         prodId: "//cernavskis.dev//LULSV//LV",
  //         method: ICalCalendarMethod.ADD,
  //         timezone: "Europe/Riga",
  //       });
  //       for (let i = new Date(rangeStart!); i.getTime() <= rangeEnd?.getTime()!; i.setDate(i.getDate() + 1)) {
  //         for (const lection of getData()!.lections) {
  //           if (isLectionOnDay(i, lection)) {
  //             const start: [number, number] = lection.time.split(":").map(Number) as [number, number];
  //             const end: [number, number] = TIME_TO_RANGE[lection.time as keyof typeof TIME_TO_RANGE]
  //               .split(" - ")[1]
  //               .split(":")
  //               .map(Number) as [number, number];
  //             const { room, prof } = getRoomAndProf(getLectionKey(lection)) ?? {};
  //             cal.createEvent({
  //               summary: COURSE_NAMES_SHORT[lection.name as keyof typeof COURSE_NAMES_SHORT],
  //               description: `${lection.name.replace(/[ILP]$/, "")}: ${COURSE_NAMES[lection.name as keyof typeof COURSE_NAMES]}${prof ? `\n${prof}` : ""}`,
  //               start: new Date(i.getFullYear(), i.getMonth(), i.getDate(), start[0], start[1]),
  //               end: new Date(i.getFullYear(), i.getMonth(), i.getDate(), end[0], end[1]),
  //               location: room?.replace("aud.", "auditorija"),
  //               id: `${i.getFullYear()}${i.getMonth()}${i.getDate()}${getLectionKey(lection)}${lection.person.stream}`,
  //             });
  //           }
  //         }
  //       }

  //       downloadFile(new File([cal.toString()], "lulsv-export.ics", { type: "text/calendar" }));
  //     }}
  //   >
  //     Izvēlies datumus!
  //   </button>
  // );

  // calendar.appendInFooter(<div>{exportButton}</div>);

  // calendar.onFocus(date => date.element.querySelector("button")!.blur());

  // function updateRange(): void {
  //   exportButton.innerText = "Izvēlies datumus!";
  //   exportButton.classList.add("disabled");
  //   if (rangeStart === null) return;

  //   exportButton.innerText = "";

  //   if (rangeStart !== null) {
  //     exportButton.innerText = `${rangeStart.getDate()}. ${MONTH_LOCALE_SHORT[rangeStart.getMonth()]} - `;
  //   }

  //   if (rangeEnd !== null) {
  //     exportButton.innerText += ` ${rangeEnd.getDate()}. ${MONTH_LOCALE_SHORT[rangeEnd.getMonth()]}`;
  //     exportButton.classList.remove("disabled");
  //   }

  //   calendar.setSelectedRange(rangeStart, rangeEnd ?? rangeStart);
  // }

  // calendar.onClick((date, event) => {
  //   console.log({ rangeStart, rangeEnd });
  //   if (rangeStart === null) {
  //     rangeStart = date.date;
  //   } else if (rangeEnd === null) {
  //     if (date.date.getTime() < rangeStart.getTime()) {
  //       rangeEnd = rangeStart;
  //       rangeStart = date.date;
  //     } else {
  //       rangeEnd = date.date;
  //     }
  //   } else {
  //     rangeStart = date.date;
  //     rangeEnd = null;
  //   }

  //   updateRange();
  // });

  // calendar.onChange(() => {
  //   updateRange();
  //   calendar.element.style.display = "block";
  // });

  return calendar.element;
};
