declare global {
    namespace NodeJS {
      interface ProcessEnv {
        user: string;
        database: string;
        databaseName: string;
        password: string;
        secretKey: string;
        host: string;
        dbport: string;
        port: string;
      }
    }
  }

  export {}