'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Shield, UserCheck, MoreVertical, Loader2 } from 'lucide-react';
import { User } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setUsers(data);
    setLoading(false);
  }

  async function updateUserRole(userId: string, newRole: 'author' | 'buyer' | 'admin') {
    setUpdating(userId);
    const supabase = createClient();
    
    const updates: any = { role: newRole };
    if (newRole === 'admin') updates.is_admin = true;
    else updates.is_admin = false;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    setUpdating(null);
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Пользователи</h1>
          <p className="text-slate-500">Управление доступом и ролями</p>
        </div>
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input 
            placeholder="Поиск по email..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-4 font-medium text-slate-500 text-sm">Пользователь</th>
                <th className="p-4 font-medium text-slate-500 text-sm">Роль</th>
                <th className="p-4 font-medium text-slate-500 text-sm">Дата регистрации</th>
                <th className="p-4 font-medium text-slate-500 text-sm text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-600" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Пользователи не найдены
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                          {user.full_name?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.full_name || 'Без имени'}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                          user.role === 'author' ? 'bg-indigo-100 text-indigo-800' : 
                          'bg-slate-100 text-slate-800'}`}>
                        {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                        {user.role === 'author' ? 'Автор' : user.role === 'admin' ? 'Админ' : 'Студент'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user.role !== 'admin' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateUserRole(user.id, 'admin')}
                            disabled={updating === user.id}
                            className="text-xs h-8"
                          >
                            Сделать админом
                          </Button>
                        )}
                        {user.role !== 'author' && user.role !== 'admin' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateUserRole(user.id, 'author')}
                            disabled={updating === user.id}
                            className="text-xs h-8"
                          >
                            Сделать автором
                          </Button>
                        )}
                        {user.role === 'author' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => updateUserRole(user.id, 'buyer')}
                            disabled={updating === user.id}
                            className="text-xs h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          >
                            Разжаловать
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
