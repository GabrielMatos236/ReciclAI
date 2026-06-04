import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { ChevronUp, ChevronDown, X } from 'lucide-react'
import BarraNavegacao from '../components/BarraNavegacao'

const CONFIG_CORES = {
  'Marrom':   { hex: '#92400e', iconUrl: 'orange' },
  'Verde':    { hex: '#22c55e', iconUrl: 'green'  },
  'Azul':     { hex: '#3b82f6', iconUrl: 'blue'   },
  'Vermelha': { hex: '#ef4444', iconUrl: 'red'    },
  'Amarela':  { hex: '#eab308', iconUrl: 'gold'   },
}

const PREDIOS = ['Prédio 1', 'Prédio 3', 'Prédio 4', 'Prédio 5', 'Prédio 6', 'Prédio 7']
const TIPOS   = ['Orgânico', 'Vidro', 'Papel', 'Plástico', 'Metal']

const LIXEIRAS = [
  { id:  1, nome: 'Orgânico - Prédio 1',  predio: 'Prédio 1', tipo: 'Orgânico',  cor: 'Marrom',   coordenadas: [-30.033394, -51.122361] },
  { id:  2, nome: 'Vidro - Prédio 1',     predio: 'Prédio 1', tipo: 'Vidro',     cor: 'Verde',    coordenadas: [-30.033494, -51.122361] },
  { id:  3, nome: 'Papel - Prédio 1',     predio: 'Prédio 1', tipo: 'Papel',     cor: 'Azul',     coordenadas: [-30.033444, -51.122311] },
  { id:  4, nome: 'Plástico - Prédio 1',  predio: 'Prédio 1', tipo: 'Plástico',  cor: 'Vermelha', coordenadas: [-30.033444, -51.122411] },
  { id:  5, nome: 'Metal - Prédio 1',     predio: 'Prédio 1', tipo: 'Metal',     cor: 'Amarela',  coordenadas: [-30.033394, -51.122311] },
  { id:  6, nome: 'Orgânico - Prédio 3',  predio: 'Prédio 3', tipo: 'Orgânico',  cor: 'Marrom',   coordenadas: [-30.033228, -51.122786] },
  { id:  7, nome: 'Vidro - Prédio 3',     predio: 'Prédio 3', tipo: 'Vidro',     cor: 'Verde',    coordenadas: [-30.033328, -51.122786] },
  { id:  8, nome: 'Papel - Prédio 3',     predio: 'Prédio 3', tipo: 'Papel',     cor: 'Azul',     coordenadas: [-30.033278, -51.122736] },
  { id:  9, nome: 'Plástico - Prédio 3',  predio: 'Prédio 3', tipo: 'Plástico',  cor: 'Vermelha', coordenadas: [-30.033278, -51.122836] },
  { id: 10, nome: 'Metal - Prédio 3',     predio: 'Prédio 3', tipo: 'Metal',     cor: 'Amarela',  coordenadas: [-30.033228, -51.122736] },
  { id: 11, nome: 'Orgânico - Prédio 4',  predio: 'Prédio 4', tipo: 'Orgânico',  cor: 'Marrom',   coordenadas: [-30.031942, -51.122703] },
  { id: 12, nome: 'Vidro - Prédio 4',     predio: 'Prédio 4', tipo: 'Vidro',     cor: 'Verde',    coordenadas: [-30.032042, -51.122703] },
  { id: 13, nome: 'Papel - Prédio 4',     predio: 'Prédio 4', tipo: 'Papel',     cor: 'Azul',     coordenadas: [-30.031992, -51.122653] },
  { id: 14, nome: 'Plástico - Prédio 4',  predio: 'Prédio 4', tipo: 'Plástico',  cor: 'Vermelha', coordenadas: [-30.031992, -51.122753] },
  { id: 15, nome: 'Metal - Prédio 4',     predio: 'Prédio 4', tipo: 'Metal',     cor: 'Amarela',  coordenadas: [-30.031942, -51.122653] },
  { id: 16, nome: 'Orgânico - Prédio 5',  predio: 'Prédio 5', tipo: 'Orgânico',  cor: 'Marrom',   coordenadas: [-30.032672, -51.123194] },
  { id: 17, nome: 'Vidro - Prédio 5',     predio: 'Prédio 5', tipo: 'Vidro',     cor: 'Verde',    coordenadas: [-30.032772, -51.123194] },
  { id: 18, nome: 'Papel - Prédio 5',     predio: 'Prédio 5', tipo: 'Papel',     cor: 'Azul',     coordenadas: [-30.032722, -51.123144] },
  { id: 19, nome: 'Plástico - Prédio 5',  predio: 'Prédio 5', tipo: 'Plástico',  cor: 'Vermelha', coordenadas: [-30.032722, -51.123244] },
  { id: 20, nome: 'Metal - Prédio 5',     predio: 'Prédio 5', tipo: 'Metal',     cor: 'Amarela',  coordenadas: [-30.032672, -51.123144] },
  { id: 21, nome: 'Orgânico - Prédio 6',  predio: 'Prédio 6', tipo: 'Orgânico',  cor: 'Marrom',   coordenadas: [-30.031867, -51.123361] },
  { id: 22, nome: 'Vidro - Prédio 6',     predio: 'Prédio 6', tipo: 'Vidro',     cor: 'Verde',    coordenadas: [-30.031967, -51.123361] },
  { id: 23, nome: 'Papel - Prédio 6',     predio: 'Prédio 6', tipo: 'Papel',     cor: 'Azul',     coordenadas: [-30.031917, -51.123311] },
  { id: 24, nome: 'Plástico - Prédio 6',  predio: 'Prédio 6', tipo: 'Plástico',  cor: 'Vermelha', coordenadas: [-30.031917, -51.123411] },
  { id: 25, nome: 'Metal - Prédio 6',     predio: 'Prédio 6', tipo: 'Metal',     cor: 'Amarela',  coordenadas: [-30.031867, -51.123311] },
  { id: 26, nome: 'Orgânico - Prédio 7',  predio: 'Prédio 7', tipo: 'Orgânico',  cor: 'Marrom',   coordenadas: [-30.032703, -51.123708] },
  { id: 27, nome: 'Vidro - Prédio 7',     predio: 'Prédio 7', tipo: 'Vidro',     cor: 'Verde',    coordenadas: [-30.032803, -51.123708] },
  { id: 28, nome: 'Papel - Prédio 7',     predio: 'Prédio 7', tipo: 'Papel',     cor: 'Azul',     coordenadas: [-30.032753, -51.123658] },
  { id: 29, nome: 'Plástico - Prédio 7',  predio: 'Prédio 7', tipo: 'Plástico',  cor: 'Vermelha', coordenadas: [-30.032753, -51.123758] },
  { id: 30, nome: 'Metal - Prédio 7',     predio: 'Prédio 7', tipo: 'Metal',     cor: 'Amarela',  coordenadas: [-30.032703, -51.123658] },
]

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

  const [filtroPredio, setFiltroPredio] = useState(null)
  const [filtroTipo,   setFiltroTipo]   = useState(location.state?.filtroTipo || null)
  const [painelAberto, setPainelAberto] = useState(!!location.state?.filtroTipo)

  const centroMapa = [-30.033217, -51.122785]

  const lixeirasFiltradas = LIXEIRAS.filter(l => {
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
                position={lixeira.coordenadas}
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
        </div>
      </div>

      {/* Painel de filtro */}
      <div className="px-4 pb-24 flex-shrink-0">

        {/* Botão de abrir/fechar painel */}
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
            ? <ChevronDown size={18} className="text-blue-900" />
            : <ChevronUp   size={18} className="text-blue-900" />
          }
        </button>

        {/* Painel expandido */}
        {painelAberto && (
          <div className="bg-white rounded-3xl p-4 shadow-lg">

            {/* Linha de limpar filtros */}
            {temFiltroAtivo && (
              <button
                onClick={limparFiltros}
                className="flex items-center gap-1 text-xs text-blue-600 font-semibold mb-3 cursor-pointer hover:text-blue-800"
              >
                <X size={12} /> Limpar filtros
              </button>
            )}

            {/* Filtro por prédio */}
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

            {/* Filtro por tipo */}
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
              Por tipo
            </p>
            <div className="flex flex-wrap gap-2">
              {TIPOS.map(tipo => {
                const lixeira = LIXEIRAS.find(l => l.tipo === tipo)
                const cor = CONFIG_CORES[lixeira?.cor]?.hex || '#6b7280'
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

      <BarraNavegacao />
    </div>
  )
}

export default Mapa