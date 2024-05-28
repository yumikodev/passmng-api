import { Injectable } from "@nestjs/common";
import {
  createCipheriv,
  createDecipheriv,
  CipherOCBTypes,
  randomBytes,
  pbkdf2,
} from "node:crypto";

@Injectable()
export class HelpersService {
  private algorithm: CipherOCBTypes = "aes-256-ocb";

  private deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      pbkdf2(password, salt, 100000, 32, "sha256", (err, derivedKey) => {
        if (err) return reject(err);

        resolve(derivedKey);
      });
    });
  }

  private extractParts(encryptedPass: string) {
    const ivLength = 12 * 2;
    const saltLength = 16 * 2;
    const authTagLength = 16 * 2;
    const iv = Buffer.from(encryptedPass.slice(0, ivLength), "hex");
    const salt = Buffer.from(
      encryptedPass.slice(ivLength, ivLength + saltLength),
      "hex",
    );
    const authTag = Buffer.from(
      encryptedPass.slice(
        ivLength + saltLength,
        ivLength + saltLength + authTagLength,
      ),
      "hex",
    );
    const encryptData = encryptedPass.slice(
      ivLength + saltLength + authTagLength,
    );

    return {
      iv,
      salt,
      encryptData,
      authTag,
    };
  }

  encrypt(content: string, secret: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const salt = randomBytes(16);
      const iv = randomBytes(12);
      const key = await this.deriveKey(secret, salt);
      const cipher = createCipheriv(this.algorithm, key, iv, {
        authTagLength: 16,
      });

      let data = "";
      cipher.setEncoding("hex");

      cipher.on("data", (chunk) => (data += chunk));
      cipher.on("error", (err) => reject(err));

      cipher.write(content);
      cipher.end();

      const authTag = cipher.getAuthTag().toString("hex");

      if (!data) {
        resolve(null);
      } else {
        resolve(
          `${iv.toString("hex")}${salt.toString("hex")}${authTag}${data}`,
        );
      }
    });
  }

  decrypt(encryptedPass: string, secret: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const { encryptData, iv, salt, authTag } =
        this.extractParts(encryptedPass);
      const key = await this.deriveKey(secret, salt);

      const decipher = createDecipheriv(this.algorithm, key, iv, {
        authTagLength: 16,
      });
      decipher.setAuthTag(authTag);

      let decrypted = "";
      decipher.on("readable", () => {
        let chunk;

        while (null !== (chunk = decipher.read())) {
          decrypted += chunk.toString("utf8");
        }
      });
      decipher.on("error", (err) => reject(err));

      decipher.write(encryptData, "hex");
      decipher.end();

      if (!decrypted) {
        resolve(null);
      } else {
        resolve(decrypted);
      }
    });
  }
}
