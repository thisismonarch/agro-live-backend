// Structural + fallback dataset for Agrofix.
// Live providers overlay current prices/FX/weather on top of this base.
// Country tables, historical series, routes, compliance and market share are curated here.

const products = {
    maize: {
        name: "Maize",
        marketShare: { 'USA': 28, 'Brazil': 22, 'China': 18, 'India': 16, 'Others': 16 },
        pricePerKg: 0.28,
        inflow: [65000,70000,68000,75000,82000,85000],
        outflow: [60000,68000,72000,78000,80000,88000],
        yearlyPrices: [0.25,0.26,0.27,0.28,0.30,0.32,0.30,0.28,0.26,0.25,0.24,0.28],
        volatility: [2.5,2.3,2.8,3.1,2.6,2.4,3.0,2.7,2.5,2.9,3.2,2.8],
        countries: {
            'USA': {price:0.28, volume:120, status:'Surplus', change:1.2, yoy:3.8},
            'Brazil': {price:0.27, volume:95, status:'Surplus', change:0.9, yoy:2.7},
            'China': {price:0.32, volume:45, status:'Deficit', change:-0.5, yoy:-1.5},
            'Egypt': {price:0.30, volume:52, status:'Deficit', change:1.5, yoy:4.5},
            'India': {price:0.28, volume:68, status:'Moderate', change:1.8, yoy:5.4},
            'Mexico': {price:0.29, volume:42, status:'Moderate', change:1.2, yoy:4.8},
            'Indonesia': {price:0.31, volume:38, status:'Deficit', change:-0.8, yoy:-1.9},
            'Nigeria': {price:0.25, volume:35, status:'Surplus', change:3.1, yoy:9.7},
            'South Africa': {price:0.27, volume:32, status:'Moderate', change:0.6, yoy:2.3},
            'Canada': {price:0.29, volume:45, status:'Surplus', change:1.9, yoy:6.2},
            'Ukraine': {price:0.24, volume:55, status:'Surplus', change:2.7, yoy:8.9},
            'Russia': {price:0.26, volume:52, status:'Surplus', change:1.5, yoy:5.1},
            'Thailand': {price:0.28, volume:38, status:'Moderate', change:0.3, yoy:1.2},
            'Vietnam': {price:0.27, volume:42, status:'Moderate', change:1.4, yoy:4.5},
            'Philippines': {price:0.33, volume:25, status:'Deficit', change:-0.2, yoy:-0.8},
            'Argentina': {price:0.26, volume:62, status:'Surplus', change:1.8, yoy:5.9}
        },
        routes: [
            {from:'USA', to:'China', freight:45, transit:'21 days', mode:'Vessel', savings:18},
            {from:'Brazil', to:'Egypt', freight:52, transit:'28 days', mode:'Vessel', savings:12},
            {from:'Argentina', to:'India', freight:38, transit:'25 days', mode:'Vessel', savings:15}
        ],
        weather: {
            'USA Midwest': {condition:'Adequate rainfall', yield:92, risk:'Low'},
            'Brazil': {condition:'Drought conditions', yield:78, risk:'High'},
            'Argentina': {condition:'Normal weather', yield:88, risk:'Medium'}
        },
        compliance: [
            {from:'USA', to:'China', rules:'GMO labeling required', tariff:'5%', status:'Approved'},
            {from:'Brazil', to:'Egypt', rules:'Pesticide residue limits', tariff:'0%', status:'Certified'},
            {from:'Argentina', to:'India', rules:'Phytosanitary certificate', tariff:'2%', status:'Pending'}
        ]
    },
    wheat: {
        name: "Wheat",
        marketShare: { 'Russia': 25, 'Ukraine': 21, 'USA': 19, 'EU': 15, 'Others': 20 },
        pricePerKg: 0.35,
        inflow: [55000,60000,58000,65000,70000,72000],
        outflow: [50000,58000,62000,68000,68000,75000],
        yearlyPrices: [0.32,0.33,0.34,0.35,0.37,0.40,0.38,0.35,0.33,0.32,0.31,0.35],
        volatility: [3.2,3.0,3.5,3.8,3.3,3.1,3.6,3.4,3.2,3.7,4.0,3.5],
        countries: {
            'Russia': {price:0.33, volume:85, status:'Surplus', change:1.1, yoy:3.3},
            'Ukraine': {price:0.34, volume:72, status:'Surplus', change:2.3, yoy:6.9},
            'USA': {price:0.36, volume:65, status:'Surplus', change:0.9, yoy:2.7},
            'EU': {price:0.38, volume:52, status:'Moderate', change:1.5, yoy:4.5},
            'China': {price:0.40, volume:35, status:'Deficit', change:-1.2, yoy:-3.6},
            'India': {price:0.33, volume:48, status:'Moderate', change:1.8, yoy:5.4},
            'Canada': {price:0.35, volume:42, status:'Surplus', change:1.5, yoy:4.8},
            'Argentina': {price:0.32, volume:38, status:'Moderate', change:0.9, yoy:3.5},
            'Australia': {price:0.34, volume:45, status:'Moderate', change:1.3, yoy:5.1},
            'Egypt': {price:0.36, volume:28, status:'Deficit', change:-1.0, yoy:-3.2},
            'Turkey': {price:0.33, volume:32, status:'Moderate', change:0.7, yoy:2.8},
            'Pakistan': {price:0.32, volume:35, status:'Moderate', change:0.5, yoy:2.1},
            'Brazil': {price:0.36, volume:28, status:'Moderate', change:1.4, yoy:5.3},
            'Indonesia': {price:0.38, volume:22, status:'Deficit', change:-0.3, yoy:-1.1},
            'Nigeria': {price:0.34, volume:30, status:'Moderate', change:1.6, yoy:6.2},
            'Japan': {price:0.39, volume:25, status:'Deficit', change:-0.5, yoy:-1.9}
        },
        routes: [
            {from:'Russia', to:'Egypt', freight:38, transit:'18 days', mode:'Vessel', savings:20},
            {from:'Ukraine', to:'Turkey', freight:28, transit:'12 days', mode:'Vessel', savings:16},
            {from:'USA', to:'Philippines', freight:55, transit:'30 days', mode:'Vessel', savings:10}
        ],
        weather: {
            'Russia': {condition:'Cold winter', yield:85, risk:'Medium'},
            'Ukraine': {condition:'Moderate temps', yield:89, risk:'Low'},
            'EU': {condition:'Spring frost risk', yield:82, risk:'High'}
        },
        compliance: [
            {from:'Russia', to:'Egypt', rules:'Quality certification', tariff:'8%', status:'Approved'},
            {from:'Ukraine', to:'Turkey', rules:'Health certificate', tariff:'3%', status:'Certified'},
            {from:'USA', to:'Philippines', rules:'Grain standards', tariff:'5%', status:'Approved'}
        ]
    },
    rice: {
        name: "Rice",
        marketShare: { 'India': 32, 'Thailand': 18, 'Vietnam': 15, 'China': 12, 'Others': 23 },
        pricePerKg: 0.42,
        inflow: [48000,52000,50000,56000,62000,65000],
        outflow: [45000,50000,54000,58000,60000,68000],
        yearlyPrices: [0.38,0.39,0.40,0.42,0.44,0.47,0.45,0.42,0.40,0.39,0.38,0.42],
        volatility: [2.8,2.6,3.1,3.3,2.9,2.7,3.2,3.0,2.8,3.1,3.4,3.0],
        countries: {
            'India': {price:0.40, volume:98, status:'Surplus', change:1.2, yoy:3.6},
            'Thailand': {price:0.44, volume:68, status:'Surplus', change:1.8, yoy:5.4},
            'Vietnam': {price:0.41, volume:55, status:'Surplus', change:2.1, yoy:6.3},
            'China': {price:0.45, volume:42, status:'Moderate', change:0.9, yoy:2.7},
            'USA': {price:0.48, volume:38, status:'Surplus', change:1.5, yoy:4.5},
            'Pakistan': {price:0.39, volume:52, status:'Moderate', change:2.1, yoy:7.5},
            'Bangladesh': {price:0.41, volume:48, status:'Deficit', change:-0.3, yoy:-1.0},
            'Indonesia': {price:0.43, volume:45, status:'Moderate', change:1.8, yoy:6.2},
            'Myanmar': {price:0.37, volume:62, status:'Surplus', change:2.9, yoy:9.1},
            'Cambodia': {price:0.40, volume:38, status:'Moderate', change:1.7, yoy:5.8},
            'Laos': {price:0.39, volume:28, status:'Moderate', change:1.4, yoy:4.9},
            'Philippines': {price:0.45, volume:25, status:'Deficit', change:-0.8, yoy:-2.5},
            'Brazil': {price:0.47, volume:22, status:'Moderate', change:0.2, yoy:0.8},
            'Egypt': {price:0.42, volume:32, status:'Deficit', change:-1.1, yoy:-3.3},
            'Japan': {price:0.51, volume:18, status:'Deficit', change:-1.5, yoy:-4.2},
            'South Korea': {price:0.50, volume:20, status:'Deficit', change:-1.3, yoy:-3.8}
        },
        routes: [
            {from:'India', to:'Philippines', freight:45, transit:'8 days', mode:'Vessel', savings:32},
            {from:'Thailand', to:'Japan', freight:78, transit:'5 days', mode:'Air', savings:15},
            {from:'Vietnam', to:'China', freight:35, transit:'6 days', mode:'Road', savings:35}
        ],
        weather: {
            'India': {condition:'Monsoon', yield:85, risk:'Medium'},
            'Thailand': {condition:'Tropical wet', yield:90, risk:'Low'},
            'Vietnam': {condition:'High humidity', yield:88, risk:'Low'}
        },
        compliance: [
            {from:'India', to:'Philippines', rules:'Quarantine', tariff:'2%', status:'Approved'},
            {from:'Thailand', to:'Japan', rules:'Residue limit', tariff:'4%', status:'Certified'},
            {from:'Vietnam', to:'China', rules:'Aflatoxin', tariff:'0%', status:'Approved'}
        ]
    },
    cocoa: {
        name: "Cocoa",
        marketShare: { 'Ivory Coast': 28, 'Ghana': 18, 'Indonesia': 17, 'Nigeria': 13, 'Others': 24 },
        pricePerKg: 8.50,
        inflow: [12000,14000,13000,16000,18000,20000],
        outflow: [11000,13000,15000,17000,18000,21000],
        yearlyPrices: [7.50,7.80,8.00,8.50,9.20,10.00,9.50,8.50,8.00,7.80,7.50,8.50],
        volatility: [4.5,4.8,5.2,5.5,4.9,4.6,5.3,5.0,4.7,5.1,5.6,5.1],
        countries: {
            'Ivory Coast': {price:8.20, volume:65, status:'Surplus', change:2.1, yoy:6.3},
            'Ghana': {price:8.80, volume:52, status:'Surplus', change:1.8, yoy:5.4},
            'Indonesia': {price:8.50, volume:48, status:'Surplus', change:2.3, yoy:6.9},
            'Brazil': {price:8.90, volume:38, status:'Moderate', change:1.5, yoy:4.8},
            'Nigeria': {price:8.30, volume:42, status:'Surplus', change:2.5, yoy:7.5},
            'Cameroon': {price:8.40, volume:35, status:'Surplus', change:1.9, yoy:5.7},
            'Ecuador': {price:8.70, volume:28, status:'Moderate', change:1.2, yoy:3.8},
            'Peru': {price:8.60, volume:22, status:'Moderate', change:1.8, yoy:5.4},
            'Dominican Republic': {price:8.75, volume:18, status:'Moderate', change:1.4, yoy:4.2},
            'Mexico': {price:8.65, volume:15, status:'Moderate', change:1.9, yoy:5.8},
            'Mali': {price:8.25, volume:20, status:'Surplus', change:2.2, yoy:6.6},
            'Togo': {price:8.35, volume:18, status:'Surplus', change:2.4, yoy:7.2},
            'Sierra Leone': {price:8.15, volume:20, status:'Surplus', change:2.1, yoy:6.3},
            'Vanuatu': {price:8.95, volume:12, status:'Moderate', change:0.9, yoy:2.7},
            'Papua New Guinea': {price:8.85, volume:10, status:'Moderate', change:1.2, yoy:3.6},
            'Haiti': {price:8.45, volume:14, status:'Moderate', change:1.7, yoy:5.1}
        },
        routes: [
            {from:'Ivory Coast', to:'Netherlands', freight:85, transit:'28 days', mode:'Vessel', savings:14},
            {from:'Ghana', to:'Belgium', freight:88, transit:'29 days', mode:'Vessel', savings:13},
            {from:'Indonesia', to:'China', freight:65, transit:'18 days', mode:'Vessel', savings:17}
        ],
        weather: {
            'Ivory Coast': {condition:'Dry season', yield:86, risk:'Medium'},
            'Ghana': {condition:'Rain approaching', yield:84, risk:'Medium'},
            'Indonesia': {condition:'High humidity', yield:79, risk:'High'}
        },
        compliance: [
            {from:'Ivory Coast', to:'Netherlands', rules:'Fair trade certification', tariff:'0%', status:'Certified'},
            {from:'Ghana', to:'Belgium', rules:'UTZ certified', tariff:'0%', status:'Certified'},
            {from:'Indonesia', to:'China', rules:'Food safety approval', tariff:'3%', status:'Approved'}
        ]
    },
    coffee: {
        name: "Coffee",
        marketShare: { 'Brazil': 32, 'Vietnam': 21, 'Colombia': 14, 'Indonesia': 12, 'Others': 21 },
        pricePerKg: 5.80,
        inflow: [22000,25000,24000,28000,32000,35000],
        outflow: [20000,24000,26000,30000,31000,36000],
        yearlyPrices: [5.20,5.40,5.60,5.80,6.10,6.50,6.20,5.80,5.50,5.30,5.10,5.80],
        volatility: [3.8,4.0,4.3,4.5,4.2,3.9,4.4,4.1,3.9,4.2,4.6,4.2],
        countries: {
            'Brazil': {price:5.60, volume:78, status:'Surplus', change:1.8, yoy:5.4},
            'Vietnam': {price:5.70, volume:65, status:'Surplus', change:2.1, yoy:6.3},
            'Colombia': {price:6.20, volume:55, status:'Surplus', change:1.5, yoy:4.5},
            'Indonesia': {price:5.90, volume:48, status:'Surplus', change:1.9, yoy:5.7},
            'Ethiopia': {price:6.00, volume:42, status:'Surplus', change:2.3, yoy:6.9},
            'Honduras': {price:5.85, volume:38, status:'Surplus', change:1.7, yoy:5.1},
            'India': {price:5.75, volume:35, status:'Moderate', change:1.2, yoy:3.8},
            'Uganda': {price:5.95, volume:32, status:'Surplus', change:2.0, yoy:6.0},
            'Peru': {price:6.10, volume:28, status:'Moderate', change:1.4, yoy:4.2},
            'Guatemala': {price:5.98, volume:25, status:'Moderate', change:1.6, yoy:4.8},
            'Mexico': {price:5.88, volume:22, status:'Moderate', change:1.3, yoy:3.9},
            'Ecuador': {price:6.05, volume:20, status:'Moderate', change:1.1, yoy:3.3},
            'Kenya': {price:6.15, volume:18, status:'Moderate', change:1.8, yoy:5.4},
            'Ghana': {price:5.82, volume:15, status:'Moderate', change:1.9, yoy:5.7},
            'Cameroon': {price:5.78, volume:16, status:'Surplus', change:2.1, yoy:6.3},
            'Tanzania': {price:5.92, volume:14, status:'Moderate', change:1.7, yoy:5.1}
        },
        routes: [
            {from:'Brazil', to:'USA', freight:95, transit:'12 days', mode:'Vessel', savings:19},
            {from:'Vietnam', to:'Germany', freight:118, transit:'28 days', mode:'Vessel', savings:11},
            {from:'Colombia', to:'Canada', freight:105, transit:'18 days', mode:'Vessel', savings:15}
        ],
        weather: {
            'Brazil': {condition:'La Niña impact', yield:76, risk:'High'},
            'Vietnam': {condition:'Favorable', yield:89, risk:'Low'},
            'Colombia': {condition:'Rainy season', yield:85, risk:'Medium'}
        },
        compliance: [
            {from:'Brazil', to:'USA', rules:'Pest-free cert', tariff:'0%', status:'Approved'},
            {from:'Vietnam', to:'Germany', rules:'Aflatoxin test', tariff:'2%', status:'Certified'},
            {from:'Colombia', to:'Canada', rules:'Origin cert', tariff:'1%', status:'Approved'}
        ]
    },
    palm: {
        name: "Palm Oil",
        marketShare: { 'Indonesia': 38, 'Malaysia': 25, 'Nigeria': 15, 'Thailand': 10, 'Others': 12 },
        pricePerKg: 0.92,
        inflow: [35000,38000,37000,42000,48000,50000],
        outflow: [32000,36000,40000,44000,46000,52000],
        yearlyPrices: [0.85,0.88,0.90,0.92,0.98,1.05,1.00,0.92,0.88,0.86,0.84,0.92],
        volatility: [3.2,3.4,3.6,3.8,3.5,3.3,3.7,3.5,3.3,3.6,3.9,3.6],
        countries: {
            'Indonesia': {price:0.90, volume:88, status:'Surplus', change:2.1, yoy:6.3},
            'Malaysia': {price:0.94, volume:72, status:'Surplus', change:1.8, yoy:5.4},
            'Nigeria': {price:0.88, volume:45, status:'Surplus', change:2.5, yoy:7.5},
            'Thailand': {price:0.96, volume:38, status:'Moderate', change:1.5, yoy:4.5},
            'Papua New Guinea': {price:0.89, volume:32, status:'Surplus', change:2.2, yoy:6.6},
            'Cameroon': {price:0.87, volume:28, status:'Surplus', change:2.3, yoy:6.9},
            'Cote d Ivoire': {price:0.91, volume:24, status:'Surplus', change:2.0, yoy:6.0},
            'Ghana': {price:0.89, volume:22, status:'Moderate', change:1.9, yoy:5.7},
            'Benin': {price:0.86, volume:18, status:'Surplus', change:2.4, yoy:7.2},
            'Solomon Islands': {price:0.95, volume:16, status:'Moderate', change:1.3, yoy:3.9},
            'Sierra Leone': {price:0.85, volume:14, status:'Surplus', change:2.6, yoy:7.8},
            'Liberia': {price:0.88, volume:15, status:'Surplus', change:2.2, yoy:6.6},
            'Guatemala': {price:0.93, volume:12, status:'Moderate', change:1.4, yoy:4.2},
            'Brazil': {price:0.97, volume:10, status:'Moderate', change:0.8, yoy:2.4},
            'Colombia': {price:0.92, volume:11, status:'Moderate', change:1.7, yoy:5.1},
            'Ecuador': {price:0.90, volume:9, status:'Moderate', change:1.5, yoy:4.5}
        },
        routes: [
            {from:'Indonesia', to:'Netherlands', freight:88, transit:'26 days', mode:'Vessel', savings:14},
            {from:'Malaysia', to:'China', freight:52, transit:'10 days', mode:'Vessel', savings:24},
            {from:'Nigeria', to:'Germany', freight:105, transit:'20 days', mode:'Vessel', savings:12}
        ],
        weather: {
            'Indonesia': {condition:'El Niño risk', yield:79, risk:'High'},
            'Malaysia': {condition:'Monsoon', yield:82, risk:'Medium'},
            'Nigeria': {condition:'Harmattan', yield:80, risk:'Medium'}
        },
        compliance: [
            {from:'Indonesia', to:'Netherlands', rules:'RSPO cert', tariff:'0%', status:'Certified'},
            {from:'Malaysia', to:'China', rules:'FFA limit', tariff:'2%', status:'Approved'},
            {from:'Nigeria', to:'Germany', rules:'Sustainability', tariff:'0%', status:'Certified'}
        ]
    },
    soybean: {
        name: "Soybeans",
        marketShare: { 'Brazil': 30, 'USA': 28, 'Argentina': 22, 'Paraguay': 10, 'Others': 10 },
        pricePerKg: 0.42,
        inflow: [48000,52000,50000,56000,60000,62000],
        outflow: [45000,50000,52000,54000,58000,64000],
        yearlyPrices: [0.38,0.39,0.40,0.42,0.44,0.47,0.45,0.42,0.40,0.39,0.38,0.42],
        volatility: [2.8,3.0,2.6,2.4,2.9,2.3,3.1,2.8,2.6,2.8,3.0,2.8],
        countries: {
            'Brazil': {price:0.40, volume:95, status:'Surplus', change:1.5, yoy:5.2},
            'USA': {price:0.44, volume:88, status:'Surplus', change:0.8, yoy:3.1},
            'Argentina': {price:0.38, volume:72, status:'Surplus', change:2.2, yoy:6.9},
            'China': {price:0.48, volume:45, status:'Deficit', change:-0.9, yoy:-2.8},
            'India': {price:0.41, volume:35, status:'Moderate', change:1.3, yoy:3.9},
            'Paraguay': {price:0.39, volume:42, status:'Surplus', change:1.8, yoy:5.4},
            'Bolivia': {price:0.37, volume:28, status:'Moderate', change:2.0, yoy:6.0},
            'Canada': {price:0.43, volume:32, status:'Surplus', change:1.1, yoy:3.3},
            'EU': {price:0.45, volume:25, status:'Moderate', change:0.6, yoy:1.8},
            'Vietnam': {price:0.42, volume:22, status:'Moderate', change:1.4, yoy:4.2},
            'Japan': {price:0.46, volume:18, status:'Moderate', change:0.9, yoy:2.7},
            'Mexico': {price:0.41, volume:15, status:'Moderate', change:1.2, yoy:3.6},
            'Thailand': {price:0.40, volume:14, status:'Moderate', change:1.6, yoy:4.8},
            'Indonesia': {price:0.42, volume:12, status:'Moderate', change:1.1, yoy:3.3},
            'Ukraine': {price:0.39, volume:16, status:'Moderate', change:2.1, yoy:6.3},
            'Russia': {price:0.38, volume:14, status:'Moderate', change:1.5, yoy:4.5}
        },
        routes: [
            {from:'Brazil', to:'China', freight:68, transit:'32 days', mode:'Vessel', savings:12},
            {from:'USA', to:'Japan', freight:78, transit:'28 days', mode:'Vessel', savings:14},
            {from:'Argentina', to:'EU', freight:82, transit:'30 days', mode:'Vessel', savings:9}
        ],
        weather: {
            'Brazil': {condition:'Drought concern', yield:79, risk:'High'},
            'USA': {condition:'Adequate moisture', yield:90, risk:'Low'},
            'Argentina': {condition:'Variable', yield:85, risk:'Medium'}
        },
        compliance: [
            {from:'Brazil', to:'China', rules:'GMO disclosure', tariff:'3%', status:'Approved'},
            {from:'USA', to:'Japan', rules:'GMO labeling', tariff:'5%', status:'Approved'},
            {from:'Argentina', to:'EU', rules:'Non-GMO required', tariff:'0%', status:'Pending'}
        ]
    },
    cassava: {
        name: "Cassava",
        marketShare: { 'Nigeria': 22, 'Thailand': 18, 'Indonesia': 16, 'Tanzania': 12, 'Others': 32 },
        pricePerKg: 0.15,
        inflow: [18000,20000,19000,22000,24000,26000],
        outflow: [16000,18000,20000,21000,23000,27000],
        yearlyPrices: [0.13,0.14,0.145,0.15,0.155,0.16,0.158,0.15,0.145,0.14,0.13,0.15],
        volatility: [1.9,2.1,1.8,1.7,2.0,1.6,2.2,1.9,1.8,2.0,2.1,1.9],
        countries: {
            'Nigeria': {price:0.14, volume:68, status:'Surplus', change:3.1, yoy:9.2},
            'Thailand': {price:0.16, volume:55, status:'Moderate', change:1.8, yoy:5.5},
            'Indonesia': {price:0.15, volume:48, status:'Moderate', change:2.3, yoy:7.1},
            'Vietnam': {price:0.17, volume:38, status:'Moderate', change:1.2, yoy:3.9},
            'Ghana': {price:0.14, volume:42, status:'Surplus', change:2.9, yoy:8.7},
            'Tanzania': {price:0.13, volume:35, status:'Surplus', change:3.5, yoy:10.4},
            'Uganda': {price:0.13, volume:32, status:'Surplus', change:3.3, yoy:9.8},
            'Senegal': {price:0.12, volume:22, status:'Surplus', change:3.8, yoy:11.2},
            'Mozambique': {price:0.12, volume:25, status:'Surplus', change:3.9, yoy:11.5},
            'Malawi': {price:0.11, volume:20, status:'Surplus', change:4.1, yoy:12.1},
            'Benin': {price:0.13, volume:18, status:'Surplus', change:3.4, yoy:10.0},
            'Madagascar': {price:0.14, volume:15, status:'Moderate', change:2.5, yoy:7.5},
            'Zambia': {price:0.12, volume:18, status:'Surplus', change:3.6, yoy:10.6},
            'Cambodia': {price:0.16, volume:12, status:'Moderate', change:1.5, yoy:4.5},
            'Laos': {price:0.15, volume:10, status:'Moderate', change:1.7, yoy:5.0},
            'Cameroon': {price:0.14, volume:16, status:'Surplus', change:3.2, yoy:9.6}
        },
        routes: [
            {from:'Nigeria', to:'Ghana', freight:18, transit:'6 days', mode:'Road', savings:28},
            {from:'Thailand', to:'Vietnam', freight:12, transit:'4 days', mode:'Road', savings:30},
            {from:'Indonesia', to:'Malaysia', freight:15, transit:'5 days', mode:'Road', savings:27}
        ],
        weather: {
            'Nigeria': {condition:'Dry harmattan', yield:83, risk:'Medium'},
            'Thailand': {condition:'Tropical wet', yield:89, risk:'Low'},
            'Indonesia': {condition:'High rainfall', yield:86, risk:'Low'}
        },
        compliance: [
            {from:'Nigeria', to:'Ghana', rules:'Regional trade', tariff:'0%', status:'Approved'},
            {from:'Thailand', to:'Vietnam', rules:'ASEAN rules', tariff:'0%', status:'Approved'},
            {from:'Indonesia', to:'Malaysia', rules:'Phytosanitary', tariff:'1%', status:'Approved'}
        ]
    }
};

const exchangeRates = { USD: 1, NGN: 1550, GHS: 15.5, KES: 135 };

module.exports = { products, exchangeRates };
