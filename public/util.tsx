import { _createElement, _fragment } from "simple-jsx-handler";

export function localGetOrDefault(key: string, defaultValue: string): string {
  let current = window.localStorage.getItem(key);
  if (current === null) {
    window.localStorage.setItem(key, defaultValue);
    current = defaultValue;
  }
  return current;
}

export function createTable(headers: (string | HTMLElement)[], entries: (string | HTMLElement)[][], columnClasses?: (string | undefined)[]): HTMLElement {
  if (typeof columnClasses === "undefined") {
    columnClasses = Array(headers.length).fill(undefined);
  }
  
  const headerRow = <tr></tr>;
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    headerRow.appendChild(<th class={columnClasses[i] ?? ""}>{ header }</th>);
  }

  const tableBody = <tbody></tbody>;

  for (const row of entries) {
    const rowElement = <tr></tr>;
    for (let i = 0; i < row.length; i++) {
      const cell = row[i];
      rowElement.appendChild(<td class={columnClasses[i] ?? ""}>{ cell }</td>);
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
