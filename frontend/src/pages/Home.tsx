import { Link } from 'react-router-dom';

export function Home() {

  // --- CONFIGURAÇÃO DE ESTILOS ---
  const estilos = {
    wrapper: {
      backgroundColor: '#f0f8ff', // Fundo geral da página (Azul Muito Claro)
      minHeight: '80vh', // Garante que o fundo cubra boa parte da tela
      paddingTop: '3rem',
      borderRadius: '10px'
    },
    titulo: {
      color: '#003366', // Azul Escuro
      fontWeight: 'bold'
    },
    subtitulo: {
      color: '#4a6fa5' // Azul acinzentado
    },
    card: {
      border: '1px solid #cfe2ff', // Borda Azul Claro
      backgroundColor: '#ffffff',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    icone: {
      color: '#003366', // Ícones em Azul Escuro
      fontSize: '3rem'
    },
    botao: {
      color: '#003366',
      borderColor: '#003366',
      backgroundColor: 'transparent'
    },
    cardTitulo: {
      color: '#004080',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={estilos.wrapper}>
      <div className="container text-center">
        <h1 className="display-4 mb-4" style={estilos.titulo}>CineStar</h1>
        <p className="lead mb-5" style={estilos.subtitulo}>
          Sistema de gerenciamento de cinema simples e eficiente.
        </p>

        <div className="row justify-content-center g-4">

          {/* CARD FILMES */}
          <div className="col-md-3">
            <div className="card h-100 shadow-sm" style={estilos.card}>
              <div className="card-body d-flex flex-column align-items-center">
                <div className="mb-3">
                  <i className="bi bi-film" style={estilos.icone}></i>
                </div>
                <h5 className="card-title" style={estilos.cardTitulo}>Filmes</h5>
                <p className="card-text text-muted">Gerencie o catálogo de filmes em cartaz.</p>
                <Link
                  to="/filmes"
                  className="btn mt-auto"
                  style={estilos.botao}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#003366';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#003366';
                  }}
                >
                  Acessar
                </Link>
              </div>
            </div>
          </div>

          {/* CARD SALAS */}
          <div className="col-md-3">
            <div className="card h-100 shadow-sm" style={estilos.card}>
              <div className="card-body d-flex flex-column align-items-center">
                <div className="mb-3">
                  <i className="bi bi-door-open" style={estilos.icone}></i>
                </div>
                <h5 className="card-title" style={estilos.cardTitulo}>Salas</h5>
                <p className="card-text text-muted">Administre as salas e capacidades.</p>
                <Link
                  to="/salas"
                  className="btn mt-auto"
                  style={estilos.botao}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#003366';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#003366';
                  }}
                >
                  Acessar
                </Link>
              </div>
            </div>
          </div>

          {/* CARD SESSÕES */}
          <div className="col-md-3">
            <div className="card h-100 shadow-sm" style={estilos.card}>
              <div className="card-body d-flex flex-column align-items-center">
                <div className="mb-3">
                  <i className="bi bi-calendar-event" style={estilos.icone}></i>
                </div>
                <h5 className="card-title" style={estilos.cardTitulo}>Sessões</h5>
                <p className="card-text text-muted">Agende sessões e venda ingressos.</p>
                <Link
                  to="/sessoes"
                  className="btn mt-auto"
                  style={estilos.botao}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#003366';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#003366';
                  }}
                >
                  Acessar
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}