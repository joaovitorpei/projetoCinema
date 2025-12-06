import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Filme } from '../types';

export function Filmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [carregando, setCarregando] = useState(true);

  // --- CONFIGURAÇÃO DE ESTILOS ---
  const estilos = {
    tituloPagina: {
      color: '#003366', // Azul Escuro
      fontWeight: 'bold'
    },
    botaoNovo: {
      backgroundColor: '#003366', // Botão principal em Azul Escuro
      borderColor: '#003366',
      color: 'white'
    },
    card: {
      border: '1px solid #cfe2ff', // Borda Azul Claro
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0, 51, 102, 0.1)', // Sombra levemente azulada
      transition: 'transform 0.2s'
    },
    cardTitle: {
      color: '#003366', // Título do filme em Azul Escuro
      fontWeight: '700'
    },
    cardSubtitle: {
      color: '#4a6fa5' // Azul acinzentado para gênero/duração
    },
    loading: {
      color: '#003366',
      fontSize: '1.2rem'
    }
  };

  useEffect(() => {
    carregarFilmes();
  }, []);

  async function carregarFilmes() {
    try {
      const dados = await api.listarFilmes();
      setFilmes(dados);
    } catch (erro) {
      console.error('Erro ao carregar filmes:', erro);
      alert('Erro ao carregar filmes');
    } finally {
      setCarregando(false);
    }
  }

  async function lidarComExclusao(id: string) {
    if (confirm('Tem certeza que deseja excluir este filme?')) {
      try {
        await api.excluirFilme(id);
        carregarFilmes(); // Recarrega a lista
      } catch (erro) {
        console.error('Erro ao excluir:', erro);
        alert('Erro ao excluir filme');
      }
    }
  }

  if (carregando) {
    return <div className="text-center mt-5" style={estilos.loading}>Carregando filmes...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2" style={{ borderBottom: '2px solid #e6f2ff' }}>
        <h2 style={estilos.tituloPagina}>Filmes em Cartaz</h2>

        <Link
          to="/filmes/novo"
          className="btn"
          style={estilos.botaoNovo}
        >
          <i className="bi bi-plus-lg me-2"></i>Novo Filme
        </Link>
      </div>

      {filmes.length === 0 ? (
        <div className="alert alert-light text-center" role="alert" style={{ backgroundColor: '#f0f8ff', color: '#003366' }}>
          Nenhum filme cadastrado no momento.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filmes.map((filme) => (
            <div className="col" key={filme.id}>
              <div className="card h-100" style={estilos.card}>
                <div className="card-body">
                  <h5 className="card-title" style={estilos.cardTitle}>{filme.titulo}</h5>

                  <h6 className="card-subtitle mb-3" style={estilos.cardSubtitle}>
                    <i className="bi bi-film me-1"></i> {filme.genero}
                    <span className="mx-2">|</span>
                    <i className="bi bi-clock me-1"></i> {filme.duracao} min
                  </h6>

                  <p className="card-text text-truncate text-muted">{filme.sinopse}</p>

                  <p className="card-text">
                    <small className="badge bg-light text-dark border">
                      {filme.classificacao}
                    </small>
                  </p>
                </div>

                <div className="card-footer bg-transparent border-top-0 d-flex justify-content-end pb-3">
                  <button
                    onClick={() => lidarComExclusao(filme.id!)}
                    className="btn btn-outline-danger btn-sm"
                    title="Excluir"
                  // Mantive o vermelho (danger) pois é padrão de UX para exclusão, 
                  // mas se quiser azul, mude a classe para 'btn-outline-primary'
                  >
                    <i className="bi bi-trash me-1"></i> Excluir
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