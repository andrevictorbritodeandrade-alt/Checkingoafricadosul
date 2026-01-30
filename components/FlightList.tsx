
import React from 'react';
import { 
  Plane, 
  PlaneTakeoff, 
  PlaneLanding, 
  Clock, 
  Users, 
  Luggage, 
  CreditCard, 
  CloudSun, 
  ThermometerSun, 
  Droplets, 
  AlertCircle,
  QrCode,
  Info,
  BellRing
} from 'lucide-react';

interface Passenger {
  name: string;
  ticketNumber?: string;
  doc?: string;
  cpf?: string;
}

interface WeatherForecast {
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  humidity: number;
  rainProb: number;
  condition: string;
}

interface FlightLeg {
  flightNumber: string;
  airline: string;
  aircraft?: string;
  departure: {
    code: string;
    city: string;
    time: string;
    date: string;
    brasiliaTime?: string;
  };
  arrival: {
    code: string;
    city: string;
    time: string;
    date: string;
    brasiliaTime?: string;
  };
  duration: string;
  layover?: string;
  checkInTime?: string;
  weatherDeparture?: WeatherForecast;
  weatherArrival?: WeatherForecast;
}

interface Trip {
  id: string;
  type: 'ida' | 'volta' | 'interno';
  title: string;
  bookingReference: string;
  provider: string;
  passengers: Passenger[];
  legs: FlightLeg[];
  baggage: string;
  financials?: {
    total: string;
    installments?: string;
    status: string;
  };
}

// MOCKED WEATHER DATA - JANEIRO/FEVEREIRO 2026 (VERÃO)
const WEATHER_SP: WeatherForecast = { tempMax: 29, tempMin: 21, feelsLike: 32, humidity: 75, rainProb: 60, condition: "Sol com Pancadas" };
const WEATHER_JNB: WeatherForecast = { tempMax: 27, tempMin: 16, feelsLike: 29, humidity: 55, rainProb: 40, condition: "Tarde com Tempestades" };
const WEATHER_CPT: WeatherForecast = { tempMax: 28, tempMin: 17, feelsLike: 28, humidity: 50, rainProb: 5, condition: "Sol e Muito Vento" };
const WEATHER_LAD: WeatherForecast = { tempMax: 33, tempMin: 25, feelsLike: 39, humidity: 80, rainProb: 20, condition: "Muito Abafado" };

const TRIPS: Trip[] = [
  {
    id: 'int-ida',
    type: 'ida',
    title: 'Ida: Brasil → África do Sul',
    bookingReference: '862508329300',
    provider: 'Decolar / TAAG',
    baggage: '2 malas despachadas por adulto + Bagagem de mão',
    passengers: [
      { name: 'André Victor Brito de Andrade', ticketNumber: '1186055770451', cpf: '126.669.667-98' },
      { name: 'Marcelly Bispo Pereira da Silva', ticketNumber: '1186055770450', cpf: '140.192.717-39' }
    ],
    legs: [
      {
        flightNumber: 'DT 748',
        airline: 'TAAG Angola Airlines',
        checkInTime: '14:05 (Recomendado)',
        departure: { code: 'GRU', city: 'São Paulo', time: '18:05', date: '25/Jan/26', brasiliaTime: '18:05' },
        arrival: { code: 'NBJ', city: 'Luanda', time: '06:40', date: '26/Jan/26', brasiliaTime: '02:40' },
        duration: '8h 35m',
        layover: 'Conexão: 3h 15m em Luanda',
        weatherDeparture: WEATHER_SP,
        weatherArrival: WEATHER_LAD
      },
      {
        flightNumber: 'DT 577',
        airline: 'TAAG Angola Airlines',
        departure: { code: 'NBJ', city: 'Luanda', time: '09:55', date: '26/Jan/26', brasiliaTime: '05:55' },
        arrival: { code: 'JNB', city: 'Joanesburgo', time: '14:40', date: '26/Jan/26', brasiliaTime: '09:40' },
        duration: '3h 45m',
        weatherDeparture: WEATHER_LAD,
        weatherArrival: WEATHER_JNB
      }
    ]
  },
  {
    id: 'dom-ida',
    type: 'interno',
    title: 'Interno: Joanesburgo → Cidade do Cabo',
    bookingReference: '1108-387-389',
    provider: 'MyTrip / South African Airways',
    baggage: 'Franquia Econômica Padrão',
    financials: { total: 'R$ 1.568,97', installments: 'Parcelado', status: 'Pago' },
    passengers: [
      { name: 'André Victor Brito de Andrade', cpf: '126.669.667-98' },
      { name: 'Marcelly Bispo Pereira da Silva', cpf: '140.192.717-39' }
    ],
    legs: [
      {
        flightNumber: 'SA 363',
        airline: 'South African Airways',
        checkInTime: '16:45',
        departure: { code: 'JNB', city: 'Joanesburgo', time: '18:45', date: '26/Jan/26', brasiliaTime: '13:45' },
        arrival: { code: 'CPT', city: 'Cidade do Cabo', time: '21:00', date: '26/Jan/26', brasiliaTime: '16:00' },
        duration: '2h 15m',
        weatherDeparture: WEATHER_JNB,
        weatherArrival: WEATHER_CPT
      }
    ]
  },
  {
    id: 'dom-volta',
    type: 'interno',
    title: 'Interno: Cidade do Cabo → Joanesburgo',
    bookingReference: '1108-387-389',
    provider: 'MyTrip / South African Airways',
    baggage: 'Franquia Econômica Padrão',
    passengers: [
      { name: 'André Victor Brito de Andrade', cpf: '126.669.667-98' },
      { name: 'Marcelly Bispo Pereira da Silva', cpf: '140.192.717-39' }
    ],
    legs: [
      {
        flightNumber: 'SA 372',
        airline: 'South African Airways',
        checkInTime: '18:25',
        departure: { code: 'CPT', city: 'Cidade do Cabo', time: '20:25', date: '31/Jan/26', brasiliaTime: '15:25' },
        arrival: { code: 'JNB', city: 'Joanesburgo', time: '22:25', date: '31/Jan/26', brasiliaTime: '17:25' },
        duration: '2h 00m',
        weatherDeparture: WEATHER_CPT,
        weatherArrival: WEATHER_JNB
      }
    ]
  },
  {
    id: 'int-volta',
    type: 'volta',
    title: 'Volta: África do Sul → Brasil',
    bookingReference: '862508329300',
    provider: 'Decolar / TAAG',
    baggage: '2 malas despachadas por adulto + Bagagem de mão',
    passengers: [
      { name: 'André Victor Brito de Andrade', ticketNumber: '1186055770451', cpf: '126.669.667-98' },
      { name: 'Marcelly Bispo Pereira da Silva', ticketNumber: '1186055770450', cpf: '140.192.717-39' }
    ],
    legs: [
      {
        flightNumber: 'DT 576',
        airline: 'TAAG Angola Airlines',
        checkInTime: '21:45 (do dia anterior)',
        departure: { code: 'JNB', city: 'Joanesburgo', time: '00:45', date: '06/Fev/26', brasiliaTime: '19:45 (05/Fev)' },
        arrival: { code: 'NBJ', city: 'Luanda', time: '03:30', date: '06/Fev/26', brasiliaTime: '23:30 (05/Fev)' },
        duration: '3h 45m',
        layover: 'Conexão: 7h 05m em Luanda',
        weatherDeparture: WEATHER_JNB,
        weatherArrival: WEATHER_LAD
      },
      {
        flightNumber: 'DT 747',
        airline: 'TAAG Angola Airlines',
        departure: { code: 'NBJ', city: 'Luanda', time: '10:35', date: '06/Fev/26', brasiliaTime: '06:35' },
        arrival: { code: 'GRU', city: 'São Paulo', time: '15:05', date: '06/Fev/26', brasiliaTime: '15:05' },
        duration: '8h 30m',
        weatherDeparture: WEATHER_LAD,
        weatherArrival: WEATHER_SP
      }
    ]
  }
];

const WeatherWidget: React.FC<{ weather: WeatherForecast, label: string }> = ({ weather, label }) => (
  <div className="bg-white/50 rounded-lg p-2 text-xs flex flex-col items-center border border-gray-100 min-w-[80px]">
    <span className="font-bold text-gray-500 mb-1">{label}</span>
    <div className="flex items-center gap-1 mb-1">
      {weather.rainProb > 40 ? <Droplets className="w-4 h-4 text-blue-500" /> : <CloudSun className="w-4 h-4 text-amber-500" />}
      <span className="font-bold text-lg">{weather.tempMax}°</span>
    </div>
    <div className="flex flex-col gap-0.5 w-full text-[10px] text-gray-600">
      <div className="flex justify-between"><span>Min:</span> <span className="font-medium">{weather.tempMin}°</span></div>
      <div className="flex justify-between text-orange-600"><ThermometerSun className="w-3 h-3" /> <span className="font-medium">{weather.feelsLike}°</span></div>
      <div className="flex justify-between text-blue-600"><Droplets className="w-3 h-3" /> <span className="font-medium">{weather.rainProb}%</span></div>
    </div>
  </div>
);

const FlightList: React.FC = () => {
  return (
    <div className="space-y-6">
      {TRIPS.map((trip) => (
        <div key={trip.id} className={`rounded-3xl border-2 overflow-hidden shadow-sm ${trip.type === 'ida' ? 'bg-blue-50 border-blue-200' : trip.type === 'volta' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className={`p-4 border-b border-dashed ${trip.type === 'ida' ? 'border-blue-200 bg-blue-100/50' : trip.type === 'volta' ? 'border-orange-200 bg-orange-100/50' : 'border-gray-200 bg-gray-100'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${trip.type === 'ida' ? 'bg-blue-600 text-white' : trip.type === 'volta' ? 'bg-orange-500 text-white' : 'bg-gray-600 text-white'}`}>{trip.type === 'ida' ? 'Ida' : trip.type === 'volta' ? 'Volta' : 'Interno'}</span>
              <span className="font-mono font-bold text-xs text-gray-400">REF: {trip.bookingReference}</span>
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">{trip.type === 'ida' ? <PlaneTakeoff className="text-blue-600" /> : <PlaneLanding className="text-orange-600" />} {trip.title}</h3>
          </div>
          <div className="p-4 space-y-6">
            {trip.legs.map((leg, idx) => (
              <div key={idx} className="relative pl-4 border-l-2 border-dashed border-gray-300">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-green-500"></div>
                <div className="mb-2 flex justify-between items-center"><span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">{leg.airline} - {leg.flightNumber}</span><span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {leg.duration}</span></div>
                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center mb-4 text-center">
                  <div><p className="text-2xl font-display font-black text-slate-800">{leg.departure.code}</p><p className="text-xs font-bold text-gray-600">{leg.departure.time}</p></div>
                  <Plane className="w-4 h-4 text-gray-300 rotate-90" />
                  <div><p className="text-2xl font-display font-black text-slate-800">{leg.arrival.code}</p><p className="text-xs font-bold text-gray-600">{leg.arrival.time}</p></div>
                </div>
                {(leg.weatherDeparture || leg.weatherArrival) && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {leg.weatherDeparture && <WeatherWidget weather={leg.weatherDeparture} label={leg.departure.code} />}
                    {leg.weatherArrival && <WeatherWidget weather={leg.weatherArrival} label={leg.arrival.code} />}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="bg-white p-4 border-t border-gray-100 text-xs space-y-2">
            <div className="flex items-start gap-2 text-gray-500"><Users className="w-4 h-4" /> <span>{trip.passengers.map(p => p.name).join(' & ')}</span></div>
            <div className="flex items-center gap-2 text-gray-500"><Luggage className="w-4 h-4" /> <span>{trip.baggage}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlightList;
