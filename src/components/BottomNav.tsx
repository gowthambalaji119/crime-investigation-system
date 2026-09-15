import { Home, MapPinned, Landmark, Activity, FileWarning, Route, Compass } from "lucide-react";

interface BottomNavProps {
  activeTab: "map" | "stats" | "list" | "area" | "route" ;
  onTabChange: (tab: "map" | "stats" | "list" | "route" | "area" ) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] bg-gradient-to-t from-white to-gray-100 backdrop-blur-lg shadow-lg rounded-3xl border border-gray-300 p-2 flex justify-around items-center z-50">
      {navItems.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex flex-col items-center p-3 transition-all duration-300 ease-in-out rounded-full 
            ${activeTab === id 
              ? "text-blue-600 bg-blue-100 shadow-md scale-110"
              : "text-gray-500 hover:text-blue-500 hover:scale-110"}
          `}
          aria-label={label} // Improved accessibility for screen readers
        >
          <Icon className={`w-7 h-7 ${activeTab === id ? "text-blue-600" : "text-gray-500"}`} />
          <span className="text-xs mt-1">{label}</span>
        </button>
      ))}
    </nav>
  );
}

const navItems = [
  { id: "map", label: "Map", Icon: MapPinned },
  { id: "area", label: "Areas", Icon: Landmark },
  { id: "route", label: "Route", Icon: Route },
  { id: "stats", label: "Stats", Icon: Activity },
  { id: "list", label: "List", Icon: Home }, // New Live Location tab
];
