import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Sessao, Filme, Sala } from '../types';

// Tipo estendido para exibição
type SessaoComDados = Sessao & {
  filme?: Filme;
  sala?: Sala;
};

export function Sessoes() {
  const [sessoes, setSessoes] = useState<SessaoComDados[]>([]);
  const [carregando, setCarregando] = useState(true);

  // --- CONFIGURAÇÃO DE ESTILOS ---
  const estilos = {
    tituloPagina: {
      color: '#003366',
      fontWeight: 'bold'
    },
    botaoNovo: {
      backgroundColor: '#003366',
      borderColor: '#003366',
      color: 'white'
    },
    card: {
      border: '1px solid #cfe2ff',
      borderLeft: '5px solid #003366', // Borda lateral grossa em Azul Escuro (Estilo Ticket)
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0, 51, 102, 0.1)',
      transition: 'transform 0.2s'
    },
    cardTitle: {
      color: '#003366',
      fontWeight: '700'
    },
    textoInfo: {
      color: '#5a7699' // Azul acinzentado
    },
    badgeGenero: {
      backgroundColor: '#e6f2ff', // Azul bem claro
      color: '#003366',
      border: '1px solid #b3d7ff'
    },
    badgeClassificacao: {
      backgroundColor: '#003366', // Azul escuro para contraste
      color: '#ffffff'
    },
    botaoVender: {
      backgroundColor: '#003366',
      borderColor: '#003366',
      color: 'white'
    },
    loading: {
      color: '#003366',
      fontSize: '1.2rem'
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [dadosSessoes, dadosFilmes, dadosSalas] = await Promise.all([
        api.listarSessoes(),
        api.listarFilmes(),
        api.listarSalas()
      ]);

      // Cruzar dados
      const sessoesCompletas = dadosSessoes.map(sessao => ({
        ...sessao,
        filme: dadosFilmes.find(f => f.id === sessao.filmeId),
        sala: dadosSalas.find(s => s.id === sessao.salaId)
      }));

      setSessoes(sessoesCompletas);
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
      alert('Erro ao carregar sessões');
    } finally {
      setCarregando(false);
    }
  }

  async function lidarComExclusao(id: string) {
    if (confirm('Tem certeza que deseja cancelar esta sessão?')) {
      try {
        await api.excluirSessao(id);
        carregarDados();
      } catch (erro) {
        console.error('Erro ao excluir:', erro);
        alert('Erro ao excluir sessão');
      }
    }
  }

  if (carregando) {
    return <div className="text-center mt-5" style={estilos.loading}>Carregando sessões...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2" style={{ borderBottom: '2px solid #e6f2ff' }}>
        <h2 style={estilos.tituloPagina}>Sessões Agendadas</h2>
        <Link 
          to="/sessoes/novo" 
          className="btn" 
          style={estilos.botaoNovo}
        >
          <i className="bi bi-plus-lg me-2"></i>Nova Sessão
        </Link>
      </div>

      {sessoes.length === 0 ? (
        <div className="alert alert-light text-center" role="alert" style={{ backgroundColor: '#f0f8ff', color: '#003366' }}>
          Nenhuma sessão agendada no momento.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {sessoes.map((sessao) => (
            <div className="col" key={sessao.id}>
              <div className="card h-100" style={estilos.card}>
                <div className="card-body">
                  <h5 className="card-title mb-3" style={estilos.cardTitle}>
                    {sessao.filme?.titulo || 'Filme não encontrado'}
                  </h5>
                  
                  <h6 className="card-subtitle mb-3" style={estilos.textoInfo}>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-door-open me-2 fs-5"></i> 
                      <span>Sala {sessao.sala?.numero || '?'}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar-event me-2 fs-5"></i> 
                      <span>{new Date(sessao.dataHora).toLocaleString()}</span>
                    </div>
                  </h6>
                  
                  <div className="mt-3">
                    <span className="badge me-2" style={estilos.badgeGenero}>
                      {sessao.filme?.genero}
                    </span>
                    <span className="badge" style={estilos.badgeClassificacao}>
                      {sessao.filme?.classificacao}
                    </span>
                  </div>
                </div>
                
                <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between pb-3 pt-0">
                  <Link 
                    to={`/sessoes/${sessao.id}/vender`} 
                    className="btn btn-sm d-flex align-items-center"
                    style={estilos.botaoVender}
                  >
                    <i className="bi bi-ticket-perforated me-2"></i>Vender Ingresso
                  </Link>
                  
                  <button 
                    onClick={() => lidarComExclusao(sessao.id!)} 
                    className="btn btn-outline-danger btn-sm"
                    title="Cancelar Sessão"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}