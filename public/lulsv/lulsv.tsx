import { _createElement, _fragment } from "simple-jsx-handler";
import { Calendar, getWeek } from "../components/Calendar";
import { localGetOrDefault, removeAllChildren } from "../util";
import { ExportICSDialog } from "./ExportICSDialog";
import { getPeople, getPerson, MONTH_LOCALE_SHORT } from "./lu-dati";
import { displayTable, isLectionInWeek, parseLine, type PersonData } from "./table-gen";

document.addEventListener("DOMContentLoaded", () => {
  const input = <input type="text" class="form-input" placeholder="Ieraksti savu vārdu"></input>;
  let personData: PersonData | null = null;
  const exportICSDialog = <ExportICSDialog getData={() => personData} />;
  const exportButton = (
    <button
      class="btn tooltip tooltip-left mx-1 disabled"
      data-tooltip={"ICS failu var importēt jebkurā kalendārā"}
      on:click={() => {
        if (exportICSDialog.style.display === "block") {
          exportICSDialog.style.display = "none";
        } else {
          exportICSDialog.style.display = "block";
        }
      }}
    >
      <i class="icon icon-share"></i> Eksportēt ICS
    </button>
  );

  window.addEventListener("click", e => {
    if (!(exportICSDialog.contains(e.target as Node) || exportButton.contains(e.target as Node))) {
      exportICSDialog.style.display = "none";
    }
  });

  const submit = (
    <button class="btn btn-primary input-group-btn mr-1" on:click={showTable}>
      Vienkāršot!
    </button>
  );
  const tableContainer = (<div></div>) as HTMLDivElement;
  const example = (
    <p class="form-input-hint">
      Ierakstot vārdu, tas parādīsies sarakstā.
      <br />
      Jāuzspiež uz viņa, lai vārds būtu precīzs,
      <br />
      jo bez tā nevar atrast datus.
    </p>
  );
  const error = (
    <p class="form-input-hint" style="display: none;">
      Notika kļūda! Paziņojiet par to administratoram!
    </p>
  );

  const calendar = new Calendar(new Date());
  calendar.element.style.display = "none";

  const viewWeekButtonText = <span>Filtrēt nedēļu</span>;

  const viewWeekButton = (
    <div class="float-left">
      {calendar.element}
      <button class="btn mr-2" on:click={() => (calendar.element.style.display = "block")}>
        <i class="icon icon-time"></i>&nbsp;{viewWeekButtonText}
      </button>
    </div>
  );

  window.addEventListener("click", e => {
    if (!(viewWeekButton.contains(e.target as Node) || calendar.element.contains(e.target as Node))) {
      calendar.element.style.display = "none";
    }
  });

  calendar.onFocus(date => date.element.querySelector("button")!.blur());

  let rangeStart: Date | null = null;
  function showRange(): void {
    if (rangeStart === null) return;
    const weekStart = getWeek(rangeStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    calendar.setSelectedRange(weekStart, weekEnd);

    calendar.element.style.display = "none";

    viewWeekButtonText.textContent = `${weekStart.getDate()}. ${MONTH_LOCALE_SHORT[weekStart.getMonth()]} - ${weekEnd.getDate()}. ${MONTH_LOCALE_SHORT[weekEnd.getMonth()]}`;
  }

  calendar.onClick((date, event) => {
    rangeStart = date.date;
    showRange();
    showTable();
  });

  calendar.onChange(() => {
    showRange();
    calendar.element.style.display = "block";
  });

  async function showTable() {
    error.style.display = "none";
    input.classList.remove("is-error");

    exportButton.classList.add("disabled");
    try {
      window.localStorage.setItem("rememberedValue", input.value);

      const dataLine = await getPerson(input.value);

      if (dataLine === null) {
        throw new Error("No data found for name: " + input.value);
      }

      personData = parseLine(dataLine);
      displayTable(tableContainer, personData, lection => rangeStart === null || isLectionInWeek(rangeStart, lection));

      exportButton.classList.remove("disabled");
      example.style.display = "none";
    } catch (e) {
      console.error("Error while doing the main shit", e);
      error.style.display = "block";
      input.classList.add("is-error");
    }
  }

  {
    // Backwards compat
    let cachedValue = localGetOrDefault("rememberedValue", "");
    if (/^\d/.test(cachedValue)) {
      cachedValue = cachedValue
        .slice(cachedValue.indexOf(" "), Math.max(cachedValue.indexOf(" I "), cachedValue.indexOf(" II ")))
        .trim();
    }
    input.value = cachedValue;
  }

  showTable();

  document.body.appendChild(
    <div class="container p-2 s-rounded">
      <div class="columns">
        <div class="col-7 col-lg-8 col-md-9 col-sm-12 col-mx-auto bg-gray round-edges p-2">
          <h2 class="m-2 text-center">LU Lekciju saraksta vienkāršotājs</h2>

          <div class="form-group form-autocomplete">
            <div class="form-autocomplete-input">
              <div class="input-group">
                {input}
                {submit}
              </div>
              {error}
            </div>
            {createAutocompleteMenu(getPeople(), input)}
            {viewWeekButton}
            <div class="float-right">
              {exportICSDialog}
              {exportButton}
            </div>
            {example}
          </div>

          {tableContainer}

          <footer class="text-center text-gray mt-18">
            Izmantoti tikai publiski resursi no LUDF mājaslapas.
            <br />
            Autortiesības aizsargātas. &copy; Kārlis Čerņavskis, {new Date().getFullYear()}
            <br />
            Šī vietne izmanto sīkdatnes tikai tās funkcionalitātei, tās nav konfigurējamas.
          </footer>
        </div>
      </div>
    </div>
  );
});

function createAutocompleteMenu(data: Promise<string[]>, input: HTMLInputElement): HTMLElement {
  const ul = <ul class="menu p-absolute"></ul>;
  ul.style.display = "none";

  input.addEventListener("input", async () => {
    const value = input.value.toLowerCase().trim();
    removeAllChildren(ul);

    const keys = await data;
    const filtered = keys.filter(str => str.toLowerCase().includes(value));
    const sorted = filtered
      .sort((a, b) => {
        const ai = a.toLowerCase().indexOf(value);
        const bi = b.toLowerCase().indexOf(value);

        if (ai !== bi) {
          return ai - bi;
        }

        return a.localeCompare(b);
      })
      .slice(0, 5);

    if (sorted.length === 0 || value.length === 0) {
      ul.style.display = "none";
      return;
    }

    sorted.forEach(str => {
      const li = (
        <li
          class="menu-item"
          on:click={() => {
            input.value = str;
            ul.style.display = "none";
          }}
        >
          <a href="#">
            <div class="tile tile-centered">
              <div class="tile-content">{str}</div>
            </div>
          </a>
        </li>
      );

      ul.appendChild(li);
    });

    ul.style.display = "block";
  });

  input.addEventListener("focus", () => {
    if (ul.children.length !== 0) {
      ul.style.display = "block";
    }
  });

  window.addEventListener("click", e => {
    if (!ul.contains(e.target as Node) && e.target !== input) {
      ul.style.display = "none";
    }
  });

  return ul;
}

// Leave this here in case we need to do some sanity checks
async function performSanityCheck(): Promise<void> {
  const PEOPLE = await getPeople();
  // Perform sanity check
  for (const name of PEOPLE) {
    const line = await getPerson(name);
    if (line === null) {
      console.error("Failed to get data for name:", name);
      continue;
    }
    try {
      parseLine(line);
    } catch (e) {
      console.error("Failed sanity check for name:", name);
    }
  }
}

// @ts-expect-error i cba to make a global declaration
window.performSanityCheck = performSanityCheck;

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
