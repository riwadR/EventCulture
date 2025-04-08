import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { ROUTES } from '../../config/routes';
import './Home.scss';

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
          <h1 className="hero__title">Art & Âme d'AURES</h1>
        </div>
      </section>

      <section className="presentation">
        <div className='presentation__img' style={{ backgroundImage: `url(https://media.discordapp.net/attachments/1359154159940669591/1359156371446042855/image.png?ex=67f67482&is=67f52302&hm=eafbc2cfe0464707ea53714274a58e9e263173cb85af3fb7e83b2fbf7c5e5920&=&format=webp&quality=lossless&width=1936&height=1402)` }}></div>
        <div className="presentation__content">
          <h2 className="presentation__title">Présentation</h2>
          <h3 className="presentation__subheading">Subheading</h3>
          <p className="presentation__body-text">
            Body text for your whole article or post. We'll put in some lorem
            ipsum to show how a filled-out page might look:
          </p>
          <p className="presentation__detailed-text">
            Excepteur efficient emerging, minim veniam anim aute carefully
            curated Ginza conversation exquisite perfect nostrud nisi
            intricate Content. Qui international first-class nulla ut. Punctual
            adipisicing, essential lovely queen tempor eiusmod irure.
            Exclusive izakaya charming Scandinavian impeccable aute
            quality of life soft power pariatur Melbourne occaecat
            discerning. Qui wardrobe aliquip, et Porter destination Toto
            remarkable officia Helsinki excepteur Basset hound. Zürich
            sleepy perfect consectetur.
          </p>
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