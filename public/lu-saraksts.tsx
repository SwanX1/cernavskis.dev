import { _createElement, _fragment, type ElementAttributes } from "simple-jsx-handler";
import { getPeople } from "./lu-dati";
import { displayTable, parseLine } from "./table-gen";
import { localGetOrDefault, removeAllChildren } from "./util";

console.log("HI!");

performSanityCheck();

const input = <input type="text" class="form-input" id="input-data"></input>;
const exportButton = <button class="btn disabled tooltip tooltip-bottom mx-1" data-tooltip={"ICS failu var importēt jebkurā kalendārā\nFunkcija vēl nestrādā :/"}><i class="icon icon-share"></i> Exportēt ICS</button>;
const submit = <button class="btn btn-primary mx-1">Vienkāršot!</button>;
const remember = <input type="checkbox"></input>;
const tableContainer = <div></div> as HTMLDivElement;
const example = <p class="form-input-hint">Ierakstot vārdu, tas parādīsies sarakstā. Jāuzspiež uz viņa, lai tiktu ievadīti (diezgan gari) dati par lekcijām.</p>;
const error = <p class="form-input-hint" style="display: none;">Notika kļūda! Paziņojiet par to administratoram!</p>;

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
    error.style.display = "none";
    input.classList.remove("is-error");

    try {
      if (remember.checked) {
        window.localStorage.setItem("rememberedValue", input.value);
      }
  
      displayTable(tableContainer, parseLine(input.value), () => {
        removeAllChildren(tableContainer);
        example.style.display = "block";
      });
      example.style.display = "none";
    } catch (e) {
      console.error("Error while doing the main shit", e);
      error.style.display = "block";
      input.classList.add("is-error");
    }
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
              { error }
            </div>
            { createAutocompleteMenu(getPeople(), input) }
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

function createAutocompleteMenu(fetched: Promise<Record<string, string>>, input: HTMLInputElement): HTMLElement {
  const ul = <ul class="menu p-absolute"></ul>;
  ul.style.display = "none";

  input.addEventListener("input", async () => {
    const allStrings = await fetched;
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
