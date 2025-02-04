import { _createElement, _fragment } from "simple-jsx-handler";
import { createTable, removeAllChildren } from "../util";
import { createLectureModal } from "./LectionInfoModal";
import { COURSE_NAMES, COURSE_NAMES_SHORT, DAY_LOCALE, DAY_LOCALE_SHORT, LECTURES, TIME_TO_RANGE } from "./lu-dati";

export type Groups = string[];
export type Lecture = (typeof LECTURES)[number];

export function displayTable(container: HTMLElement, groups: Groups): void {
  removeAllChildren(container);
  container.appendChild(<div>{createDataTable(groups)}</div>);
}

export function createDataTable(groups: Groups): HTMLElement {
  const lections: string[][] = LECTURES.filter(lecture => {
    if (lecture.groups.length === 0) {
      return true;
    }
    for (const [group, week] of lecture.groups) {
      if (groups.includes(group)) {
        return true;
      }
    }

    return false;
  })
    .sort((a, b) => {
      if (a.day !== b.day) {
        const ad = ["Pr", "O", "T", "C", "Pk"].findIndex(day => day === a.day);
        const bd = ["Pr", "O", "T", "C", "Pk"].findIndex(day => day === b.day);
        return ad - bd;
      } else if (a.time !== b.time) {
        return parseInt(a.time) - parseInt(b.time);
      }
      return 0;
    })
    .map(lection => {
      if (!(lection.time in TIME_TO_RANGE)) {
        throw new Error("Invalid time");
      }

      if (!(lection.day in DAY_LOCALE)) {
        throw new Error("Invalid day");
      }

      if (!(lection.course in COURSE_NAMES)) {
        throw new Error("Invalid lection name");
      }

      const { room, professor } = lection;

      const weekFilter = lection.groups.find(([group, week]) => groups.includes(group))?.[1];
      const groupFilter = lection.groups.find(([group, week]) => groups.includes(group))?.[0];

      return [
        <>
          <div>
            <span class="hide-lg">{COURSE_NAMES[lection.course as keyof typeof COURSE_NAMES]}</span>
            <span class="show-lg">{COURSE_NAMES_SHORT[lection.course as keyof typeof COURSE_NAMES_SHORT]}</span>
          </div>
          <span class="text-gray hide-xl">{professor}</span>
        </>,
        <>
          <span class="hide-lg">{DAY_LOCALE[lection.day as keyof typeof DAY_LOCALE]}</span>
          <span class="show-lg">{DAY_LOCALE_SHORT[lection.day as keyof typeof DAY_LOCALE_SHORT]}</span>
        </>,
        weekFilter === "even" ? (
          "Pāra nedēļās"
        ) : weekFilter === "odd" ? (
          "Nepāra nedēļās"
        ) : Array.isArray(weekFilter) ? (
          `Nedēļās ${weekFilter.join(", ")}`
        ) : (
          <span class="text-gray">Katru nedēļu</span>
        ),
        TIME_TO_RANGE[lection.time as keyof typeof TIME_TO_RANGE],
        room,
        groupFilter ?? "",
        <button class="btn show-xl" on:click={() => document.body.appendChild(createLectureModal(lection, groups))}>
          <i class="icon icon-more-vert"></i>
        </button>,
      ];
    });

  const tableElement = createTable(["Kurss", "Diena", "", "Laiks", "Telpa", "Grupa", ""], lections, [
    "",
    "",
    "hide-xl",
    "",
    "hide-xl",
    "hide-xl",
    "show-xl",
  ]);

  return tableElement;
}
