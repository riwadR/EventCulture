import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { ROUTES } from '../../config/routes';
import './NotFound.scss';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found">
      <div className="not-found__container">
        <div className="not-found__code">404</div>
        <h1 className="not-found__title">Page non trouvée</h1>
        <p className="not-found__message">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="not-found__actions">
          <Link to={ROUTES.HOME}>
            <Button>Retourner à l'accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
