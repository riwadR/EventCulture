import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { ROUTES } from '../../config/routes';
import { getAllEvents } from '../../services/eventService';
import './Home.scss';
import Event from '../../models/Event';

const HomePage: React.FC = () => {

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async (): Promise<void> => {
      try {
        const allEvents = await getAllEvents();
        setEvents(allEvents);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="home-page">
      <section className="hero" style={{ background: `linear-gradient(rgba(211, 211, 211, 0.5), rgba(211, 211, 211, 0.5)), url('/images/home.png') no-repeat center center` }}>
        <div className="hero__content">
          <h1 className="hero__title">Art & Âme d'AURES</h1>
        </div>
      </section>

      <section className="presentation">
        <div className='presentation__img' style={{ backgroundImage: `url(/images/welcome.png)` }}></div>
        <div className="presentation__content">
          <h2 className="presentation__title">Bienvenue sur le site officiel d’Agir Villages Aurès</h2>
          <h3 className="presentation__subheading">Cultivons l’avenir, ensemble.</h3>
          <p className="presentation__body-text">
          Agir Villages Aurès est bien plus qu’un projet : c’est un mouvement collectif pour réinventer nos territoires, valoriser les savoirs locaux, et bâtir des ponts entre patrimoine, jeunesse et innovation.
          </p>
          <p className="presentation__detailed-text">
          À travers nos chantiers-écoles, nos événements culturels, et nos initiatives citoyennes, nous redonnons vie aux villages de l’Aurès en impliquant leurs forces vives : les jeunes, les artistes, les artisans, les institutions et les habitants eux-mêmes.
          </p>
        </div>
      </section>
      <section className="featured-events">
        <div className="container">
          <h2 className="section-title">Événements à la une</h2>
          <div className="featured-events__grid">
            {events.slice(0, 3).map((event) => (
              <Card
                className="event-card"
              >
                <div className="event-card__image">
                  <img src="https://cdn.discordapp.com/attachments/1359154159940669591/1359154174142709930/image.png?ex=67fdb2b6&is=67fc6136&hm=12e7af497323e95d3478be5f2ea73a7e0b1df24d1f29a7f08c3df8a5e5761816&" alt={event.titre} />
                </div>
                <div className="event-card__details">
                  <p className='event-card_title'>{event.titre}</p>
                  <p className="event-card__description">{event.description}</p>
                </div>
                <div className="event-card__footer">
                  <Link to={`${ROUTES.EVENTS}/${event.id_event}`}>
                    <Button variant="secondary">Voir l'événement</Button>
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
            <h2 className="section-title">À propos</h2>
            <p>
            Agir Villages Aurès est une initiative citoyenne et culturelle qui vise à revitaliser les villages de l’Aurès en valorisant leur patrimoine, en impliquant les habitants et en créant des ponts entre tradition et innovation. À travers des chantiers-écoles, des événements artistiques et des actions collaboratives, le projet offre aux jeunes et aux communautés locales un espace d’apprentissage, de création et de transmission. Porté par un collectif engagé, Agir Villages Aurès encourage une dynamique territoriale durable, inclusive et participative, où chaque acteur devient moteur du changement.
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