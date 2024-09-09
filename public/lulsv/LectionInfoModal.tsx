import { _createElement, _fragment } from "simple-jsx-handler";
import { DAY_LOCALE_LOCATIVE, LECTION_LINKS, LECTION_NAMES, TIME_TO_RANGE } from "./lu-dati";
import { getLectionKey, getRoomAndProf, type Lection } from "./table-gen";

export function createLectionModal(lection: Lection): HTMLElement {
  function closeModal(): void {
    modal.parentNode?.removeChild(modal);
  }

  let { room, prof } = getRoomAndProf(getLectionKey(lection)) ?? { room: null, prof: null };

  if (!room) {
    room = <span class="text-error">ERROR</span>;
    console.error("No room found for lection " + getLectionKey(lection), lection);
  } else {
    room = room.replace(". telpa", "").replace("aud.", "auditorija").trim();
  }

  if (!prof) {
    console.error("No prof found for lection " + getLectionKey(lection), lection);
  }

  const modal: HTMLElement = (
    <div class="modal active mw-100">
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <button class="btn btn-link float-right" on:click={closeModal}>
            <i class="icon icon-cross"></i>
          </button>
          <div class="modal-title h5">{LECTION_NAMES[lection.name as keyof typeof LECTION_NAMES]}</div>
        </div>
        <div class="modal-body py-0">
          <div class="content">
            {lection.name === "DatZB067L" ? (
              <span class="text-error">
                Kurss sākas tikai ar 4. nedēļu
                <br />
              </span>
            ) : (
              <></>
            )}
            <table class="table table-striped">
              <thead></thead>
              <tbody>
                <tr>
                  <td>Diena</td>
                  <td>
                    {DAY_LOCALE_LOCATIVE[lection.day as keyof typeof DAY_LOCALE_LOCATIVE]},{" "}
                    {lection.weekFilter === "even"
                      ? "Pāra nedēļās"
                      : lection.weekFilter === "odd"
                        ? "Nepāra nedēļās"
                        : Array.isArray(lection.weekFilter)
                          ? `Nedēļās ${lection.weekFilter.map(num => `${num}.`).join(", ")}`
                          : "Katru nedēļu"}
                    , {TIME_TO_RANGE[lection.time as keyof typeof TIME_TO_RANGE]}
                  </td>
                </tr>
                <tr>
                  <td>Pasniedzējs</td>
                  <td>{prof ?? "Pasniedzējs netika atrasts"}</td>
                </tr>
                <tr>
                  <td>Telpa</td>
                  <td>{room}</td>
                </tr>
                <tr>
                  <td>Plūsma{lection.group ? " / Grupa" : ""}</td>
                  <td>{`${lection.person.stream} plūsma${lection.group ? `, ${lection.group}${/[0-9]$/.test(lection.group) ? "." : ""} grupa` : ""}`}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          {lection.name in LECTION_LINKS ? (
            <button
              class="btn"
              on:click={() => window.location.assign(LECTION_LINKS[lection.name as keyof typeof LECTION_LINKS])}
            >
              <i class="icon icon-link"></i> Atvērt e-studijās
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );

  return modal;
}
