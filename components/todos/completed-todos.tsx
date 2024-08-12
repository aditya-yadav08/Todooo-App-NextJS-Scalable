import { CircleCheckBig } from "lucide-react";
import React from "react";

export default function CompletedTodos({ totalTodos }) {
  return (
    <div className="flex items-center border-b-2 p-2 border-gray-100 text-sm text-foreground/80 gap-1 py-4">
      <>
        <CircleCheckBig />
        <span>+ {totalTodos}</span>
        <span className="capitalize">completed tasks</span>
      </>
    </div>
  );
}
