import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Users, Shield, UserX, UserCheck } from 'lucide-react'
import api from '../../api/api'

export default function AdminUsers() {
  const { t } = useTranslation()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('')

  const fetchUsers = () => {
    setLoading(true)
    api.get(`/admin/users?role=${roleFilter}`)
      .then(res => setUsers(res.data))
      .catch(err => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers()
  }, [roleFilter])

  const handleToggleActive = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/toggle-active`)
      toast.success(res.data.message)
      fetchUsers()
    } catch (err) {
      toast.error('Toggle status failed')
    }
  }

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{t('users')}</h1>
          <p className="page-subtitle">Manage accounts across Business, NGO, Individual, Delivery and Admin roles</p>
        </div>
        <select className="input" style={{ width: '180px' }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="business">Business</option>
          <option value="ngo">NGO</option>
          <option value="individual">Individual</option>
          <option value="delivery">Delivery</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Organization</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No users found</td></tr>
            ) : users.map((u) => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td style={{ fontWeight: 600 }}>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="badge badge-blue">{u.role.toUpperCase()}</span></td>
                <td>{u.organization_name || '-'}</td>
                <td>
                  {u.is_active ? (
                    <span className="badge badge-green">Active</span>
                  ) : (
                    <span className="badge badge-red">Suspended</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleToggleActive(u.id)} className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-primary'}`}>
                    {u.is_active ? <><UserX size={14} /> Suspend</> : <><UserCheck size={14} /> Activate</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
