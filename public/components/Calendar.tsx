import { _createElement, _fragment } from "simple-jsx-handler";
import { removeAllChildren } from "../util";

export function getMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

export function getWeek(date: Date): Date {
  const startOfWeek = new Date(date);
  // Sunday is 0. Stupid americans
  startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
}

export function getMonthDaysWithFullWeeks(date: Date): Date[] {
  const monthStart = getMonth(date);

  const days: Date[] = [];
  do {
    let nextWeek = days[days.length - 1];
    if (!nextWeek) {
      nextWeek = getWeek(monthStart);
    } else {
      nextWeek = new Date(nextWeek);
      nextWeek.setDate(nextWeek.getDate() + 7);
    }
    days.push(...getWeekDays(nextWeek));
  } while (days[days.length - 1].getMonth() === monthStart.getMonth());

  return days;
}

export function isNextMonth(date: Date, month: Date): boolean {
  return date.getFullYear() > month.getFullYear() || date.getMonth() > month.getMonth();
}

export function isPrevMonth(date: Date, month: Date): boolean {
  return date.getFullYear() < month.getFullYear() || date.getMonth() < month.getMonth();
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getWeekDays(date: Date): Date[] {
  const startOfWeek = getWeek(date);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    days.push(day);
  }

  return days;
}

function createCalendarDateEventTarget(): {
  addEventListener: (eventName: string, listener: (e: CalendarDateEvent) => void) => void;
  dispatchEvent: (eventName: string, event: CalendarDateEvent) => void;
} {
  const listeners: Record<string, ((e: CalendarDateEvent) => void)[]> = {};

  return {
    addEventListener: (eventName, listener) => {
      if (!listeners[eventName]) {
        listeners[eventName] = [];
      }
      listeners[eventName].push(listener);
    },
    dispatchEvent: (eventName, event) => {
      if (listeners[eventName]) {
        listeners[eventName].forEach(listener => listener(event));
      }
    },
  };
}

export interface CalendarDateEvent extends MouseEvent {
  calendarDate: CalendarDate;
}

export class CalendarDate {
  public constructor(
    public readonly date: Date,
    public readonly element: HTMLElement,
    public readonly eventTarget = createCalendarDateEventTarget()
  ) {
    element.addEventListener("click", e => {
      (e as CalendarDateEvent).calendarDate = this;
      this.eventTarget.dispatchEvent("click", e as CalendarDateEvent);
    });
    element.children[0].addEventListener("focus", e => {
      (e as CalendarDateEvent).calendarDate = this;
      this.eventTarget.dispatchEvent("focus", e as CalendarDateEvent);
    });
    element.addEventListener("mouseenter", e => {
      (e as CalendarDateEvent).calendarDate = this;
      this.eventTarget.dispatchEvent("mouseenter", e as CalendarDateEvent);
    });
    element.addEventListener("mouseleave", e => {
      (e as CalendarDateEvent).calendarDate = this;
      this.eventTarget.dispatchEvent("mouseleave", e as CalendarDateEvent);
    });
  }
}

export class Calendar {
  public readonly element: HTMLElement;
  private readonly calendarBody: HTMLElement;
  private readonly calendarHeader: HTMLElement;
  private readonly calendarFooter: HTMLElement;
  private selectedRange: [CalendarDate, CalendarDate] | null = null;
  private displayedDateItems: CalendarDate[] = [];
  private eventTarget = createCalendarDateEventTarget();

  public constructor(private currentMonth: Date) {
    this.calendarBody = <div class="calendar-body"></div>;
    this.calendarHeader = <div class="navbar-primary text-center text-nowrap"></div>;
    this.calendarFooter = <div class="calendar-footer"></div>;

    this.element = (
      <div class="calendar p-absolute bg-light" style="z-index: 1;">
        <div class="calendar-nav navbar flex-nowrap">
          <button
            class="btn btn-action btn-link btn-lg"
            on:click={() => {
              const newDate = new Date(this.currentMonth);
              newDate.setMonth(newDate.getMonth() - 1);
              this.setCurrentMonth(newDate);
            }}
          >
            <i class="icon icon-arrow-left"></i>
          </button>
          {this.calendarHeader}
          <button
            class="btn btn-action btn-link btn-lg"
            on:click={() => {
              const newDate = new Date(this.currentMonth);
              newDate.setMonth(newDate.getMonth() + 1);
              this.setCurrentMonth(newDate);
            }}
          >
            <i class="icon icon-arrow-right"></i>
          </button>
        </div>

        <div class="calendar-container">
          <div class="calendar-header">
            <div class="calendar-date">Pr</div>
            <div class="calendar-date">O</div>
            <div class="calendar-date">Tr</div>
            <div class="calendar-date">Ce</div>
            <div class="calendar-date">Pk</div>
            <div class="calendar-date">Se</div>
            <div class="calendar-date">Sv</div>
          </div>

          {this.calendarBody}
          {this.calendarFooter}
        </div>
      </div>
    );

    this.setCurrentMonth(currentMonth);
  }

  public getCalendarDate(date: Date): CalendarDate | null {
    for (const calendarDate of this.displayedDateItems) {
      if (isSameDay(calendarDate.date, date)) {
        return calendarDate;
      }
    }
    return null;
  }

  public setSelectedRange(from: Date, to: Date): void {
    this.selectedRange = [from, to].sort((a, b) => a.getTime() - b.getTime()).map(date => this.getCalendarDate(date)) as [CalendarDate, CalendarDate];

    if (this.displayedDateItems[0].date.getTime() > to.getTime() || this.displayedDateItems[this.displayedDateItems.length - 1].date.getTime() < from.getTime()) {
      return; // Display is out of range
    }

    console.log("setSelectedRange", { from, to });

    for (const date of this.displayedDateItems) {
      date.element.classList.remove("calendar-range");
      date.element.classList.remove("range-start");
      date.element.classList.remove("range-end");
    }

    let fromIndex = this.displayedDateItems.indexOf(this.selectedRange[0]);
    let toIndex = this.displayedDateItems.indexOf(this.selectedRange[1]);

    if (fromIndex === -1) {
      fromIndex = -Infinity;
    }

    if (toIndex === -1) {
      toIndex = Infinity;
    }

    for (let i = 0; i < this.displayedDateItems.length; i++) {
      const date = this.displayedDateItems[i];

      if (fromIndex <= i && i <= toIndex) {
        console.log("range", { fromIndex, toIndex, i, date: date.date.toDateString() });
        date.element.classList.add("calendar-range");
      } else {
        date.element.classList.remove("calendar-range");
      }
      
      if (i === fromIndex) {
        console.log("start", { fromIndex, toIndex, i, date: date.date.toDateString() });
        date.element.classList.add("range-start");
      }
      
      if (i === toIndex) {
        console.log("end", { fromIndex, toIndex, i, date: date.date.toDateString() });
        date.element.classList.add("range-end");
      }
    }
  }

  public getSelectedRange(): [CalendarDate, CalendarDate] | null {
    return this.selectedRange;
  }

  public setCurrentMonth(date: Date): void {
    this.currentMonth = date;

    const monthName = [
      "Janvāris",
      "Februāris",
      "Marts",
      "Aprīlis",
      "Maijs",
      "Jūnijs",
      "Jūlijs",
      "Augusts",
      "Septembris",
      "Oktobris",
      "Novembris",
      "Decembris",
    ][date.getMonth()];
    const year = date.getFullYear();

    this.displayedDateItems = getMonthDaysWithFullWeeks(this.currentMonth).map(day => {
      const element = (
        <div
          class={
            "calendar-date" +
            (isNextMonth(day, this.currentMonth)
              ? " next-month"
              : isPrevMonth(day, this.currentMonth)
                ? " prev-month"
                : "")
          }
        >
          <button class={"date-item" + (isSameDay(new Date(), day) ? " date-today" : "")}>{day.getDate()}</button>
        </div>
      );

      return new CalendarDate(day, element, this.eventTarget);
    });

    removeAllChildren(this.calendarBody);
    for (const date of this.displayedDateItems) {
      this.calendarBody.appendChild(date.element);
    }

    this.calendarHeader.innerText = `${monthName} ${year}`;

    this.eventTarget.dispatchEvent("change", {} as CalendarDateEvent);
  }

  public getCurrentMonth(): Date {
    return this.currentMonth;
  }

  public isDateVisible(date: Date): boolean {
    return false;
  }

  public appendInFooter(element: HTMLElement): void {
    this.calendarFooter.appendChild(element);
  }

  public onHover(listener: (date: CalendarDate, event: CalendarDateEvent) => void): void {
    this.eventTarget.addEventListener("mouseenter", e => listener(e.calendarDate, e));
  }

  public onUnhover(listener: (date: CalendarDate, event: CalendarDateEvent) => void): void {
    this.eventTarget.addEventListener("mouseleave", e => listener(e.calendarDate, e));
  }

  public onClick(listener: (date: CalendarDate, event: CalendarDateEvent) => void): void {
    this.eventTarget.addEventListener("click", e => listener(e.calendarDate, e));
  }

  public onFocus(listener: (date: CalendarDate, event: CalendarDateEvent) => void): void {
    this.eventTarget.addEventListener("focus", e => listener(e.calendarDate, e));
  }

  public onChange(listener: (date: CalendarDate, event: CalendarDateEvent) => void): void {
    this.eventTarget.addEventListener("change", e => listener(e.calendarDate, e));
  }
}
