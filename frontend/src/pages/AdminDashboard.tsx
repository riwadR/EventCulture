import React, { useState } from "react";
import {
  HiMiniUsers as Users,
  HiMiniBookOpen as Book,
  HiMiniCalendar as Calendar,
  HiMiniMapPin as MapPin,
  HiMiniArrowTrendingUp as TrendingUp,
  HiMiniExclamationTriangle as AlertTriangle,
  HiMiniCheckCircle as CheckCircle,
  HiMiniClock as Clock,
  HiMiniEye as Eye,
  HiMiniHandThumbUp as ThumbsUp,
  HiMiniChatBubbleOvalLeftEllipsis as MessageCircle,
  HiMiniCog6Tooth as Settings,
  HiMiniArrowDownTray as Download,
  HiMiniArrowPath as RefreshCw,
  HiMiniFunnel as Filter,
  HiMiniMagnifyingGlass as Search,
  HiMiniEllipsisVertical as MoreVertical,
  HiMiniPencilSquare as Edit,
  HiMiniTrash as Trash2,
  HiMiniNoSymbol as Ban,
   HiMiniCheck as Check,
  HiMiniDocumentText as FileText,
  HiMiniPresentationChartBar as BarChart3,
  HiMiniChartPie as PieChart,
  HiMiniBolt as Activity,
  HiMiniShieldCheck as Shield,
  HiMiniBell as Bell,
  HiMiniFlag as Flag,
} from "react-icons/hi2";

// =============================================================================
// DONNÉES SIMULÉES
// =============================================================================

const statsData = {
  overview: [
    { label: "Utilisateurs", value: "1,247", change: "+12%", trend: "up", icon: Users, color: "blue" },
    { label: "Œuvres", value: "2,847", change: "+8%", trend: "up", icon: Book, color: "green" },
    { label: "Événements", value: "189", change: "+23%", trend: "up", icon: Calendar, color: "purple" },
    { label: "Sites patrimoniaux", value: "567", change: "+5%", trend: "up", icon: MapPin, color: "orange" }
  ],
  moderation: [
    { label: "En attente", value: "42", type: "pending", icon: Clock, color: "yellow" },
    { label: "Signalements", value: "7", type: "reports", icon: Flag, color: "red" },
    { label: "Professionnels à valider", value: "15", type: "professionals", icon: Check, color: "blue" },
    { label: "Contenus sensibles", value: "3", type: "sensitive", icon: AlertTriangle, color: "orange" }
  ]
};

const recentActivity = [
  { id: 1, type: "user_registration", message: "Nouvel utilisateur inscrit", user: "Amina Benali", time: "2 min", status: "info" },
  { id: 2, type: "content_published", message: "Nouvelle œuvre publiée", user: "Omar Khelifi", time: "15 min", status: "success" },
  { id: 3, type: "content_reported", message: "Contenu signalé", user: "Système", time: "1h", status: "warning" },
  { id: 4, type: "event_created", message: "Nouvel événement créé", user: "Leila Saadi", time: "2h", status: "info" },
  { id: 5, type: "user_suspended", message: "Utilisateur suspendu", user: "Admin", time: "3h", status: "error" }
];

const pendingItems = [
  { id: 1, type: "oeuvre", title: "Roman historique sur la guerre d'indépendance", author: "Rachid Messaoud", date: "2025-06-01", status: "pending" },
  { id: 2, type: "evenement", title: "Festival de musique traditionnelle", author: "Fatima Benaissa", date: "2025-05-30", status: "pending" },
  { id: 3, type: "lieu", title: "Site archéologique de Djémila", author: "Mohamed Cherif", date: "2025-05-29", status: "pending" }
];

const reportedContent = [
  { id: 1, type: "commentaire", content: "Commentaire inapproprié sur \"L'Étranger\"", reporter: "Amina B.", reason: "Contenu offensant", date: "2025-06-01", severity: "high" },
  { id: 2, type: "oeuvre", content: "Image inappropriée dans la galerie", reporter: "Omar K.", reason: "Contenu non approprié", date: "2025-05-31", severity: "medium" }
];

const analyticsData = {
  visitors: [
    { month: "Jan", value: 4000 },
    { month: "Fév", value: 3000 },
    { month: "Mar", value: 5000 },
    { month: "Avr", value: 4500 },
    { month: "Mai", value: 6000 },
    { month: "Juin", value: 5500 }
  ],
  topContent: [
    { title: "L'Étranger - Albert Camus", views: 2547, type: "oeuvre" },
    { title: "Festival International du Film d'Alger", views: 1823, type: "evenement" },
    { title: "Casbah d'Alger", views: 1456, type: "lieu" },
    { title: "Nedjma - Kateb Yacine", views: 1234, type: "oeuvre" },
    { title: "Concert de Musique Andalouse", views: 987, type: "evenement" }
  ]
};

// =============================================================================
// COMPOSANTS
// =============================================================================

const StatCard: React.FC<{
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: any;
  color: string;
}> = ({ label, value, change, trend, icon: Icon, color }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    orange: "text-orange-600 bg-orange-100",
    yellow: "text-yellow-600 bg-yellow-100",
    red: "text-red-600 bg-red-100",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p
              className={`text-sm flex items-center mt-1 ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp size={14} className="mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

const QuickAction: React.FC<{
  title: string;
  description: string;
  icon: any;
  color: string;
  onClick: () => void;
}> = ({ title, description, icon: Icon, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all text-left w-full"
    >
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </button>
  );
};

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  const tabs = [
    { id: "overview", name: "Vue d'ensemble", icon: BarChart3 },
    { id: "content", name: "Contenu", icon: FileText },
    { id: "users", name: "Utilisateurs", icon: Users },
    { id: "moderation", name: "Modération", icon: Shield },
    { id: "analytics", name: "Analyses", icon: PieChart },
    { id: "settings", name: "Paramètres", icon: Settings },
  ];

  const timeRanges = [
    { value: "24h", label: "24 heures" },
    { value: "7d", label: "7 jours" },
    { value: "30d", label: "30 jours" },
    { value: "90d", label: "3 mois" },
    { value: "1y", label: "1 an" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="text-red-600" size={24} />
                <h1 className="text-xl font-semibold text-gray-900">Administration</h1>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Mode Admin
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sélecteur de période */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Rafraîchir */}
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation par onglets */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Statistiques principales */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques générales</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {statsData.overview.map((stat, index) => (
    <StatCard key={index} {...stat} trend={stat.trend as "up" | "down"} />
  ))}
</div>

            </div>

            {/* Modération */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Modération</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.moderation.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Activité récente */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          activity.status === "success" ? "bg-green-100 text-green-600"
                          : activity.status === "warning" ? "bg-yellow-100 text-yellow-600"
                          : activity.status === "error" ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                        }`}>
                          <Activity size={14} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">
                            {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Actions rapides</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <QuickAction
                      title="Valider les professionnels"
                      description="15 comptes en attente"
                      icon={Check}
                      color="text-blue-600 bg-blue-100"
                      onClick={() => setActiveTab("users")}
                    />
                    <QuickAction
                      title="Modérer le contenu"
                      description="42 éléments à examiner"
                      icon={Shield}
                      color="text-yellow-600 bg-yellow-100"
                      onClick={() => setActiveTab("moderation")}
                    />
                    <QuickAction
                      title="Gérer les signalements"
                      description="7 signalements actifs"
                      icon={Flag}
                      color="text-red-600 bg-red-100"
                      onClick={() => setActiveTab("moderation")}
                    />
                    <QuickAction
                      title="Exporter les données"
                      description="Télécharger les rapports"
                      icon={Download}
                      color="text-green-600 bg-green-100"
                      onClick={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-6">
            {/* Filtres et recherche */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher du contenu..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter size={16} />
                    <span>Filtres</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="all">Tous les types</option>
                    <option value="oeuvres">Œuvres</option>
                    <option value="evenements">Événements</option>
                    <option value="lieux">Lieux</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="published">Publié</option>
                    <option value="rejected">Rejeté</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Contenu en attente de validation */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Contenu en attente de validation</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.type === "oeuvre" ? "bg-blue-100 text-blue-800"
                            : item.type === "evenement" ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                          }`}>
                            {item.type === "oeuvre"
                              ? "Œuvre"
                              : item.type === "evenement"
                              ? "Événement"
                              : "Lieu"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.author}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.date).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-emerald-600 hover:text-emerald-900">
                              <CheckCircle size={16} />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 size={16} />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "moderation" && (
          <div className="space-y-6">
            {/* Signalements */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Signalements actifs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contenu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signalé par</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raison</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sévérité</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportedContent.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {report.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{report.content}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reporter}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reason}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            report.severity === "high"
                              ? "bg-red-100 text-red-800"
                              : report.severity === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                            {report.severity === "high"
                              ? "Élevée"
                              : report.severity === "medium"
                              ? "Moyenne"
                              : "Faible"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye size={16} />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <CheckCircle size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Ban size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visiteurs par mois */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Visiteurs par mois</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {analyticsData.visitors.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-blue-500 rounded-t w-full"
                        style={{ height: `${(data.value / 6000) * 200}px` }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contenu populaire */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenu le plus consulté</h3>
                <div className="space-y-3">
                  {analyticsData.topContent.map((content, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{content.title}</p>
                          <p className="text-xs text-gray-500 capitalize">{content.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Eye size={14} />
                        <span>{content.views.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
