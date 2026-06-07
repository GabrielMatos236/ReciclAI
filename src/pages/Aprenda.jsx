import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import BarraNavegacao from '../components/BarraNavegacao'

const CATEGORIAS = [
  {
    cor: 'Azul',
    bg: 'bg-blue-100',
    texto: 'text-blue-900',
    borda: 'border-blue-300',
    hex: '#3b82f6',
    label: 'Papel e Papelão',
    exemplos: ['Jornais e revistas', 'Caixas de papelão', 'Folhas de papel', 'Cadernos sem espiral', 'Embalagens de papel'],
    nao: ['Papel higiênico usado', 'Papel engordurado', 'Guardanapos usados']
  },
  {
    cor: 'Vermelha',
    bg: 'bg-red-100',
    texto: 'text-red-900',
    borda: 'border-red-300',
    hex: '#ef4444',
    label: 'Plástico',
    exemplos: ['Garrafas PET', 'Embalagens de shampoo', 'Sacos plásticos limpos', 'Potes de iogurte', 'Canudos'],
    nao: ['Plástico com restos de comida', 'Fraldas descartáveis', 'Isopor contaminado']
  },
  {
    cor: 'Verde',
    bg: 'bg-green-100',
    texto: 'text-green-900',
    borda: 'border-green-300',
    hex: '#22c55e',
    label: 'Vidro',
    exemplos: ['Garrafas de vidro', 'Potes de conserva', 'Frascos de perfume', 'Copos quebrados (com cuidado)'],
    nao: ['Espelhos', 'Vidro de janela temperado', 'Lâmpadas', 'Cristais']
  },
  {
    cor: 'Amarela',
    bg: 'bg-yellow-100',
    texto: 'text-yellow-900',
    borda: 'border-yellow-300',
    hex: '#eab308',
    label: 'Metal',
    exemplos: ['Latas de alumínio', 'Latas de alimentos', 'Tampas metálicas', 'Panelas velhas', 'Arames'],
    nao: ['Latas com resíduos de tinta', 'Embalagens aerossol cheias']
  },
  {
    cor: 'Marrom',
    bg: 'bg-amber-100',
    texto: 'text-amber-900',
    borda: 'border-amber-300',
    hex: '#92400e',
    label: 'Orgânico',
    exemplos: ['Cascas de frutas e legumes', 'Restos de comida', 'Borra de café', 'Folhas e galhos pequenos', 'Ovos e casca'],
    nao: ['Carne crua em excesso', 'Laticínios em grande quantidade', 'Óleo de cozinha']
  },
  {
    cor: 'Cinza',
    bg: 'bg-gray-100',
    texto: 'text-gray-800',
    borda: 'border-gray-300',
    hex: '#6b7280',
    label: 'Não-reciclável / Rejeito',
    exemplos: ['Papel carbono e fotografias', 'Esponjas de cozinha', 'Cerâmicas e porcelanas', 'Adesivos e etiquetas', 'Fitas adesivas'],
    nao: []
  },
]

const DICAS = [
  { emoji: '🚿', titulo: 'Lave as embalagens', texto: 'Sempre enxágue potes e garrafas antes de descartar. Resíduos de alimentos contaminam toda a leva de recicláveis.' },
  { emoji: '📦', titulo: 'Separe antes de descartar', texto: 'Não misture materiais diferentes. Vidro com plástico, por exemplo, prejudica o processo de reciclagem nas usinas.' },
  { emoji: '♻️', titulo: 'Amasse as latas', texto: 'Latas amassadas ocupam menos espaço no coletor e facilitam o transporte até a cooperativa de reciclagem.' },
  { emoji: '🔋', titulo: 'Eletrônicos têm descarte especial', texto: 'Pilhas, baterias e aparelhos eletrônicos nunca vão nas lixeiras comuns. Procure pontos de coleta específicos.' },
]

function Aprenda() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* Header */}
      <div className="bg-gradient-to-tr from-blue-950 to-blue-700 h-28 rounded-b-[12px] flex flex-col items-center justify-center flex-shrink-0 relative">
        <button
          onClick={() => navigate('/home')}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-800/60 p-2 rounded-full cursor-pointer hover:bg-blue-800 transition"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold tracking-wide">Aprenda a Reciclar</h1>
        <p className="text-blue-200 text-xs mt-1 opacity-80">Guia de descarte seletivo</p>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-4">

        {/* Cards por categoria */}
        {CATEGORIAS.map((cat) => (
          <div
            key={cat.cor}
            className={`${cat.bg} border ${cat.borda} rounded-3xl p-4`}
          >
            {/* Header do card */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.hex }}
              />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                  Lixeira {cat.cor}
                </p>
                <p className={`${cat.texto} font-bold text-base leading-tight`}>
                  {cat.label}
                </p>
              </div>
            </div>

            {/* Pode descartar */}
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
              ✓ Pode descartar
            </p>
            <ul className="flex flex-col gap-1 mb-3">
              {cat.exemplos.map((ex) => (
                <li key={ex} className={`${cat.texto} text-sm flex items-center gap-2`}>
                  <span className="text-green-600 font-bold">•</span> {ex}
                </li>
              ))}
            </ul>

            {/* Não pode */}
            {cat.nao.length > 0 && (
              <>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
                  ✗ Não colocar aqui
                </p>
                <ul className="flex flex-col gap-1">
                  {cat.nao.map((item) => (
                    <li key={item} className="text-red-700 text-sm flex items-center gap-2">
                      <span className="font-bold">•</span> {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}

        {/* Dicas gerais */}
        <div className="bg-white rounded-3xl p-4 border border-gray-200">
          <p className="text-blue-900 font-bold text-base mb-3">💡 Dicas importantes</p>
          <div className="flex flex-col gap-3">
            {DICAS.map((dica) => (
              <div key={dica.titulo} className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{dica.emoji}</span>
                <div>
                  <p className="text-blue-900 font-semibold text-sm">{dica.titulo}</p>
                  <p className="text-gray-600 text-xs leading-relaxed mt-0.5">{dica.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <BarraNavegacao />
    </div>
  )
}

export default Aprenda
