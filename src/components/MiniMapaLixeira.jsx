import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'

// Mesma paleta usada no Mapa.jsx, mas isolada aqui pra não
// criar dependência entre os dois componentes.
const CONFIG_CORES = {
  'Marrom':   { iconUrl: 'orange' },
  'Verde':    { iconUrl: 'green'  },
  'Azul':     { iconUrl: 'blue'   },
  'Vermelha': { iconUrl: 'red'    },
  'Amarela':  { iconUrl: 'gold'   },
}

function criarIcone(cor) {
  const config = CONFIG_CORES[cor] || { iconUrl: 'grey' }
  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${config.iconUrl}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  })
}

// Mapa pequeno e estático — só mostra a localização de UMA lixeira.
// Usado no card expandido do chamado pra dar contexto visual rápido.
function MiniMapaLixeira({ lixeira }) {
  if (!lixeira) return null

  const posicao = [lixeira.latitude, lixeira.longitude]

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200" style={{ height: 160 }}>
      <MapContainer
        center={posicao}
        zoom={18}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={posicao} icon={criarIcone(lixeira.cor)}>
          <Popup>
            <div className="text-center">
              <strong>{lixeira.nome}</strong><br />
              {lixeira.predio} · {lixeira.tipo}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default MiniMapaLixeira
