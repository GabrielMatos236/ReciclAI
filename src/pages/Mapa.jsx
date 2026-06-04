import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import BarraNavegacao from '../components/BarraNavegacao'

// ============================================
//           SINGLE SOURCE OF TRUTH
// ============================================


const CONFIG_CORES = {
  'Vermelha': { hex: '#ef4444', iconUrl: 'red' },
  'Azul':     { hex: '#3b82f6', iconUrl: 'blue' },
  'Verde':    { hex: '#22c55e', iconUrl: 'green' },
  'Amarela':  { hex: '#eab308', iconUrl: 'gold' },
  'Marrom':   { hex: '#92400e', iconUrl: 'orange' },
  'Cinza':    { hex: '#6b7280', iconUrl: 'grey' }
}

<<<<<<< Updated upstream
function Mapa() {
  const centroMapa = [-30.033217502718294, -51.1227849300074]
  
  // lixeiras existentes
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
  
  // Ícones lixeiras
  function criarIcone(cor) {
    const config = CONFIG_CORES[cor] || CONFIG_CORES['Cinza']
    
    return new Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${config.iconUrl}.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    })
=======
function Mapa({ barra = <BarraNavegacao /> }) {
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
>>>>>>> Stashed changes
  }
  
  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      
      {/* Header */}
      <div className="bg-purple-900 px-6 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-white text-2xl font-bold">Mapa do Campus</h1>
        <p className="text-purple-200 text-sm mt-1">
          Encontre o ponto de descarte mais próximo
        </p>
      </div>
      
      {/* Mapa */}
      <div className="px-6 mt-6">
        <div className="rounded-3xl overflow-hidden shadow-lg" style={{ height: '300px' }}>
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
                    <strong>{lixeira.nome}</strong>
                    <br />
                    Tipo: {lixeira.tipo}
                    <br />
                    <span style={{ color: CONFIG_CORES[lixeira.cor]?.hex || '#6b7280' }}>
                      Lixeira {lixeira.cor}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {/* Legenda em formato de chips/badges */}
        <div className="bg-white rounded-3xl p-4 mt-4 shadow-lg">
          <h3 className="font-bold text-purple-900 mb-3 text-center">
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
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cor }}
                  />
                  <span className="text-xs font-semibold text-gray-700">
                    {lixeira.nome}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
<<<<<<< Updated upstream
      
      <BarraNavegacao />
=======

      {barra}
>>>>>>> Stashed changes
    </div>
  )
}

export default Mapa