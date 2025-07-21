import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Calculator, TrendingUp, AlertTriangle, Euro, Home, BarChart3, Settings, Search, Filter, 
         Bell, BookmarkPlus, Eye, EyeOff, RefreshCw, Zap, Target, PieChart, LineChart, 
         Heart, Share, Download, Plus, Minus, Play, Pause, Maximize2 } from 'lucide-react';

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

  // New interactive state
  const [mapView, setMapView] = useState('price'); // price, yield, growth, risk
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    yieldRange: [0, 8],
    riskLevel: ['Low', 'Medium', 'High'],
    countries: []
  });
  const [animatedMarkers, setAnimatedMarkers] = useState(true);
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('1y');
  const [favoriteRegions, setFavoriteRegions] = useState([]);
  const [fullscreenMap, setFullscreenMap] = useState(false);

  // Enhanced data for European regions with historical data
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
      coordinates: { x: 52, y: 28 },
      population: 3.7,
      gdpGrowth: 2.1,
      unemployment: 8.2,
      marketScore: 7.2,
      liquidity: 'High',
      futureProjects: ['Tesla Gigafactory', 'New Airport Expansion'],
      priceHistory: [4200, 4350, 4500],
      yieldHistory: [3.5, 3.3, 3.2],
      vacancy: 3.1,
      avgRentPerSqm: 14.4
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
      coordinates: { x: 48, y: 35 },
      population: 1.5,
      gdpGrowth: 3.2,
      unemployment: 3.1,
      marketScore: 8.9,
      liquidity: 'Very High',
      futureProjects: ['Olympic Bid 2032', 'Tech Hub Expansion'],
      priceHistory: [7800, 8000, 8200],
      yieldHistory: [3.0, 2.9, 2.8],
      vacancy: 1.8,
      avgRentPerSqm: 22.9
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
      coordinates: { x: 58, y: 42 },
      population: 1.9,
      gdpGrowth: 2.7,
      unemployment: 6.8,
      marketScore: 8.1,
      liquidity: 'High',
      futureProjects: ['Smart City Initiative', 'Green Building Program'],
      priceHistory: [4900, 5000, 5100],
      yieldHistory: [3.7, 3.6, 3.5],
      vacancy: 2.3,
      avgRentPerSqm: 17.9
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
      coordinates: { x: 35, y: 18 },
      population: 0.9,
      gdpGrowth: 3.8,
      unemployment: 4.2,
      marketScore: 7.8,
      liquidity: 'Very High',
      futureProjects: ['Port Expansion', 'Sustainable Housing'],
      priceHistory: [6200, 6500, 6800],
      yieldHistory: [4.5, 4.3, 4.1],
      vacancy: 2.1,
      avgRentPerSqm: 27.9
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
      coordinates: { x: 62, y: 48 },
      population: 1.3,
      gdpGrowth: 4.1,
      unemployment: 3.8,
      marketScore: 8.3,
      liquidity: 'Medium',
      futureProjects: ['Metro Extension', 'Tech District'],
      priceHistory: [2600, 2750, 2900],
      yieldHistory: [5.8, 5.5, 5.2],
      vacancy: 4.2,
      avgRentPerSqm: 15.1
    },
    {
      id: 'paris',
      name: 'Paris',
      country: 'France',
      avgPrice: 9100,
      rentYield: 2.9,
      priceGrowth: 3.8,
      regulations: ['Rent Control', 'Airbnb Restrictions'],
      riskLevel: 'Medium',
      coordinates: { x: 40, y: 30 },
      population: 2.2,
      gdpGrowth: 2.3,
      unemployment: 7.1,
      marketScore: 8.7,
      liquidity: 'Very High',
      futureProjects: ['Grand Paris Express', 'Olympic Legacy'],
      priceHistory: [8700, 8900, 9100],
      yieldHistory: [3.2, 3.0, 2.9],
      vacancy: 2.8,
      avgRentPerSqm: 26.4
    },
    {
      id: 'barcelona',
      name: 'Barcelona',
      country: 'Spain',
      avgPrice: 3800,
      rentYield: 4.3,
      priceGrowth: 6.2,
      regulations: ['Tourist Rental Moratorium'],
      riskLevel: 'Medium',
      coordinates: { x: 32, y: 55 },
      population: 1.6,
      gdpGrowth: 3.1,
      unemployment: 11.2,
      marketScore: 7.4,
      liquidity: 'High',
      futureProjects: ['Sagrada Familia Completion', 'Smart Beaches'],
      priceHistory: [3400, 3600, 3800],
      yieldHistory: [4.8, 4.5, 4.3],
      vacancy: 3.9,
      avgRentPerSqm: 16.3
    },
    {
      id: 'zurich',
      name: 'Zurich',
      country: 'Switzerland',
      avgPrice: 12500,
      rentYield: 2.1,
      priceGrowth: 2.8,
      regulations: ['Foreign Buyer Restrictions'],
      riskLevel: 'Low',
      coordinates: { x: 50, y: 38 },
      population: 0.4,
      gdpGrowth: 1.9,
      unemployment: 2.4,
      marketScore: 9.1,
      liquidity: 'Medium',
      futureProjects: ['Financial District Expansion'],
      priceHistory: [12100, 12300, 12500],
      yieldHistory: [2.3, 2.2, 2.1],
      vacancy: 1.2,
      avgRentPerSqm: 26.3
    }
  ];

  // Live data simulation and utility functions
  useEffect(() => {
    if (liveUpdates) {
      const interval = setInterval(() => {
        // Simulate live market updates
        const randomRegion = regions[Math.floor(Math.random() * regions.length)];
        const changeType = Math.random() > 0.5 ? 'price' : 'yield';
        const change = (Math.random() - 0.5) * 0.2; // ±10% change
        
        if (Math.random() > 0.9) { // 10% chance of notification
          const newNotification = {
            id: Date.now(),
            type: changeType === 'price' ? 'price_alert' : 'yield_alert',
            region: randomRegion.name,
            message: `${randomRegion.name} ${changeType} ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change * 100).toFixed(1)}%`,
            timestamp: new Date().toLocaleTimeString(),
            severity: Math.abs(change) > 0.05 ? 'high' : 'medium'
          };
          
          setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [liveUpdates, regions]);

  // Filter regions based on search and filters
  const filteredRegions = useMemo(() => {
    return regions.filter(region => {
      const matchesSearch = region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           region.country.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPrice = region.avgPrice >= filters.priceRange[0] && region.avgPrice <= filters.priceRange[1];
      const matchesYield = region.rentYield >= filters.yieldRange[0] && region.rentYield <= filters.yieldRange[1];
      const matchesRisk = filters.riskLevel.includes(region.riskLevel);
      const matchesCountry = filters.countries.length === 0 || filters.countries.includes(region.country);
      
      return matchesSearch && matchesPrice && matchesYield && matchesRisk && matchesCountry;
    });
  }, [regions, searchQuery, filters]);

  // Utility functions
  const toggleFavorite = useCallback((regionId) => {
    setFavoriteRegions(prev => 
      prev.includes(regionId) 
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  }, []);

  const calculateROI = useCallback(() => {
    const { purchasePrice, downPayment, monthlyRent, renovationCost, managementFee, vacancy } = calculatorData;
    const totalInvestment = downPayment + renovationCost;
    const annualRent = monthlyRent * 12;
    const effectiveRent = annualRent * (1 - vacancy / 100) * (1 - managementFee / 100);
    const roi = ((effectiveRent / totalInvestment) * 100).toFixed(1);
    const cashFlow = (effectiveRent / 12).toFixed(0);
    
    return { roi, cashFlow, effectiveRent: effectiveRent.toFixed(0) };
  }, [calculatorData]);

  const saveScenario = useCallback((name) => {
    const results = calculateROI();
    const scenario = {
      id: Date.now(),
      name,
      data: { ...calculatorData },
      results,
      timestamp: new Date().toISOString()
    };
    setSavedScenarios(prev => [scenario, ...prev]);
  }, [calculatorData, calculateROI]);

  const toggleRegionSelection = useCallback((region) => {
    if (compareMode) {
      setSelectedRegions(prev => {
        const isSelected = prev.find(r => r.id === region.id);
        if (isSelected) {
          return prev.filter(r => r.id !== region.id);
        } else if (prev.length < 3) {
          return [...prev, region];
        }
        return prev;
      });
    } else {
      setSelectedRegion(region);
    }
  }, [compareMode]);

  const getMarkerColor = useCallback((region) => {
    switch (mapView) {
      case 'price':
        return region.avgPrice > 7000 ? 'bg-red-500' : 
               region.avgPrice > 4000 ? 'bg-yellow-500' : 'bg-green-500';
      case 'yield':
        return region.rentYield > 4 ? 'bg-green-500' :
               region.rentYield > 3 ? 'bg-yellow-500' : 'bg-red-500';
      case 'growth':
        return region.priceGrowth > 6 ? 'bg-green-500' :
               region.priceGrowth > 4 ? 'bg-yellow-500' : 'bg-red-500';
      case 'risk':
        return region.riskLevel === 'Low' ? 'bg-green-500' :
               region.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  }, [mapView]);

  const getMarkerSize = useCallback((region) => {
    switch (mapView) {
      case 'price':
        return region.avgPrice > 8000 ? 'w-6 h-6' : region.avgPrice > 5000 ? 'w-5 h-5' : 'w-4 h-4';
      case 'yield':
        return region.rentYield > 4.5 ? 'w-6 h-6' : region.rentYield > 3.5 ? 'w-5 h-5' : 'w-4 h-4';
      default:
        return 'w-4 h-4';
    }
  }, [mapView]);



  const MapExplorer = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">European Investment Map</h2>
            <p>Explore real estate opportunities across major European markets</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiveUpdates(!liveUpdates)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                liveUpdates ? 'bg-green-500 text-white' : 'bg-white/20 text-white'
              }`}
            >
              {liveUpdates ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              Live Updates
            </button>
            <button
              onClick={() => setFullscreenMap(!fullscreenMap)}
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search cities or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                compareMode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Target className="w-4 h-4" />
              Compare Mode
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAnimatedMarkers(!animatedMarkers)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                animatedMarkers ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              Animations
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{notifications.length} alerts</span>
          </div>
        </div>
        
        {/* Price and Yield Range Filters */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (€/m²)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="15000"
                step="500"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priceRange: [Number(e.target.value), prev.priceRange[1]]
                }))}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 w-16">€{filters.priceRange[0]}</span>
              <span className="text-xs text-gray-500">to</span>
              <input
                type="range"
                min="0"
                max="15000"
                step="500"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], Number(e.target.value)]
                }))}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 w-16">€{filters.priceRange[1]}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Yield Range (%)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="8"
                step="0.1"
                value={filters.yieldRange[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  yieldRange: [Number(e.target.value), prev.yieldRange[1]]
                }))}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 w-12">{filters.yieldRange[0]}%</span>
              <span className="text-xs text-gray-500">to</span>
              <input
                type="range"
                min="0"
                max="8"
                step="0.1"
                value={filters.yieldRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  yieldRange: [prev.yieldRange[0], Number(e.target.value)]
                }))}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 w-12">{filters.yieldRange[1]}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className={`bg-white rounded-xl p-6 shadow-lg border transition-all duration-300 ${
            fullscreenMap ? 'fixed inset-4 z-50' : ''
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Market Overview</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setMapView('price')}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    mapView === 'price' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Price/m²
                </button>
                <button 
                  onClick={() => setMapView('yield')}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    mapView === 'yield' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Yield
                </button>
                <button 
                  onClick={() => setMapView('growth')}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    mapView === 'growth' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Growth
                </button>
                <button 
                  onClick={() => setMapView('risk')}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    mapView === 'risk' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Risk
                </button>
              </div>
            </div>
            
            {/* Enhanced map visualization */}
            <div className={`relative bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 rounded-lg overflow-hidden transition-all ${
              fullscreenMap ? 'h-[calc(100vh-200px)]' : 'h-80'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50"></div>
              
              {/* Live notifications overlay */}
              {notifications.length > 0 && (
                <div className="absolute top-4 right-4 space-y-2 z-10">
                  {notifications.slice(0, 2).map((notification) => (
                    <div
                      key={notification.id}
                      className={`bg-white border-l-4 p-3 rounded shadow-lg text-xs max-w-64 animate-pulse ${
                        notification.severity === 'high' ? 'border-red-500' : 'border-yellow-500'
                      }`}
                    >
                      <div className="font-medium">{notification.region}</div>
                      <div className="text-gray-600">{notification.message}</div>
                      <div className="text-gray-400 text-xs mt-1">{notification.timestamp}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {filteredRegions.map((region) => {
                const isSelected = compareMode ? selectedRegions.find(r => r.id === region.id) : selectedRegion?.id === region.id;
                const isFavorite = favoriteRegions.includes(region.id);
                
                return (
                  <div
                    key={region.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ left: `${region.coordinates.x}%`, top: `${region.coordinates.y}%` }}
                    onClick={() => toggleRegionSelection(region)}
                  >
                    <div className={`${getMarkerSize(region)} ${getMarkerColor(region)} rounded-full shadow-lg transition-all duration-300 group-hover:scale-125 ${
                      isSelected ? 'ring-4 ring-blue-300 scale-125' : ''
                    } ${animatedMarkers ? 'animate-pulse' : ''}`}>
                      {isFavorite && (
                        <Heart className="w-2 h-2 text-white absolute inset-0 m-auto" fill="currentColor" />
                      )}
                    </div>
                    
                    {/* Enhanced tooltip */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-xl text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">{region.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(region.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Heart className={`w-3 h-3 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>€{region.avgPrice}/m²</div>
                        <div>{region.rentYield}% yield</div>
                        <div>+{region.priceGrowth}% growth</div>
                        <div className="text-gray-600">{region.riskLevel} risk</div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="text-gray-600">Score: {region.marketScore}/10</div>
                        <div className="text-gray-600">Pop: {region.population}M</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Map legend */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>
                    {mapView === 'price' && 'Low Price'}
                    {mapView === 'yield' && 'High Yield'}
                    {mapView === 'growth' && 'High Growth'}
                    {mapView === 'risk' && 'Low Risk'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>
                    {mapView === 'price' && 'High Price'}
                    {mapView === 'yield' && 'Low Yield'}
                    {mapView === 'growth' && 'Low Growth'}
                    {mapView === 'risk' && 'High Risk'}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {filteredRegions.length} of {regions.length} cities shown
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Live Notifications */}
          {notifications.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-lg border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                Live Alerts
                <button
                  onClick={() => setNotifications([])}
                  className="ml-auto text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-l-4 p-3 rounded-r-lg text-xs ${
                      notification.severity === 'high' 
                        ? 'bg-red-50 border-red-500' 
                        : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="font-medium">{notification.region}</div>
                    <div className="text-gray-600">{notification.message}</div>
                    <div className="text-gray-400 mt-1">{notification.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Mode */}
          {compareMode && selectedRegions.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-lg border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                Comparison ({selectedRegions.length}/3)
              </h4>
              <div className="space-y-3">
                {selectedRegions.map((region) => (
                  <div key={region.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{region.name}</span>
                      <button
                        onClick={() => setSelectedRegions(prev => prev.filter(r => r.id !== region.id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>€{region.avgPrice}/m²</div>
                      <div>{region.rentYield}% yield</div>
                      <div>+{region.priceGrowth}%</div>
                      <div className="text-gray-600">{region.riskLevel}</div>
                    </div>
                  </div>
                ))}
                
                {selectedRegions.length >= 2 && (
                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-600 mb-2">Quick Compare:</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Best Yield:</span>
                        <span className="font-medium text-green-600">
                          {selectedRegions.reduce((prev, curr) => 
                            prev.rentYield > curr.rentYield ? prev : curr
                          ).name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lowest Price:</span>
                        <span className="font-medium text-blue-600">
                          {selectedRegions.reduce((prev, curr) => 
                            prev.avgPrice < curr.avgPrice ? prev : curr
                          ).name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Best Growth:</span>
                        <span className="font-medium text-purple-600">
                          {selectedRegions.reduce((prev, curr) => 
                            prev.priceGrowth > curr.priceGrowth ? prev : curr
                          ).name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Region Details */}
          {selectedRegion && !compareMode && (
            <div className="bg-white rounded-xl p-4 shadow-lg border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2">
                  {selectedRegion.name} Details
                  <button
                    onClick={() => toggleFavorite(selectedRegion.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Heart className={`w-4 h-4 ${
                      favoriteRegions.includes(selectedRegion.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-400'
                    }`} />
                  </button>
                </h4>
                <div className="flex gap-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Share className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-blue-700">€{selectedRegion.avgPrice}</div>
                    <div className="text-xs text-blue-600">Price/m²</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-green-700">{selectedRegion.rentYield}%</div>
                    <div className="text-xs text-green-600">Rent Yield</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-purple-700">+{selectedRegion.priceGrowth}%</div>
                    <div className="text-xs text-purple-600">Price Growth</div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-amber-700">{selectedRegion.marketScore}</div>
                    <div className="text-xs text-amber-600">Market Score</div>
                  </div>
                </div>

                {/* Market Details */}
                <div className="pt-3 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Population:</span>
                    <span className="font-medium">{selectedRegion.population}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GDP Growth:</span>
                    <span className="font-medium text-green-600">+{selectedRegion.gdpGrowth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unemployment:</span>
                    <span className="font-medium">{selectedRegion.unemployment}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Liquidity:</span>
                    <span className="font-medium">{selectedRegion.liquidity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vacancy Rate:</span>
                    <span className="font-medium">{selectedRegion.vacancy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Rent/m²:</span>
                    <span className="font-medium">€{selectedRegion.avgRentPerSqm}</span>
                  </div>
                </div>

                {/* Future Projects */}
                <div className="pt-3 border-t">
                  <span className="text-xs text-gray-600 mb-2 block">Future Projects:</span>
                  <div className="space-y-1">
                    {selectedRegion.futureProjects.map((project, idx) => (
                      <div key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {project}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regulations */}
                <div className="pt-3 border-t">
                  <span className="text-xs text-gray-600 mb-2 block">Active Regulations:</span>
                  <div className="space-y-1">
                    {selectedRegion.regulations.map((reg, idx) => (
                      <div key={idx} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        {reg}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historical Chart Preview */}
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Price History (3Y):</span>
                    <button
                      onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {chartType === 'line' ? <BarChart3 className="w-3 h-3" /> : <LineChart className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex items-end justify-between h-12 bg-gray-50 rounded px-2 py-1">
                    {selectedRegion.priceHistory.map((price, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-500 rounded-t"
                        style={{ 
                          height: `${(price / Math.max(...selectedRegion.priceHistory)) * 100}%`,
                          width: '20%'
                        }}
                        title={`€${price}`}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>2022</span>
                    <span>2023</span>
                    <span>2024</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Regulations Summary */}
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

          {/* Favorites Quick Access */}
          {favoriteRegions.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-lg border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Favorites ({favoriteRegions.length})
              </h4>
              <div className="space-y-2">
                {favoriteRegions.slice(0, 3).map((regionId) => {
                  const region = regions.find(r => r.id === regionId);
                  return region ? (
                    <button
                      key={regionId}
                      onClick={() => setSelectedRegion(region)}
                      className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-sm">{region.name}</div>
                      <div className="text-xs text-gray-600">€{region.avgPrice}/m² • {region.rentYield}% yield</div>
                    </button>
                  ) : null;
                })}
                {favoriteRegions.length > 3 && (
                  <div className="text-xs text-gray-500 text-center pt-2">
                    +{favoriteRegions.length - 3} more favorites
                  </div>
                )}
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Investment Calculator</h2>
              <p>Calculate ROI and cash flow for your investment scenarios</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const name = prompt('Enter scenario name:');
                  if (name) saveScenario(name);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <BookmarkPlus className="w-4 h-4" />
                Save Scenario
              </button>
            </div>
          </div>
        </div>

        {/* Saved Scenarios */}
        {savedScenarios.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <h3 className="text-lg font-semibold mb-4">Saved Scenarios</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedScenarios.slice(0, 6).map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setCalculatorData(scenario.data)}
                  className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border"
                >
                  <div className="font-medium text-sm mb-1">{scenario.name}</div>
                  <div className="text-xs text-gray-600">ROI: {scenario.results.roi}%</div>
                  <div className="text-xs text-gray-500">
                    {new Date(scenario.timestamp).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <h3 className="text-lg font-semibold mb-4">Property Details</h3>
            <div className="space-y-6">
              {/* Purchase Price with Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Purchase Price</label>
                  <span className="text-sm font-bold text-green-600">€{calculatorData.purchasePrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="10000"
                  value={calculatorData.purchasePrice}
                  onChange={(e) => setCalculatorData({...calculatorData, purchasePrice: Number(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>€50k</span>
                  <span>€2M</span>
                </div>
              </div>

              {/* Down Payment with Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Down Payment</label>
                  <div className="text-sm">
                    <span className="font-bold text-green-600">€{calculatorData.downPayment.toLocaleString()}</span>
                    <span className="text-gray-500 ml-2">
                      ({((calculatorData.downPayment / calculatorData.purchasePrice) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="10000"
                  max={calculatorData.purchasePrice}
                  step="5000"
                  value={calculatorData.downPayment}
                  onChange={(e) => setCalculatorData({...calculatorData, downPayment: Number(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>€10k</span>
                  <span>€{(calculatorData.purchasePrice / 1000).toFixed(0)}k</span>
                </div>
              </div>

              {/* Monthly Rent with Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Monthly Rent</label>
                  <div className="text-sm">
                    <span className="font-bold text-green-600">€{calculatorData.monthlyRent.toLocaleString()}</span>
                    <span className="text-gray-500 ml-2">
                      (€{(calculatorData.monthlyRent * 12).toLocaleString()}/year)
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="300"
                  max="8000"
                  step="50"
                  value={calculatorData.monthlyRent}
                  onChange={(e) => setCalculatorData({...calculatorData, monthlyRent: Number(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>€300</span>
                  <span>€8,000</span>
                </div>
              </div>

              {/* Renovation Cost with Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Renovation Cost</label>
                  <span className="text-sm font-bold text-green-600">€{calculatorData.renovationCost.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="2500"
                  value={calculatorData.renovationCost}
                  onChange={(e) => setCalculatorData({...calculatorData, renovationCost: Number(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>€0</span>
                  <span>€100k</span>
                </div>
              </div>

              {/* Management Fee and Vacancy Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Management Fee</label>
                    <span className="text-sm font-bold text-green-600">{calculatorData.managementFee}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={calculatorData.managementFee}
                    onChange={(e) => setCalculatorData({...calculatorData, managementFee: Number(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Vacancy Rate</label>
                    <span className="text-sm font-bold text-green-600">{calculatorData.vacancy}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={calculatorData.vacancy}
                    onChange={(e) => setCalculatorData({...calculatorData, vacancy: Number(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>15%</span>
                  </div>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="pt-4 border-t">
                <div className="text-sm font-medium text-gray-700 mb-3">Quick Presets:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCalculatorData({
                      purchasePrice: 200000,
                      downPayment: 40000,
                      monthlyRent: 1200,
                      renovationCost: 15000,
                      managementFee: 8,
                      vacancy: 5
                    })}
                    className="p-2 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100 transition-colors"
                  >
                    Starter Property
                  </button>
                  <button
                    onClick={() => setCalculatorData({
                      purchasePrice: 500000,
                      downPayment: 100000,
                      monthlyRent: 2500,
                      renovationCost: 35000,
                      managementFee: 10,
                      vacancy: 4
                    })}
                    className="p-2 bg-green-50 text-green-700 rounded text-sm hover:bg-green-100 transition-colors"
                  >
                    Premium Property
                  </button>
                  <button
                    onClick={() => setCalculatorData({
                      purchasePrice: 150000,
                      downPayment: 30000,
                      monthlyRent: 900,
                      renovationCost: 25000,
                      managementFee: 12,
                      vacancy: 8
                    })}
                    className="p-2 bg-yellow-50 text-yellow-700 rounded text-sm hover:bg-yellow-100 transition-colors"
                  >
                    Fixer-Upper
                  </button>
                  <button
                    onClick={() => setCalculatorData({
                      purchasePrice: 800000,
                      downPayment: 160000,
                      monthlyRent: 3200,
                      renovationCost: 50000,
                      managementFee: 6,
                      vacancy: 3
                    })}
                    className="p-2 bg-purple-50 text-purple-700 rounded text-sm hover:bg-purple-100 transition-colors"
                  >
                    Luxury Investment
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Enhanced Investment Results */}
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Investment Results</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTimeRange('1y')}
                    className={`px-3 py-1 rounded text-sm transition-all ${
                      timeRange === '1y' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    1Y
                  </button>
                  <button
                    onClick={() => setTimeRange('5y')}
                    className={`px-3 py-1 rounded text-sm transition-all ${
                      timeRange === '5y' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    5Y
                  </button>
                  <button
                    onClick={() => setTimeRange('10y')}
                    className={`px-3 py-1 rounded text-sm transition-all ${
                      timeRange === '10y' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    10Y
                  </button>
                </div>
              </div>
              
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">{results.roi}%</div>
                  <div className="text-sm text-green-600">Annual ROI</div>
                  <div className="text-xs text-green-500 mt-1">
                    {parseFloat(results.roi) >= 8 ? '🎯 Excellent' : parseFloat(results.roi) >= 5 ? '✅ Good' : '⚠️ Review'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">€{results.cashFlow}</div>
                  <div className="text-sm text-blue-600">Monthly Cash Flow</div>
                  <div className="text-xs text-blue-500 mt-1">
                    €{(parseFloat(results.cashFlow) * 12).toLocaleString()}/year
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {((calculatorData.monthlyRent * 12 / calculatorData.purchasePrice) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-purple-600">Gross Yield</div>
                  <div className="text-xs text-purple-500 mt-1">Before expenses</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-700">
                    {(calculatorData.downPayment / calculatorData.purchasePrice * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-amber-600">LTV Ratio</div>
                  <div className="text-xs text-amber-500 mt-1">Loan to Value</div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-gray-900">Income Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Gross Annual Rent:</span>
                      <span className="font-medium">€{(calculatorData.monthlyRent * 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>- Vacancy ({calculatorData.vacancy}%):</span>
                      <span>€{((calculatorData.monthlyRent * 12) * (calculatorData.vacancy / 100)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>- Management ({calculatorData.managementFee}%):</span>
                      <span>€{((calculatorData.monthlyRent * 12) * (calculatorData.managementFee / 100)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Net Annual Income:</span>
                      <span className="text-green-600">€{results.effectiveRent}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-gray-900">Investment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Purchase Price:</span>
                      <span className="font-medium">€{calculatorData.purchasePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Down Payment:</span>
                      <span className="font-medium">€{calculatorData.downPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Renovation Cost:</span>
                      <span className="font-medium">€{calculatorData.renovationCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total Investment:</span>
                      <span className="text-blue-600">€{(calculatorData.downPayment + calculatorData.renovationCost).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROI Projection Chart */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3 text-gray-900">ROI Projection ({timeRange})</h4>
                <div className="h-32 bg-gray-50 rounded-lg p-4 flex items-end justify-between">
                  {Array.from({ length: timeRange === '1y' ? 12 : timeRange === '5y' ? 5 : 10 }, (_, i) => {
                    const height = Math.min(100, Math.max(20, parseFloat(results.roi) * (1 + i * 0.02)));
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className="bg-gradient-to-t from-green-500 to-green-300 rounded-t w-6 transition-all duration-1000"
                          style={{ height: `${height}%` }}
                          title={`${timeRange === '1y' ? `Month ${i + 1}` : `Year ${i + 1}`}: ${height.toFixed(1)}% ROI`}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">
                          {timeRange === '1y' ? `M${i + 1}` : `Y${i + 1}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Projected ROI assuming 2% annual growth in rent and property value
                </div>
              </div>
            </div>
            
            {/* Enhanced What-If Scenarios */}
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-500" />
                Interactive Scenarios
              </h4>
              <div className="space-y-4">
                {/* Rent Growth Scenario */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-800">Annual Rent Growth</span>
                    <span className="text-sm font-bold text-green-700">3%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.5"
                    defaultValue="3"
                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    onChange={(e) => {
                      const growth = parseFloat(e.target.value);
                      const newROI = parseFloat(results.roi) + (growth * 0.6);
                      e.target.nextElementSibling.textContent = `ROI after 5 years: ${newROI.toFixed(1)}%`;
                    }}
                  />
                  <div className="text-sm text-green-600 mt-2">ROI after 5 years: {(parseFloat(results.roi) + 1.8).toFixed(1)}%</div>
                </div>

                {/* Property Value Growth */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-800">Property Value Growth</span>
                    <span className="text-sm font-bold text-blue-700">4%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    defaultValue="4"
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    onChange={(e) => {
                      const growth = parseFloat(e.target.value);
                      const additionalReturn = growth * 2.5;
                      e.target.nextElementSibling.textContent = `Total return increases by ${additionalReturn.toFixed(0)}%`;
                    }}
                  />
                  <div className="text-sm text-blue-600 mt-2">Total return increases by 10%</div>
                </div>

                {/* Vacancy Rate Impact */}
                <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-red-800">Vacancy Rate</span>
                    <span className="text-sm font-bold text-red-700">8%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    defaultValue="8"
                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                    onChange={(e) => {
                      const vacancy = parseFloat(e.target.value);
                      const impact = (vacancy - calculatorData.vacancy) * 0.15;
                      const newROI = parseFloat(results.roi) - impact;
                      e.target.nextElementSibling.textContent = `ROI becomes ${newROI.toFixed(1)}%`;
                    }}
                  />
                  <div className="text-sm text-red-600 mt-2">ROI drops to {(parseFloat(results.roi) - 0.4).toFixed(1)}%</div>
                </div>

                {/* Interest Rate Impact */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-purple-800">Mortgage Interest Rate</span>
                    <span className="text-sm font-bold text-purple-700">4.5%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.1"
                    defaultValue="4.5"
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value);
                      const loanAmount = calculatorData.purchasePrice - calculatorData.downPayment;
                      const monthlyPayment = (loanAmount * (rate / 100 / 12)) / (1 - Math.pow(1 + rate / 100 / 12, -360));
                      const impact = (monthlyPayment * 12) / (calculatorData.downPayment + calculatorData.renovationCost) * 100;
                      e.target.nextElementSibling.textContent = `Monthly payment: €${monthlyPayment.toFixed(0)}, Impact on ROI: -${impact.toFixed(1)}%`;
                    }}
                  />
                  <div className="text-sm text-purple-600 mt-2">Monthly payment: €{((calculatorData.purchasePrice - calculatorData.downPayment) * 0.045 / 12).toFixed(0)}</div>
                </div>
              </div>
            </div>

            {/* Market Comparison */}
            {selectedRegion && (
              <div className="bg-white rounded-xl p-6 shadow-lg border">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Market Comparison - {selectedRegion.name}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm">Your ROI:</span>
                      <span className="font-bold text-lg">{results.roi}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm">Market Average:</span>
                      <span className="font-bold text-lg">{selectedRegion.rentYield}%</span>
                    </div>
                    <div className={`flex justify-between items-center p-3 rounded ${
                      parseFloat(results.roi) > selectedRegion.rentYield 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      <span className="text-sm">Difference:</span>
                      <span className="font-bold text-lg">
                        {parseFloat(results.roi) > selectedRegion.rentYield ? '+' : ''}
                        {(parseFloat(results.roi) - selectedRegion.rentYield).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-600 mb-2">Market Insights:</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        parseFloat(results.roi) > selectedRegion.rentYield ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span>{parseFloat(results.roi) > selectedRegion.rentYield ? 'Above' : 'Below'} market average</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedRegion.priceGrowth > 5 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span>Market growth: +{selectedRegion.priceGrowth}% annually</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedRegion.riskLevel === 'Low' ? 'bg-green-500' : 
                        selectedRegion.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span>Risk level: {selectedRegion.riskLevel}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

// Add this CSS to your global styles or as a styled component
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    box-shadow: 0 0 2px 0 #555;
    transition: background .15s ease-in-out;
  }

  .slider::-webkit-slider-thumb:hover {
    background: #059669;
  }

  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 2px 0 #555;
    transition: background .15s ease-in-out;
  }

  .slider::-moz-range-thumb:hover {
    background: #059669;
  }

  .slider:focus {
    outline: none;
  }

  .slider:focus::-webkit-slider-thumb {
    ring: 2px;
    ring-color: #10b981;
    ring-opacity: 0.5;
  }
`;