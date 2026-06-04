import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import BarraNavegacao from '../components/BarraNavegacao'

const CONFIG_CORES = {
  'Vermelha': { hex: '#ef4444', iconUrl: 'red' },
  'Azul':     { hex: '#3b82f6', iconUrl: 'blue' },
  'Verde':    { hex: '#22c55e', iconUrl: 'green' },
  'Amarela':  { hex: '#eab308', iconUrl: 'gold' },
  'Marrom':   { hex: '#92400e', iconUrl: 'orange' },
  'Cinza':    { hex: '#6b7280', iconUrl: 'grey' }
}

function Mapa() {
  const centroMapa = [-30.033217502718294, -51.1227849300074]

  const lixeiras = [
    {
      id: 1,
      nome: 'Lixeira Bloco A',
      tipo: 'Plástico',
      cor: 'Vermelha',
      coordenadas: [-30.033020, -51.122620]
    },
    {
      id: 2,
      nome: 'Lixeira Cantina',
      tipo: 'Orgânico',
      cor: 'Marrom',
      coordenadas: [-30.033410, -51.122930]
    },
    {
      id: 3,
      nome: 'Lixeira Biblioteca',
      tipo: 'Papel',
      cor: 'Azul',
      coordenadas: [-30.033250, -51.122420]
    }
  ]

  function criarIcone(cor) {
    const config = CONFIG_CORES[cor] || CONFIG_CORES['Cinza']
    return new Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${config.iconUrl}.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    })
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">

      {/* Header — mesmo padrão da Camera */}
      <div className="bg-gradient-to-tr from-blue-950 to-blue-700 h-28 rounded-b-[12px] flex flex-col items-center justify-center flex-shrink-0 mb-(-1)">
        <h1 className="text-white text-2xl font-bold tracking-wide">
          Mapa do Campus
        </h1>
        <div className="mt-2 flex items-center gap-2 opacity-80">
          <span className="text-[10px] uppercase tracking-[0.2em] text-blue-200">
            Powered by
          </span>
          <span className="text-blue-100 font-bold text-xs tracking-wide">
            Leaflet
          </span>
          <span className="text-blue-200 text-[10px]">+</span>
          <span className="text-blue-100 font-bold text-xs tracking-wide">
            OpenStreetMap
          </span>
        </div>
      </div>

      {/* Mapa — ocupa todo o espaço disponível */}
      <div className="flex-1 px-4 pt-4 pb-2 min-h-0">
        <div className="h-full rounded-3xl overflow-hidden shadow-lg">
          <MapContainer
            center={centroMapa}
            zoom={17}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {lixeiras.map((lixeira) => (
              <Marker
                key={lixeira.id}
                position={lixeira.coordenadas}
                icon={criarIcone(lixeira.cor)}
              >
                <Popup>
                  <div className="text-center">
                    <strong>{lixeira.nome}</strong><br />
                    Tipo: {lixeira.tipo}<br />
                    <span style={{ color: CONFIG_CORES[lixeira.cor]?.hex || '#6b7280' }}>
                      Lixeira {lixeira.cor}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Card de lixeiras — fixo embaixo, acima da navbar */}
      <div className="px-4 pb-28 flex-shrink-0">
        <div className="bg-white rounded-3xl p-4 shadow-lg">
          <h3 className="font-bold text-blue-900 mb-3 text-center text-sm uppercase tracking-wider">
            Lixeiras Disponíveis
          </h3>

          <div className="flex flex-wrap justify-center gap-2">
            {lixeiras.map((lixeira) => {
              const cor = CONFIG_CORES[lixeira.cor]?.hex || '#6b7280'
              return (
                <div
                  key={lixeira.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border-2"
                  style={{ borderColor: cor }}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cor }}
                  />
                  <span className="text-xs font-semibold text-blue-900">
                    {lixeira.nome}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <BarraNavegacao />
    </div>
  )
}

export default Mapa