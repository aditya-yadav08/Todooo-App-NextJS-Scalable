import { Calendar, CalendarDays, Grid2X2, Inbox } from "lucide-react";

export const primaryNavItems = [
    {
      id: "primary",
      name: "Inbox",
      link: "/loggedin",
      icon: <Inbox className="w-4 h-4" />,
    },
    {
      name: "Today",
      link: "/loggedin/today",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      name: "Upcoming",
      link: "/loggedin/upcoming",
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      name: "Filters & Labels",
      link: "/loggedin/filter-labels",
      icon: <Grid2X2 className="w-4 h-4" />,
    },
];

export const GET_STARTED_PROJECT_ID = "k97cpa1q8rbfjeecwzs26yzzq16yqmkk";
export const PERSONAL_LABEL_ID = "k5757cjp6d2nfr7exfmwmebb5s6yq1sv";
export const AI_LABEL_ID = "k574vq4y8w9t2qv80kcfktv6w96z1dad";
