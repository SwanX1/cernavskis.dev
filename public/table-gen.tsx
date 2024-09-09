import { _createElement, _fragment } from "simple-jsx-handler";
import { createTable, removeAllChildren } from "./util";
import { DAY_LOCALE, DAY_LOCALE_SHORT, LECTION_LINKS, LECTION_NAMES, LECTION_NAMES_SHORT, LECTION_ROOMS_PROFS, PROFS, ROOMS, TIME_TO_RANGE, WEEK_ORDINALS } from "./lu-dati";
import { createLectionModal } from "./LectionInfoModal";

export interface PersonData {
  id: number;
  name: string;
  stream: string;
  lections: Lection[];
}

export interface Lection {
  person: PersonData;
  name: string;
  day: string;
  time: string;
  group?: string;
  weekFilter?: "even" | "odd" | number[];
}

export function displayTable(container: HTMLElement, data: PersonData, onClose?: () => void): void {
  removeAllChildren(container);
  container.appendChild(<div>{createDataTable(data, onClose)}</div>);
}

export function parseLine(line: string): PersonData {
  line = line.replace(/\s+/g, " ").trim().replaceAll(" -", "-");
  let idAndName = line.slice(0, Math.max(line.indexOf(" I "), line.indexOf(" II "))).trim();
  let [stream, ...rest] = line.slice(Math.max(line.indexOf(" I "), line.indexOf(" II "))).trim().split(" ").map(str => str.trim());
  const id = parseInt(idAndName.slice(0, idAndName.indexOf(" ")).trim());
  const name = idAndName.slice(idAndName.indexOf(" ")).trim();
  if (isNaN(id)) {
    throw new Error("Invalid ID");
  }
  
  const lections: Lection[] = [];
  let lectionCount = 0;
  while (rest.length > 0) {
    const currentLection: Partial<Lection> = {};

    let lineSection = rest.shift()!;

    // Edge case
    const isEdgeCase = lineSection === "5.,";
    if (isEdgeCase) {

      do {
        rest.shift();
      } while (rest.length !== 0 && rest[0] !== "ned.");
      rest.shift();

      lineSection = rest.shift()!;
    }

    debugger;

    let [day, time] = lineSection.split("-").map(str => str.trim());
    currentLection.time = time.replace(".", ":");
    if (day.length > 2) {
      let weekFilter;
      [weekFilter, day] = day.split(".").map(str => str.trim());

      if (weekFilter === "1") {
        currentLection.weekFilter = "odd";
      } else if (weekFilter === "2") {
        currentLection.weekFilter = "even";
      } else {
        throw new Error("Invalid week filter");
      }
    }

    currentLection.day = day;

    if (rest[0]?.startsWith("(")) {
      currentLection.group = rest.shift()!.slice(1, -1).trim();
    }

    if (isEdgeCase) {
      currentLection.weekFilter = [5, 8, 10, 14, 16];
    }

    currentLection.name = [
      "DatZB066",
      "DatZB066",
      "DatZB001",
      "DatZB067",
      "DatZB009",
      "DatZB018",
      "DatZB010",
      "DatZB010",
      "DatZB009P",
      "DatZB009L",
      "DatZB067L", // starts only on 4th week
      "DatZB001L",
      "DatZB010I",
    ][lectionCount++];

    lections.push(currentLection as Lection);
  }

  const personData: PersonData = {
    id,
    name,
    stream,
    lections,
  };

  for (const lection of lections) {
    lection.person = personData;
  }

  return personData;
}

export function createDataTable(data: PersonData, onClose?: () => void): HTMLElement {
  const lections: string[][] = data.lections.sort((a, b) => {
    if (a.day !== b.day) {
      const ad = ["Pr", "O", "T", "C", "Pk"].findIndex(day => day === a.day);
      const bd = ["Pr", "O", "T", "C", "Pk"].findIndex(day => day === b.day);
      return ad - bd;
    } else if (a.time !== b.time) {
      const [ah, am] = a.time.split(":").map(parseInt);
      const [bh, bm] = b.time.split(":").map(parseInt);

      if (ah !== bh) {
        return ah - bh;
      } else {
        return am - bm
      }
    }
    return 0;
  }).map(lection => {
    if (!(lection.time in TIME_TO_RANGE)) {
      throw new Error("Invalid time");
    }

    if (!(lection.day in DAY_LOCALE)) {
      throw new Error("Invalid day");
    }

    if (!(lection.name in LECTION_NAMES)) {
      throw new Error("Invalid lection name");
    }

    let { room, prof } = getRoomAndProf(getLectionKey(lection)) ?? { room: null, prof: null };

    if (!room) {
      room = <span class="text-error">ERROR</span>;
      console.error("No room found for lection " + getLectionKey(lection), lection);
    }

    if (!prof) {
      console.error("No prof found for lection " + getLectionKey(lection), lection);
    }
    
    return [
      <>
        <div>
          <span class="hide-lg">{ LECTION_NAMES[lection.name as keyof typeof LECTION_NAMES] }</span>
          <span class="show-lg">{ LECTION_NAMES_SHORT[lection.name as keyof typeof LECTION_NAMES_SHORT] }</span>
        </div>
        {
          lection.name === "DatZB067L" ?
            <span class="text-error hide-lg">Kurss sākas tikai ar 4. nedēļu<br /></span> :
            <></>
        }
        <span class="text-gray hide-xl">{prof ?? "Pasniedzējs netika atrasts"}</span>
      </>,
      <>
        <span class="hide-lg">{DAY_LOCALE[lection.day as keyof typeof DAY_LOCALE]}</span>
        <span class="show-lg">{DAY_LOCALE_SHORT[lection.day as keyof typeof DAY_LOCALE_SHORT]}</span>
      </>,
      lection.weekFilter === "even" ? "Pāra nedēļās" :
        lection.weekFilter === "odd" ? "Nepāra nedēļās" :
          Array.isArray(lection.weekFilter) ? `Nedēļās ${lection.weekFilter.join(", ")}` :
            <span class="text-gray">Katru nedēļu</span>,
      TIME_TO_RANGE[lection.time as keyof typeof TIME_TO_RANGE],
      room,
      lection.group ?? "",
      <>
        {
          lection.name in LECTION_LINKS ?
          <button class="btn tooltip tooltip-left hide-xl" data-tooltip={`Atvērt ${lection.name} e-studijās`} on:click={() => window.location.assign(LECTION_LINKS[lection.name as keyof typeof LECTION_LINKS])}><i class="icon icon-link"></i></button> :
          <></>
        }
        <button class="btn show-xl" on:click={() => document.body.appendChild(createLectionModal(lection))}><i class="icon icon-more-vert"></i></button>
      </>,
    ];
  });

  const tableElement = createTable(
    ["Kurss", "Diena", "", "Laiks", "Telpa", "Grupa", ""],
    lections,
    ["", "", "hide-xl", "", "hide-xl", "hide-xl", ""]
  );

  const closeButton = <button class="btn float-right m-1" on:click={onClose}>Aizvērt tabulu <i class="icon icon-cross"></i></button>;

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekID = `${startOfWeek.getFullYear()}${(startOfWeek.getMonth() + 1).toString().padStart(2, "0")}${startOfWeek.getDate().toString().padStart(2, "0")}`;
  const weekOrdinal = WEEK_ORDINALS[weekID as keyof typeof WEEK_ORDINALS];

  return <>
    <p class="mb-1">Šobrīd ir {weekOrdinal}. nedēļa, { weekOrdinal % 2 === 0 ? "pāra" : "nepāra" }</p>
    { onClose ? closeButton : <></> }
    { tableElement }
  </>;
}

export function getLectionKey(lection: Lection): string {
  return `${lection.day}${lection.time.split(":").map(str => str.padStart(2, "0")).join("")}${lection.name}${lection.group ?? ""}`;
}

export function getRoomAndProf(lectionKey: string): { room: string, prof: string } | null {
  if (!(lectionKey in LECTION_ROOMS_PROFS)) return null;

  const [profKey, roomKey] = LECTION_ROOMS_PROFS[lectionKey as keyof typeof LECTION_ROOMS_PROFS];

  return {
    room: ROOMS[roomKey],
    prof: PROFS[profKey],
  };
}