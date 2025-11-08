import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Users, DollarSign, MousePointer, Eye } from 'lucide-react';

interface DemographicData {
  ageRange: string;
  men: number;
  women: number;
}

interface CityData {
  city: string;
  percentage: number;
}

interface AdCampaign {
  name: string;
  date: string;
  type: string;
  spent: number;
  objective: string;
  status: string;
}

const demographicsData: DemographicData[] = [
  { ageRange: '18-24', men: 19.9, women: 5 },
  { ageRange: '25-34', men: 36.1, women: 7.5 },
  { ageRange: '35-44', men: 16.3, women: 2.8 },
  { ageRange: '45-54', men: 5.8, women: 0.8 },
  { ageRange: '55-64', men: 1.9, women: 0.4 },
  { ageRange: '65+', men: 2.9, women: 0.6 },
];

const topCities: CityData[] = [
  { city: 'Maputo', percentage: 30.3 },
  { city: 'Matola', percentage: 13.8 },
  { city: 'Beira', percentage: 8 },
  { city: 'Nampula', percentage: 7 },
  { city: 'Tete', percentage: 6.4 },
  { city: 'Chimoio', percentage: 5.9 },
  { city: 'Pemba', percentage: 4.3 },
  { city: 'Quelimane', percentage: 2.5 },
];

const adCampaigns: AdCampaign[] = [
  { name: 'T2 Mao Tse Tung', date: '2025-11-05', type: 'Instagram', spent: 6.0, objective: 'Visualizações', status: 'Active' },
  { name: 'T2 Mao Tse Tung', date: '2025-11-05', type: 'Facebook', spent: 3.0, objective: 'Mensagens', status: 'Active' },
  { name: 'T2 Polana', date: '2025-11-04', type: 'Instagram', spent: 5.0, objective: 'Conversões', status: 'Concluído' },
  { name: 'T2 Polana', date: '2025-11-04', type: 'Facebook', spent: 5.0, objective: 'Mensagens', status: 'Concluído' },
  { name: 'Flat TP2 Central', date: '2025-11-04', type: 'Facebook', spent: 5.0, objective: 'Mensagens', status: 'Concluído' },
  { name: 'T2 Park Moza', date: '2025-11-03', type: 'Facebook', spent: 3.0, objective: 'Mensagens', status: 'Concluído' },
  { name: 'T2 Polana Cimento', date: '2025-11-03', type: 'Facebook', spent: 3.0, objective: 'Mensagens', status: 'Concluído' },
  { name: 'T3 Kings Village', date: '2025-11-02', type: 'Facebook', spent: 1.0, objective: 'Cliques', status: 'Concluído' },
  { name: 'T2 Emília Dausse', date: '2025-10-26', type: 'Facebook', spent: 2.0, objective: 'Mensagens', status: 'Concluído' },
];

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('90days');
  const [dataSource, setDataSource] = useState('all');

  const reachData = useMemo(() => {
    const data: Array<{ date: string; reach: number; impressions: number }> = [];
    const startDate = new Date('2025-10-01');
    for (let i = 0; i < 30; i += 1) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toISOString().split('T')[0],
        reach: Math.floor(Math.random() * 5000) + 2000,
        impressions: Math.floor(Math.random() * 8000) + 3000,
      });
    }
    return data;
  }, []);

  const visitsData = useMemo(
    () => [
      { date: '2025-10-08', visits: 80 },
      { date: '2025-10-09', visits: 88 },
      { date: '2025-10-10', visits: 90 },
      { date: '2025-10-11', visits: 52 },
      { date: '2025-10-12', visits: 79 },
      { date: '2025-10-15', visits: 16 },
      { date: '2025-10-16', visits: 46 },
      { date: '2025-10-17', visits: 19 },
      { date: '2025-10-18', visits: 63 },
      { date: '2025-10-27', visits: 12 },
      { date: '2025-11-01', visits: 5 },
      { date: '2025-11-02', visits: 6 },
      { date: '2025-11-03', visits: 45 },
      { date: '2025-11-04', visits: 76 },
    ],
    [],
  );

  const linkClicksData = useMemo(
    () => [
      { date: '2025-10-08', clicks: 41 },
      { date: '2025-10-09', clicks: 82 },
      { date: '2025-10-10', clicks: 124 },
      { date: '2025-10-11', clicks: 138 },
      { date: '2025-10-12', clicks: 60 },
      { date: '2025-10-15', clicks: 25 },
      { date: '2025-10-16', clicks: 73 },
      { date: '2025-10-17', clicks: 76 },
      { date: '2025-10-18', clicks: 107 },
      { date: '2025-10-27', clicks: 15 },
    ],
    [],
  );

  const totalReach = useMemo(() => reachData.reduce((sum, item) => sum + item.reach, 0), [reachData]);
  const totalImpressions = useMemo(() => reachData.reduce((sum, item) => sum + item.impressions, 0), [reachData]);
  const totalClicks = useMemo(() => linkClicksData.reduce((sum, item) => sum + item.clicks, 0), [linkClicksData]);
  const totalSpent = useMemo(() => adCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0), []);
  const totalVisits = useMemo(() => visitsData.reduce((sum, item) => sum + item.visits, 0), [visitsData]);
  const avgCTR = useMemo(() => (totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0'), [
    totalClicks,
    totalImpressions,
  ]);
  const costPerClick = useMemo(() => (totalClicks > 0 ? (totalSpent / totalClicks).toFixed(2) : '0'), [totalSpent, totalClicks]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">WOOW Imobiliária</h1>
              <p className="text-sm text-slate-600">Business Intelligence Dashboard</p>
            </div>
            <div className="flex gap-3">
              <select
                value={dateRange}
                onChange={(event) => setDateRange(event.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
                <option value="90days">Últimos 90 dias</option>
              </select>
              <select
                value={dataSource}
                onChange={(event) => setDataSource(event.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="all">Todas as Fontes</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Alcance Total</p>
                <p className="text-2xl font-bold text-slate-900">{totalReach.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% vs período anterior</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Investimento Total</p>
                <p className="text-2xl font-bold text-slate-900">${totalSpent.toFixed(2)}</p>
                <p className="text-xs text-slate-500 mt-1">CPC: ${costPerClick}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Cliques em Links</p>
                <p className="text-2xl font-bold text-slate-900">{totalClicks.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">CTR: {avgCTR}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MousePointer className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Visitas à Página</p>
                <p className="text-2xl font-bold text-slate-900">{totalVisits}</p>
                <p className="text-xs text-orange-600 mt-1">↑ 8% esta semana</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Alcance e Visualizações</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={reachData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="reach" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Alcance" />
                <Area
                  type="monotone"
                  dataKey="impressions"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Visualizações"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Cliques em Links</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={linkClicksData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} name="Cliques" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Demografia por Idade e Género</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demographicsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="ageRange" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="men" fill="#3b82f6" name="Homens" />
                <Bar dataKey="women" fill="#ec4899" name="Mulheres" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Principais Cidades</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topCities}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ city, percentage }) => `${city} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {topCities.map((entry, index) => (
                    <Cell key={`cell-${index.toString()}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Campanhas Publicitárias Recentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Campanha</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Data</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Plataforma</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Objetivo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Gasto</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {adCampaigns.slice(0, 10).map((campaign, index) => (
                  <tr key={campaign.name + index.toString()} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-900">{campaign.name}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{campaign.date}</td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          campaign.type === 'Facebook' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {campaign.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{campaign.objective}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-slate-900">${campaign.spent.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          campaign.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Visitas à Página do Facebook</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={visitsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="visits" fill="#10b981" name="Visitas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-600">© 2025 WOOW Imobiliária - Dashboard de Inteligência de Negócios</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

