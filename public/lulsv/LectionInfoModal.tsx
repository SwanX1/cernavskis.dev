import { _createElement, _fragment } from "simple-jsx-handler";
import { COURSE_NAMES, DAY_LOCALE_LOCATIVE, TIME_TO_RANGE } from "./lu-dati";
import { type Groups, type Lecture } from "./table-gen";

export function createLectureModal(lecture: Lecture, groups: Groups): HTMLElement {
  function closeModal(): void {
    modal.parentNode?.removeChild(modal);
  }

  const { room, professor } = lecture;
  const weekFilter = lecture.groups.find(([group, week]) => groups.includes(group))?.[1];
  const groupFilter = lecture.groups.find(([group, week]) => groups.includes(group))?.[0];

  const modal: HTMLElement = (
    <div class="modal active mw-100">
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <button class="btn btn-link float-right" on:click={closeModal}>
            <i class="icon icon-cross"></i>
          </button>
          <div class="modal-title h5">{COURSE_NAMES[lecture.course as keyof typeof COURSE_NAMES]}</div>
        </div>
        <div class="modal-body py-0">
          <div class="content">
            <table class="table table-striped">
              <thead></thead>
              <tbody>
                <tr>
                  <td>Diena</td>
                  <td>
                    {DAY_LOCALE_LOCATIVE[lecture.day as keyof typeof DAY_LOCALE_LOCATIVE]},{" "}
                    {weekFilter === "even"
                      ? "Pāra nedēļās"
                      : weekFilter === "odd"
                        ? "Nepāra nedēļās"
                        : Array.isArray(weekFilter)
                          ? `Nedēļās ${weekFilter.map(num => `${num}.`).join(", ")}`
                          : "Katru nedēļu"}
                    , {TIME_TO_RANGE[lecture.time as keyof typeof TIME_TO_RANGE]}
                  </td>
                </tr>
                <tr>
                  <td>Pasniedzējs</td>
                  <td>{professor ?? "Pasniedzējs netika atrasts"}</td>
                </tr>
                <tr>
                  <td>Telpa</td>
                  <td>{room}</td>
                </tr>
                {groupFilter ? (
                  <tr>
                    <td>Plūsma / Grupa</td>
                    <td>{groupFilter}</td>
                  </tr>
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return modal;
}
