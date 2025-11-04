class Subject {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.nom = data.nom || '';
    this.code = data.code || '';
    this.coefficient = data.coefficient || 1;
    this.description = data.description || '';
    this.classes = data.classes || []; // Classes that study this subject
    this.enseignants = data.enseignants || []; // Teacher IDs who teach this subject
  }

  ajouterClasse(classeNom) {
    if (!this.classes.includes(classeNom)) {
      this.classes.push(classeNom);
    }
  }

  retirerClasse(classeNom) {
    this.classes = this.classes.filter(nom => nom !== classeNom);
  }

  ajouterEnseignant(enseignantId) {
    if (!this.enseignants.includes(enseignantId)) {
      this.enseignants.push(enseignantId);
    }
  }

  retirerEnseignant(enseignantId) {
    this.enseignants = this.enseignants.filter(id => id !== enseignantId);
  }
}

module.exports = Subject;