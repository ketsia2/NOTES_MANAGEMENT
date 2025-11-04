class Teacher {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.nom = data.nom || '';
    this.prenoms = data.prenoms || '';
    this.email = data.email || '';
    this.telephone = data.telephone || '';
    this.matieres = data.matieres || []; // Array of subject IDs
    this.classes = data.classes || []; // Array of class names
    this.role = 'teacher';
    this.dateCreation = data.dateCreation || new Date().toISOString();
  }

  ajouterMatiere(matiereId) {
    if (!this.matieres.includes(matiereId)) {
      this.matieres.push(matiereId);
    }
  }

  retirerMatiere(matiereId) {
    this.matieres = this.matieres.filter(id => id !== matiereId);
  }

  ajouterClasse(classeNom) {
    if (!this.classes.includes(classeNom)) {
      this.classes.push(classeNom);
    }
  }

  retirerClasse(classeNom) {
    this.classes = this.classes.filter(nom => nom !== classeNom);
  }

  peutEnseigner(matiereId, classeNom) {
    return this.matieres.includes(matiereId) && this.classes.includes(classeNom);
  }
}

module.exports = Teacher;