"use client";

import { useGame } from "./GameProvider";

export default function Toasts() {
  const { toasts, dismiss } = useGame();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} type="button" className={`toast toast-${t.kind}`} onClick={() => dismiss(t.id)}>
          <span className="toast-icon" aria-hidden="true">{t.icon}</span>
          <span className="toast-text">
            <b>{t.title}</b>
            <span>{t.body}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
