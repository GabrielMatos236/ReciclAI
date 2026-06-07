import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, ArrowLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import BarraNavegacao from '../components/BarraNavegacao'

const CATEGORIAS = [
  {
    id: 'papel',
    label: 'Papel e Papelão',
    cor: '#1e40af',
    icone: '📄',
    descricao: 'Para descarte, os papéis devem estar secos e limpos, sem gordura ou cola.',
    reciclaveis: [
      'Jornais e revistas',
      'Livros e cadernos',
      'Papel de escritório',
      'Papel kraft',
      'Caixas de papelão',
      'Cartolina e envelope',
      'Caixa de ovo de papelão',
      'Caixas e bulas de remédios',
      'Rolinho do papel higiênico',
    ],
    nao: [
      'Papel higiênico usado',
      'Papel celofane',
      'Nota fiscal (termossensível)',
      'Papel carbono',
      'Fotografias',
      'Adesivos e etiquetas',
      'Fita crepe',
      'Papel metalizado',
      'Papel plastificado',
    ],
    complicados: [
      'Caixa de pizza (separe a parte limpa)',
      'Guardanapo de papel (verificar)',
    ],
  },
  {
    id: 'plastico',
    label: 'Plástico',
    cor: '#b91c1c',
    icone: '🧴',
    descricao: 'Sempre enxágue as embalagens antes de descartar. Resíduos de alimentos contaminam toda a carga.',
    reciclaveis: [
      'Garrafas PET (água, suco, refrigerante)',
      'Embalagens de shampoo e condicionador',
      'Potes transparentes (maionese, ketchup)',
      'Embalagens de cosméticos',
      'Sacolinhas plásticas limpas',
      'Potes de iogurte',
      'Brinquedos de plástico',
      'Canos e tubos de PVC',
      'Canudos',
    ],
    nao: [
      'Fraldas descartáveis',
      'Isopor contaminado',
      'Embalagens com resíduos de tinta',
      'Plástico com muita sujeira',
    ],
    complicados: [
      'Embalagens coloridas (baixa reciclabilidade)',
      'Bandejinhas de alimentos (depende do material)',
      'PET de leite (requer triagem especial)',
    ],
  },
  {
    id: 'vidro',
    label: 'Vidro',
    cor: '#15803d',
    icone: '🍾',
    descricao: 'Evite acidentes: se o vidro estiver quebrado, envolva em papel antes de descartar. Limpe frascos de alimentos antes do descarte.',
    reciclaveis: [
      'Garrafas de bebidas (refrigerante, cerveja, vinho)',
      'Potes de conserva e condimentos',
      'Frascos de perfume',
      'Copos de vidro',
    ],
    nao: [
      'Cerâmicas e louças',
      'Cristal',
      'Vidros temperados (janelas, parabrisa)',
      'Lâmpadas',
    ],
    complicados: [
      'Ampolas de medicamentos (consulte farmácia)',
      'Espelhos (verifique ponto de coleta local)',
    ],
  },
  {
    id: 'metal',
    label: 'Metal',
    cor: '#a16207',
    icone: '🥫',
    descricao: 'Amasse as latas antes de descartar — ocupam menos espaço e facilitam o transporte até a cooperativa.',
    reciclaveis: [
      'Latas de alumínio (cerveja, refrigerante)',
      'Latas de alimentos (conservas, extrato)',
      'Tampas metálicas',
      'Panelas e utensílios velhos',
      'Arames e pregos',
      'Ferragens em geral',
    ],
    nao: [
      'Embalagens aerossol cheias ou pressurizadas',
      'Latas com resíduos de tinta ou solvente',
      'Pilhas e baterias (descarte especial!)',
    ],
    complicados: [
      'Embalagens metalizadas (papel + alumínio)',
      'Tampas de garrafa PET (separe do plástico)',
    ],
  },
  {
    id: 'organico',
    label: 'Orgânico',
    cor: '#92400e',
    icone: '🍃',
    descricao: 'Resíduos orgânicos podem virar adubo via compostagem. Evite misturar com recicláveis.',
    reciclaveis: [
      'Cascas de frutas e legumes',
      'Restos de comida cozida',
      'Borra de café e filtro de papel',
      'Cascas de ovos',
      'Folhas e galhos pequenos',
      'Aparas de grama',
    ],
    nao: [
      'Óleo de cozinha (descarte em ponto específico)',
      'Carne crua ou ossos em excesso',
      'Laticínios em grande quantidade',
    ],
    complicados: [
      'Fraldas e absorventes (rejeito — lixo comum)',
    ],
  },
  {
    id: 'nao-reciclavel',
    label: 'Não-reciclável (Rejeito)',
    cor: '#4b5563',
    icone: '🗑️',
    descricao: 'Rejeitos são resíduos que não têm aproveitamento na reciclagem nem na compostagem. Vão para o lixo comum.',
    reciclaveis: [],
    nao: [
      'Papel higiênico e lenço usados',
      'Esponjas de cozinha',
      'Cerâmicas e porcelanas',
      'Fitas adesivas',
      'Cabelos e pelos',
      'Bitucas de cigarro',
      'Velas e cera',
    ],
    complicados: [
      'Eletrônicos (e-lixo — ponto de coleta específico)',
      'Pilhas e baterias (ponto de coleta específico)',
      'Medicamentos vencidos (devolva à farmácia)',
    ],
  },
]

function ItemLista({ tipo, texto }) {
  if (tipo === 'sim') return (
    <div className="flex items-start gap-2">
      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
      <span className="text-gray-700 text-sm leading-snug">{texto}</span>
    </div>
  )
  if (tipo === 'nao') return (
    <div className="flex items-start gap-2">
      <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
      <span className="text-gray-700 text-sm leading-snug">{texto}</span>
    </div>
  )
  return (
    <div className="flex items-start gap-2">
      <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
      <span className="text-gray-700 text-sm leading-snug">{texto}</span>
    </div>
  )
}

function Aprenda() {
  const navigate = useNavigate()
  const [aberto, setAberto] = useState(null)
  const [legendaAberta, setLegendaAberta] = useState(true)

  function toggleCategoria(id) {
    setAberto(prev => prev === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* Header */}
      <div className="bg-gradient-to-tr from-blue-950 to-blue-700 h-28 rounded-b-[12px] flex flex-col items-center justify-center relative flex-shrink-0">
        <button
          onClick={() => navigate('/home')}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-800/60 p-2 rounded-full cursor-pointer hover:bg-blue-800 transition"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold tracking-wide">Aprenda a Reciclar</h1>
        <p className="text-blue-200 text-xs mt-1 opacity-80">Guia de descarte seletivo</p>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">

        {/* Legenda (accordion) */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setLegendaAberta(p => !p)}
            className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
          >
            <span className="text-blue-900 font-bold text-base">Legenda</span>
            {legendaAberta
              ? <ChevronUp size={20} className="text-gray-400" />
              : <ChevronDown size={20} className="text-gray-400" />
            }
          </button>

          {legendaAberta && (
            <div className="px-5 pb-5 flex flex-col gap-3 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-green-500" />
                <span className="text-gray-800 font-semibold text-sm">Material Reciclável</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle size={20} className="text-red-500" />
                <span className="text-gray-800 font-semibold text-sm">Não Reciclável</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-800 font-semibold text-sm">Material complicado:</span>
                  <p className="text-gray-500 text-xs leading-relaxed mt-0.5">
                    Baixa reciclabilidade e/ou requer cuidados específicos para o descarte.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordions por categoria */}
        {CATEGORIAS.map((cat) => {
          const estaAberto = aberto === cat.id
          return (
            <div key={cat.id} className="rounded-2xl overflow-hidden shadow-sm">

              {/* Header colorido */}
              <button
                onClick={() => toggleCategoria(cat.id)}
                className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer transition-opacity active:opacity-80"
                style={{ backgroundColor: cat.cor }}
              >
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xl">
                  {cat.icone}
                </div>
                <span className="flex-1 text-left font-bold text-lg text-white">
                  {cat.label}
                </span>
                {estaAberto
                  ? <ChevronUp size={22} color="white" />
                  : <ChevronDown size={22} color="white" />
                }
              </button>

              {/* Conteúdo expandido */}
              {estaAberto && (
                <div className="bg-white px-5 py-5 flex flex-col gap-4">

                  {/* Descrição */}
                  <p
                    className="text-gray-600 text-sm leading-relaxed border-l-4 pl-3"
                    style={{ borderColor: cat.cor }}
                  >
                    {cat.descricao}
                  </p>

                  {/* Recicláveis */}
                  {cat.reciclaveis.length > 0 && (
                    <div>
                      <p className="text-gray-800 font-bold text-sm mb-2">Recicláveis</p>
                      <div className="flex flex-col gap-2">
                        {cat.reciclaveis.map(item => (
                          <ItemLista key={item} tipo="sim" texto={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Não recicláveis */}
                  {cat.nao.length > 0 && (
                    <div>
                      <p className="text-gray-800 font-bold text-sm mb-2">Não Recicláveis</p>
                      <div className="flex flex-col gap-2">
                        {cat.nao.map(item => (
                          <ItemLista key={item} tipo="nao" texto={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Complicados */}
                  {cat.complicados.length > 0 && (
                    <div>
                      <p className="text-gray-800 font-bold text-sm mb-2">Complicados</p>
                      <div className="flex flex-col gap-2">
                        {cat.complicados.map(item => (
                          <ItemLista key={item} tipo="complicado" texto={item} />
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default Aprenda
