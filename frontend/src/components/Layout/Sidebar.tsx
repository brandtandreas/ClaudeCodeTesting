import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', exact: true },
  { to: '/dashboard', label: 'Dashboard', exact: false },
]

export default function Sidebar() {
  return (
    <aside
      style={{
        width: '200px',
        backgroundColor: '#f9fafb',
        borderRight: '1px solid #e5e7eb',
        padding: '24px 0',
        flexShrink: 0,
      }}
    >
      <nav>
        {navItems.map(({ to, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            style={({ isActive }) => ({
              display: 'block',
              padding: '10px 20px',
              color: isActive ? '#1d4ed8' : '#374151',
              backgroundColor: isActive ? '#eff6ff' : 'transparent',
              textDecoration: 'none',
              fontWeight: isActive ? '600' : '400',
              fontSize: '14px',
              borderLeft: isActive ? '3px solid #1d4ed8' : '3px solid transparent',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
