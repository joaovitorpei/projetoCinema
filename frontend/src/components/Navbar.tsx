import { Link } from 'react-router-dom';

export function Navbar() {
  
  // --- CONFIGURAÇÃO DE ESTILOS ---
  const estilos = {
    nav: {
      backgroundColor: '#003366', // Azul Escuro Profundo
      borderBottom: '4px solid #004080', // Uma borda sutilmente mais clara para dar acabamento
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)' // Sombra para separar do conteúdo
    },
    brand: {
      fontWeight: '800', // Fonte bem grossa para o logo
      fontSize: '1.5rem',
      letterSpacing: '1px'
    },
    link: {
      fontSize: '1.05rem',
      fontWeight: '500'
    }
  };

  return (
    // Mantive 'navbar-dark' para que o texto fique branco automaticamente
    <nav className="navbar navbar-expand-lg navbar-dark mb-4" style={estilos.nav}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" style={estilos.brand}>
          <i className="bi bi-camera-reels"></i> CineStar
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav gap-2">
            <li className="nav-item">
              <Link className="nav-link" to="/filmes" style={estilos.link}>
                <i className="bi bi-film me-1"></i> Filmes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/salas" style={estilos.link}>
                <i className="bi bi-door-open me-1"></i> Salas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sessoes" style={estilos.link}>
                <i className="bi bi-calendar-event me-1"></i> Sessões
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}