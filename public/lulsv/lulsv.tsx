import { _createElement, _fragment } from "simple-jsx-handler";
import { Calendar, getWeek } from "../components/Calendar";
import { localGetOrDefault, removeAllChildren } from "../util";
import { ExportICSDialog } from "./ExportICSDialog";
import { MONTH_LOCALE_SHORT } from "./lu-dati";
import { displayTable, type Groups } from "./table-gen";

document.addEventListener("DOMContentLoaded", () => {
  const input: HTMLInputElement = <input type="text" class="form-input" placeholder="Ieraksti plūsmu un grupas (ar komatu atdalītas)"></input>;
  let personData: Groups | null = null;
  // const exportICSDialog = <ExportICSDialog getData={() => personData} />;
  const exportButton = (
    <button
      class="btn tooltip tooltip-left mx-1 disabled"
      data-tooltip={"ICS failu var importēt jebkurā kalendārā"}
      on:click={() => {
        // if (exportICSDialog.style.display === "block") {
        //   exportICSDialog.style.display = "none";
        // } else {
        //   exportICSDialog.style.display = "block";
        // }
      }}
    >
      <i class="icon icon-share"></i> Eksportēt ICS
    </button>
  );

  // window.addEventListener("click", e => {
  //   if (!(exportICSDialog.contains(e.target as Node) || exportButton.contains(e.target as Node))) {
  //     exportICSDialog.style.display = "none";
  //   }
  // });

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

  // const calendar = new Calendar(new Date());
  // calendar.element.style.display = "none";

  const viewWeekButtonText = <span>Filtrēt nedēļu</span>;

  const viewWeekButton = (
    <div class="float-left">
      {/* {calendar.element} */}
      <button class="btn mr-2 disabled"> {/*on:click={() => (calendar.element.style.display = "block")}*/}
        <i class="icon icon-time"></i>&nbsp;{viewWeekButtonText}
      </button>
    </div>
  );

  // window.addEventListener("click", e => {
  //   if (!(viewWeekButton.contains(e.target as Node) || calendar.element.contains(e.target as Node))) {
  //     calendar.element.style.display = "none";
  //   }
  // });

  // calendar.onFocus(date => date.element.querySelector("button")!.blur());

  let rangeStart: Date | null = null;
  function showRange(): void {
    if (rangeStart === null) return;
    const weekStart = getWeek(rangeStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // calendar.setSelectedRange(weekStart, weekEnd);

    // calendar.element.style.display = "none";

    viewWeekButtonText.textContent = `${weekStart.getDate()}. ${MONTH_LOCALE_SHORT[weekStart.getMonth()]} - ${weekEnd.getDate()}. ${MONTH_LOCALE_SHORT[weekEnd.getMonth()]}`;
  }

  // calendar.onClick((date, event) => {
  //   rangeStart = date.date;
  //   showRange();
  //   showTable();
  // });

  // calendar.onChange(() => {
  //   showRange();
  //   calendar.element.style.display = "block";
  // });

  async function showTable() {
    error.style.display = "none";
    input.classList.remove("is-error");

    exportButton.classList.add("disabled");
    try {
      window.localStorage.setItem("rememberedValue2", input.value);

      displayTable(tableContainer, input.value.split(",").map(str => str.trim()));

      // exportButton.classList.remove("disabled");
      example.style.display = "none";
    } catch (e) {
      console.error("Error while doing the main shit", e);
      error.style.display = "block";
      input.classList.add("is-error");
    }
  }

  {
    let cachedValue = localGetOrDefault("rememberedValue2", "");
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
            {viewWeekButton}
            <div class="float-right">
              {/* {exportICSDialog} */}
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
