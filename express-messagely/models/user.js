const bcrypt = require('bcrypt');
const db = require('../db'); // assuming a db connection is set up
const { BCRYPT_WORK_FACTOR } = require('../config');

class User {

  /** Register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */
  static async register({ username, password, first_name, last_name, phone }) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    // Insert user into the database
    const result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING username, first_name, last_name, phone`,
      [username, hashedPassword, first_name, last_name, phone]
    );

    return result.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */
  static async authenticate(username, password) {
    // Find user by username
    const result = await db.query(
      `SELECT username, password FROM users WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    // If user is not found, return false
    if (!user) return false;

    // Compare password with stored hash
    const isValid = await bcrypt.compare(password, user.password);

    return isValid;
  }

  /** Update last_login_at for user */
  static async updateLoginTimestamp(username) {
    await db.query(
      `UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE username = $1`,
      [username]
    );
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...]
   */
  static async all() {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone FROM users`
    );
    return result.rows;
  }

  /** Get: get user by username
   *
   * returns {username, first_name, last_name, phone, join_at, last_login_at }
   */
  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone, join_at, last_login_at
       FROM users
       WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      throw new Error(`No user found with username: ${username}`);
    }

    return user;
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */
  static async messagesFrom(username) {
    const result = await db.query(
      `SELECT m.id,
              m.body,
              m.sent_at,
              m.read_at,
              u.username AS to_username,
              u.first_name AS to_first_name,
              u.last_name AS to_last_name,
              u.phone AS to_phone
       FROM messages m
       JOIN users u ON m.to_username = u.username
       WHERE m.from_username = $1`,
      [username]
    );

    return result.rows.map(msg => ({
      id: msg.id,
      body: msg.body,
      sent_at: msg.sent_at,
      read_at: msg.read_at,
      to_user: {
        username: msg.to_username,
        first_name: msg.to_first_name,
        last_name: msg.to_last_name,
        phone: msg.to_phone,
      }
    }));
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */
  static async messagesTo(username) {
    const result = await db.query(
      `SELECT m.id,
              m.body,
              m.sent_at,
              m.read_at,
              u.username AS from_username,
              u.first_name AS from_first_name,
              u.last_name AS from_last_name,
              u.phone AS from_phone
       FROM messages m
       JOIN users u ON m.from_username = u.username
       WHERE m.to_username = $1`,
      [username]
    );

    return result.rows.map(msg => ({
      id: msg.id,
      body: msg.body,
      sent_at: msg.sent_at,
      read_at: msg.read_at,
      from_user: {
        username: msg.from_username,
        first_name: msg.from_first_name,
        last_name: msg.from_last_name,
        phone: msg.from_phone,
      }
    }));
  }
}

module.exports = User;
