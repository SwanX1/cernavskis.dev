import { _createElement, _fragment } from "simple-jsx-handler";
import { getPeople } from "./lu-dati";
import { displayTable, parseLine } from "./table-gen";
import { localGetOrDefault, removeAllChildren } from "./util";

performSanityCheck();

document.addEventListener("DOMContentLoaded", () => {
  const input = <input type="text" class="form-input" id="input-data"></input>;
  const exportButton = <button class="btn disabled tooltip tooltip-bottom mx-1" data-tooltip={"ICS failu var importēt jebkurā kalendārā\nFunkcija vēl nestrādā :/"}><i class="icon icon-share"></i> Exportēt ICS</button>;
  const submit = <button class="btn btn-primary input-group-btn mr-1" on:click={showTable}>Vienkāršot!</button>;
  const tableContainer = <div></div> as HTMLDivElement;
  const example = <p class="form-input-hint">Ierakstot vārdu, tas parādīsies sarakstā.<br />Jāuzspiež uz viņa, lai vārds būtu precīzs,<br />jo bez tā nevar atrast datus.</p>;
  const error = <p class="form-input-hint" style="display: none;">Notika kļūda! Paziņojiet par to administratoram!</p>;

  async function showTable() {
    error.style.display = "none";
    input.classList.remove("is-error");

    try {
      window.localStorage.setItem("rememberedValue", input.value);

      const dataLine = (await getPeople())[input.value];

      if (!dataLine) {
        throw new Error("No data found for name: " + input.value);
      }
  
      displayTable(tableContainer, parseLine(dataLine), () => {
        removeAllChildren(tableContainer);
        example.style.display = "block";
      });
      example.style.display = "none";
    } catch (e) {
      console.error("Error while doing the main shit", e);
      error.style.display = "block";
      input.classList.add("is-error");
    }
  }

  { // Backwards compat
    let cachedValue = localGetOrDefault("rememberedValue", "");
    if (/^\d/.test(cachedValue)) {
      cachedValue = cachedValue.slice(
        cachedValue.indexOf(" "),
        Math.max(
          cachedValue.indexOf(" I "),
          cachedValue.indexOf(" II "),
        )
      ).trim();
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
                <label for="input-data" class="form-label input-group-addon">
                Ierakstiet savu vārdu:
                </label>
                { input }
                { submit }
              </div>
              { error }
            </div>
            { createAutocompleteMenu(getPeople().then(obj => Object.keys(obj)), input) }
            <div class="float-right">
              { exportButton }
            </div>
            { example }
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

function createAutocompleteMenu(data: Promise<string[]>, input: HTMLInputElement): HTMLElement {
  const ul = <ul class="menu p-absolute"></ul>;
  ul.style.display = "none";

  input.addEventListener("input", async () => {
    const value = input.value.toLowerCase().trim();
    removeAllChildren(ul);

    const keys = await data;
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
      const li = <li class="menu-item" on:click={() => {
        input.value = str;
        ul.style.display = "none";
      }}>
        <a href="#">
          <div class="tile tile-centered">
            <div class="tile-content">{ str }</div>
          </div>
        </a>
      </li>;

      ul.appendChild(li);
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

async function performSanityCheck(): Promise<void> {
  const PEOPLE = await getPeople();
  // Perform sanity check
  for (const name of Object.keys(PEOPLE)) {
    try {
      parseLine(PEOPLE[name as keyof typeof PEOPLE]);
    } catch (e) {
      console.error("Failed sanity check for name:", name);
    }
  }
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
