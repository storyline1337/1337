import React, { useState, useEffect } from 'react';
import { MapPin, Calculator, TrendingUp, AlertTriangle, Euro, Home, BarChart3, Settings, Search, Filter } from 'lucide-react';

const RealEstateInvestmentTool = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [calculatorData, setCalculatorData] = useState({
    purchasePrice: 300000,
    downPayment: 60000,
    monthlyRent: 1500,
    renovationCost: 20000,
    managementFee: 8,
    vacancy: 5
  });

  // Sample data for European regions
  const regions = [
    {
      id: 'berlin',
      name: 'Berlin',
      country: 'Germany',
      avgPrice: 4500,
      rentYield: 3.2,
      priceGrowth: 5.8,
      regulations: ['Mietpreisbremse', 'Rent Cap'],
      riskLevel: 'Medium',
      coordinates: { x: 52, y: 28 }
    },
    {
      id: 'munich',
      name: 'Munich',
      country: 'Germany',
      avgPrice: 8200,
      rentYield: 2.8,
      priceGrowth: 4.2,
      regulations: ['Mietpreisbremse'],
      riskLevel: 'Low',
      coordinates: { x: 48, y: 35 }
    },
    {
      id: 'vienna',
      name: 'Vienna',
      country: 'Austria',
      avgPrice: 5100,
      rentYield: 3.5,
      priceGrowth: 3.9,
      regulations: ['Social Housing Priority'],
      riskLevel: 'Low',
      coordinates: { x: 58, y: 42 }
    },
    {
      id: 'amsterdam',
      name: 'Amsterdam',
      country: 'Netherlands',
      avgPrice: 6800,
      rentYield: 4.1,
      priceGrowth: 7.2,
      regulations: ['Rent Control', 'Tourist Rental Ban'],
      riskLevel: 'High',
      coordinates: { x: 35, y: 18 }
    },
    {
      id: 'prague',
      name: 'Prague',
      country: 'Czech Republic',
      avgPrice: 2900,
      rentYield: 5.2,
      priceGrowth: 8.1,
      regulations: ['Foreign Ownership Restrictions'],
      riskLevel: 'Medium',
      coordinates: { x: 62, y: 48 }
    }
  ];

  const calculateROI = () => {
    const { purchasePrice, downPayment, monthlyRent, renovationCost, managementFee, vacancy } = calculatorData;
    const totalInvestment = downPayment + renovationCost;
    const annualRent = monthlyRent * 12;
    const effectiveRent = annualRent * (1 - vacancy / 100) * (1 - managementFee / 100);
    const roi = ((effectiveRent / totalInvestment) * 100).toFixed(1);
    const cashFlow = (effectiveRent / 12).toFixed(0);
    
    return { roi, cashFlow, effectiveRent: effectiveRent.toFixed(0) };
  };

  const MapExplorer = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
        <h2 className="text-2xl font-bold mb-2">European Investment Map</h2>
        <p>Explore real estate opportunities across major European markets</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Market Overview</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Price/m²</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Yield</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Growth</button>
              </div>
            </div>
            
            {/* Simplified map visualization */}
            <div className="relative bg-gray-50 rounded-lg h-80 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50"></div>
              {regions.map((region) => (
                <div
                  key={region.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${region.coordinates.x}%`, top: `${region.coordinates.y}%` }}
                  onClick={() => setSelectedRegion(region)}
                >
                  <div className={`w-4 h-4 rounded-full shadow-lg transition-all duration-200 group-hover:scale-125 ${
                    region.riskLevel === 'Low' ? 'bg-green-500' :
                    region.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="font-semibold">{region.name}</div>
                    <div>€{region.avgPrice}/m²</div>
                    <div>{region.rentYield}% yield</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-lg border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Active Regulations
            </h4>
            <div className="space-y-2">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="font-medium text-red-800">Berlin Rent Cap</div>
                <div className="text-sm text-red-600">Max €9.80/m² for existing properties</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="font-medium text-amber-800">Amsterdam Tourist Ban</div>
                <div className="text-sm text-amber-600">Short-term rentals restricted in city center</div>
              </div>
            </div>
          </div>
          
          {selectedRegion && (
            <div className="bg-white rounded-xl p-4 shadow-lg border">
              <h4 className="font-semibold mb-3">{selectedRegion.name} Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Avg Price:</span>
                  <span className="font-medium">€{selectedRegion.avgPrice}/m²</span>
                </div>
                <div className="flex justify-between">
                  <span>Rent Yield:</span>
                  <span className="font-medium">{selectedRegion.rentYield}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Price Growth:</span>
                  <span className="font-medium text-green-600">+{selectedRegion.priceGrowth}%</span>
                </div>
                <div className="pt-2">
                  <span className="text-xs text-gray-600">Regulations:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRegion.regulations.map((reg, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const InvestmentCalculator = () => {
    const results = calculateROI();
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-xl text-white">
          <h2 className="text-2xl font-bold mb-2">Investment Calculator</h2>
          <p>Calculate ROI and cash flow for your investment scenarios</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <h3 className="text-lg font-semibold mb-4">Property Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (€)</label>
                <input
                  type="number"
                  value={calculatorData.purchasePrice}
                  onChange={(e) => setCalculatorData({...calculatorData, purchasePrice: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment (€)</label>
                <input
                  type="number"
                  value={calculatorData.downPayment}
                  onChange={(e) => setCalculatorData({...calculatorData, downPayment: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (€)</label>
                <input
                  type="number"
                  value={calculatorData.monthlyRent}
                  onChange={(e) => setCalculatorData({...calculatorData, monthlyRent: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Renovation Cost (€)</label>
                <input
                  type="number"
                  value={calculatorData.renovationCost}
                  onChange={(e) => setCalculatorData({...calculatorData, renovationCost: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Management Fee (%)</label>
                  <input
                    type="number"
                    value={calculatorData.managementFee}
                    onChange={(e) => setCalculatorData({...calculatorData, managementFee: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vacancy Rate (%)</label>
                  <input
                    type="number"
                    value={calculatorData.vacancy}
                    onChange={(e) => setCalculatorData({...calculatorData, vacancy: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Investment Results</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">{results.roi}%</div>
                  <div className="text-sm text-green-600">Annual ROI</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">€{results.cashFlow}</div>
                  <div className="text-sm text-blue-600">Monthly Cash Flow</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span>Annual Net Income:</span>
                  <span className="font-medium">€{results.effectiveRent}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Total Investment:</span>
                  <span className="font-medium">€{(calculatorData.downPayment + calculatorData.renovationCost).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <h4 className="font-semibold mb-3">What-If Scenarios</h4>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="font-medium">Rent increases by 3% annually</div>
                  <div className="text-sm text-gray-600">ROI after 5 years: {(parseFloat(results.roi) + 1.8).toFixed(1)}%</div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="font-medium">Property value grows by 4%</div>
                  <div className="text-sm text-gray-600">Total return increases by 12%</div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="font-medium">Higher vacancy (8%)</div>
                  <div className="text-sm text-gray-600">ROI drops to {(parseFloat(results.roi) - 0.4).toFixed(1)}%</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MarketIntelligence = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl text-white">
        <h2 className="text-2xl font-bold mb-2">Market Intelligence</h2>
        <p>Stay updated on regulations, trends, and opportunities</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <h3 className="text-lg font-semibold mb-4">Recent Regulatory Changes</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-800">Germany - Berlin</span>
                  <span className="text-xs text-red-600">2 days ago</span>
                </div>
                <p className="text-sm text-red-700">Rent cap legislation extended through 2025. Maximum allowable rent remains at €9.80/m² for properties built before 2014.</p>
              </div>
              
              <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-800">Netherlands - Amsterdam</span>
                  <span className="text-xs text-amber-600">1 week ago</span>
                </div>
                <p className="text-sm text-amber-700">New restrictions on tourist rentals in historic districts. Properties can only be rented for tourism 30 days per year maximum.</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Austria - Vienna</span>
                  <span className="text-xs text-green-600">2 weeks ago</span>
                </div>
                <p className="text-sm text-green-700">Tax incentives introduced for energy-efficient renovations. Up to 30% tax credit for sustainable building upgrades.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <h3 className="text-lg font-semibold mb-4">Market Trends</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Price Development</h4>
                {regions.slice(0, 3).map((region) => (
                  <div key={region.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{region.name}</span>
                    <span className={`text-sm font-medium ${region.priceGrowth > 5 ? 'text-green-600' : 'text-gray-600'}`}>
                      +{region.priceGrowth}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Rental Yields</h4>
                {regions.slice(0, 3).map((region) => (
                  <div key={region.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{region.name}</span>
                    <span className="text-sm font-medium text-blue-600">{region.rentYield}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-lg border">
            <h4 className="font-semibold mb-3">Investment Alerts</h4>
            <div className="space-y-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="font-medium text-blue-800">Prague Opportunity</div>
                <div className="text-sm text-blue-600">Prices 15% below regional average</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="font-medium text-green-800">Vienna Incentives</div>
                <div className="text-sm text-green-600">New renovation tax credits available</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg border">
            <h4 className="font-semibold mb-3">Upcoming Changes</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Berlin Tax Reform</span>
                <span className="text-gray-500">Q3 2025</span>
              </div>
              <div className="flex justify-between">
                <span>EU Energy Standards</span>
                <span className="text-gray-500">Jan 2026</span>
              </div>
              <div className="flex justify-between">
                <span>Amsterdam Zoning Update</span>
                <span className="text-gray-500">Q4 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'map', label: 'Market Explorer', icon: MapPin },
    { id: 'calculator', label: 'ROI Calculator', icon: Calculator },
    { id: 'intelligence', label: 'Market Intel', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RE-Invest EU</h1>
                <p className="text-xs text-gray-500">European Real Estate Investment Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'map' && <MapExplorer />}
        {activeTab === 'calculator' && <InvestmentCalculator />}
        {activeTab === 'intelligence' && <MarketIntelligence />}
      </main>
    </div>
  );
};

export default RealEstateInvestmentTool;