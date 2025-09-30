import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Users } from 'lucide-react';
import api from '../../api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'User' });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const { data } = await api.get("/admin/users");
        setUsers(data || []);
        setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update existing user
        const { data } = await api.put( 
          `/admin/users/${editingUser._id}`,
          formData
        );
        setUsers(users.map(u => u._id === editingUser._id ? data.user : u));
      } else {
        // Add new user
        const { data } = await api.post(
          "/admin/users",
          formData
        );
        setUsers([...users, data.user]);
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
    setShowModal(false);
    setEditingUser(null);
    if (editingUser) {
      setUsers(users.map(u => u._id === editingUser._id ? { ...u, ...formData } : u));
    } else {
      const newUser = { _id: Date.now(), ...formData, isActive: true };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'User' });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const Loader = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
    </div>
  );

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Users className="w-6 h-7 text-rose-600" />
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 flex items-center space-x-2">
          <Plus className="w-4 h-4" /> <span>Add User</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search users..." value={searchText} onChange={(e)=>setSearchText(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"/>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={()=>handleEdit(u)} className="text-rose-600 hover:text-rose-900"><Edit className="w-4 h-4"/></button>
                  <button onClick={()=>handleDelete(u._id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editingUser ? 'Edit User' : 'Add New User'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" required value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" required value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"/>
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input type="password" required={!editingUser} value={formData.password || ''} onChange={(e)=>setFormData({...formData,password:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"/>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select value={formData.role} onChange={(e)=>setFormData({...formData,role:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3 justify-end">
                <button type="button" onClick={()=>{ setShowModal(false); setEditingUser(null); setFormData({name:'',email:'',role:'User'}) }} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700">{editingUser ? 'Update' : 'Create'} User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
