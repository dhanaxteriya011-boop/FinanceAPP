import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { User, Mail, Phone, FileText, Calendar, Search, Users } from 'lucide-react';
import './AdminUsers.css';

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    api.get('/admin/users')
      .then(r => setUsers(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-page-container">
      <header className="users-header">
        <h1>Registered Users</h1>
        <p>Manage and monitor all applicant accounts on the platform.</p>
      </header>

      {/* Search Header */}
      <section className="search-card">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-inline" />
          <input 
            type="text" 
            placeholder="Search by name, email or phone..."
            className="admin-search-field" 
            value={search}
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div style={{ padding: '0 10px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
          {filtered.length} Users Found
        </div>
      </section>

      {/* List Container */}
      <section className="user-list-card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div className="admin-skeleton-card" style={{ height: '80px', marginBottom: '10px' }} />
            <div className="admin-skeleton-card" style={{ height: '80px', marginBottom: '10px' }} />
            <div className="admin-skeleton-card" style={{ height: '80px' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Users size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#64748b' }}>No users found</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="users-list-wrapper">
            {filtered.map(user => (
              <div key={user.id} className="user-row">
                {/* Profile Section */}
                <div className="user-profile-block">
                  <div className="user-avatar-rect">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="user-main-info">
                    <span className="name-text">{user.name}</span>
                    <div className="user-contact-grid">
                      <span className="contact-item">
                        <Mail size={12} /> {user.email}
                      </span>
                      {user.phone && (
                        <span className="contact-item">
                          <Phone size={12} /> {user.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Data Stats Section */}
                <div className="user-stats-block">
                  <div className="stat-group">
                    <span className="stat-label">
                      <FileText size={10} /> Apps
                    </span>
                    <div className="stat-value-big">{user.loan_applications_count || 0}</div>
                  </div>
                  
                  <div className="stat-group">
                    <span className="stat-label">
                      <Calendar size={10} /> Member Since
                    </span>
                    <div className="stat-value-date">
                      {new Date(user.created_at).toLocaleDateString('en-IN', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}