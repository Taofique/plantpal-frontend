import { useMemo, useState } from "react";
import type { TActivity } from "../types/activity";

type ModernMonthCalendarProps = {
  selected?: Date | null;
  onSelect: (date: Date) => void;
  weekStartsOn?: 0 | 1;
  className?: string;
  activities?: TActivity[];
};

const DAY_LABELS_SUN_FIRST = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_LABELS_MON_FIRST = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isToday(d: Date) {
  return isSameDay(d, new Date());
}

export default function ModernMonthCalendar({
  selected = null,
  onSelect,
  weekStartsOn = 0,
  className = "",
  activities = [],
}: ModernMonthCalendarProps) {
  // Any date within the visible month
  const [cursor, setCursor] = useState<Date>(selected ?? new Date());

  const {
    gridDays, // 42 Date cells (6 weeks)
    monthLabel, // "August 2025"
    dayLabels, // ["Sun","Mon",...]
  } = useMemo(() => {
    const monthStart = startOfMonth(cursor);
    const monthEnd = endOfMonth(cursor);
    const daysInMonth = monthEnd.getDate();

    // Offset for leading blanks depending on week start
    const rawStartIndex = monthStart.getDay(); // 0..6 (Sun..Sat)
    const startIndex =
      weekStartsOn === 0 ? rawStartIndex : (rawStartIndex - 1 + 7) % 7; // shift if Monday-start

    // Build array of 42 dates (6 rows * 7 cols)
    const cells: Date[] = [];

    // Leading days from prev month
    for (let i = startIndex; i > 0; i--) {
      cells.push(
        new Date(monthStart.getFullYear(), monthStart.getMonth(), 1 - i)
      );
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), i));
    }
    // Trailing days from next month
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1];
      cells.push(
        new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1)
      );
    }
    // Ensure 6 full weeks (Google-like fixed height)
    while (cells.length < 42) {
      const last = cells[cells.length - 1];
      cells.push(
        new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1)
      );
    }

    const monthLabel = cursor.toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    });

    const dayLabels =
      weekStartsOn === 0 ? DAY_LABELS_SUN_FIRST : DAY_LABELS_MON_FIRST;

    return { gridDays: cells, monthLabel, dayLabels };
  }, [cursor, weekStartsOn]);

  const goPrev = () =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const goNext = () =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  const goToday = () => setCursor(new Date());

  const monthIndex = cursor.getMonth();

  return (
    <div
      className={`w-full rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-gray-100 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-5">
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-semibold text-gray-900">
            {monthLabel}
          </span>
          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            {new Date().toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="h-9 w-9 rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            onClick={goToday}
            className="hidden sm:inline-flex px-3 h-9 rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
          >
            Today
          </button>
          <button
            onClick={goNext}
            className="h-9 w-9 rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 text-center text-xs md:text-sm text-gray-500 px-2 md:px-4">
        {dayLabels.map((d) => (
          <div key={d} className="py-2 font-medium select-none">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 p-2 md:p-4">
        {gridDays.map((d, i) => {
          const inCurrentMonth = d.getMonth() === monthIndex;
          const selectedLike = selected && isSameDay(d, selected);
          const todayLike = isToday(d);

          return (
            <button
              key={d.toISOString() + i}
              onClick={() => onSelect(d)}
              className={[
                "aspect-square w-full rounded-xl border text-left p-2 md:p-3",
                "transition shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
                inCurrentMonth
                  ? "bg-white border-gray-200"
                  : "bg-gray-50 border-gray-100 text-gray-400",
                selectedLike
                  ? "ring-2 ring-emerald-500 border-emerald-300"
                  : "",
              ].join(" ")}
              aria-current={todayLike ? "date" : undefined}
              aria-selected={selectedLike || undefined}
            >
              <div className="flex items-center justify-between">
                <span
                  className={[
                    "text-sm md:text-base font-medium",
                    inCurrentMonth ? "text-gray-900" : "text-gray-400",
                  ].join(" ")}
                >
                  {d.getDate()}
                </span>

                {todayLike && (
                  <span className="text-[10px] md:text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    today
                  </span>
                )}
              </div>
              {/* Mini slot where you can later show dots/labels for activities */}

              {/* Activities inside each box */}
              <div className="mt-2 flex flex-col gap-0.5">
                {/**
                 * Filter activities for this exact day (local compare)
                 * and show up to 3. Completed items use completedAt != null.
                 */}
                {activities
                  ?.filter((a) => isSameDay(new Date(a.dueAt), d))
                  .slice(0, 3)
                  .map((a) => {
                    const completed = Boolean(a.completedAt);
                    return (
                      <span
                        key={a.id}
                        className={`truncate text-[10px] md:text-xs px-1 rounded ${
                          completed
                            ? "line-through text-gray-400 bg-gray-50"
                            : "text-emerald-700 bg-emerald-50"
                        }`}
                        title={`${a.title} — ${a.type}`}
                      >
                        {a.title}
                      </span>
                    );
                  })}

                {/* "+ n more" indicator if there are more than 3 */}
                {(() => {
                  const dayCount =
                    activities?.filter((a) => isSameDay(new Date(a.dueAt), d))
                      .length || 0;
                  const more = Math.max(0, dayCount - 3);
                  if (more > 0) {
                    return (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // don't trigger date click twice
                          onSelect(d); // reuse onSelect to open modal/list for this date
                        }}
                        className="text-[11px] text-gray-500 hover:underline mt-1"
                      >
                        +{more} more
                      </button>
                    );
                  }
                  return null;
                })()}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
