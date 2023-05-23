declare global {
    namespace NodeJS {
      interface ProcessEnv {
        user: string;
        database: string;
        databaseName: string;
        password: string;
        secretKey: string;
        host: string;
        dbport: number;
        port: number;
      }
    }
  }

  export {}