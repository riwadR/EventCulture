class Event {
    constructor(id_event, type, titre, description, dateDebut, dateFin, id_lieu, id_createur) {
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

export default EventModel;
