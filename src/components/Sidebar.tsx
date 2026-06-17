import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <nav style={{ width: '200px', background: '#eee', padding: '1rem' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/tasks">Tasks</Link>
        </li>
      </ul>
    </nav>
  )
}