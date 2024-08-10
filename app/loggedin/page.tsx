import Tasks from "@/components/todooo/tasks";
import UserProfile from "@/components/todooo/user-profile";


export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-between p-24">
     <h1>Todooo</h1>
     <UserProfile/>
     <Tasks/>
    </main>
  );
}
