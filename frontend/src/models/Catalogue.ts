class Catalogue {
    id_catalog: number;
    id_event: number;
    nom: string;
    description: string;

    constructor(id_catalog: number, id_event: number, nom: string, description: string) {
      this.id_catalog = id_catalog;
      this.id_event = id_event;
      this.nom = nom;
      this.description = description;
    }
  }

export default Catalogue;