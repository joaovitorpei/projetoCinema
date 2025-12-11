import { CartaoMenu } from '../components/CartaoMenu';

export function Home() {
  return (
    <div className="text-center mt-5">
      <h1 className="display-4 fw-bold mb-4">Bem-vindo ao CineStar</h1>
      <p className="lead text-muted mb-5">
        Sistema de gerenciamento.
      </p>

      <div className="row justify-content-center g-4">
        <CartaoMenu 
          titulo="Filmes"
          descricao="catálogo de filmes em cartaz."
          link="/filmes"
          icone="bi-film"
          classeIcone="text-primary"
          classeBotao="btn-outline-primary"
        />

        <CartaoMenu 
          titulo="Salas"
          descricao="Administre as salas."
          link="/salas"
          icone="bi-door-open"
          classeIcone="text-success"
          classeBotao="btn-outline-success"
        />

        <CartaoMenu 
          titulo="Sessões"
          descricao="Agende sessões e venda ingressos."
          link="/sessoes"
          icone="bi-calendar-event"
          classeIcone="text-info"
          classeBotao="btn-outline-info"
        />
      </div>
    </div>
  );
}
