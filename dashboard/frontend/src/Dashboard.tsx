import React, { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { Users, DollarSign, MousePointer, Eye } from 'lucide-react';

interface DailyPerformance {
  date: string;
  reach: number;
  impressions: number;
  clicks: number;
  visits: number;
  spend: number;
}

interface ChannelBreakdown {
  name: string;
  leads: number;
  spend: number;
  color: string;
}

interface CampaignSnapshot {
  name: string;
  objective: string;
  status: 'Active' | 'Completed';
  spend: number;
  leads: number;
}

const performanceData: DailyPerformance[] = [
  { date: '2025-01-01', reach: 3200, impressions: 5100, clicks: 120, visits: 85, spend: 42 },
  { date: '2025-01-02', reach: 3600, impressions: 5600, clicks: 132, visits: 96, spend: 47 },
  { date: '2025-01-03', reach: 3800, impressions: 5900, clicks: 140, visits: 103, spend: 51 },
  { date: '2025-01-04', reach: 4100, impressions: 6300, clicks: 155, visits: 110, spend: 55 },
  { date: '2025-01-05', reach: 3950, impressions: 6100, clicks: 147, visits: 101, spend: 52 },
  { date: '2025-01-06', reach: 4250, impressions: 6500, clicks: 161, visits: 118, spend: 57 },
  { date: '2025-01-07', reach: 4450, impressions: 6800, clicks: 173, visits: 124, spend: 60 },
];

const channelBreakdown: ChannelBreakdown[] = [
  { name: 'Facebook', leads: 52, spend: 230, color: '#3b82f6' },
  { name: 'Instagram', leads: 37, spend: 180, color: '#ec4899' },
  { name: 'WhatsApp', leads: 29, spend: 90, color: '#10b981' },
];

const campaigns: CampaignSnapshot[] = [
  { name: 'T2 Mao Tse Tung', objective: 'Leads', status: 'Active', spend: 68, leads: 19 },
  { name: 'T2 Polana Cimento', objective: 'Messages', status: 'Completed', spend: 54, leads: 14 },
  { name: 'Flat TP2 Central', objective: 'Traffic', status: 'Completed', spend: 48, leads: 11 },
  { name: 'T3 Kings Village', objective: 'Leads', status: 'Completed', spend: 32, leads: 9 },
];

const Dashboard: React.FC = () => {
  const totals = useMemo(() => {
    const reach = performanceData.reduce((sum, day) => sum + day.reach, 0);
    const impressions = performanceData.reduce((sum, day) => sum + day.impressions, 0);
    const clicks = performanceData.reduce((sum, day) => sum + day.clicks, 0);
    const visits = performanceData.reduce((sum, day) => sum + day.visits, 0);
    const spend = performanceData.reduce((sum, day) => sum + day.spend, 0);

    return { reach, impressions, clicks, visits, spend };
  }, []);

  const ctr = useMemo(() => {
    if (!totals.impressions) {
      return '0.0%';
    }
    return `${((totals.clicks / totals.impressions) * 100).toFixed(1)}%`;
  }, [totals.clicks, totals.impressions]);

  const costPerLead = useMemo(() => {
    const leads = campaigns.reduce((sum, campaign) => sum + campaign.leads, 0);
    if (!leads) {
      return '$0.00';
    }
    return `$${(totals.spend / leads).toFixed(2)}`;
  }, [totals.spend]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">WOOW Imobiliária</h1>
            <p className="text-sm text-slate-600">Resumo de desempenho digital</p>
          </div>
          <p className="text-xs text-slate-500">Atualizado automaticamente com dados de janeiro de 2025</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Alcance total</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{totals.reach.toLocaleString()}</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </span>
            </div>
            <p className="mt-3 text-xs text-green-600">+9% vs semana anterior</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Investimento total</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">${totals.spend.toFixed(2)}</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500">CPL médio: {costPerLead}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Cliques</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{totals.clicks.toLocaleString()}</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100">
                <MousePointer className="h-6 w-6 text-purple-600" />
              </span>
            </div>
            <p className="mt-3 text-xs text-blue-600">CTR médio: {ctr}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Visitas ao site</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{totals.visits.toLocaleString()}</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100">
                <Eye className="h-6 w-6 text-orange-600" />
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500">Sessões qualificadas: 74%</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-900">Tendência de alcance e impressões</h2>
              <span className="text-xs text-slate-500">Últimos 7 dias</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="reach" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Alcance" />
                <Area type="monotone" dataKey="impressions" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="Impressões" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-lg font-medium text-slate-900">Distribuição de leads por canal</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={channelBreakdown} dataKey="leads" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                  {channelBreakdown.map((channel) => (
                    <Cell key={channel.name} fill={channel.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {channelBreakdown.map((channel) => (
                <div key={channel.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: channel.color }} />
                    {channel.name}
                  </span>
                  <span className="font-medium text-slate-900">{channel.leads} leads</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-900">Visitas qualificadas</h2>
              <span className="text-xs text-slate-500">Tráfego orgânico + pago</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="visits" fill="#6366f1" name="Visitas" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-lg font-medium text-slate-900">Campanhas recentes</h2>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.name} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">{campaign.name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        campaign.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {campaign.status === 'Active' ? 'Ativa' : 'Concluída'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">Objetivo: {campaign.objective}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Investimento: ${campaign.spend.toFixed(0)}</span>
                    <span>Leads gerados: {campaign.leads}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <p className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} WOOW Imobiliária · Painel BI simplificado para apresentação executiva
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
