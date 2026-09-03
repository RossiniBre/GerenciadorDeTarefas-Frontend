import { NavLink } from "react-router-dom";
import { AlignJustify, ChevronLeft, Home, Calendar, Bot, User, LogOut } from "lucide-react";
import "./Sidebar.css";

const mainNavItems = [
  { label: "Início", path: "/", icon: Home },
  { label: "Calendário", path: "/calendar", icon: Calendar },
  { label: "Nexus IA", path: "/nexus-ia", icon: Bot },
];

const systemNavItems = [
  { label: "Conta", path: "/my-account", icon: User },
];

export default function Sidebar({ isCollapsed, onToggleCollapse, onLogout }) {
  return (
    <aside className={isCollapsed ? "collapsed" : ""}>
      <h2 className="logo">
        <span className="label">TaskNexus</span>
        <AlignJustify size={24} />
      </h2>

      <button className="close-sidebar" onClick={onToggleCollapse}>
        <span className="label">Fechar</span>
        <ChevronLeft size={24} />
      </button>

      <nav id="interface">
        <ul>
          {mainNavItems.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              {}
              <NavLink to={path} className={({ isActive }) => (isActive ? "active" : "")}>
                <span className="label">{label}</span>
                <Icon size={24} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav id="system">
        <ul>
          {systemNavItems.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink to={path} className={({ isActive }) => (isActive ? "active" : "")}>
                <span className="label">{label}</span>
                <Icon size={24} />
              </NavLink>
            </li>
          ))}

          {}
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>
              <span className="label">Sair</span>
              <LogOut size={24} />
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}