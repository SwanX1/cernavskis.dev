import { _createElement, _fragment } from "simple-jsx-handler";

export function localGetOrDefault(key: string, defaultValue: string): string {
  let current = window.localStorage.getItem(key);
  if (current === null) {
    window.localStorage.setItem(key, defaultValue);
    current = defaultValue;
  }
  return current;
}

export function createTable(headers: (string | HTMLElement)[], entries: (string | HTMLElement)[][]): HTMLElement {
  const headerRow = <tr></tr>;
  for (const header of headers) {
    headerRow.appendChild(<th>{ header }</th>);
  }

  const tableBody = <tbody></tbody>;

  for (const row of entries) {
    const rowElement = <tr></tr>;
    for (const cell of row) {
      rowElement.appendChild(<td>{ cell }</td>);
    }
    tableBody.appendChild(rowElement);
  }

  return <table class="table">
    <thead>
      { headerRow }
    </thead>
    { tableBody }
  </table>;
}

export function removeAllChildren(element: Node): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
