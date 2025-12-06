import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Sessao, Filme, Sala, Ingresso } from '../types';

type AssentoStatus = 'livre' | 'ocupado' | 'selecionado';

interface AssentoUI {
  id: string;
  status: AssentoStatus;
}

export function VendaIngresso() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [filme, setFilme] = useState<Filme | null>(null);
  const [sala, setSala] = useState<Sala | null>(null);
  const [assentos, setAssentos] = useState<AssentoUI[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  const [selecionados, setSelecionados] = useState<Map<string, 'INTEIRA' | 'MEIA'>>(new Map());

  // --- CONFIGURAÇÃO DE ESTILOS ---
  const estilos = {
    titulo: { color: '#003366', fontWeight: 'bold' },
    subtitulo: { color: '#4a6fa5' },
    infoSessao: { color: '#004080', fontWeight: '500' },
    
    // Cards
    cardContainer: {
      backgroundColor: '#f0f8ff', // Azul Alice
      border: '1px solid #cfe2ff',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 51, 102, 0.1)'
    },
    cardHeader: {
      backgroundColor: '#003366',
      color: 'white',
      fontWeight: 'bold',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px'
    },

    // Assentos
    tela: {
      backgroundColor: '#8da2c0', // Azul acinzentado representando a tela
      height: '10px',
      width: '80%',
      margin: '0 auto 30px auto',
      borderRadius: '5px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
    },
    assentoLivre: {
      backgroundColor: '#fff',
      border: '2px solid #003366',
      color: '#003366'
    },
    assentoSelecionado: {
      backgroundColor: '#003366',
      border: '2px solid #003366',
      color: '#fff'
    },
    assentoOcupado: {
      backgroundColor: '#d1d5db', // Cinza
      border: '2px solid #9ca3af',
      color: '#6b7280',
      cursor: 'not-allowed'
    },

    // Resumo
    totalLabel: { color: '#003366', fontWeight: 'bold' },
    totalValor: { color: '#003366', fontWeight: '800', fontSize: '1.5rem' },
    botaoFinalizar: {
      backgroundColor: '#003366',
      borderColor: '#003366',
      color: 'white',
      fontWeight: 'bold'
    }
  };

  useEffect(() => {
    if (id) {
      carregarDados(id);
    }
  }, [id]);

  async function carregarDados(sessaoId: string) {
    try {
      const dadosSessao = await api.listarSessoes().then(lista => lista.find(s => s.id === sessaoId));
      
      if (!dadosSessao) {
        alert('Sessão não encontrada');
        navigate('/sessoes');
        return;
      }
      
      const [dadosFilme, dadosSala, dadosIngressos] = await Promise.all([
        api.obterFilme(dadosSessao.filmeId),
        api.listarSalas().then(lista => lista.find(s => s.id === dadosSessao.salaId)),
        api.listarIngressosPorSessao(sessaoId)
      ]);

      if (!dadosSala) throw new Error('Sala não encontrada');

      setSessao(dadosSessao);
      setFilme(dadosFilme);
      setSala(dadosSala);

      gerarAssentos(dadosSala.capacidade, dadosIngressos);
      
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
      alert('Erro ao carregar dados da sessão');
    } finally {
      setCarregando(false);
    }
  }

  function gerarAssentos(capacidade: number, ingressosVendidos: Ingresso[]) {
    const assentosGerados: AssentoUI[] = [];
    const assentosOcupados = new Set(ingressosVendidos.map(i => i.assento));
    
    const colunas = 10;
    const fileiras = Math.ceil(capacidade / colunas);
    
    let contador = 0;
    for (let i = 0; i < fileiras; i++) {
      const letra = String.fromCharCode(65 + i);
      for (let j = 1; j <= colunas; j++) {
        if (contador >= capacidade) break;
        
        const idAssento = `${letra}${j}`;
        assentosGerados.push({
          id: idAssento,
          status: assentosOcupados.has(idAssento) ? 'ocupado' : 'livre'
        });
        contador++;
      }
    }
    setAssentos(assentosGerados);
  }

  function alternarAssento(assentoId: string) {
    const novosSelecionados = new Map(selecionados);
    if (novosSelecionados.has(assentoId)) {
      novosSelecionados.delete(assentoId);
    } else {
      novosSelecionados.set(assentoId, 'INTEIRA');
    }
    setSelecionados(novosSelecionados);
  }

  function mudarTipoIngresso(assentoId: string, tipo: 'INTEIRA' | 'MEIA') {
    const novosSelecionados = new Map(selecionados);
    novosSelecionados.set(assentoId, tipo);
    setSelecionados(novosSelecionados);
  }

  async function finalizarVenda() {
    if (selecionados.size === 0) return;
    
    if (!confirm(`Confirmar venda de ${selecionados.size} ingressos?`)) return;

    try {
      const promises = Array.from(selecionados.entries()).map(([assento, tipo]) => {
        return api.criarIngresso({
          sessaoId: sessao!.id!,
          assento,
          tipo,
          valor: tipo === 'INTEIRA' ? 20 : 10
        });
      });

      await Promise.all(promises);
      
      alert('Venda realizada com sucesso!');
      navigate('/sessoes');
      
    } catch (erro) {
      console.error('Erro na venda:', erro);
      alert('Erro ao processar venda');
    }
  }

  const total = Array.from(selecionados.values()).reduce((acc, tipo) => acc + (tipo === 'INTEIRA' ? 20 : 10), 0);

  if (carregando) return <div className="text-center mt-5" style={{ color: '#003366' }}>Carregando interface de vendas...</div>;

  return (
    <div className="container mt-4">
      {/* Cabeçalho */}
      <div className="row mb-4 pb-3" style={{ borderBottom: '2px solid #e6f2ff' }}>
        <div className="col">
          <h2 style={estilos.titulo}>Venda de Ingressos</h2>
          <h4 className="mt-2" style={estilos.subtitulo}>{filme?.titulo}</h4>
          <div className="d-flex align-items-center gap-3 mt-2" style={estilos.infoSessao}>
             <span><i className="bi bi-door-open me-1"></i> Sala {sala?.numero}</span>
             <span>|</span>
             <span><i className="bi bi-calendar-event me-1"></i> {new Date(sessao!.dataHora).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Mapa de Assentos */}
        <div className="col-lg-7">
          <div style={estilos.cardContainer}>
            <div className="p-3 text-center" style={estilos.cardHeader}>SELEÇÃO DE ASSENTOS</div>
            <div className="card-body p-4 text-center">
              
              <div style={estilos.tela}></div>
              <p className="small text-muted mb-4">TELA</p>

              <div className="d-flex flex-wrap justify-content-center gap-2" style={{ maxWidth: '450px', margin: '0 auto' }}>
                {assentos.map(assento => {
                  const isSelected = selecionados.has(assento.id);
                  
                  // Define estilo baseado no estado
                  let style = estilos.assentoLivre;
                  if (assento.status === 'ocupado') style = estilos.assentoOcupado;
                  else if (isSelected) style = estilos.assentoSelecionado;

                  return (
                    <button
                      key={assento.id}
                      className="btn btn-sm fw-bold shadow-sm"
                      style={{ ...style, width: '45px', height: '40px' }}
                      onClick={() => assento.status === 'livre' && alternarAssento(assento.id)}
                      disabled={assento.status === 'ocupado'}
                    >
                      {assento.id}
                    </button>
                  );
                })}
              </div>
              
              {/* Legenda */}
              <div className="mt-5 d-flex justify-content-center gap-4 border-top pt-3">
                <div className="d-flex align-items-center gap-2">
                    <div style={{...estilos.assentoLivre, width: 20, height: 20, borderRadius: 4}}></div>
                    <small>Livre</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div style={{...estilos.assentoSelecionado, width: 20, height: 20, borderRadius: 4}}></div>
                    <small>Selecionado</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div style={{...estilos.assentoOcupado, width: 20, height: 20, borderRadius: 4}}></div>
                    <small>Ocupado</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo da Compra */}
        <div className="col-lg-5">
          <div style={estilos.cardContainer}>
            <div className="p-3" style={estilos.cardHeader}>RESUMO DO PEDIDO</div>
            <div className="card-body p-4">
              {selecionados.size === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-ticket-perforated display-1 d-block mb-3" style={{ opacity: 0.2 }}></i>
                  Selecione os assentos no mapa para iniciar a venda.
                </div>
              ) : (
                <>
                  <ul className="list-group list-group-flush mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {Array.from(selecionados.entries()).map(([assento, tipo]) => (
                      <li key={assento} className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom border-light">
                        <div>
                            <span className="badge rounded-pill me-2" style={{ backgroundColor: '#003366' }}>{assento}</span>
                            <span className="fw-500 text-dark">Ingresso</span>
                        </div>
                        <select 
                          className="form-select form-select-sm w-auto border-primary"
                          style={{ color: '#003366', fontWeight: 500 }}
                          value={tipo}
                          onChange={(e) => mudarTipoIngresso(assento, e.target.value as 'INTEIRA' | 'MEIA')}
                        >
                          <option value="INTEIRA">Inteira (R$ 20)</option>
                          <option value="MEIA">Meia (R$ 10)</option>
                        </select>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-3 border-top border-2">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <span style={estilos.totalLabel}>TOTAL A PAGAR</span>
                      <span style={estilos.totalValor}>R$ {total.toFixed(2)}</span>
                    </div>
                    
                    <button 
                      className="btn w-100 py-2 shadow-sm" 
                      style={estilos.botaoFinalizar}
                      onClick={finalizarVenda}
                    >
                      <i className="bi bi-check-lg me-2"></i> Confirmar Venda
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}