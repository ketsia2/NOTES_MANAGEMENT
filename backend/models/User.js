const bcrypt = require('bcrypt');

class User {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.username = data.username || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.role = data.role || 'teacher'; // 'admin' or 'teacher'
    this.teacherId = data.teacherId || null; // Link to teacher if role is teacher
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.lastLogin = data.lastLogin || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  async hashPassword() {
    if (this.password) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  async checkPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  updateLastLogin() {
    this.lastLogin = new Date().toISOString();
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isTeacher() {
    return this.role === 'teacher';
  }
}

module.exports = User;