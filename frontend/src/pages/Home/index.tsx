import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { ROUTES } from '../../config/routes';
import './Home.css';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  description: string;
}

const HomePage: React.FC = () => {
  const featuredEvents: Event[] = [
    {
      id: 1,
      title: 'Festival de Jazz',
      date: '15-20 juin 2023',
      location: 'Paris',
      image: 'https://via.placeholder.com/300x200?text=Jazz+Festival',
      description: 'Le plus grand festival de jazz de France avec des artistes internationaux.',
    },
    {
      id: 2,
      title: 'Exposition d\'Art Moderne',
      date: '1-30 juillet 2023',
      location: 'Lyon',
      image: 'https://via.placeholder.com/300x200?text=Art+Exhibition',
      description: 'Une exposition unique présentant les œuvres des plus grands artistes contemporains.',
    },
    {
      id: 3,
      title: 'Concert Symphonique',
      date: '10 août 2023',
      location: 'Marseille',
      image: 'https://via.placeholder.com/300x200?text=Symphony+Concert',
      description: 'Un concert exceptionnel avec l\'orchestre philharmonique de Marseille.',
    },
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Découvrez les meilleurs événements culturels</h1>
          <p className="hero__subtitle">
            Trouvez des concerts, expositions, festivals et bien plus encore dans votre région
          </p>
          <div className="hero__actions">
            <Link to={ROUTES.EVENTS}>
              <Button size="large">Explorer les événements</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-events">
        <div className="container">
          <h2 className="section-title">Événements à la une</h2>
          <div className="featured-events__grid">
            {featuredEvents.map((event) => (
              <Card
                key={event.id}
                className="event-card"
                title={event.title}
                subtitle={`${event.date} | ${event.location}`}
              >
                <div className="event-card__image">
                  <img src={event.image} alt={event.title} />
                </div>
                <p className="event-card__description">{event.description}</p>
                <div className="event-card__footer">
                  <Link to={`${ROUTES.EVENTS}/${event.id}`}>
                    <Button variant="outline" size="small">
                      Voir les détails
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          <div className="featured-events__more">
            <Link to={ROUTES.EVENTS}>
              <Button variant="secondary">Voir tous les événements</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-section__content">
            <h2 className="section-title">À propos d'EventCulture</h2>
            <p>
              EventCulture est votre plateforme dédiée à la découverte d'événements culturels.
              Notre mission est de vous connecter aux meilleurs concerts, expositions, festivals et
              spectacles dans votre région et partout en France.
            </p>
            <Link to={ROUTES.ABOUT}>
              <Button variant="outline">En savoir plus</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 