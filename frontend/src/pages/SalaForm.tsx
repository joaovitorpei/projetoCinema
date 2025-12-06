import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { salaSchema } from '../types';
import { z } from 'zod';

export function SalaForm() {
  const navigate = useNavigate();
  const [dadosFormulario, setDadosFormulario] = useState({
    numero: '',
    fileiras: '',
    assentosPorFileira: ''
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  // --- CONFIGURAÇÃO DE ESTILOS ---
  // --- CONFIGURAÇÃO DE ESTILOS ---
  const estilos = {
    container: {
      backgroundColor: 'var(--card-bg-color)', // Fundo Escuro
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 4px 8px rgba(0,255,0,0.1)',
      border: '1px solid var(--border-color)'
    },
    titulo: {
      color: 'var(--main-text-color)', // Verde
      fontWeight: 'bold',
      borderBottom: '2px solid var(--main-text-color)',
      paddingBottom: '10px'
    },
    label: {
      color: 'var(--main-text-color)',
      fontWeight: '500'
    },
    infoBox: {
      backgroundColor: 'var(--card-bg-color)', // Manter fundo escuro
      color: 'var(--accent-color)', // Texto verde mais escuro/destaque
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '15px'
    },
    botaoSalvar: {
      backgroundColor: 'var(--main-text-color)',
      borderColor: 'var(--main-text-color)',
      color: 'black'
    },
    botaoCancelar: {
      backgroundColor: 'transparent',
      borderColor: 'var(--main-text-color)',
      color: 'var(--main-text-color)'
    }
  };

  function lidarComMudanca(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
  }

  async function lidarComEnvio(e: React.FormEvent) {
    e.preventDefault();

    try {
      const fileiras = Number(dadosFormulario.fileiras);
      const assentos = Number(dadosFormulario.assentosPorFileira);
      const capacidade = fileiras * assentos;

      // Validar dados básicos
      if (fileiras <= 0 || assentos <= 0) {
        setErros({ ...erros, capacidade: "Defina fileiras e assentos válidos" });
        return;
      }

      const salaParaValidar = {
        numero: Number(dadosFormulario.numero),
        capacidade: capacidade
      };

      // Validar com Zod
      const salaValidada = salaSchema.parse(salaParaValidar);

      // Gerar matriz de poltronas (false = livre)
      const poltronas = Array.from({ length: fileiras }, () =>
        Array(assentos).fill(false)
      );

      // Enviar para API
      await api.criarSala({
        ...salaValidada,
        poltronas
      });

      alert('Sala cadastrada com sucesso!');
      navigate('/salas');

    } catch (erro) {
      if (erro instanceof z.ZodError) {
        const novosErros: Record<string, string> = {};

        erro.issues.forEach(issue => {
          const field = issue.path[0];
          if (field) {
            novosErros[field.toString()] = issue.message;
          }
        });

        setErros(novosErros);
      } else {
        console.error(erro);
        alert('Erro ao salvar sala');
      }
    }
  }

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: '700px' }}>
      <div style={estilos.container}>
        <h2 className="mb-4" style={estilos.titulo}>Nova Sala</h2>

        <form onSubmit={lidarComEnvio} className="row g-3">
          <div className="col-md-4">
            <label className="form-label" style={estilos.label}>Número da Sala</label>
            <input
              type="number"
              className={`form-control ${erros.numero ? 'is-invalid' : ''}`}
              name="numero"
              value={dadosFormulario.numero}
              onChange={lidarComMudanca}
              placeholder="Ex: 1"
            />
            {erros.numero && <div className="invalid-feedback">{erros.numero}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label" style={estilos.label}>Qtd. Fileiras</label>
            <input
              type="number"
              className="form-control"
              name="fileiras"
              value={dadosFormulario.fileiras}
              onChange={lidarComMudanca}
              required
              min="1"
              placeholder="Ex: 10"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label" style={estilos.label}>Assentos por Fileira</label>
            <input
              type="number"
              className="form-control"
              name="assentosPorFileira"
              value={dadosFormulario.assentosPorFileira}
              onChange={lidarComMudanca}
              required
              min="1"
              placeholder="Ex: 8"
            />
          </div>

          <div className="col-12 mt-4">
            <div style={estilos.infoBox} className="d-flex align-items-center">
              <i className="bi bi-calculator me-3 fs-4"></i>
              <div>
                <span className="d-block small">Capacidade Total Calculada:</span>
                <strong className="fs-5">
                  {(Number(dadosFormulario.fileiras) || 0) * (Number(dadosFormulario.assentosPorFileira) || 0)}
                </strong> lugares
              </div>
            </div>
            {erros.capacidade && <div className="text-danger mt-1 small">{erros.capacidade}</div>}
          </div>

          <div className="col-12 mt-4 d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn"
              style={estilos.botaoCancelar}
              onClick={() => navigate('/salas')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn"
              style={estilos.botaoSalvar}
            >
              Salvar Sala
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}