class Event {
    id_event: number | null;
    type: string;
    titre: string;
    description: string;
    dateDebut: string;
    dateFin: string;
    id_lieu: number | null;
    id_createur: number | null;

    constructor(
        id_event: number | null, 
        type: string, 
        titre: string, 
        description: string, 
        dateDebut: string, 
        dateFin: string, 
        id_lieu: number | null, 
        id_createur: number | null
    ) {
        this.id_event = id_event || null;
        this.type = type || "Exposition"; // Valeurs possibles: 'Exposition', 'Atelier', 'Concert'
        this.titre = titre || "";
        this.description = description || "";
        this.dateDebut = dateDebut || "";
        this.dateFin = dateFin || "";
        this.id_lieu = id_lieu || null;
        this.id_createur = id_createur || null;
    }
}

export default Event;
