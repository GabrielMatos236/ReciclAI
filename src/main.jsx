// #2 Hierarquia do fluxo da aplicação //
import { StrictMode } from 'react' // -> Importa o StrictMode do React para ajudar a identificar problemas no aplicativo durante o desenvolvimento.
import { createRoot } from 'react-dom/client' // -> Importa a função createRoot do React DOM para criar a raiz do aplicativo React.
import './index.css' // -> Importa o arquivo CSS global para estilizar o aplicativo.
import 'leaflet/dist/leaflet.css' // -> Importa o arquivo CSS do Leaflet, uma biblioteca de mapas, para estilizar os elementos do mapa.
import App from './App.jsx' // -> Importa o componente principal do aplicativo, que é definido no arquivo App.jsx.

// -> Cria a raiz do aplicativo React e renderiza o componente App dentro do StrictMode, que ajuda a identificar problemas no aplicativo durante o desenvolvimento.
createRoot(document.getElementById('root')).render( // -> O 'root' é o ID do elemento HTML onde o aplicativo React será montado.
  <StrictMode>
    <App />
  </StrictMode>,
)
