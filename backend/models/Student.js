class Student {
  constructor(data) {
    this.nom = data['NOM et PRENOMS'] || data.nom;
    this.sexe = data.SEXE || data.sexe;
    this.matricule = data.MATRICULE || data.matricule;
    this.anciennete = data.ANCIENNETE || data.anciennete;
    this.dateNaissance = data['DATE ET LIEU DE NAISSANCE'] || data.dateNaissance;
    this.residence = data.RESIDENCE || data.residence;
    this.classe = data.classe || 'A1 ELEC'; // Default class
  }
}

module.exports = Student;