import React, { useState, useEffect } from 'react';
import {
  Users,
  Download,
  Search,
  CheckCircle2,
  Plus,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import {
  RegisteredUser,
  getAllCapturedUsers,
  getActiveUser,
  registerUser,
} from '../utils/authManager';

interface UserTrackingDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserTrackingDashboardModal: React.FC<UserTrackingDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUser, setActiveUserState] = useState<RegisteredUser | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');

  const loadData = () => {
    setUsers(getAllCapturedUsers());
    setActiveUserState(getActiveUser());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateMockUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) return;

    registerUser(newEmail, newName, 'microsoft_store', 'website_landing_page');
    setNewEmail('');
    setNewName('');
    setIsAddingUser(false);
    loadData();
  };

  const handleExportCsv = () => {
    if (users.length === 0) return;
    const headers = ['ID', 'Email', 'Name', 'RegisteredDate', 'Subscribed', 'Keystrokes'];
    const rows = users.map((u) => [
      u.id,
      u.email,
      u.name || '',
      new Date(u.registeredAt).toISOString(),
      u.isSubscribed ? 'YES' : 'NO',
      u.totalKeystrokes,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `thockyapp-customers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalUsers = users.length;
  const subscribedCount = users.filter((u) => u.isSubscribed).length;
  const trialCount = totalUsers - subscribedCount;
  const totalKeystrokes = users.reduce((acc, u) => acc + (u.totalKeystrokes || 0), 0);

  return (
    <div
      id="user-tracking-dashboard-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-white space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Customer Accounts</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  Live DB
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Registered customer emails, keystroke usage, and 1-year pass license status
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={users.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-white/10 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-white/10 hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Customers</div>
            <div className="text-2xl font-black text-white">{totalUsers}</div>
            <div className="text-[10px] text-indigo-400 font-medium">Registered Accounts</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subscribers</div>
            <div className="text-2xl font-black text-emerald-400">{subscribedCount}</div>
            <div className="text-[10px] text-emerald-400/80 font-medium">$3.99/yr Active</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Trials</div>
            <div className="text-2xl font-black text-indigo-400">{trialCount}</div>
            <div className="text-[10px] text-slate-400">1-Day Evaluation</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Keystrokes</div>
            <div className="text-2xl font-black text-cyan-400">{totalKeystrokes.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400">Mechanical ASMR</div>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer email or name..."
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsAddingUser(!isAddingUser)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>

        {/* Add User Form Drawer */}
        {isAddingUser && (
          <form
            onSubmit={handleCreateMockUser}
            className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-3 animate-in fade-in"
          >
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Register New Customer Account</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="customer@example.com"
                className="bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Customer Name (e.g. Jordan)"
                className="bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingUser(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-indigo-600 text-xs text-white font-bold cursor-pointer"
              >
                Save Record
              </button>
            </div>
          </form>
        )}

        {/* Table of Registered Users */}
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950/70">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Customer Email</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Keystrokes</th>
                  <th className="py-3 px-4">License Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 font-sans">
                      No customer records found matching "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isCurrent = activeUser?.email === user.email;
                    return (
                      <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0 font-sans">
                              {user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5 font-sans">
                                <span>{user.email}</span>
                                {isCurrent && (
                                  <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-semibold">
                                    Current Device
                                  </span>
                                )}
                              </div>
                              {user.name && <div className="text-[10px] text-slate-400 font-sans">{user.name}</div>}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {new Date(user.registeredAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-3 px-4 text-slate-300 font-bold">
                          {user.totalKeystrokes.toLocaleString()}
                        </td>

                        <td className="py-3 px-4">
                          {user.isSubscribed ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase">
                              $3.99/yr Subscriber
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase">
                              1-Day Trial
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
