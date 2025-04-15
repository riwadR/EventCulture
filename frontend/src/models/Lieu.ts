class Lieu {
    id_lieu: number | null;
    nom: string;
    adresse: string;
    ville: string;
    pays: string;
    createdAt?: string;
    updatedAt?: string;

    constructor(
        id_lieu: number | null,
        nom: string,
        adresse: string,
        ville: string,
        pays: string,
        createdAt?: string,
        updatedAt?: string
    ) {
        this.id_lieu = id_lieu || null;
        this.nom = nom || "";
        this.adresse = adresse || "";
        this.ville = ville || "";
        this.pays = pays || "";
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default Lieu;