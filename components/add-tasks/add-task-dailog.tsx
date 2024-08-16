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
import { Calendar, ChevronDown, Flag, Hash, Tag } from "lucide-react";
import { format } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import Task from "../todos/task";
import { AddTaskWrapper } from "./add-task-button";

export default function AddTaskDailog({
  data,
}: {
  data: Doc<"todos">;
}) {
  const { taskName, description, projectId, labelId, priority, dueDate, _id } = data;
  const project = useQuery(api.projects.getProjectByProjectId, { projectId });
  const label = useQuery(api.labels.getLabelByLabelId, { labelId });
  const inCompletedSubtodosByProject =
  useQuery(api.subTodos.inCompleteSubTodos) ?? [];

const completedSubtodosByProject =
  useQuery(api.subTodos.completedSubTodos) ?? [];

  const checkASubTodoMutation = useMutation(api.subTodos.checkASubTodo);
  const unCheckASubTodoMutation = useMutation(api.subTodos.unCheckASubTodo);

  const [todoDetails, setTodoDetails] = useState([]);

  useEffect(() => {
    const data = [
      {
        labelName: "Project",
        value: project?.name || "",
        icon: <Hash className="h-4 w-4 text-primary capitalize" />,
      },
      {
        labelName: "Due date",
        value: format(dueDate, "MMM dd yyyy"),
        icon: <Calendar className="h-4 w-4 text-primary capitalize" />,
      },
      {
        labelName: "Priority",
        value: priority?.toString() || "",
        icon: <Flag className="h-4 w-4 text-primary capitalize" />,
      },
      {
        labelName: "Label",
        value: label?.name || "",
        icon: <Tag className="h-4 w-4 text-primary capitalize" />,
      },
    ];

    if (data) {
      setTodoDetails(data);
    }
  }, [dueDate, priority, label?.name, project]);

  return (
    <DialogContent className="max-w-4xl lg:h-4/6 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader className="w-full">
        <DialogTitle>{taskName}</DialogTitle>
        <DialogDescription>
          <p className="my-2 capitalize">{description}</p>
          <div className="flex items-center gap-1 mt-12 border-b-2 border-gray-100 pb-2 flex-wrap sm:justify-between lg:gap-0">
            <div className="flex gap-1">
              <ChevronDown className="w-5 h-5 text-primary" />
              <p className="font-bold flex text-sm text-gray-900">Sub-tasks</p>
            </div>
            <div>
              <Button variant={"outline"}> Suggest Missing Tasks (AI)</Button>
            </div>
          </div>
          <div className="pl-4">
            {inCompletedSubtodosByProject.map((task) => {
              return (
                <Task
                  key={task._id}
                  data={task}
                  isCompleted={task.isCompleted}
                  handleOnChange={() =>
                    checkASubTodoMutation({ taskId: task._id })
                  }
                />
              );
            })}
            <div className="pb-4">
              <AddTaskWrapper parentTask={data}/>
            </div>
            {completedSubtodosByProject.map((task) => {
              return (
                <Task
                  key={task._id}
                  data={task}
                  isCompleted={task.isCompleted}
                  handleOnChange={() =>
                    unCheckASubTodoMutation({ taskId: task._id })
                  }
                />
              );
            })}
          </div>
        </DialogDescription>
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
