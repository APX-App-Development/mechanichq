// Comprehensive vehicle database for accurate fitment
export const vehicleYears = Array.from({ length: 36 }, (_, i) => 2025 - i);

export const vehicleMakes = [
  'Acura', 'Alfa Romeo', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler',
  'Dodge', 'Ferrari', 'Fiat', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hyundai', 'Infiniti',
  'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Maserati',
  'Mazda', 'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 'Porsche', 'Ram',
  'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

export const vehicleModels = {
  'Ford': ['F-150', 'F-250', 'F-350', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Expedition', 'Ranger', 'Bronco', 'Bronco Sport', 'Maverick', 'Transit', 'EcoSport', 'Fusion', 'Focus', 'Fiesta', 'Taurus'],
  'Chevrolet': ['Silverado 1500', 'Silverado 2500HD', 'Silverado 3500HD', 'Camaro', 'Corvette', 'Tahoe', 'Suburban', 'Equinox', 'Traverse', 'Blazer', 'Colorado', 'Malibu', 'Cruze', 'Impala', 'Trax', 'Bolt', 'Spark'],
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', '4Runner', 'Tacoma', 'Tundra', 'Sequoia', 'Sienna', 'Prius', 'Avalon', 'C-HR', 'Venza', 'Land Cruiser', 'GR86', 'Supra', 'Yaris'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'HR-V', 'Ridgeline', 'Passport', 'Fit', 'Insight', 'Clarity'],
  'Nissan': ['Altima', 'Sentra', 'Maxima', 'Rogue', 'Murano', 'Pathfinder', 'Armada', 'Frontier', 'Titan', 'Kicks', 'Versa', '370Z', 'GT-R', 'Leaf', 'Ariya'],
  'Ram': ['1500', '2500', '3500', 'ProMaster', 'ProMaster City'],
  'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Wagoneer', 'Grand Wagoneer'],
  'Dodge': ['Charger', 'Challenger', 'Durango', 'Journey', 'Grand Caravan'],
  'BMW': ['3 Series', '4 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', 'M3', 'M4', 'M5', 'Z4', 'i4', 'iX'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'A-Class', 'CLA', 'AMG GT', 'EQS', 'EQE'],
  'Audi': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'RS3', 'RS5', 'e-tron', 'R8'],
  'Volkswagen': ['Jetta', 'Passat', 'Golf', 'Tiguan', 'Atlas', 'Arteon', 'Taos', 'ID.4'],
  'Subaru': ['Outback', 'Forester', 'Crosstrek', 'Ascent', 'Impreza', 'Legacy', 'WRX', 'BRZ'],
  'Mazda': ['Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9', 'CX-30', 'CX-50', 'MX-5 Miata'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Venue', 'Ioniq', 'Veloster'],
  'Kia': ['Forte', 'Optima', 'Stinger', 'Sportage', 'Sorento', 'Telluride', 'Soul', 'Seltos', 'EV6'],
  'Lexus': ['ES', 'IS', 'GS', 'LS', 'RX', 'GX', 'LX', 'NX', 'UX', 'LC', 'RC'],
  'Acura': ['ILX', 'TLX', 'RDX', 'MDX', 'NSX', 'Integra'],
  'Infiniti': ['Q50', 'Q60', 'QX50', 'QX55', 'QX60', 'QX80'],
  'GMC': ['Sierra 1500', 'Sierra 2500HD', 'Sierra 3500HD', 'Canyon', 'Yukon', 'Yukon XL', 'Terrain', 'Acadia'],
  'Cadillac': ['CT4', 'CT5', 'XT4', 'XT5', 'XT6', 'Escalade', 'Lyriq'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
  'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster', 'Cayman'],
  'Land Rover': ['Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque', 'Discovery', 'Defender'],
  'Volvo': ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C40'],
  'Lincoln': ['Corsair', 'Nautilus', 'Aviator', 'Navigator'],
  'Buick': ['Encore', 'Encore GX', 'Envision', 'Enclave'],
  'Chrysler': ['300', 'Pacifica', 'Voyager'],
  'Mitsubishi': ['Mirage', 'Outlander', 'Eclipse Cross', 'Outlander Sport'],
  'Mini': ['Cooper', 'Clubman', 'Countryman', 'Convertible'],
  'Genesis': ['G70', 'G80', 'G90', 'GV70', 'GV80'],
  'Alfa Romeo': ['Giulia', 'Stelvio'],
  'Jaguar': ['XE', 'XF', 'F-Pace', 'E-Pace', 'I-Pace', 'F-Type'],
  'Maserati': ['Ghibli', 'Quattroporte', 'Levante'],
  'Fiat': ['500', '500X'],
  'McLaren': ['570S', '720S', 'GT', 'Artura'],
  'Lamborghini': ['Huracán', 'Aventador', 'Urus'],
  'Ferrari': ['Roma', 'F8', 'SF90', 'Portofino', '812']
};

export const vehicleEngines = {
  'F-150': ['2.7L V6 EcoBoost', '3.5L V6 EcoBoost', '5.0L V8', '3.0L V6 PowerBoost', '3.3L V6'],
  'Silverado 1500': ['2.7L Turbo', '5.3L V8', '6.2L V8', '3.0L Duramax Diesel'],
  'Mustang': ['2.3L EcoBoost', '5.0L V8 GT', '5.2L V8 Shelby GT500'],
  'Camaro': ['2.0L Turbo', '3.6L V6', '6.2L V8 SS', '6.2L V8 ZL1'],
  'Civic': ['1.5L Turbo', '2.0L', '2.0L Turbo (Type R)'],
  'Accord': ['1.5L Turbo', '2.0L Turbo'],
  'Camry': ['2.5L 4-Cylinder', '3.5L V6', '2.5L Hybrid'],
  'Corolla': ['1.8L 4-Cylinder', '2.0L 4-Cylinder', '1.8L Hybrid'],
  'Wrangler': ['2.0L Turbo', '3.6L V6', '3.0L EcoD Diesel', '6.4L V8 (392)'],
  '3 Series': ['2.0L Turbo', '3.0L Turbo I6'],
  'C-Class': ['2.0L Turbo', '3.0L Turbo I6', '4.0L V8 AMG'],
  'default': ['Base Engine', 'Optional Engine']
};