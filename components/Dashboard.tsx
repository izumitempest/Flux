import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Activity, TrendingUp } from 'lucide-react';
import { CHART_DATA, MOCK_MEMBERS, MOCK_PROPOSALS } from '../constants';

const Dashboard: React.FC = () => {
  const activeMembers = MOCK_MEMBERS.filter(m => m.status === 'Active').length;
  const activeProposals = MOCK_PROPOSALS.filter(p => p.status === 'Active').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value={MOCK_MEMBERS.length.toString()}
          icon={<Users className="text-blue-500" size={24} />}
          trend="+12% from last month"
        />
        <StatsCard
          title="Active Members"
          value={activeMembers.toString()}
          icon={<Activity className="text-green-500" size={24} />}
          trend="85% engagement rate"
        />
        <StatsCard
          title="Active Proposals"
          value={activeProposals.toString()}
          icon={<FileText className="text-purple-500" size={24} />}
          trend="2 closing soon"
        />
        <StatsCard
          title="Participation"
          value="78%"
          icon={<TrendingUp className="text-orange-500" size={24} />}
          trend="High turnout"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Member Growth</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
              />
              <Area 
                type="monotone" 
                dataKey="members" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorMembers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                  JS
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Smith voted on 'Coffee Budget'</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h2>
             <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                 <div className="flex-shrink-0 w-12 text-center bg-purple-50 rounded-lg py-1">
                    <div className="text-xs font-bold text-purple-600">OCT</div>
                    <div className="text-lg font-bold text-gray-900">{20 + i}</div>
                 </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Quarterly General Meeting</p>
                  <p className="text-xs text-gray-500">Main Hall • 6:00 PM</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend: string }> = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
    </div>
    <p className="text-xs text-gray-500">{trend}</p>
  </div>
);

export default Dashboard;