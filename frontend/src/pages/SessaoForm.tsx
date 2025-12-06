import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { sessaoSchema, type Filme, type Sala } from '../types';
import { z } from 'zod';

export function SessaoForm() {
  const navigate = useNavigate();
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  
  const [dadosFormulario, setDadosFormulario] = useState({
    filmeId: '',
    salaId: '',
    dataHora: ''
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  // --- CONFIGURAÇÃO DE ESTILOS (TEMA AZUL) ---
  const estilos = {
    container: {
      backgroundColor: '#f0f8ff', // Fundo Azul Claro (AliceBlue)
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Sombra suave
      border: '1px solid #cfe2ff' // Borda azul clara
    },
    titulo: {
      color: '#003366', // Azul Escuro
      fontWeight: 'bold',
      borderBottom: '2px solid #003366',
      paddingBottom: '10px'
    },
    label: {
      color: '#004080', // Azul médio para textos
      fontWeight: '500'
    },
    botaoSalvar: {
      backgroundColor: '#003366', // Azul Escuro (Substitui o verde)
      borderColor: '#003366',
      color: 'white'
    },
    botaoCancelar: {
      backgroundColor: 'transparent',
      borderColor: '#003366',
      color: '#003366'
    }
  };

  useEffect(() => {
    carregarOpcoes();
  }, []);

  async function carregarOpcoes() {
    try {
      const [dadosFilmes, dadosSalas] = await Promise.all([
        api.listarFilmes(),
        api.listarSalas()
      ]);
      setFilmes(dadosFilmes);
      setSalas(dadosSalas);
    } catch (erro) {
      console.error('Erro ao carregar opções:', erro);
      alert('Erro ao carregar filmes e salas');
    }
  }

  function lidarComMudanca(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
  }

  async function lidarComEnvio(e: React.FormEvent) {
    e.preventDefault();

    try {
      // Validação com Zod
      const sessaoValidada = sessaoSchema.parse(dadosFormulario);

      // Enviar para API
      await api.criarSessao(sessaoValidada);

      alert('Sessão agendada com sucesso!');
      navigate('/sessoes');

    } catch (erro: unknown) {
      if (erro instanceof z.ZodError) {
        const novosErros: Record<string, string> = {};
        erro.issues.forEach(issue => {
          const field = issue.path[0]; 
          if (typeof field === "string") {
            novosErros[field] = issue.message;
          }
        });
        setErros(novosErros);
        return;
      }
      console.error(erro);
      alert('Erro ao agendar sessão');
    }
  }

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: '700px' }}>
      <div style={estilos.container}>
        <h2 className="mb-4" style={estilos.titulo}>Agendar Sessão</h2>
        
        <form onSubmit={lidarComEnvio} className="row g-3">
          
          {/* Seleção de Filme */}
          <div className="col-md-12">
            <label className="form-label" style={estilos.label}>Filme</label>
            <select 
              className={`form-select ${erros.filmeId ? 'is-invalid' : ''}`}
              name="filmeId" 
              value={dadosFormulario.filmeId} 
              onChange={lidarComMudanca}
              style={{ borderColor: '#cfe2ff' }} // Borda azul clara no input
            >
              <option value="">Selecione um filme...</option>
              {filmes.map(filme => (
                <option key={filme.id} value={filme.id}>
                  {filme.titulo}
                </option>
              ))}
            </select>
            {erros.filmeId && <div className="invalid-feedback">{erros.filmeId}</div>}
          </div>

          {/* Seleção de Sala */}
          <div className="col-md-6">
            <label className="form-label" style={estilos.label}>Sala</label>
            <select 
              className={`form-select ${erros.salaId ? 'is-invalid' : ''}`}
              name="salaId" 
              value={dadosFormulario.salaId} 
              onChange={lidarComMudanca}
              style={{ borderColor: '#cfe2ff' }}
            >
              <option value="">Selecione uma sala...</option>
              {salas.map(sala => (
                <option key={sala.id} value={sala.id}>
                  Sala {sala.numero} ({sala.capacidade} lugares)
                </option>
              ))}
            </select>
            {erros.salaId && <div className="invalid-feedback">{erros.salaId}</div>}
          </div>

          {/* Data e Hora */}
          <div className="col-md-6">
            <label className="form-label" style={estilos.label}>Data e Horário</label>
            <input 
              type="datetime-local" 
              className={`form-control ${erros.dataHora ? 'is-invalid' : ''}`}
              name="dataHora" 
              value={dadosFormulario.dataHora} 
              onChange={lidarComMudanca}
              style={{ borderColor: '#cfe2ff' }}
            />
            {erros.dataHora && <div className="invalid-feedback">{erros.dataHora}</div>}
          </div>

          {/* Botões de Ação */}
          <div className="col-12 mt-4 d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn" 
              style={estilos.botaoCancelar}
              onClick={() => navigate('/sessoes')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn"
              style={estilos.botaoSalvar}
            >
              Agendar Sessão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}