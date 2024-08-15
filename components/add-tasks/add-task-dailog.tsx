import { Doc } from "@/convex/_generated/dataModel";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Calendar, Flag, Hash, Tag } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

export default function AddTaskDailog({
  data: { taskName, description, projectId, labelId, priority, dueDate },
}: {
  data: Doc<"todos">;
}) {
  const project = useQuery(api.projects.getProjectByProjectId, { projectId });
  const label = useQuery(api.labels.getLabelByLabelId, { labelId });

  const [todoDetails, setTodoDetails] = useState([]);

  useEffect(() => {
    const data = [
      {
        labelName: "Project",
        value: project?.name,
        icon: <Hash className="h-4 w-4 text-primary capitalize" />,
      },
      {
        labelName: "Due date",
        value: format(dueDate, "MMM dd yyyy"),
        icon: <Calendar className="h-4 w-4 text-primary capitalize" />,
      },
      {
        labelName: "Priority",
        value: priority,
        icon: <Flag className="h-4 w-4 text-primary capitalize" />,
      },
      {
        labelName: "Label",
        value: label?.name,
        icon: <Tag className="h-4 w-4 text-primary capitalize" />,
      },
    ];

    setTodoDetails(data);
  }, [dueDate, priority, label?.name, project]);

  return (
    <DialogContent className="max-w-4xl lg:h-4/6 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader>
        <DialogTitle>{taskName}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2 bg-gray-100 lg:w-1/2">
        {todoDetails.map(({ labelName, value, icon }, idx) => (
          <div
            key={`${value}-${idx}`}
            className="grid gap-2 p-4 border-b-2 w-full"
          >
            <Label className="flex items-start">{labelName}</Label>
            <div className="flex items-center text-left justify-start gap-2">
              {icon}
              <p className="text-sm">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </DialogContent>
  );
}
