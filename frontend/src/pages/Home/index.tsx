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
        console.log('Événements récupérés:', allEvents);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements', error);
      }
    };

    fetchEvents();
  }, []);

  const featuredEvents: Event[] = [
    {
      id_event: 1, 
      type: "type", 
      titre: "titre", 
      description: 'desc', 
      dateDebut: '08-2023', 
      dateFin: '08-2023', 
      id_lieu: 1, 
      id_createur: 1
    },
    {
      id_event: 2, 
      type: "type", 
      titre: "titre2", 
      description: 'desc', 
      dateDebut: '08-2023', 
      dateFin: '08-2023', 
      id_lieu: 1, 
      id_createur: 1
    },
    {
      id_event: 3, 
      type: "type3", 
      titre: "titre", 
      description: 'desc', 
      dateDebut: '08-2023', 
      dateFin: '08-2023', 
      id_lieu: 1, 
      id_createur: 1
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
            {featuredEvents.map((event) => (
              <Card
                key={event.id_event}
                className="event-card"
                title={event.titre}
                subtitle={`${event.dateDebut} | ${event.id_lieu}`}
              >
                <div className="event-card__image">
                  {/* <img src={event.image} alt={event.title} /> */}
                </div>
                <p className="event-card__description">{event.description}</p>
                <div className="event-card__footer">
                  <Link to={`${ROUTES.EVENTS}/${event.id_event}`}>
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