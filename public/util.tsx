import { _createElement, _fragment } from "simple-jsx-handler";

export function localGetOrDefault(key: string, defaultValue: string): string {
  let current = window.localStorage.getItem(key);
  if (current === null) {
    window.localStorage.setItem(key, defaultValue);
    current = defaultValue;
  }
  return current;
}

export function createTable(
  headers: (string | HTMLElement)[],
  entries: (string | HTMLElement)[][],
  columnClasses?: (string | undefined)[]
): HTMLElement {
  if (typeof columnClasses === "undefined") {
    columnClasses = Array(headers.length).fill(undefined);
  }

  return (
    <table class="table">
      <thead>
        <tr>{...headers.map((header, i) => <th class={columnClasses[i] ?? ""}>{header}</th>)}</tr>
      </thead>
      <tbody>
        {...entries.map((row, i) => <tr>{...row.map((cell, i) => <td class={columnClasses[i] ?? ""}>{cell}</td>)}</tr>)}
      </tbody>
    </table>
  );
}

export function removeAllChildren(element: Node): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
