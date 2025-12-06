import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Sala } from '../types';

export function Salas() {
  const [salas, setSalas] = useState<Sala[]>([]);
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
    tabelaContainer: {
      borderRadius: '10px',
      overflow: 'hidden', // Para arredondar os cantos da tabela
      border: '1px solid #cfe2ff',
      boxShadow: '0 4px 6px rgba(0, 51, 102, 0.05)'
    },
    tabelaHeader: {
      backgroundColor: '#003366',
      color: 'white'
    },
    loading: {
      color: '#003366',
      fontSize: '1.2rem'
    }
  };

  useEffect(() => {
    carregarSalas();
  }, []);

  async function carregarSalas() {
    try {
      const dados = await api.listarSalas();
      setSalas(dados);
    } catch (erro) {
      console.error('Erro ao carregar salas:', erro);
      alert('Erro ao carregar salas');
    } finally {
      setCarregando(false);
    }
  }

  async function lidarComExclusao(id: string) {
    if (confirm('Tem certeza que deseja excluir esta sala?')) {
      try {
        await api.excluirSala(id);
        carregarSalas();
      } catch (erro) {
        console.error('Erro ao excluir:', erro);
        alert('Erro ao excluir sala');
      }
    }
  }

  if (carregando) {
    return <div className="text-center mt-5" style={estilos.loading}>Carregando salas...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2" style={{ borderBottom: '2px solid #e6f2ff' }}>
        <h2 style={estilos.tituloPagina}>Salas Cadastradas</h2>
        <Link
          to="/salas/novo"
          className="btn"
          style={estilos.botaoNovo}
        >
          <i className="bi bi-plus-lg me-2"></i>Nova Sala
        </Link>
      </div>

      {salas.length === 0 ? (
        <div className="alert alert-light text-center" role="alert" style={{ backgroundColor: '#f0f8ff', color: '#003366' }}>
          Nenhuma sala cadastrada no momento.
        </div>
      ) : (
        <div className="table-responsive" style={estilos.tabelaContainer}>
          <table className="table table-hover mb-0">
            <thead style={estilos.tabelaHeader}>
              <tr>
                <th className="py-3 ps-4">Número</th>
                <th className="py-3">Capacidade</th>
                <th className="py-3 text-end pe-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {salas.map((sala) => (
                <tr key={sala.id} style={{ verticalAlign: 'middle' }}>
                  <td className="ps-4">
                    <span className="badge rounded-pill" style={{ backgroundColor: '#e6f2ff', color: '#003366', fontSize: '1rem' }}>
                      Sala {sala.numero}
                    </span>
                  </td>
                  <td>
                    <i className="bi bi-people-fill me-2 text-secondary"></i>
                    {sala.capacidade} lugares
                  </td>
                  <td className="text-end pe-4">
                    <button
                      onClick={() => lidarComExclusao(sala.id!)}
                      className="btn btn-outline-danger btn-sm"
                      title="Excluir"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}