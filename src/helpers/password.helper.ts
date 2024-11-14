import bcrypt from 'bcrypt';

/**
 * Responsible for hashing and validating user passwords.
 *
 * @property rounds Salt hashing rounds.
 */
class PasswordHelper {
    private rounds: number;

    constructor(rounds: number) {
        this.rounds = rounds;
    }

    // Hashes plaintext
    public hash(plain: string): string {
        return bcrypt.hashSync(plain, this.rounds);
    }

    // Matches plaintext
    public matches(hash: string, plain: string): boolean {
        return bcrypt.compareSync(plain, hash);
    }
}

const passwordHelper = new PasswordHelper(8);

export default passwordHelper;
