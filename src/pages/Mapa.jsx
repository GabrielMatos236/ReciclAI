import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { ChevronUp, ChevronDown, X } from 'lucide-react'
import { supabase } from '../services/supabase'

const CONFIG_CORES = {
  'Marrom':   { hex: '#92400e', iconUrl: 'orange' },
  'Verde':    { hex: '#22c55e', iconUrl: 'green'  },
  'Azul':     { hex: '#3b82f6', iconUrl: 'blue'   },
  'Vermelha': { hex: '#ef4444', iconUrl: 'red'    },
  'Amarela':  { hex: '#eab308', iconUrl: 'gold'   },
}

const PREDIOS = ['Prédio 1', 'Prédio 3', 'Prédio 4', 'Prédio 5', 'Prédio 6', 'Prédio 7']
const TIPOS   = ['Orgânico', 'Vidro', 'Papel', 'Plástico', 'Metal']

function criarIcone(cor) {
  const config = CONFIG_CORES[cor] || { iconUrl: 'grey' }
  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${config.iconUrl}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  })
}

function Mapa() {
  const location = useLocation()

  const [lixeiras, setLixeiras]         = useState([])
  const [carregando, setCarregando]     = useState(true)
  const [filtroPredio, setFiltroPredio] = useState(null)
  const [filtroTipo,   setFiltroTipo]   = useState(location.state?.filtroTipo || null)
  const [painelAberto, setPainelAberto] = useState(!!location.state?.filtroTipo)

  const centroMapa = [-30.033217, -51.122785]

  useEffect(() => {
    async function carregarLixeiras() {
      const { data, error } = await supabase
        .from('lixeiras')
        .select('*')
        .order('id')

      if (error) {
        console.error('Erro ao carregar lixeiras:', error)
      } else {
        setLixeiras(data || [])
      }
      setCarregando(false)
    }

    carregarLixeiras()
  }, [])

  const lixeirasFiltradas = lixeiras.filter(l => {
    const passaPredio = !filtroPredio || l.predio === filtroPredio
    const passaTipo   = !filtroTipo   || l.tipo   === filtroTipo
    return passaPredio && passaTipo
  })

  const temFiltroAtivo = filtroPredio || filtroTipo

  function limparFiltros() {
    setFiltroPredio(null)
    setFiltroTipo(null)
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-tr from-blue-950 to-blue-700 h-28 rounded-b-[12px] flex flex-col items-center justify-center flex-shrink-0">
        <h1 className="text-white text-2xl font-bold tracking-wide">
          Mapa do Campus
        </h1>
        <div className="mt-2 flex items-center gap-2 opacity-80">
          <span className="text-[10px] uppercase tracking-[0.2em] text-blue-200">Powered by</span>
          <span className="text-blue-100 font-bold text-xs tracking-wide">Leaflet</span>
          <span className="text-blue-200 text-[10px]">+</span>
          <span className="text-blue-100 font-bold text-xs tracking-wide">OpenStreetMap</span>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 px-4 pt-4 pb-2 min-h-0 overflow-hidden max-h-[60vh]">
        <div className="h-full rounded-3xl overflow-hidden shadow-lg">
          {carregando ? (
            <div className="h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500 font-semibold text-sm">Carregando mapa...</p>
            </div>
          ) : (
            <MapContainer
              center={centroMapa}
              zoom={17}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {lixeirasFiltradas.map((lixeira) => (
                <Marker
                  key={lixeira.id}
                  position={[lixeira.latitude, lixeira.longitude]}
                  icon={criarIcone(lixeira.cor)}
                >
                  <Popup>
                    <div className="text-center">
                      <strong>{lixeira.nome}</strong><br />
                      Tipo: {lixeira.tipo}<br />
                      <span style={{ color: CONFIG_CORES[lixeira.cor]?.hex }}>
                        Lixeira {lixeira.cor}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>

      {/* Painel de filtro */}
      <div className="px-4 pb-24 flex-shrink-0">

        <button
          onClick={() => setPainelAberto(!painelAberto)}
          className="w-full bg-white rounded-3xl px-5 py-3 shadow-lg flex items-center justify-between cursor-pointer hover:bg-gray-50 transition mb-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-blue-900 font-bold text-sm">Filtrar lixeiras</span>
            {temFiltroAtivo && (
              <span className="bg-blue-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {[filtroPredio, filtroTipo].filter(Boolean).length} ativo{[filtroPredio, filtroTipo].filter(Boolean).length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {painelAberto
            ? <ChevronUp   size={18} className="text-blue-900" />
            : <ChevronDown size={18} className="text-blue-900" />
          }
        </button>

        {painelAberto && (
          <div className="bg-white rounded-3xl p-4 shadow-lg">

            {temFiltroAtivo && (
              <button
                onClick={limparFiltros}
                className="flex items-center gap-1 text-xs text-blue-600 font-semibold mb-3 cursor-pointer hover:text-blue-800"
              >
                <X size={12} /> Limpar filtros
              </button>
            )}

            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
              Por prédio
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {PREDIOS.map(predio => (
                <button
                  key={predio}
                  onClick={() => setFiltroPredio(prev => prev === predio ? null : predio)}
                  className="px-3 py-1.5 rounded-full border-2 border-blue-900 text-xs font-semibold transition cursor-pointer"
                  style={{
                    backgroundColor: filtroPredio === predio ? '#1e3a5f' : 'transparent',
                    color: filtroPredio === predio ? 'white' : '#1e3a5f',
                  }}
                >
                  {predio}
                </button>
              ))}
            </div>

            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
              Por tipo
            </p>
            <div className="flex flex-wrap gap-2">
              {TIPOS.map(tipo => {
                const lixeiraDoTipo = lixeiras.find(l => l.tipo === tipo)
                const cor = CONFIG_CORES[lixeiraDoTipo?.cor]?.hex || '#6b7280'
                const ativo = filtroTipo === tipo
                return (
                  <button
                    key={tipo}
                    onClick={() => setFiltroTipo(prev => prev === tipo ? null : tipo)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-semibold transition cursor-pointer"
                    style={{
                      borderColor: cor,
                      backgroundColor: ativo ? cor : 'transparent',
                      color: ativo ? 'white' : '#1e3a5f',
                    }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: ativo ? 'white' : cor }}
                    />
                    {tipo}
                  </button>
                )
              })}
            </div>

          </div>
        )}
      </div>

    </div>
  )
}

export default Mapa
