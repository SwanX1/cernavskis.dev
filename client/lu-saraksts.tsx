import { _createElement, _fragment, type ElementAttributes } from "simple-jsx-handler";
import { createTable, localGetOrDefault, removeAllChildren } from "./util";
import { DAY_LOCALE, LECTION_LINKS, LECTION_NAMES, PEOPLE, TIME_TO_RANGE, WEEK_ORDINALS } from "./lu-dati";

interface PersonData {
  id: number;
  name: string;
  stream: string;
  lections: Lection[];
}

interface Lection {
  name: string;
  day: string;
  time: string;
  group?: string;
  weekFilter?: "even" | "odd" | number[];
}

// Perform sanity check
for (const name of Object.keys(PEOPLE)) {
  try {
    parseLine(PEOPLE[name as keyof typeof PEOPLE]);
  } catch (e) {
    console.error("Failed sanity check for name:", name);
  }
}

const input = <input type="text" class="form-input" id="input-data"></input>;
const exportButton = <button class="btn disabled tooltip tooltip-bottom mx-1" data-tooltip={"ICS failu var importēt jebkurā kalendārā\nFunkcija vēl nestrādā :/"}><i class="icon icon-share"></i> Exportēt ICS</button>;
const submit = <button class="btn btn-primary mx-1">Vienkāršot!</button>;
const remember = <input type="checkbox"></input>;
const tableContainer = <div></div> as HTMLDivElement;
const example = <p class="form-input-hint">Ierakstot vārdu, tas parādīsies sarakstā. Jāuzspiež uz viņa, lai tiktu ievadīti (diezgan gari) dati par lekcijām.</p>;

document.addEventListener("DOMContentLoaded", () => {
  remember.checked = localGetOrDefault("shouldRemember", "false") === "true" ? true : false;
  remember.addEventListener("change", () => {
    window.localStorage.setItem("shouldRemember", String(remember.checked));
  });

  if (remember.checked) {
    input.value = localGetOrDefault("rememberedValue", "");
  } else {
    window.localStorage.removeItem("rememberedValue");
  }

  submit.addEventListener("click", () => {
    if (remember.checked) {
      window.localStorage.setItem("rememberedValue", input.value);
    }

    removeAllChildren(tableContainer);
    tableContainer.appendChild(<div>{createDataTable(parseLine(input.value))}</div>);
    example.style.display = "none";
  });

  document.body.appendChild(
    <div class="container p-2 s-rounded">
      <div class="columns">
        <div class="col-7 col-lg-8 col-md-9 col-sm-12 col-mx-auto bg-gray round-edges p-2">
          <h2 class="m-2 text-center">LU Lekciju saraksta vienkāršotājs</h2>

          <div class="form-group float-right tooltip tooltip-bottom" data-tooltip="Pārlādējot šo lapu, ievadītais netiks dzēsts">
            <label class="form-switch">
              { remember }
              <i class="form-icon"></i> Atcerēties mani
            </label>
          </div>


          <div class="form-group form-autocomplete">
            <label for="input-data" class="form-label">
            Ierakstiet savu vārdu<span class="text-gray">, vai ievadiet savu grupas saraksta rindiņu:</span>
            </label>
            <div class="form-autocomplete-input">
              { input }
            </div>
            { createAutocompleteMenu(PEOPLE, input) }
            { example }
            <div class="float-right">
              { exportButton }
              { submit }
            </div>
          </div>

          { tableContainer }

          <footer class="text-center text-gray mt-18">
            Izmantoti tikai publiski resursi no LUDF mājaslapas.<br />
            Autortiesības aizsargātas. &copy; Kārlis Čerņavskis, {new Date().getFullYear()}<br />
            Šī vietne izmanto sīkdatnes tikai tās funkcionalitātei, tās nav konfigurējamas.
          </footer>
        </div>
      </div>
    </div>
  );
});

function parseLine(line: string): PersonData {
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

  return {
    id,
    name,
    stream,
    lections,
  };
}

function createDataTable(data: PersonData): HTMLElement {
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

    let openButton = <></>;
    if (lection.name in LECTION_LINKS) {
      openButton = <button class="btn tooltip tooltip-left" data-tooltip={`Atvērt ${lection.name} e-studijās`}><i class="icon icon-link"></i></button>;
      openButton.addEventListener("click", () => window.location.assign(LECTION_LINKS[lection.name as keyof typeof LECTION_LINKS]));
    }
    

    return [
      <>
        { LECTION_NAMES[lection.name as keyof typeof LECTION_NAMES] }
        {
          lection.name === "DatZB067L" ?
            <InfoTooltip position="right">Kurss sākas tikai ar 4. nedēļu</InfoTooltip> :
          lection.name === "DatZB018" && lection.day === "Pr" ?
            <InfoTooltip position="right">Saraksta kļūda - īstenībā ir otrdienā, plkst. 14:30</InfoTooltip> :
            <></>
        }
      </>,
      DAY_LOCALE[lection.day as keyof typeof DAY_LOCALE],
      lection.weekFilter === "even" ? "Pāra nedēļās" :
        lection.weekFilter === "odd" ? "Nepāra nedēļās" :
          Array.isArray(lection.weekFilter) ? `Nedēļās ${lection.weekFilter.join(", ")}` :
            <span class="text-gray">Katru nedēļu</span>,
      TIME_TO_RANGE[lection.time as keyof typeof TIME_TO_RANGE],
      lection.group ?? "",
      openButton,
    ];
  });

  const tableElement = createTable(["Kurss", "Diena", "", "Laiks", "Grupa", ""], lections);

  const closeButton = <button class="btn float-right m-1">Aizvērt tabulu <i class="icon icon-cross"></i></button>;

  closeButton.addEventListener("click", () => {
    removeAllChildren(tableContainer);
    example.style.display = "block";
  });


  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekID = `${startOfWeek.getFullYear()}${(startOfWeek.getMonth() + 1).toString().padStart(2, "0")}${startOfWeek.getDate().toString().padStart(2, "0")}`;
  const weekOrdinal = WEEK_ORDINALS[weekID as keyof typeof WEEK_ORDINALS];

  return <>
    <p class="mb-1">Lekciju saraksts: { data.name }, { data.stream } plūsma</p>
    { closeButton }
    <p class="text-gray">Šobrīd ir {weekOrdinal}. nedēļa, { weekOrdinal % 2 === 0 ? "pāra" : "nepāra" }</p>
    { tableElement }
  </>;
}

const InfoTooltip = (attrs: ElementAttributes, ...children: Node[]) => {
  if (children.length !== 1) {
    throw new Error("Invalid children count");
  }

  if (typeof children[0] !== "string") {
    throw new Error("Invalid children type");
  }

  const tooltipText = children[0] ?? "";
  const position = attrs.position ?? "top";

  if (position !== "top" && position !== "bottom" && position !== "left" && position !== "right") {
    throw new Error("Invalid position");
  }

  return <>
    <br />
    <span class="text-error">{ tooltipText }</span>
  </>;
};

function createAutocompleteMenu(allStrings: Record<string, string>, input: HTMLInputElement): HTMLElement {
  const ul = <ul class="menu p-absolute"></ul>;
  ul.style.display = "none";

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase().trim();
    removeAllChildren(ul);

    const keys = Object.keys(allStrings);
    const filtered = keys.filter(str => str.toLowerCase().includes(value));
    const sorted = filtered.sort((a, b) => {
      const ai = a.toLowerCase().indexOf(value);
      const bi = b.toLowerCase().indexOf(value);

      if (ai !== bi) {
        return ai - bi;
      }

      return a.localeCompare(b);
    }).slice(0, 5);

    if (sorted.length === 0 || value.length === 0) {
      ul.style.display = "none";
      return;
    }
    
    sorted.forEach(str => {
      const li = <li class="menu-item"></li>;
      const a = <a href="#"><div class="tile tile-centered"></div></a>;
      const tileContent = <div class="tile-content"></div>;
      tileContent.textContent = str;
      a.appendChild(tileContent);
      li.appendChild(a);
      ul.appendChild(li);

      li.addEventListener("click", () => {
        input.value = allStrings[str];
        ul.style.display = "none";
      });
    });

    ul.style.display = "block";
  });

  input.addEventListener("focus", () => {
    if (ul.children.length !== 0) {
      ul.style.display = "block";
    }
  });

  window.addEventListener("click", (e) => {
    if (!ul.contains(e.target as Node) && e.target !== input) {
      ul.style.display = "none";
    }
  });

  return ul;
}

// function createICS(lections: Lection[]): string {
//   let ics = `
//     BEGIN:VCALENDAR
//     VERSION:2.0
//     PRODID:-//cernavskis.dev//LU Lekciju saraksta vienkāršotājs//LV
//   `;

//   const startOfWeek = new Date();
//   startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
//   startOfWeek.setHours(0, 0, 0, 0);

//   for (const lection of lections) {
//     if (!isLectionThisWeek(lection)) continue;

//     const day = ["Pr", "O", "T", "C", "Pk"].findIndex(d => d === lection.day);
//     const time = lection.time.split(":").map(str => parseInt(str));
//     const date = new Date(startOfWeek);
//     date.setDate(date.getDate() + day);
//     date.setHours(time[0], time[1], 0, 0);

//     ics += `BEGIN:VEVENT
// SUMMARY:${LECTION_NAMES[lection.name as keyof typeof LECTION_NAMES]}
// DTSTART:${date.toISOString().slice(0, -5)}Z
// DTEND:${new Date(date.getTime() + 1000 * 60 * 100).toISOString().slice(0, -5)}Z
// DESCRIPTION:Grupa: ${lection.group ?? "Nav norādīts"}
// LOCATION:LU ${getRoom(lection)}
// DESCRIPTION;ENCODING=QUOTED-PRINTABLE:${getProfs(lection).replaceAll("\n", "\n ").replaceAll(",", "\\,")}
// END:VEVENT`;
//   }

//   ics += `END:VCALENDAR`;

//   return ics.trim().replaceAll(/^\s+/, "").replaceAll(/\n+/, "\n");
// }

// function getRoom(lection: Lection): string {
//   const key = `${lection.day}${lection.name}${lection.time}${lection.group ?? ""}`;
//   return ROOMS[key];
// }
