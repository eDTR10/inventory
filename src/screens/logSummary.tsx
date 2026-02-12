import { useState, useEffect } from 'react';
import { getLogSummary, getLogSummaryByDateRange, LogSummary } from '@/services/logsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, TrendingUp, TrendingDown, Users, Package, X, ChevronRight } from 'lucide-react';
import axios from '@/plugin/axios';
import AdminRoute from '@/components/AdminRoute';

interface UserLog {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  action: string;
  action_display: string;
  transaction: string;
  item_id: number;
  item_name: string;
  quantity: number;
  size?: string;
  date_created: string;
}

type Period = 'today' | 'this_week' | 'this_month' | 'this_year' | 'custom';
type ItemView = 'added' | 'deducted';

export const LogSummaryPage = () => {
  const [period, setPeriod] = useState<Period>('today');
  const [summary, setSummary] = useState<LogSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [itemView, setItemView] = useState<ItemView>('added');
  const [selectedUser, setSelectedUser] = useState<{
    user_id: number;
    name: string;
    email: string;
  } | null>(null);
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);
  const [loadingUserLogs, setLoadingUserLogs] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    item_id: number;
    item_name: string;
  } | null>(null);
  const [itemLogs, setItemLogs] = useState<UserLog[]>([]);
  const [loadingItemLogs, setLoadingItemLogs] = useState(false);

  useEffect(() => {
    if (period !== 'custom') {
      fetchSummary();
    }
  }, [period]);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      if (period === 'custom') {
        if (!startDate || !endDate) {
          setError('Please select both start and end dates');
          return;
        }
        const data = await getLogSummaryByDateRange(startDate, endDate);
        setSummary(data);
      } else {
        const data = await getLogSummary(period);
        setSummary(data);
      }
    } catch (err) {
      console.error('Failed to fetch summary:', err);
      setError('Failed to load summary data');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDateSubmit = () => {
    fetchSummary();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const fetchUserLogs = async (userId: number) => {
    setLoadingUserLogs(true);
    try {
      if (!summary) return;
      
      const response = await axios.get(`/inventory/logs/`, {
        params: {
          user_id: userId,
        }
      });
      
      console.log('Fetched logs:', response.data);
      console.log('Summary date range:', summary.start_date, 'to', summary.end_date);
      
      // Filter logs by the summary's date range
      const startDate = new Date(summary.start_date);
      const endDate = new Date(summary.end_date);
      
      const filteredLogs = response.data.filter((log: UserLog) => {
        const logDate = new Date(log.date_created);
        return logDate >= startDate && logDate <= endDate;
      });
      
      console.log('Filtered logs:', filteredLogs);
      setUserLogs(filteredLogs);
    } catch (err) {
      console.error('Failed to fetch user logs:', err);
    } finally {
      setLoadingUserLogs(false);
    }
  };

  const handleUserClick = (user: { user_id: number; name: string; email: string }) => {
    setSelectedUser(user);
    fetchUserLogs(user.user_id);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setUserLogs([]);
  };

  const groupLogsByItem = (logs: UserLog[]) => {
    const grouped: { [key: string]: { item_name: string; added: number; deducted: number } } = {};
    
    logs.forEach(log => {
      const key = `${log.item_id}`;
      if (!grouped[key]) {
        grouped[key] = {
          item_name: log.item_name,
          added: 0,
          deducted: 0
        };
      }
      
      if (log.transaction === 'add') {
        grouped[key].added += log.quantity;
      } else if (log.transaction === 'deducted') {
        grouped[key].deducted += log.quantity;
      }
    });
    
    return Object.values(grouped);
  };

  const fetchItemLogs = async (itemId: number) => {
    setLoadingItemLogs(true);
    try {
      if (!summary) return;
      
      const response = await axios.get(`/inventory/logs/`, {
        params: {
          item_id: itemId,
        }
      });
      
      // Filter logs by the summary's date range
      const startDate = new Date(summary.start_date);
      const endDate = new Date(summary.end_date);
      
      const filteredLogs = response.data.filter((log: UserLog) => {
        const logDate = new Date(log.date_created);
        return logDate >= startDate && logDate <= endDate;
      });
      
      setItemLogs(filteredLogs);
    } catch (err) {
      console.error('Failed to fetch item logs:', err);
    } finally {
      setLoadingItemLogs(false);
    }
  };

  const handleItemClick = (item: { item__id: number; item__name: string }) => {
    setSelectedItem({
      item_id: item.item__id,
      item_name: item.item__name
    });
    fetchItemLogs(item.item__id);
  };

  const closeItemModal = () => {
    setSelectedItem(null);
    setItemLogs([]);
  };

  const groupLogsByUser = (logs: UserLog[]) => {
    const grouped: { [key: string]: { user_name: string; user_email: string; added: number; deducted: number } } = {};
    
    logs.forEach(log => {
      const key = `${log.user_id}`;
      if (!grouped[key]) {
        grouped[key] = {
          user_name: log.user_name,
          user_email: log.user_email,
          added: 0,
          deducted: 0
        };
      }
      
      if (log.transaction === 'add') {
        grouped[key].added += log.quantity;
      } else if (log.transaction === 'deducted') {
        grouped[key].deducted += log.quantity;
      }
    });
    
    return Object.values(grouped);
  };

  return (
    <AdminRoute allowAccLvl0={true}>
      <div className="p-8 lg:p-6 md:p-4 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-2xl font-bold mb-8 md:mb-6">Inventory Log Summary</h1>

      {/* Period Selector */}
      <div className="mb-6 p-6 bg-white dark:bg-slate-900 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Select Period
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={period === 'today' ? 'default' : 'outline'}
            onClick={() => setPeriod('today')}
            size="sm"
          >
            Today
          </Button>
          <Button
            variant={period === 'this_week' ? 'default' : 'outline'}
            onClick={() => setPeriod('this_week')}
            size="sm"
          >
            This Week
          </Button>
          <Button
            variant={period === 'this_month' ? 'default' : 'outline'}
            onClick={() => setPeriod('this_month')}
            size="sm"
          >
            This Month
          </Button>
          <Button
            variant={period === 'this_year' ? 'default' : 'outline'}
            onClick={() => setPeriod('this_year')}
            size="sm"
          >
            This Year
          </Button>
          <Button
            variant={period === 'custom' ? 'default' : 'outline'}
            onClick={() => setPeriod('custom')}
            size="sm"
          >
            Custom Range
          </Button>
        </div>

        {period === 'custom' && (
          <div className="flex gap-2 items-end flex-wrap">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button onClick={handleCustomDateSubmit} disabled={loading}>
              Apply
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading summary...</p>
        </div>
      ) : summary ? (
        <>
          {/* Date Range Display */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Period:</strong> {formatDate(summary.start_date)} - {formatDate(summary.end_date)}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Items Added</p>
                  <p className="text-3xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                    {summary.summary.added.total_quantity}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {summary.summary.added.transaction_count} transactions
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 md:w-10 md:h-10 text-green-600 dark:text-green-400 opacity-50" />
              </div>
            </div>

            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Items Deducted</p>
                  <p className="text-3xl md:text-2xl font-bold text-red-600 dark:text-red-400">
                    {summary.summary.deducted.total_quantity}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {summary.summary.deducted.transaction_count} transactions
                  </p>
                </div>
                <TrendingDown className="w-12 h-12 md:w-10 md:h-10 text-red-600 dark:text-red-400 opacity-50" />
              </div>
            </div>

            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Net Change</p>
                  <p className={`text-3xl md:text-2xl font-bold ${summary.summary.net_change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {summary.summary.net_change >= 0 ? '+' : ''}{summary.summary.net_change}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Overall balance
                  </p>
                </div>
                <Package className="w-12 h-12 md:w-10 md:h-10 text-blue-600 dark:text-blue-400 opacity-50" />
              </div>
            </div>
          </div>

          {/* Combined Items Ranking Section */}
          <div className="mb-8">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-lg shadow border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {itemView === 'added' ? (
                    <>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Top Items Added
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      Top Items Deducted
                    </>
                  )}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant={itemView === 'added' ? 'default' : 'outline'}
                    onClick={() => setItemView('added')}
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Added
                  </Button>
                  <Button
                    variant={itemView === 'deducted' ? 'default' : 'outline'}
                    onClick={() => setItemView('deducted')}
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    <TrendingDown className="w-4 h-4 mr-1" />
                    Deducted
                  </Button>
                </div>
              </div>
              
              {itemView === 'added' ? (
                summary.top_items.most_added.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {summary.top_items.most_added.map((item, index) => (
                      <div 
                        key={item.item__id} 
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-lg font-bold text-gray-400 flex-shrink-0">#{index + 1}</span>
                          <span className="font-medium truncate">{item.item__name}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-lg font-bold text-green-600">+{item.total}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No items added in this period</p>
                )
              ) : (
                summary.top_items.most_deducted.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {summary.top_items.most_deducted.map((item, index) => (
                      <div 
                        key={item.item__id} 
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-lg font-bold text-gray-400 flex-shrink-0">#{index + 1}</span>
                          <span className="font-medium truncate">{item.item__name}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-lg font-bold text-red-600">-{item.total}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No items deducted in this period</p>
                )
              )}
            </div>
          </div>

          {/* User Activity Section */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              User Activity
            </h3>
            {summary.user_activity.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-slate-700">
                      <th className="text-left p-3 font-semibold">User</th>
                      <th className="text-center p-3 font-semibold sm:table-cell hidden">Total Actions</th>
                      <th className="text-center p-3 font-semibold text-green-600">Added</th>
                      <th className="text-center p-3 font-semibold text-red-600">Deducted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.user_activity.map((user) => (
                      <tr 
                        key={user.user_id} 
                        className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        onClick={() => handleUserClick(user)}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{user.name}</p>
                              <p className="text-xs text-gray-500 truncate sm:block hidden">{user.email}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </div>
                        </td>
                        <td className="text-center p-3 font-semibold sm:table-cell hidden">{user.total_actions}</td>
                        <td className="text-center p-3 text-green-600 font-semibold">+{user.added}</td>
                        <td className="text-center p-3 text-red-600 font-semibold">-{user.deducted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No user activity in this period</p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Select a period to view summary
        </div>
      )}

      {/* User Activity Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b dark:border-slate-700">
              <div className="min-w-0 flex-1 pr-4">
                <h2 className="text-lg sm:text-xl font-bold truncate">{selectedUser.name}</h2>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{selectedUser.email}</p>
              </div>
              <button
                onClick={closeUserModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {loadingUserLogs ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <p className="mt-2 text-gray-600">Loading user activity...</p>
                </div>
              ) : userLogs.length > 0 ? (
                <>
                  {/* Summary by Item */}
                  <div className="mb-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Activity Summary by Item</h3>
                    <div className="space-y-3">
                      {groupLogsByItem(userLogs).map((item, index) => (
                        <div key={index} className="p-3 sm:p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2 gap-2">
                            <span className="font-semibold text-base sm:text-lg truncate flex-1">{item.item_name}</span>
                            <div className="flex gap-2 sm:gap-4 flex-shrink-0">
                              {item.added > 0 && (
                                <span className="text-green-600 font-semibold text-sm sm:text-base">+{item.added}</span>
                              )}
                              {item.deducted > 0 && (
                                <span className="text-red-600 font-semibold text-sm sm:text-base">-{item.deducted}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Net change: 
                            <span className={`ml-2 font-semibold ${item.added - item.deducted >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.added - item.deducted >= 0 ? '+' : ''}{item.added - item.deducted}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Transaction Log */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Transaction History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b dark:border-slate-700">
                            <th className="text-left p-2 sm:p-3 font-semibold">Date</th>
                            <th className="text-left p-2 sm:p-3 font-semibold">Item</th>
                            <th className="text-center p-2 sm:p-3 font-semibold">Action</th>
                            <th className="text-right p-2 sm:p-3 font-semibold">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userLogs.map((log) => (
                            <tr key={log.id} className="border-b dark:border-slate-700">
                              <td className="p-2 sm:p-3 text-gray-600 dark:text-gray-400">
                                <span className="hidden sm:inline">
                                  {new Date(log.date_created).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                <span className="sm:hidden">
                                  {new Date(log.date_created).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </td>
                              <td className="p-2 sm:p-3 font-medium">
                                <span className="truncate block max-w-[150px] sm:max-w-none">{log.item_name}</span>
                              </td>
                              <td className="text-center p-2 sm:p-3">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  log.transaction === 'add' 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {log.action_display || (log.transaction === 'add' ? 'Added' : 'Deducted')}
                                </span>
                              </td>
                              <td className={`text-right p-2 sm:p-3 font-semibold ${
                                log.transaction === 'add' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {log.transaction === 'add' ? '+' : '-'}{log.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 py-12">No activity found for this user</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t dark:border-slate-700 flex justify-end">
              <Button onClick={closeUserModal} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Item Activity Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b dark:border-slate-700">
              <div className="min-w-0 flex-1 pr-4">
                <h2 className="text-lg sm:text-xl font-bold truncate">{selectedItem.item_name}</h2>
                <p className="text-xs sm:text-sm text-gray-500">Item Activity Breakdown</p>
              </div>
              <button
                onClick={closeItemModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {loadingItemLogs ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <p className="mt-2 text-gray-600">Loading item activity...</p>
                </div>
              ) : itemLogs.length > 0 ? (
                <>
                  {/* Summary by User */}
                  <div className="mb-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Activity Summary by User</h3>
                    <div className="space-y-3">
                      {groupLogsByUser(itemLogs).map((user, index) => (
                        <div key={index} className="p-3 sm:p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2 gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="font-semibold text-base sm:text-lg block truncate">{user.user_name}</span>
                              <p className="text-xs text-gray-500 truncate">{user.user_email}</p>
                            </div>
                            <div className="flex gap-2 sm:gap-4 flex-shrink-0">
                              {user.added > 0 && (
                                <span className="text-green-600 font-semibold text-sm sm:text-base">+{user.added}</span>
                              )}
                              {user.deducted > 0 && (
                                <span className="text-red-600 font-semibold text-sm sm:text-base">-{user.deducted}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Net change: 
                            <span className={`ml-2 font-semibold ${user.added - user.deducted >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {user.added - user.deducted >= 0 ? '+' : ''}{user.added - user.deducted}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Transaction Log */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Transaction History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b dark:border-slate-700">
                            <th className="text-left p-2 sm:p-3 font-semibold">Date</th>
                            <th className="text-left p-2 sm:p-3 font-semibold">User</th>
                            <th className="text-center p-2 sm:p-3 font-semibold">Action</th>
                            <th className="text-right p-2 sm:p-3 font-semibold">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemLogs.map((log) => (
                            <tr key={log.id} className="border-b dark:border-slate-700">
                              <td className="p-2 sm:p-3 text-gray-600 dark:text-gray-400">
                                <span className="hidden sm:inline">
                                  {new Date(log.date_created).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                <span className="sm:hidden">
                                  {new Date(log.date_created).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </td>
                              <td className="p-2 sm:p-3">
                                <div className="min-w-0">
                                  <p className="font-medium truncate max-w-[120px] sm:max-w-none">{log.user_name}</p>
                                  <p className="text-xs text-gray-500 truncate hidden sm:block">{log.user_email}</p>
                                </div>
                              </td>
                              <td className="text-center p-2 sm:p-3">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  log.transaction === 'add' 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {log.action_display || (log.transaction === 'add' ? 'Added' : 'Deducted')}
                                </span>
                              </td>
                              <td className={`text-right p-2 sm:p-3 font-semibold ${
                                log.transaction === 'add' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {log.transaction === 'add' ? '+' : '-'}{log.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 py-12">No activity found for this item</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t dark:border-slate-700 flex justify-end">
              <Button onClick={closeItemModal} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminRoute>
  );
};

export default LogSummaryPage;
