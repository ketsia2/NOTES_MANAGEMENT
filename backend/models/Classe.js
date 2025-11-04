class Classe {
  constructor(data) {
    this.nom = data.nom || 'A1 ELEC';
    this.niveau = data.niveau || 'A1';
    this.filiere = data.filiere || 'ELEC';
    this.anneeScolaire = data.anneeScolaire || '2024-2025';
    this.eleves = data.eleves || [];
    this.notes = data.notes || [];
  }

  ajouterEleve(eleve) {
    this.eleves.push(eleve);
  }

  ajouterNote(note) {
    this.notes.push(note);
  }

  getEleves() {
    return this.eleves;
  }

  getNotes(sequence = null) {
    if (sequence) {
      return this.notes.filter(note => note.sequence === sequence);
    }
    return this.notes;
  }

  calculerMoyenneClasse(sequence = null) {
    const notes = this.getNotes(sequence);
    if (notes.length === 0) return 0;

    const total = notes.reduce((sum, note) => sum + note.moyenne, 0);
    return total / notes.length;
  }
}

module.exports = Classe;