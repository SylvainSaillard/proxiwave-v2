import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ProjectsView from './ProjectsView';
import MessagesPanel from './MessagesPanel';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-cream flex p-3 sm:p-4 gap-4">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col bg-white rounded-bento overflow-hidden border border-warm-100">
        <TopBar />
        <div className="flex-1 flex overflow-hidden">
          <ProjectsView />
        </div>
      </div>

      {/* Messages panel */}
      <MessagesPanel />
    </div>
  );
}
